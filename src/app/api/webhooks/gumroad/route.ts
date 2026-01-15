import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscriptions, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Gumroad webhook event types
type GumroadEventType =
  | "sale"
  | "refund"
  | "dispute"
  | "dispute_won"
  | "cancellation"
  | "subscription_updated"
  | "subscription_ended"
  | "subscription_restarted";

interface GumroadWebhookPayload {
  // Common fields
  seller_id: string;
  product_id: string;
  product_name: string;
  permalink: string;
  product_permalink: string;
  email: string;
  price: number; // in cents
  currency: string;
  quantity: number;
  order_number: number;
  sale_id: string;
  sale_timestamp: string;
  purchaser_id: string;

  // Subscription specific
  subscription_id?: string;
  subscription_duration?: string;
  is_recurring_charge?: boolean;
  recurrence?: string;
  ended_at?: string;
  restarted_at?: string;

  // Additional fields
  variants?: string;
  offer_code?: string;
  test?: boolean;
  ip_country?: string;
  referrer?: string;

  // Custom fields (for passing organizationId, etc.)
  custom_fields?: Record<string, string>;
  url_params?: Record<string, string>;
}

// Map Gumroad product permalinks to plan tiers
const PRODUCT_TO_PLAN: Record<string, string> = {
  // Actual Gumroad product permalinks
  "izcdvd": "starter",         // SMB Voice Starter - $7.95/month
  "ojjjt": "professional",     // SMB Voice Professional - $19.95/month
  "ouowmw": "enterprise",      // SMB Voice Enterprise - $49.95/month
};

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json() as GumroadWebhookPayload;

    // Determine event type from the request URL or payload
    const url = new URL(request.url);
    const eventType = url.searchParams.get("event") as GumroadEventType || "sale";

    console.log(`Gumroad webhook received: ${eventType}`, {
      sale_id: payload.sale_id,
      product_name: payload.product_name,
      email: payload.email,
    });

    // Skip test webhooks in production
    if (payload.test && process.env.NODE_ENV === "production") {
      console.log("Skipping test webhook in production");
      return NextResponse.json({ received: true, test: true });
    }

    switch (eventType) {
      case "sale":
        await handleSale(payload);
        break;
      case "refund":
        await handleRefund(payload);
        break;
      case "cancellation":
      case "subscription_ended":
        await handleCancellation(payload);
        break;
      case "subscription_updated":
        await handleSubscriptionUpdate(payload);
        break;
      case "subscription_restarted":
        await handleSubscriptionRestart(payload);
        break;
      case "dispute":
        await handleDispute(payload);
        break;
      case "dispute_won":
        await handleDisputeWon(payload);
        break;
      default:
        console.log(`Unhandled Gumroad event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Gumroad webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleSale(payload: GumroadWebhookPayload) {
  const { email, sale_id, subscription_id, product_name, price } = payload;

  // Get organization by email or custom field
  const organizationId = payload.custom_fields?.organizationId ||
                          payload.url_params?.org_id;

  if (!organizationId) {
    // Create or find organization by email
    const [existingOrg] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.billingEmail, email))
      .limit(1);

    if (existingOrg) {
      // Update existing organization with subscription
      await updateOrganizationSubscription(existingOrg.id, payload);
    } else {
      console.log(`New sale without organization: ${email}`, { sale_id });
      // Could create a pending subscription record or notify admin
    }
    return;
  }

  await updateOrganizationSubscription(organizationId, payload);
  console.log(`Sale processed: ${sale_id} for ${email}`);
}

async function updateOrganizationSubscription(
  organizationId: string,
  payload: GumroadWebhookPayload
) {
  const planId = PRODUCT_TO_PLAN[payload.permalink] ||
                 PRODUCT_TO_PLAN[payload.product_permalink] ||
                 "starter";

  const isSubscription = !!payload.subscription_id;
  const status = isSubscription ? "active" : "active"; // One-time vs recurring

  // Calculate period dates
  const now = new Date();
  const periodEnd = new Date(now);

  // Set period based on subscription duration
  if (payload.subscription_duration === "yearly") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else if (payload.subscription_duration === "quarterly") {
    periodEnd.setMonth(periodEnd.getMonth() + 3);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1); // Default monthly
  }

  // Upsert subscription
  await db
    .insert(subscriptions)
    .values({
      id: payload.subscription_id || payload.sale_id,
      organizationId,
      stripeCustomerId: payload.purchaser_id, // Using Gumroad purchaser ID
      stripeSubscriptionId: payload.subscription_id || payload.sale_id,
      stripePriceId: payload.product_id,
      planId,
      status,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
    })
    .onConflictDoUpdate({
      target: subscriptions.id,
      set: {
        status,
        planId,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      },
    });

  // Update organization billing status
  await db
    .update(organizations)
    .set({
      billingStatus: status,
      stripeCustomerId: payload.purchaser_id,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, organizationId));
}

async function handleRefund(payload: GumroadWebhookPayload) {
  const { sale_id, email } = payload;

  console.log(`Refund processed: ${sale_id} for ${email}`);

  // Find subscription by sale ID and mark as refunded
  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, sale_id));
}

async function handleCancellation(payload: GumroadWebhookPayload) {
  const subscriptionId = payload.subscription_id || payload.sale_id;

  console.log(`Subscription cancelled: ${subscriptionId}`);

  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      cancelAtPeriodEnd: true,
      canceledAt: payload.ended_at ? new Date(payload.ended_at) : new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  // Update organization status
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (sub?.organizationId) {
    await db
      .update(organizations)
      .set({
        billingStatus: "canceled",
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, sub.organizationId));
  }
}

async function handleSubscriptionUpdate(payload: GumroadWebhookPayload) {
  const subscriptionId = payload.subscription_id || payload.sale_id;

  console.log(`Subscription updated: ${subscriptionId}`);

  // For recurring charges, extend the period
  const now = new Date();
  const periodEnd = new Date(now);

  if (payload.subscription_duration === "yearly") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else if (payload.subscription_duration === "quarterly") {
    periodEnd.setMonth(periodEnd.getMonth() + 3);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  await db
    .update(subscriptions)
    .set({
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
}

async function handleSubscriptionRestart(payload: GumroadWebhookPayload) {
  const subscriptionId = payload.subscription_id || payload.sale_id;

  console.log(`Subscription restarted: ${subscriptionId}`);

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await db
    .update(subscriptions)
    .set({
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      canceledAt: null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  // Update organization status
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (sub?.organizationId) {
    await db
      .update(organizations)
      .set({
        billingStatus: "active",
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, sub.organizationId));
  }
}

async function handleDispute(payload: GumroadWebhookPayload) {
  const { sale_id, email } = payload;

  console.log(`Dispute opened: ${sale_id} for ${email}`);

  // Mark subscription as disputed
  await db
    .update(subscriptions)
    .set({
      status: "past_due", // or create a "disputed" status
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, sale_id));
}

async function handleDisputeWon(payload: GumroadWebhookPayload) {
  const { sale_id, email } = payload;

  console.log(`Dispute won: ${sale_id} for ${email}`);

  // Restore subscription after winning dispute
  await db
    .update(subscriptions)
    .set({
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, sale_id));
}

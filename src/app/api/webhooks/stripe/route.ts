import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import { subscriptions, invoices, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

// Explicit interface for subscription webhook data
interface StripeSubscriptionData {
  id: string;
  customer: string;
  status: string;
  metadata?: Record<string, string>;
  items: {
    data: Array<{
      price?: {
        id?: string;
        product?: string;
      };
    }>;
  };
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  trial_end?: number | null;
}

// Explicit interface for invoice webhook data
interface StripeInvoiceData {
  id: string;
  customer: string;
  subscription?: string | null;
  amount_due: number;
  amount_paid: number;
  currency: string;
  hosted_invoice_url?: string | null;
  invoice_pdf?: string | null;
  period_start?: number | null;
  period_end?: number | null;
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = await constructWebhookEvent(payload, signature);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as unknown as StripeSubscriptionData);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as unknown as StripeSubscriptionData);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as unknown as StripeInvoiceData);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as unknown as StripeInvoiceData);
        break;

      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(event.data.object as unknown as StripeSubscriptionData);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handleSubscriptionUpdate(subscription: StripeSubscriptionData) {
  const organizationId = subscription.metadata?.organizationId;
  if (!organizationId) {
    console.error("No organizationId in subscription metadata");
    return;
  }

  const planId = subscription.items.data[0]?.price?.product as string;
  const status = mapStripeStatus(subscription.status);

  // Upsert subscription record
  await db
    .insert(subscriptions)
    .values({
      id: subscription.id,
      organizationId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price?.id || "",
      planId,
      status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    })
    .onConflictDoUpdate({
      target: subscriptions.id,
      set: {
        status,
        stripePriceId: subscription.items.data[0]?.price?.id || "",
        planId,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        updatedAt: new Date(),
      },
    });

  // Update organization status
  await db
    .update(organizations)
    .set({
      billingStatus: status,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, organizationId));

  console.log(`Subscription ${subscription.id} updated: ${status}`);
}

async function handleSubscriptionDeleted(subscription: StripeSubscriptionData) {
  const organizationId = subscription.metadata?.organizationId;
  if (!organizationId) return;

  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

  await db
    .update(organizations)
    .set({
      billingStatus: "canceled",
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, organizationId));

  console.log(`Subscription ${subscription.id} deleted`);
}

async function handleInvoicePaid(invoice: StripeInvoiceData) {
  if (!invoice.subscription) return;

  const subscriptionId = invoice.subscription as string;

  // Record the invoice
  await db.insert(invoices).values({
    id: invoice.id,
    organizationId: invoice.metadata?.organizationId || "",
    stripeInvoiceId: invoice.id,
    subscriptionId,
    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency,
    status: "paid",
    invoiceUrl: invoice.hosted_invoice_url || null,
    pdfUrl: invoice.invoice_pdf || null,
    periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
    periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
    paidAt: new Date(),
  });

  console.log(`Invoice ${invoice.id} paid: $${(invoice.amount_paid / 100).toFixed(2)}`);
}

async function handleInvoicePaymentFailed(invoice: StripeInvoiceData) {
  const organizationId = invoice.metadata?.organizationId;
  if (!organizationId) return;

  // Record failed invoice
  await db.insert(invoices).values({
    id: invoice.id,
    organizationId,
    stripeInvoiceId: invoice.id,
    subscriptionId: invoice.subscription as string,
    amountDue: invoice.amount_due,
    amountPaid: 0,
    currency: invoice.currency,
    status: "failed",
    invoiceUrl: invoice.hosted_invoice_url || null,
    pdfUrl: invoice.invoice_pdf || null,
    periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
    periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
  });

  // Update organization billing status
  await db
    .update(organizations)
    .set({
      billingStatus: "past_due",
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, organizationId));

  console.log(`Invoice ${invoice.id} payment failed`);

  // TODO: Send payment failed email notification
}

async function handleTrialWillEnd(subscription: StripeSubscriptionData) {
  const organizationId = subscription.metadata?.organizationId;
  if (!organizationId) return;

  console.log(`Trial ending soon for organization ${organizationId}`);

  // TODO: Send trial ending notification email
}

function mapStripeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    active: "active",
    past_due: "past_due",
    unpaid: "past_due",
    canceled: "canceled",
    incomplete: "incomplete",
    incomplete_expired: "canceled",
    trialing: "trialing",
    paused: "paused",
  };
  return statusMap[status] || "unknown";
}

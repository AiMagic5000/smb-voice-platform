import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { organizations, phoneNumbers, subscriptions, invoices, usageRecords } from "@/lib/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import * as stripe from "@/lib/stripe/client";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - Get billing information and current usage
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.standard
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const tenantId = orgId || userId;

    // Get organization with billing info
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.clerkOrgId, tenantId))
      .limit(1);

    // Get active subscription
    let subscription = null;
    let stripeSubscription = null;
    let paymentMethods: Awaited<ReturnType<typeof stripe.listPaymentMethods>> = [];

    if (org?.stripeCustomerId) {
      // Get subscription from database
      const [dbSubscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.organizationId, org.id))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      subscription = dbSubscription;

      // Get subscription details from Stripe
      if (subscription?.stripeSubscriptionId) {
        stripeSubscription = await stripe.getSubscription(subscription.stripeSubscriptionId);
      }

      // Get payment methods
      paymentMethods = await stripe.listPaymentMethods(org.stripeCustomerId);
    }

    // Get phone number counts
    const allNumbers = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.tenantId, tenantId));

    const localNumbers = allNumbers.filter((n) => n.type === "local").length;
    const tollFreeNumbers = allNumbers.filter((n) => n.type === "toll_free").length;

    // Get current period usage
    const periodStart = subscription?.currentPeriodStart || new Date(new Date().setDate(1));
    const usage = await db
      .select()
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.organizationId, org?.id || ""),
          gte(usageRecords.createdAt, periodStart)
        )
      );

    // Calculate usage totals
    const usageSummary = {
      aiMinutes: 0,
      smsOutbound: 0,
      smsInbound: 0,
      callRecording: 0,
      internationalMinutes: 0,
    };

    let usageChargesTotal = 0;
    for (const record of usage) {
      usageChargesTotal += record.totalPrice;
      if (record.type === "ai_minutes") usageSummary.aiMinutes += record.quantity;
      if (record.type === "sms_outbound") usageSummary.smsOutbound += record.quantity;
      if (record.type === "sms_inbound") usageSummary.smsInbound += record.quantity;
      if (record.type === "call_recording") usageSummary.callRecording += record.quantity;
      if (record.type === "international_minutes") usageSummary.internationalMinutes += record.quantity;
    }

    // Get recent invoices
    const recentInvoices = org?.id ? await db
      .select()
      .from(invoices)
      .where(eq(invoices.organizationId, org.id))
      .orderBy(desc(invoices.createdAt))
      .limit(10) : [];

    // Get upcoming invoice from Stripe
    let upcomingInvoice = null;
    if (org?.stripeCustomerId) {
      upcomingInvoice = await stripe.getUpcomingInvoice(org.stripeCustomerId);
    }

    // Get plan details
    const planKey = (subscription?.planId || org?.plan || "starter") as keyof typeof stripe.PRICING;
    const plan = stripe.PRICING[planKey] || stripe.PRICING.starter;

    // Calculate charges
    const baseCharge = plan.monthly;
    const additionalNumbersCharge = Math.max(0, localNumbers - (plan.phoneNumbers === -1 ? localNumbers : plan.phoneNumbers)) * stripe.USAGE_PRICING.additionalPhoneNumber;
    const tollFreeCharge = tollFreeNumbers * stripe.USAGE_PRICING.tollFreeNumber;
    const totalCharges = baseCharge + additionalNumbersCharge + tollFreeCharge + usageChargesTotal;

    // Format payment method for response
    const defaultPaymentMethod = paymentMethods[0];

    return NextResponse.json({
      subscription: subscription ? {
        id: subscription.id,
        plan: plan.name,
        planId: subscription.planId,
        status: subscription.status,
        billingCycle: "monthly",
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        trialEndsAt: subscription.trialEndsAt,
        basePrice: baseCharge,
      } : {
        plan: plan.name,
        planId: planKey,
        status: org?.billingStatus || "active",
        billingCycle: "monthly",
        basePrice: baseCharge,
        nextBillingDate: getNextBillingDate(),
      },
      phoneNumbers: {
        local: localNumbers,
        tollFree: tollFreeNumbers,
        total: allNumbers.length,
        included: plan.phoneNumbers === -1 ? "unlimited" : plan.phoneNumbers,
      },
      usage: {
        current: usageSummary,
        aiMinutesIncluded: plan.aiMinutes === -1 ? "unlimited" : plan.aiMinutes,
        charges: usageChargesTotal,
      },
      charges: {
        base: baseCharge,
        additionalNumbers: additionalNumbersCharge,
        tollFree: tollFreeCharge,
        usage: usageChargesTotal,
        total: totalCharges,
      },
      upcomingInvoice: upcomingInvoice ? {
        amountDue: upcomingInvoice.amount_due,
        periodEnd: upcomingInvoice.period_end ? new Date(upcomingInvoice.period_end * 1000) : null,
      } : null,
      recentInvoices: recentInvoices.map(inv => ({
        id: inv.id,
        amount: inv.amountPaid,
        status: inv.status,
        date: inv.createdAt,
        invoiceUrl: inv.invoiceUrl,
        pdfUrl: inv.pdfUrl,
      })),
      paymentMethod: defaultPaymentMethod ? {
        id: defaultPaymentMethod.id,
        type: "card",
        last4: defaultPaymentMethod.card?.last4 || "****",
        brand: defaultPaymentMethod.card?.brand || "unknown",
        expiryMonth: defaultPaymentMethod.card?.exp_month,
        expiryYear: defaultPaymentMethod.card?.exp_year,
      } : null,
      pricing: stripe.PRICING,
      usagePricing: stripe.USAGE_PRICING,
    });
  } catch (error) {
    console.error("Error fetching billing info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Update payment method or subscription
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.strict
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const tenantId = orgId || userId;
    const body = await request.json();
    const { action, paymentMethodId, planId, priceId } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    // Get organization
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.clerkOrgId, tenantId))
      .limit(1);

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    switch (action) {
      case "createCustomer": {
        if (org.stripeCustomerId) {
          return NextResponse.json({
            success: true,
            customerId: org.stripeCustomerId,
            message: "Customer already exists",
          });
        }

        const customer = await stripe.createCustomer({
          email: org.billingEmail || body.email,
          name: org.name,
          organizationId: org.id,
        });

        await db
          .update(organizations)
          .set({ stripeCustomerId: customer.id })
          .where(eq(organizations.id, org.id));

        return NextResponse.json({
          success: true,
          customerId: customer.id,
        });
      }

      case "updatePaymentMethod": {
        if (!paymentMethodId) {
          return NextResponse.json(
            { error: "Payment method ID is required" },
            { status: 400 }
          );
        }

        if (!org.stripeCustomerId) {
          return NextResponse.json(
            { error: "No Stripe customer found. Create customer first." },
            { status: 400 }
          );
        }

        // Attach payment method to customer
        await stripe.attachPaymentMethod(paymentMethodId, org.stripeCustomerId);

        // Set as default
        await stripe.setDefaultPaymentMethod(org.stripeCustomerId, paymentMethodId);

        return NextResponse.json({
          success: true,
          message: "Payment method updated successfully",
        });
      }

      case "createSubscription": {
        if (!priceId) {
          return NextResponse.json(
            { error: "Price ID is required" },
            { status: 400 }
          );
        }

        if (!org.stripeCustomerId) {
          return NextResponse.json(
            { error: "No Stripe customer found. Create customer first." },
            { status: 400 }
          );
        }

        const subscription = await stripe.createSubscription({
          customerId: org.stripeCustomerId,
          priceId,
          trialDays: 14, // 14-day free trial
          metadata: { organizationId: org.id },
        });

        return NextResponse.json({
          success: true,
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
      }

      case "changePlan": {
        if (!priceId) {
          return NextResponse.json(
            { error: "Price ID is required" },
            { status: 400 }
          );
        }

        // Get current subscription
        const [currentSub] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.organizationId, org.id))
          .orderBy(desc(subscriptions.createdAt))
          .limit(1);

        if (!currentSub) {
          return NextResponse.json(
            { error: "No active subscription found" },
            { status: 400 }
          );
        }

        // Update subscription in Stripe
        const stripeSubscription = await stripe.getSubscription(currentSub.stripeSubscriptionId);
        if (!stripeSubscription) {
          return NextResponse.json(
            { error: "Subscription not found in Stripe" },
            { status: 400 }
          );
        }

        const updated = await stripe.updateSubscription(currentSub.stripeSubscriptionId, {
          items: [{
            id: stripeSubscription.items.data[0].id,
            price: priceId,
          }],
          metadata: { organizationId: org.id, planId },
        });

        const periodEnd = (updated as unknown as { current_period_end?: number }).current_period_end;
        return NextResponse.json({
          success: true,
          message: "Subscription plan updated successfully",
          newPlan: planId,
          effectiveDate: periodEnd ? new Date(periodEnd * 1000) : new Date(),
        });
      }

      case "cancelSubscription": {
        const [currentSub] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.organizationId, org.id))
          .orderBy(desc(subscriptions.createdAt))
          .limit(1);

        if (!currentSub) {
          return NextResponse.json(
            { error: "No active subscription found" },
            { status: 400 }
          );
        }

        // Cancel at end of period (not immediately)
        const cancelled = await stripe.cancelSubscription(currentSub.stripeSubscriptionId, false);

        const cancelPeriodEnd = (cancelled as unknown as { current_period_end?: number }).current_period_end;
        return NextResponse.json({
          success: true,
          message: "Subscription will be cancelled at end of billing period",
          cancellationDate: cancelPeriodEnd ? new Date(cancelPeriodEnd * 1000) : new Date(),
        });
      }

      case "reactivateSubscription": {
        const [currentSub] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.organizationId, org.id))
          .orderBy(desc(subscriptions.createdAt))
          .limit(1);

        if (!currentSub) {
          return NextResponse.json(
            { error: "No subscription found" },
            { status: 400 }
          );
        }

        // Reactivate (remove cancellation)
        await stripe.updateSubscription(currentSub.stripeSubscriptionId, {
          cancel_at_period_end: false,
        });

        return NextResponse.json({
          success: true,
          message: "Subscription reactivated successfully",
        });
      }

      case "createCheckoutSession": {
        if (!priceId) {
          return NextResponse.json(
            { error: "Price ID is required" },
            { status: 400 }
          );
        }

        if (!org.stripeCustomerId) {
          // Create customer first
          const customer = await stripe.createCustomer({
            email: org.billingEmail || body.email,
            name: org.name,
            organizationId: org.id,
          });

          await db
            .update(organizations)
            .set({ stripeCustomerId: customer.id })
            .where(eq(organizations.id, org.id));

          org.stripeCustomerId = customer.id;
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://smbvoice.alwaysencrypted.com";
        const session = await stripe.createCheckoutSession({
          customerId: org.stripeCustomerId,
          priceId,
          successUrl: `${baseUrl}/dashboard/billing?success=true`,
          cancelUrl: `${baseUrl}/dashboard/billing?cancelled=true`,
          trialDays: 14,
          metadata: { organizationId: org.id },
        });

        return NextResponse.json({
          success: true,
          checkoutUrl: session.url,
        });
      }

      case "createBillingPortal": {
        if (!org.stripeCustomerId) {
          return NextResponse.json(
            { error: "No Stripe customer found" },
            { status: 400 }
          );
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://smbvoice.alwaysencrypted.com";
        const session = await stripe.createBillingPortalSession({
          customerId: org.stripeCustomerId,
          returnUrl: `${baseUrl}/dashboard/billing`,
        });

        return NextResponse.json({
          success: true,
          portalUrl: session.url,
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error updating billing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getNextBillingDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().split("T")[0];
}

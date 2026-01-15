import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { organizations, subscriptions, usageRecords, phoneNumbers, invoices } from "@/lib/db/schema";
import { eq, and, gte, desc, sql, lte } from "drizzle-orm";
import { PRICING, USAGE_PRICING } from "@/lib/stripe/client";

// GET - Get usage data from database
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "current";

    const now = new Date();

    // Get organization
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.clerkOrgId, tenantId))
      .limit(1);

    // Get subscription
    const [subscription] = org ? await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, org.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1) : [null];

    // Get plan details
    const planKey = (subscription?.planId || org?.plan || "starter") as keyof typeof PRICING;
    const plan = PRICING[planKey] || PRICING.starter;

    // Calculate billing period
    const periodStart = subscription?.currentPeriodStart || new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = subscription?.currentPeriodEnd || new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // Get current period usage from database
    const currentUsage = org ? await db
      .select()
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.organizationId, org.id),
          gte(usageRecords.createdAt, periodStart)
        )
      ) : [];

    // Aggregate usage by type
    const usageTotals = {
      call_minutes: 0,
      ai_minutes: 0,
      sms_outbound: 0,
      sms_inbound: 0,
      international_minutes: 0,
      call_recording: 0,
    };

    let totalUsageCharges = 0;
    for (const record of currentUsage) {
      const type = record.type as keyof typeof usageTotals;
      if (type in usageTotals) {
        usageTotals[type] += record.quantity;
      }
      totalUsageCharges += record.totalPrice;
    }

    // Get phone numbers
    const allNumbers = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.tenantId, tenantId));

    const localNumbers = allNumbers.filter(n => n.type === "local").length;
    const tollFreeNumbers = allNumbers.filter(n => n.type === "toll_free").length;

    // Calculate overages
    const includedMinutes = plan.phoneNumbers === -1 ? Infinity : 1000; // Unlimited for enterprise
    const includedSMS = 500;
    const includedAI = plan.aiMinutes === -1 ? Infinity : plan.aiMinutes;
    const includedNumbers = plan.phoneNumbers === -1 ? Infinity : plan.phoneNumbers;

    const minutesOverage = Math.max(0, usageTotals.call_minutes - includedMinutes);
    const smsOverage = Math.max(0, usageTotals.sms_outbound - includedSMS);
    const aiOverage = Math.max(0, usageTotals.ai_minutes - includedAI);
    const additionalNumbers = Math.max(0, localNumbers - includedNumbers);

    // Calculate charges (US/Canada calls included in plan, only international is charged)
    const callOverageRate = 1; // $0.01 per minute for overage (cents)
    const overageCharges = {
      minutes: minutesOverage * (callOverageRate / 100),
      sms: smsOverage * (USAGE_PRICING.smsOutbound / 100),
      ai: aiOverage * (USAGE_PRICING.aiMinuteOverage / 100),
      additionalNumbers: additionalNumbers * (USAGE_PRICING.additionalPhoneNumber / 100),
      tollFree: tollFreeNumbers * (USAGE_PRICING.tollFreeNumber / 100),
      storage: 0,
    };

    const taxes = plan.monthly * 0.08; // Estimated 8% tax
    const totalCharges = plan.monthly +
      overageCharges.minutes +
      overageCharges.sms +
      overageCharges.ai +
      overageCharges.additionalNumbers +
      overageCharges.tollFree +
      taxes;

    // Get historical usage (last 6 months)
    const history = [];
    for (let i = 1; i <= 6; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      // Get usage for this month
      const monthUsage = org ? await db
        .select({
          type: usageRecords.type,
          total: sql<number>`sum(${usageRecords.quantity})`,
          charges: sql<number>`sum(${usageRecords.totalPrice})`,
        })
        .from(usageRecords)
        .where(
          and(
            eq(usageRecords.organizationId, org.id),
            gte(usageRecords.createdAt, monthStart),
            lte(usageRecords.createdAt, monthEnd)
          )
        )
        .groupBy(usageRecords.type) : [];

      // Get invoice for this month if available
      const [monthInvoice] = org ? await db
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.organizationId, org.id),
            gte(invoices.createdAt, monthStart),
            lte(invoices.createdAt, monthEnd)
          )
        )
        .limit(1) : [null];

      let monthMinutes = 0;
      let monthSMS = 0;
      for (const u of monthUsage) {
        if (u.type === "call_minutes") monthMinutes = u.total || 0;
        if (u.type === "sms_outbound") monthSMS = u.total || 0;
      }

      history.push({
        month: monthStart.toLocaleString("default", { month: "short", year: "numeric" }),
        minutes: monthMinutes,
        sms: monthSMS,
        total: monthInvoice ? (monthInvoice.amountPaid / 100).toFixed(2) : plan.monthly.toFixed(2),
      });
    }

    return NextResponse.json({
      tenantId,
      period,
      billingPeriod: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString(),
        daysRemaining,
      },

      plan: {
        name: plan.name,
        monthlyFee: plan.monthly,
        includedMinutes: includedMinutes === Infinity ? "unlimited" : includedMinutes,
        includedSMS,
        includedPhoneNumbers: includedNumbers === Infinity ? "unlimited" : includedNumbers,
        includedAIMinutes: includedAI === Infinity ? "unlimited" : includedAI,
      },

      current: {
        minutes: {
          used: usageTotals.call_minutes,
          included: includedMinutes === Infinity ? "unlimited" : includedMinutes,
          overage: minutesOverage,
          overageRate: callOverageRate / 100,
        },
        sms: {
          used: usageTotals.sms_outbound + usageTotals.sms_inbound,
          outbound: usageTotals.sms_outbound,
          inbound: usageTotals.sms_inbound,
          included: includedSMS,
          overage: smsOverage,
          overageRate: USAGE_PRICING.smsOutbound / 100,
        },
        phoneNumbers: {
          active: allNumbers.length,
          local: localNumbers,
          tollFree: tollFreeNumbers,
          included: includedNumbers === Infinity ? "unlimited" : includedNumbers,
          additionalRate: USAGE_PRICING.additionalPhoneNumber,
        },
        aiMinutes: {
          used: usageTotals.ai_minutes,
          included: includedAI === Infinity ? "unlimited" : includedAI,
          overage: aiOverage,
          overageRate: USAGE_PRICING.aiMinuteOverage / 100,
        },
        internationalMinutes: {
          used: usageTotals.international_minutes,
          rate: USAGE_PRICING.internationalCall / 100,
        },
      },

      charges: {
        basePlan: plan.monthly,
        overageMinutes: overageCharges.minutes,
        overageSMS: overageCharges.sms,
        overageAI: overageCharges.ai,
        additionalNumbers: overageCharges.additionalNumbers,
        tollFreeNumbers: overageCharges.tollFree,
        storageOverage: overageCharges.storage,
        taxes,
        total: totalCharges,
      },

      history,

      subscription: subscription ? {
        status: subscription.status,
        trialEndsAt: subscription.trialEndsAt,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching usage data:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}

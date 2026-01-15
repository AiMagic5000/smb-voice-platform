import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { organizations, phoneNumbers } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// Pricing configuration
const PRICING = {
  basePrice: 795, // $7.95 in cents
  additionalPhoneNumber: 500, // $5.00 per additional number
  tollFreeNumber: 1000, // $10.00 per toll-free number
  aiMinutes: 10, // $0.10 per AI minute
  smsOutbound: 2, // $0.02 per outbound SMS
  smsInbound: 1, // $0.01 per inbound SMS
  callRecording: 100, // $1.00 per GB storage
};

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

    // Get phone number counts
    const allNumbers = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.tenantId, tenantId));

    const localNumbers = allNumbers.filter((n) => n.type === "local").length;
    const tollFreeNumbers = allNumbers.filter((n) => n.type === "toll_free").length;

    // Calculate current month charges
    const baseCharge = PRICING.basePrice;
    const additionalNumbersCharge = Math.max(0, localNumbers - 1) * PRICING.additionalPhoneNumber;
    const tollFreeCharge = tollFreeNumbers * PRICING.tollFreeNumber;

    // Simulated usage (in production, this would come from usage tracking)
    const usage = {
      aiMinutes: 45,
      smsOutbound: 120,
      smsInbound: 85,
      callMinutes: 342,
      recordingStorageGB: 0.5,
    };

    const usageCharges = {
      aiMinutes: usage.aiMinutes * PRICING.aiMinutes,
      smsOutbound: usage.smsOutbound * PRICING.smsOutbound,
      smsInbound: usage.smsInbound * PRICING.smsInbound,
      recordingStorage: Math.ceil(usage.recordingStorageGB) * PRICING.callRecording,
    };

    const totalUsageCharges = Object.values(usageCharges).reduce((a, b) => a + b, 0);
    const totalCharges = baseCharge + additionalNumbersCharge + tollFreeCharge + totalUsageCharges;

    return NextResponse.json({
      subscription: {
        plan: "SMB Voice Pro",
        status: "active",
        billingCycle: "monthly",
        nextBillingDate: getNextBillingDate(),
        basePrice: baseCharge,
      },
      phoneNumbers: {
        local: localNumbers,
        tollFree: tollFreeNumbers,
        total: allNumbers.length,
      },
      usage: {
        current: usage,
        charges: usageCharges,
      },
      charges: {
        base: baseCharge,
        additionalNumbers: additionalNumbersCharge,
        tollFree: tollFreeCharge,
        usage: totalUsageCharges,
        total: totalCharges,
      },
      pricing: PRICING,
      paymentMethod: {
        type: "card",
        last4: "4242",
        brand: "Visa",
        expiryMonth: 12,
        expiryYear: 2027,
      },
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
    const { userId } = await auth();

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

    const body = await request.json();
    const { action, paymentMethodId, planId } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "updatePaymentMethod":
        if (!paymentMethodId) {
          return NextResponse.json(
            { error: "Payment method ID is required" },
            { status: 400 }
          );
        }
        // In production, update with Stripe
        return NextResponse.json({
          success: true,
          message: "Payment method updated successfully",
        });

      case "changePlan":
        if (!planId) {
          return NextResponse.json(
            { error: "Plan ID is required" },
            { status: 400 }
          );
        }
        // In production, update subscription with Stripe
        return NextResponse.json({
          success: true,
          message: "Subscription plan updated successfully",
          newPlan: planId,
        });

      case "cancelSubscription":
        // In production, cancel with Stripe
        return NextResponse.json({
          success: true,
          message: "Subscription will be cancelled at end of billing period",
          cancellationDate: getNextBillingDate(),
        });

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

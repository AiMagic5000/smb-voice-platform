import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { callForwardingRules } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - Get specific forwarding rule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const tenantId = orgId || userId;

    const rule = await db
      .select()
      .from(callForwardingRules)
      .where(and(eq(callForwardingRules.id, id), eq(callForwardingRules.tenantId, tenantId)))
      .limit(1);

    if (rule.length === 0) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    return NextResponse.json(rule[0]);
  } catch (error) {
    console.error("Error fetching forwarding rule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update forwarding rule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const tenantId = orgId || userId;
    const body = await request.json();

    // Check if rule exists
    const existing = await db
      .select()
      .from(callForwardingRules)
      .where(and(eq(callForwardingRules.id, id), eq(callForwardingRules.tenantId, tenantId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    const {
      ruleName,
      ruleType,
      forwardTo,
      forwardType,
      ringTimeout,
      isEnabled,
      priority,
    } = body;

    const updated = await db
      .update(callForwardingRules)
      .set({
        ruleName: ruleName ?? existing[0].ruleName,
        ruleType: ruleType ?? existing[0].ruleType,
        forwardTo: forwardTo ?? existing[0].forwardTo,
        forwardType: forwardType ?? existing[0].forwardType,
        ringTimeout: ringTimeout ?? existing[0].ringTimeout,
        isEnabled: isEnabled ?? existing[0].isEnabled,
        priority: priority ?? existing[0].priority,
        updatedAt: new Date(),
      })
      .where(eq(callForwardingRules.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating forwarding rule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete forwarding rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const tenantId = orgId || userId;

    // Check if rule exists
    const existing = await db
      .select()
      .from(callForwardingRules)
      .where(and(eq(callForwardingRules.id, id), eq(callForwardingRules.tenantId, tenantId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    await db.delete(callForwardingRules).where(eq(callForwardingRules.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting forwarding rule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

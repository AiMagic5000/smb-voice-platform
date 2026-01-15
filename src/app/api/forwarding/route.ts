import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { callForwardingRules, extensions, phoneNumbers } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - List all call forwarding rules
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
    const { searchParams } = new URL(request.url);
    const extensionId = searchParams.get("extensionId");
    const phoneNumberId = searchParams.get("phoneNumberId");

    let query = db
      .select({
        id: callForwardingRules.id,
        tenantId: callForwardingRules.tenantId,
        extensionId: callForwardingRules.extensionId,
        phoneNumberId: callForwardingRules.phoneNumberId,
        ruleName: callForwardingRules.ruleName,
        ruleType: callForwardingRules.ruleType,
        forwardTo: callForwardingRules.forwardTo,
        forwardType: callForwardingRules.forwardType,
        ringTimeout: callForwardingRules.ringTimeout,
        isEnabled: callForwardingRules.isEnabled,
        priority: callForwardingRules.priority,
        createdAt: callForwardingRules.createdAt,
        extensionNumber: extensions.extension,
        extensionName: extensions.name,
        phoneNumber: phoneNumbers.number,
      })
      .from(callForwardingRules)
      .leftJoin(extensions, eq(callForwardingRules.extensionId, extensions.id))
      .leftJoin(phoneNumbers, eq(callForwardingRules.phoneNumberId, phoneNumbers.id))
      .where(eq(callForwardingRules.tenantId, tenantId))
      .orderBy(callForwardingRules.priority, desc(callForwardingRules.createdAt));

    const rules = await query;

    // Filter by extensionId or phoneNumberId if provided
    let filteredRules = rules;
    if (extensionId) {
      filteredRules = rules.filter((r) => r.extensionId === extensionId);
    }
    if (phoneNumberId) {
      filteredRules = rules.filter((r) => r.phoneNumberId === phoneNumberId);
    }

    return NextResponse.json(filteredRules);
  } catch (error) {
    console.error("Error fetching forwarding rules:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new call forwarding rule
export async function POST(request: NextRequest) {
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
    const body = await request.json();

    const {
      extensionId,
      phoneNumberId,
      ruleName,
      ruleType,
      forwardTo,
      forwardType,
      ringTimeout,
      priority,
    } = body;

    // Validate required fields
    if (!ruleName || !ruleType || !forwardTo) {
      return NextResponse.json(
        { error: "Rule name, type, and forward destination are required" },
        { status: 400 }
      );
    }

    // Must have either extensionId or phoneNumberId
    if (!extensionId && !phoneNumberId) {
      return NextResponse.json(
        { error: "Either extension or phone number is required" },
        { status: 400 }
      );
    }

    // Validate ruleType
    const validRuleTypes = ["always", "busy", "no_answer", "after_hours", "custom"];
    if (!validRuleTypes.includes(ruleType)) {
      return NextResponse.json(
        { error: "Invalid rule type" },
        { status: 400 }
      );
    }

    // Get current highest priority
    const existingRules = await db
      .select()
      .from(callForwardingRules)
      .where(eq(callForwardingRules.tenantId, tenantId));

    const maxPriority = existingRules.reduce(
      (max, rule) => Math.max(max, rule.priority),
      0
    );

    const created = await db
      .insert(callForwardingRules)
      .values({
        tenantId,
        extensionId: extensionId || null,
        phoneNumberId: phoneNumberId || null,
        ruleName,
        ruleType,
        forwardTo,
        forwardType: forwardType || "extension",
        ringTimeout: ringTimeout || 20,
        priority: priority || maxPriority + 1,
      })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error("Error creating forwarding rule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

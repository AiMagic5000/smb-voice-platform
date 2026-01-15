import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { callLogs } from "@/lib/db/schema";
import { eq, and, desc, gte, lte, or, like } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - List call logs with filtering
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
    const direction = searchParams.get("direction"); // inbound, outbound
    const status = searchParams.get("status"); // answered, missed, voicemail, busy
    const extension = searchParams.get("extension");
    const search = searchParams.get("search"); // Search phone numbers
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build base query with tenant filtering
    let calls = await db
      .select()
      .from(callLogs)
      .where(eq(callLogs.tenantId, tenantId))
      .orderBy(desc(callLogs.createdAt))
      .limit(limit)
      .offset(offset);

    // Apply filters
    if (direction) {
      calls = calls.filter((c) => c.direction === direction);
    }
    if (status) {
      calls = calls.filter((c) => c.status === status);
    }
    if (extension) {
      calls = calls.filter((c) => c.extension === extension);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      calls = calls.filter(
        (c) =>
          c.fromNumber.toLowerCase().includes(searchLower) ||
          c.toNumber.toLowerCase().includes(searchLower)
      );
    }
    if (startDate) {
      const start = new Date(startDate);
      calls = calls.filter((c) => c.createdAt >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      calls = calls.filter((c) => c.createdAt <= end);
    }

    // Get total count for this tenant
    const allCalls = await db
      .select()
      .from(callLogs)
      .where(eq(callLogs.tenantId, tenantId));

    // Calculate stats
    const stats = {
      total: allCalls.length,
      inbound: allCalls.filter((c) => c.direction === "inbound").length,
      outbound: allCalls.filter((c) => c.direction === "outbound").length,
      answered: allCalls.filter((c) => c.status === "answered").length,
      missed: allCalls.filter((c) => c.status === "missed").length,
      voicemail: allCalls.filter((c) => c.status === "voicemail").length,
      avgDuration: Math.round(
        allCalls.reduce((sum, c) => sum + (c.duration || 0), 0) /
          (allCalls.filter((c) => c.duration).length || 1)
      ),
    };

    return NextResponse.json({
      calls,
      stats,
      total: calls.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching call logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create call log (typically called by SignalWire webhook)
export async function POST(request: NextRequest) {
  try {
    // This endpoint can be called by SignalWire webhooks
    const body = await request.json();

    const {
      tenantId,
      direction,
      fromNumber,
      toNumber,
      extension,
      duration,
      status,
      recordingUrl,
    } = body;

    // Validate required fields
    if (!tenantId || !direction || !fromNumber || !toNumber || !status) {
      return NextResponse.json(
        { error: "Tenant ID, direction, from number, to number, and status are required" },
        { status: 400 }
      );
    }

    // Validate direction
    if (!["inbound", "outbound"].includes(direction)) {
      return NextResponse.json(
        { error: "Direction must be 'inbound' or 'outbound'" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["answered", "missed", "voicemail", "busy"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const created = await db
      .insert(callLogs)
      .values({
        tenantId,
        direction,
        fromNumber,
        toNumber,
        extension: extension || null,
        duration: duration || null,
        status,
        recordingUrl: recordingUrl || null,
      })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error("Error creating call log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

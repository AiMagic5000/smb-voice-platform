import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { callQueues, queueAgents, extensions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - Get specific queue with agents
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

    const queue = await db
      .select()
      .from(callQueues)
      .where(and(eq(callQueues.id, id), eq(callQueues.tenantId, tenantId)))
      .limit(1);

    if (queue.length === 0) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }

    // Get agents for this queue
    const agents = await db
      .select({
        id: queueAgents.id,
        extensionId: queueAgents.extensionId,
        priority: queueAgents.priority,
        isPaused: queueAgents.isPaused,
        extensionNumber: extensions.extension,
        extensionName: extensions.name,
        extensionEmail: extensions.email,
      })
      .from(queueAgents)
      .leftJoin(extensions, eq(queueAgents.extensionId, extensions.id))
      .where(eq(queueAgents.queueId, id));

    return NextResponse.json({
      ...queue[0],
      agents,
    });
  } catch (error) {
    console.error("Error fetching queue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update queue
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

    // Check if queue exists
    const existing = await db
      .select()
      .from(callQueues)
      .where(and(eq(callQueues.id, id), eq(callQueues.tenantId, tenantId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }

    const {
      name,
      description,
      ringStrategy,
      ringTimeout,
      maxWaitTime,
      holdMusic,
      announcePosition,
      announceWaitTime,
      wrapUpTime,
      isEnabled,
    } = body;

    const updated = await db
      .update(callQueues)
      .set({
        name: name ?? existing[0].name,
        description: description !== undefined ? description : existing[0].description,
        ringStrategy: ringStrategy ?? existing[0].ringStrategy,
        ringTimeout: ringTimeout ?? existing[0].ringTimeout,
        maxWaitTime: maxWaitTime ?? existing[0].maxWaitTime,
        holdMusic: holdMusic ?? existing[0].holdMusic,
        announcePosition: announcePosition ?? existing[0].announcePosition,
        announceWaitTime: announceWaitTime ?? existing[0].announceWaitTime,
        wrapUpTime: wrapUpTime ?? existing[0].wrapUpTime,
        isEnabled: isEnabled ?? existing[0].isEnabled,
        updatedAt: new Date(),
      })
      .where(eq(callQueues.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating queue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete queue
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

    // Check if queue exists
    const existing = await db
      .select()
      .from(callQueues)
      .where(and(eq(callQueues.id, id), eq(callQueues.tenantId, tenantId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }

    // Delete agents first (cascade)
    await db.delete(queueAgents).where(eq(queueAgents.queueId, id));

    // Delete queue
    await db.delete(callQueues).where(eq(callQueues.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting queue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

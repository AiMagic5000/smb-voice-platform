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

// POST - Add agent to queue
export async function POST(
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

    const { id: queueId } = await params;
    const tenantId = orgId || userId;
    const body = await request.json();

    const { extensionId, priority } = body;

    if (!extensionId) {
      return NextResponse.json(
        { error: "Extension ID is required" },
        { status: 400 }
      );
    }

    // Verify queue exists and belongs to tenant
    const queue = await db
      .select()
      .from(callQueues)
      .where(and(eq(callQueues.id, queueId), eq(callQueues.tenantId, tenantId)))
      .limit(1);

    if (queue.length === 0) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }

    // Check if agent already in queue
    const existingAgent = await db
      .select()
      .from(queueAgents)
      .where(
        and(
          eq(queueAgents.queueId, queueId),
          eq(queueAgents.extensionId, extensionId)
        )
      )
      .limit(1);

    if (existingAgent.length > 0) {
      return NextResponse.json(
        { error: "Agent already in queue" },
        { status: 400 }
      );
    }

    // Get current highest priority
    const currentAgents = await db
      .select()
      .from(queueAgents)
      .where(eq(queueAgents.queueId, queueId));

    const maxPriority = currentAgents.reduce(
      (max, agent) => Math.max(max, agent.priority),
      0
    );

    // Add agent
    const created = await db
      .insert(queueAgents)
      .values({
        queueId,
        extensionId,
        priority: priority || maxPriority + 1,
      })
      .returning();

    // Get extension details
    const extension = await db
      .select()
      .from(extensions)
      .where(eq(extensions.id, extensionId))
      .limit(1);

    return NextResponse.json(
      {
        ...created[0],
        extensionNumber: extension[0]?.extension,
        extensionName: extension[0]?.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding agent to queue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove agent from queue
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

    const { id: queueId } = await params;
    const tenantId = orgId || userId;
    const { searchParams } = new URL(request.url);
    const extensionId = searchParams.get("extensionId");

    if (!extensionId) {
      return NextResponse.json(
        { error: "Extension ID is required" },
        { status: 400 }
      );
    }

    // Verify queue exists and belongs to tenant
    const queue = await db
      .select()
      .from(callQueues)
      .where(and(eq(callQueues.id, queueId), eq(callQueues.tenantId, tenantId)))
      .limit(1);

    if (queue.length === 0) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }

    // Remove agent
    await db
      .delete(queueAgents)
      .where(
        and(
          eq(queueAgents.queueId, queueId),
          eq(queueAgents.extensionId, extensionId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing agent from queue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update agent (pause/unpause, change priority)
export async function PATCH(
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

    const { id: queueId } = await params;
    const tenantId = orgId || userId;
    const body = await request.json();

    const { extensionId, isPaused, priority } = body;

    if (!extensionId) {
      return NextResponse.json(
        { error: "Extension ID is required" },
        { status: 400 }
      );
    }

    // Verify queue exists and belongs to tenant
    const queue = await db
      .select()
      .from(callQueues)
      .where(and(eq(callQueues.id, queueId), eq(callQueues.tenantId, tenantId)))
      .limit(1);

    if (queue.length === 0) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }

    // Find existing agent
    const existingAgent = await db
      .select()
      .from(queueAgents)
      .where(
        and(
          eq(queueAgents.queueId, queueId),
          eq(queueAgents.extensionId, extensionId)
        )
      )
      .limit(1);

    if (existingAgent.length === 0) {
      return NextResponse.json(
        { error: "Agent not in queue" },
        { status: 404 }
      );
    }

    // Update agent
    const updated = await db
      .update(queueAgents)
      .set({
        isPaused: isPaused ?? existingAgent[0].isPaused,
        priority: priority ?? existingAgent[0].priority,
      })
      .where(eq(queueAgents.id, existingAgent[0].id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating queue agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

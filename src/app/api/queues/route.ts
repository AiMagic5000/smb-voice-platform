import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { callQueues, queueAgents, extensions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - List all call queues
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

    // Get all queues with agent counts
    const queues = await db
      .select()
      .from(callQueues)
      .where(eq(callQueues.tenantId, tenantId))
      .orderBy(desc(callQueues.createdAt));

    // Get agent counts for each queue
    const queuesWithAgents = await Promise.all(
      queues.map(async (queue) => {
        const agents = await db
          .select({
            id: queueAgents.id,
            extensionId: queueAgents.extensionId,
            priority: queueAgents.priority,
            isPaused: queueAgents.isPaused,
            extensionNumber: extensions.extension,
            extensionName: extensions.name,
          })
          .from(queueAgents)
          .leftJoin(extensions, eq(queueAgents.extensionId, extensions.id))
          .where(eq(queueAgents.queueId, queue.id));

        return {
          ...queue,
          agentCount: agents.length,
          agents,
        };
      })
    );

    return NextResponse.json(queuesWithAgents);
  } catch (error) {
    console.error("Error fetching queues:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new call queue
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
      name,
      description,
      ringStrategy,
      ringTimeout,
      maxWaitTime,
      holdMusic,
      announcePosition,
      announceWaitTime,
      wrapUpTime,
      agentIds, // Array of extension IDs to add as agents
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Queue name is required" },
        { status: 400 }
      );
    }

    // Create the queue
    const created = await db
      .insert(callQueues)
      .values({
        tenantId,
        name,
        description,
        ringStrategy: ringStrategy || "round_robin",
        ringTimeout: ringTimeout || 20,
        maxWaitTime: maxWaitTime || 300,
        holdMusic: holdMusic || "default",
        announcePosition: announcePosition ?? true,
        announceWaitTime: announceWaitTime ?? false,
        wrapUpTime: wrapUpTime || 0,
      })
      .returning();

    const queue = created[0];

    // Add agents if provided
    if (agentIds && Array.isArray(agentIds) && agentIds.length > 0) {
      const agentRecords = agentIds.map((extensionId: string, index: number) => ({
        queueId: queue.id,
        extensionId,
        priority: index + 1,
      }));

      await db.insert(queueAgents).values(agentRecords);
    }

    return NextResponse.json(queue, { status: 201 });
  } catch (error) {
    console.error("Error creating queue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

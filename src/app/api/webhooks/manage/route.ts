import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { webhookEndpoints, webhookLogs } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { z } from "zod";
import crypto from "crypto";

const createWebhookSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  events: z.array(
    z.enum([
      "call.started",
      "call.ended",
      "call.missed",
      "sms.received",
      "sms.sent",
      "voicemail.new",
      "recording.ready",
    ])
  ),
  secret: z.string().optional(),
  enabled: z.boolean().optional(),
});

const updateWebhookSchema = createWebhookSchema.partial();

// GET - List webhook endpoints and recent logs
async function handleGet(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeLogs = searchParams.get("includeLogs") === "true";
    const logsLimit = parseInt(searchParams.get("logsLimit") || "50");

    // Get webhook endpoints
    const endpoints = await db
      .select()
      .from(webhookEndpoints)
      .where(eq(webhookEndpoints.tenantId, orgId || userId))
      .orderBy(desc(webhookEndpoints.createdAt));

    // Get recent logs if requested
    let logs: typeof webhookLogs.$inferSelect[] = [];
    if (includeLogs) {
      logs = await db
        .select()
        .from(webhookLogs)
        .where(eq(webhookLogs.tenantId, orgId || userId))
        .orderBy(desc(webhookLogs.createdAt))
        .limit(logsLimit);
    }

    // Calculate stats
    const stats = {
      totalEndpoints: endpoints.length,
      activeEndpoints: endpoints.filter((e) => e.enabled).length,
      recentSuccess: logs.filter((l) => l.status === "success").length,
      recentFailed: logs.filter((l) => l.status === "failed").length,
    };

    return NextResponse.json({
      endpoints: endpoints.map((e) => ({
        ...e,
        secret: e.secret ? "••••••••" : null, // Mask secret
      })),
      logs: includeLogs ? logs : undefined,
      stats,
    });
  } catch (error) {
    console.error("Error fetching webhooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch webhooks" },
      { status: 500 }
    );
  }
}

// POST - Create a new webhook endpoint
async function handlePost(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createWebhookSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.issues },
        { status: 400 }
      );
    }

    const { name, url, events, secret, enabled = true } = validated.data;

    // Generate secret if not provided
    const webhookSecret = secret || crypto.randomBytes(32).toString("hex");

    // Create webhook endpoint
    const [newEndpoint] = await db
      .insert(webhookEndpoints)
      .values({
        tenantId: orgId || userId,
        name,
        url,
        events,
        secret: webhookSecret,
        enabled,
      })
      .returning();

    return NextResponse.json({
      success: true,
      endpoint: {
        ...newEndpoint,
        secret: webhookSecret, // Return secret once on creation
      },
      message: "Save this secret - it won't be shown again",
    });
  } catch (error) {
    console.error("Error creating webhook:", error);
    return NextResponse.json(
      { error: "Failed to create webhook" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handleGet, rateLimitConfigs.standard);
export const POST = withRateLimit(handlePost, rateLimitConfigs.standard);

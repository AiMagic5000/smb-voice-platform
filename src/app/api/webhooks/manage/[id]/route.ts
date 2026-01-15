import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { webhookEndpoints, webhookLogs } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { z } from "zod";
import crypto from "crypto";

const updateWebhookSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  events: z
    .array(
      z.enum([
        "call.started",
        "call.ended",
        "call.missed",
        "sms.received",
        "sms.sent",
        "voicemail.new",
        "recording.ready",
      ])
    )
    .optional(),
  enabled: z.boolean().optional(),
  regenerateSecret: z.boolean().optional(),
});

// Helper to get rate limit identifier
function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - Get a single webhook endpoint with logs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(getRateLimitId(request, userId), rateLimitConfigs.standard);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;

    const endpoint = await db
      .select()
      .from(webhookEndpoints)
      .where(
        and(
          eq(webhookEndpoints.id, id),
          eq(webhookEndpoints.tenantId, orgId || userId)
        )
      )
      .limit(1);

    if (endpoint.length === 0) {
      return NextResponse.json(
        { error: "Webhook endpoint not found" },
        { status: 404 }
      );
    }

    // Get recent logs for this endpoint
    const logs = await db
      .select()
      .from(webhookLogs)
      .where(
        and(
          eq(webhookLogs.webhookEndpointId, id),
          eq(webhookLogs.tenantId, orgId || userId)
        )
      )
      .orderBy(desc(webhookLogs.createdAt))
      .limit(100);

    // Calculate success rate
    const successCount = logs.filter((l) => l.status === "success").length;
    const successRate = logs.length > 0 ? (successCount / logs.length) * 100 : 100;

    return NextResponse.json({
      endpoint: {
        ...endpoint[0],
        secret: "••••••••", // Mask secret
      },
      logs,
      stats: {
        totalDeliveries: logs.length,
        successRate: Math.round(successRate * 10) / 10,
        lastDelivery: logs[0]?.createdAt || null,
      },
    });
  } catch (error) {
    console.error("Error fetching webhook:", error);
    return NextResponse.json(
      { error: "Failed to fetch webhook" },
      { status: 500 }
    );
  }
}

// PATCH - Update a webhook endpoint
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(getRateLimitId(request, userId), rateLimitConfigs.standard);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = updateWebhookSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.issues },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db
      .select()
      .from(webhookEndpoints)
      .where(
        and(
          eq(webhookEndpoints.id, id),
          eq(webhookEndpoints.tenantId, orgId || userId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Webhook endpoint not found" },
        { status: 404 }
      );
    }

    const { regenerateSecret, ...updateData } = validated.data;
    const updates: Record<string, unknown> = { ...updateData };

    // Regenerate secret if requested
    let newSecret: string | null = null;
    if (regenerateSecret) {
      newSecret = crypto.randomBytes(32).toString("hex");
      updates.secret = newSecret;
    }

    updates.updatedAt = new Date();

    const [updatedEndpoint] = await db
      .update(webhookEndpoints)
      .set(updates)
      .where(eq(webhookEndpoints.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      endpoint: {
        ...updatedEndpoint,
        secret: newSecret || "••••••••", // Only show new secret
      },
      ...(newSecret && { newSecret, message: "Save this secret - it won't be shown again" }),
    });
  } catch (error) {
    console.error("Error updating webhook:", error);
    return NextResponse.json(
      { error: "Failed to update webhook" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a webhook endpoint
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(getRateLimitId(request, userId), rateLimitConfigs.standard);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await db
      .select()
      .from(webhookEndpoints)
      .where(
        and(
          eq(webhookEndpoints.id, id),
          eq(webhookEndpoints.tenantId, orgId || userId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Webhook endpoint not found" },
        { status: 404 }
      );
    }

    // Delete logs first
    await db
      .delete(webhookLogs)
      .where(eq(webhookLogs.webhookEndpointId, id));

    // Delete endpoint
    await db.delete(webhookEndpoints).where(eq(webhookEndpoints.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting webhook:", error);
    return NextResponse.json(
      { error: "Failed to delete webhook" },
      { status: 500 }
    );
  }
}

// POST - Test webhook endpoint
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Strict rate limiting for test endpoint
    const rateLimit = checkRateLimit(getRateLimitId(request, userId), rateLimitConfigs.strict);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;

    // Get endpoint
    const endpoint = await db
      .select()
      .from(webhookEndpoints)
      .where(
        and(
          eq(webhookEndpoints.id, id),
          eq(webhookEndpoints.tenantId, orgId || userId)
        )
      )
      .limit(1);

    if (endpoint.length === 0) {
      return NextResponse.json(
        { error: "Webhook endpoint not found" },
        { status: 404 }
      );
    }

    const webhookUrl = endpoint[0].url;
    const webhookSecret = endpoint[0].secret;

    // Create test payload
    const testPayload = {
      event: "test.ping",
      timestamp: new Date().toISOString(),
      data: {
        message: "This is a test webhook delivery",
        webhook_id: id,
      },
    };

    const payloadString = JSON.stringify(testPayload);

    // Generate signature
    const signature = crypto
      .createHmac("sha256", webhookSecret || "")
      .update(payloadString)
      .digest("hex");

    const startTime = Date.now();

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Event": "test.ping",
        },
        body: payloadString,
      });

      const duration = Date.now() - startTime;
      const responseBody = await response.text();

      // Log the test delivery
      await db.insert(webhookLogs).values({
        tenantId: orgId || userId,
        webhookEndpointId: id,
        event: "test.ping",
        status: response.ok ? "success" : "failed",
        statusCode: response.status,
        requestBody: testPayload,
        responseBody: responseBody ? { raw: responseBody } : null,
        duration,
        retryCount: 0,
      });

      return NextResponse.json({
        success: response.ok,
        statusCode: response.status,
        duration,
        response: responseBody.substring(0, 500),
      });
    } catch (fetchError) {
      const duration = Date.now() - startTime;

      // Log failed delivery
      await db.insert(webhookLogs).values({
        tenantId: orgId || userId,
        webhookEndpointId: id,
        event: "test.ping",
        status: "failed",
        requestBody: testPayload,
        error: fetchError instanceof Error ? fetchError.message : "Unknown error",
        duration,
        retryCount: 0,
      });

      return NextResponse.json({
        success: false,
        error: fetchError instanceof Error ? fetchError.message : "Connection failed",
        duration,
      });
    }
  } catch (error) {
    console.error("Error testing webhook:", error);
    return NextResponse.json(
      { error: "Failed to test webhook" },
      { status: 500 }
    );
  }
}

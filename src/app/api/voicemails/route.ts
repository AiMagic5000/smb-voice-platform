import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { voicemails, extensions } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - List all voicemails
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
    const extensionFilter = searchParams.get("extension");
    const isReadFilter = searchParams.get("isRead");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query with tenant filtering
    let vms = await db
      .select()
      .from(voicemails)
      .where(eq(voicemails.tenantId, tenantId))
      .orderBy(desc(voicemails.createdAt))
      .limit(limit)
      .offset(offset);

    // Apply filters
    if (extensionFilter) {
      vms = vms.filter((vm) => vm.extension === extensionFilter);
    }
    if (isReadFilter !== null) {
      const isRead = isReadFilter === "true";
      vms = vms.filter((vm) => vm.isRead === isRead);
    }

    // Get unread count for this tenant
    const allVoicemails = await db
      .select()
      .from(voicemails)
      .where(eq(voicemails.tenantId, tenantId));
    const unreadCount = allVoicemails.filter((vm) => !vm.isRead).length;

    return NextResponse.json({
      voicemails: vms,
      total: allVoicemails.length,
      unreadCount,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching voicemails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create voicemail (typically called by SignalWire webhook)
export async function POST(request: NextRequest) {
  try {
    // This endpoint can be called by SignalWire webhooks without auth
    // In production, verify SignalWire signature
    const body = await request.json();

    const {
      tenantId,
      extension,
      callerNumber,
      callerName,
      duration,
      transcription,
      audioUrl,
    } = body;

    // Validate required fields
    if (!tenantId || !extension || !callerNumber || !audioUrl) {
      return NextResponse.json(
        { error: "Tenant ID, extension, caller number, and audio URL are required" },
        { status: 400 }
      );
    }

    const created = await db
      .insert(voicemails)
      .values({
        tenantId,
        extension,
        callerNumber,
        callerName: callerName || null,
        duration: duration || 0,
        transcription: transcription || null,
        audioUrl,
      })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error("Error creating voicemail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

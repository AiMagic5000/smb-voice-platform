import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { voicemails } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - Get specific voicemail
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

    const tenantId = orgId || userId;
    const { id } = await params;

    const vm = await db
      .select()
      .from(voicemails)
      .where(and(eq(voicemails.id, id), eq(voicemails.tenantId, tenantId)))
      .limit(1);

    if (vm.length === 0) {
      return NextResponse.json({ error: "Voicemail not found" }, { status: 404 });
    }

    return NextResponse.json(vm[0]);
  } catch (error) {
    console.error("Error fetching voicemail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Mark voicemail as read/unread
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

    const tenantId = orgId || userId;
    const { id } = await params;
    const body = await request.json();

    // Check if voicemail exists for this tenant
    const existing = await db
      .select()
      .from(voicemails)
      .where(and(eq(voicemails.id, id), eq(voicemails.tenantId, tenantId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Voicemail not found" }, { status: 404 });
    }

    const { isRead } = body;

    const updated = await db
      .update(voicemails)
      .set({
        isRead: isRead ?? existing[0].isRead,
      })
      .where(and(eq(voicemails.id, id), eq(voicemails.tenantId, tenantId)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating voicemail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete voicemail
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

    const tenantId = orgId || userId;
    const { id } = await params;

    // Check if voicemail exists for this tenant
    const existing = await db
      .select()
      .from(voicemails)
      .where(and(eq(voicemails.id, id), eq(voicemails.tenantId, tenantId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Voicemail not found" }, { status: 404 });
    }

    await db.delete(voicemails).where(and(eq(voicemails.id, id), eq(voicemails.tenantId, tenantId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting voicemail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

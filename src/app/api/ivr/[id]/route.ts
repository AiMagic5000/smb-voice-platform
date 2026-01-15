import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ivrMenus } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - Get specific IVR menu
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

    const menu = await db
      .select()
      .from(ivrMenus)
      .where(and(eq(ivrMenus.id, id), eq(ivrMenus.tenantId, tenantId)))
      .limit(1);

    if (menu.length === 0) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json(menu[0]);
  } catch (error) {
    console.error("Error fetching IVR menu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update IVR menu
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

    // Check if menu exists
    const existing = await db
      .select()
      .from(ivrMenus)
      .where(and(eq(ivrMenus.id, id), eq(ivrMenus.tenantId, tenantId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    const {
      name,
      greeting,
      options,
      timeout,
      timeoutAction,
      timeoutTarget,
      isDefault,
      isEnabled,
    } = body;

    // If setting as default, unset any existing default
    if (isDefault && !existing[0].isDefault) {
      await db
        .update(ivrMenus)
        .set({ isDefault: false })
        .where(and(eq(ivrMenus.tenantId, tenantId), eq(ivrMenus.isDefault, true)));
    }

    const updated = await db
      .update(ivrMenus)
      .set({
        name: name ?? existing[0].name,
        greeting: greeting ?? existing[0].greeting,
        options: options ?? existing[0].options,
        timeout: timeout ?? existing[0].timeout,
        timeoutAction: timeoutAction ?? existing[0].timeoutAction,
        timeoutTarget: timeoutTarget !== undefined ? timeoutTarget : existing[0].timeoutTarget,
        isDefault: isDefault ?? existing[0].isDefault,
        isEnabled: isEnabled ?? existing[0].isEnabled,
        updatedAt: new Date(),
      })
      .where(eq(ivrMenus.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating IVR menu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete IVR menu
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

    // Check if menu exists
    const existing = await db
      .select()
      .from(ivrMenus)
      .where(and(eq(ivrMenus.id, id), eq(ivrMenus.tenantId, tenantId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    // Don't allow deletion of default menu
    if (existing[0].isDefault) {
      return NextResponse.json(
        { error: "Cannot delete default menu. Set another menu as default first." },
        { status: 400 }
      );
    }

    await db.delete(ivrMenus).where(eq(ivrMenus.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting IVR menu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

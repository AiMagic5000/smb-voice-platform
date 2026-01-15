import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ivrMenus } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - List all IVR menus or get default menu
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
    const defaultOnly = searchParams.get("default") === "true";

    if (defaultOnly) {
      // Get default menu only
      const defaultMenu = await db
        .select()
        .from(ivrMenus)
        .where(and(eq(ivrMenus.tenantId, tenantId), eq(ivrMenus.isDefault, true)))
        .limit(1);

      if (defaultMenu.length === 0) {
        return NextResponse.json({
          id: null,
          name: "Main Menu",
          greeting: "Thank you for calling. Press 1 for Sales, 2 for Support, or 0 to speak with an operator.",
          options: [
            { id: "1", digit: "1", label: "Sales", action: "department", target: "sales" },
            { id: "2", digit: "2", label: "Support", action: "department", target: "support" },
            { id: "3", digit: "0", label: "Operator", action: "extension", target: "101" },
          ],
          timeout: 10,
          timeoutAction: "repeat",
          isDefault: true,
          isEnabled: true,
        });
      }

      return NextResponse.json(defaultMenu[0]);
    }

    // List all menus
    const menus = await db
      .select()
      .from(ivrMenus)
      .where(eq(ivrMenus.tenantId, tenantId))
      .orderBy(desc(ivrMenus.isDefault), desc(ivrMenus.createdAt));

    return NextResponse.json(menus);
  } catch (error) {
    console.error("Error fetching IVR menus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new IVR menu
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
      greeting,
      options,
      timeout,
      timeoutAction,
      timeoutTarget,
      isDefault,
    } = body;

    // Validate required fields
    if (!name || !greeting || !options) {
      return NextResponse.json(
        { error: "Name, greeting, and options are required" },
        { status: 400 }
      );
    }

    // If setting as default, unset any existing default
    if (isDefault) {
      await db
        .update(ivrMenus)
        .set({ isDefault: false })
        .where(and(eq(ivrMenus.tenantId, tenantId), eq(ivrMenus.isDefault, true)));
    }

    const created = await db
      .insert(ivrMenus)
      .values({
        tenantId,
        name,
        greeting,
        options,
        timeout: timeout || 10,
        timeoutAction: timeoutAction || "repeat",
        timeoutTarget,
        isDefault: isDefault || false,
      })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error("Error creating IVR menu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { businessHours } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - Retrieve business hours for tenant
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

    const hours = await db
      .select()
      .from(businessHours)
      .where(eq(businessHours.tenantId, tenantId))
      .limit(1);

    if (hours.length === 0) {
      // Return default business hours
      return NextResponse.json({
        id: null,
        timezone: "America/New_York",
        schedule: {
          monday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
          tuesday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
          wednesday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
          thursday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
          friday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
          saturday: { enabled: false, openTime: "10:00", closeTime: "14:00" },
          sunday: { enabled: false, openTime: "10:00", closeTime: "14:00" },
        },
        holidays: [],
        afterHoursAction: "voicemail",
        isActive: true,
      });
    }

    return NextResponse.json(hours[0]);
  } catch (error) {
    console.error("Error fetching business hours:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update business hours
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
      timezone,
      schedule,
      holidays,
      afterHoursAction,
      afterHoursTarget,
      afterHoursMessage,
    } = body;

    // Validate required fields
    if (!schedule || typeof schedule !== "object") {
      return NextResponse.json(
        { error: "Schedule is required" },
        { status: 400 }
      );
    }

    // Check if hours already exist
    const existing = await db
      .select()
      .from(businessHours)
      .where(eq(businessHours.tenantId, tenantId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      const updated = await db
        .update(businessHours)
        .set({
          timezone: timezone || "America/New_York",
          schedule,
          holidays: holidays || [],
          afterHoursAction: afterHoursAction || "voicemail",
          afterHoursTarget,
          afterHoursMessage,
          updatedAt: new Date(),
        })
        .where(eq(businessHours.id, existing[0].id))
        .returning();

      return NextResponse.json(updated[0]);
    }

    // Create new
    const created = await db
      .insert(businessHours)
      .values({
        tenantId,
        timezone: timezone || "America/New_York",
        schedule,
        holidays: holidays || [],
        afterHoursAction: afterHoursAction || "voicemail",
        afterHoursTarget,
        afterHoursMessage,
      })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error("Error saving business hours:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET current open/closed status
export async function HEAD(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return new NextResponse(null, { status: 401 });
    }

    const tenantId = orgId || userId;

    const hours = await db
      .select()
      .from(businessHours)
      .where(eq(businessHours.tenantId, tenantId))
      .limit(1);

    if (hours.length === 0) {
      // Default to open during business hours
      return new NextResponse(null, {
        status: 200,
        headers: { "X-Business-Status": "unknown" },
      });
    }

    const config = hours[0];
    const now = new Date();

    // Get current day in tenant's timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: config.timezone,
      weekday: "long",
    });
    const dayName = formatter.format(now).toLowerCase();

    const schedule = config.schedule as Record<string, { enabled: boolean; openTime: string; closeTime: string }>;
    const todaySchedule = schedule[dayName];

    if (!todaySchedule || !todaySchedule.enabled) {
      return new NextResponse(null, {
        status: 200,
        headers: { "X-Business-Status": "closed" },
      });
    }

    // Get current time in tenant's timezone
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: config.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const currentTime = timeFormatter.format(now).replace(":", "");
    const openTime = todaySchedule.openTime.replace(":", "");
    const closeTime = todaySchedule.closeTime.replace(":", "");

    const isOpen =
      parseInt(currentTime) >= parseInt(openTime) &&
      parseInt(currentTime) < parseInt(closeTime);

    return new NextResponse(null, {
      status: 200,
      headers: { "X-Business-Status": isOpen ? "open" : "closed" },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}

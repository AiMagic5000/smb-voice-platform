import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { notificationPreferences } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/notifications/preferences
 * Get current user's notification preferences
 */
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;

    // Get existing preferences
    const existing = await db
      .select()
      .from(notificationPreferences)
      .where(
        and(
          eq(notificationPreferences.tenantId, tenantId),
          eq(notificationPreferences.userId, userId)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json({ preferences: existing[0] });
    }

    // Return default preferences if none exist
    return NextResponse.json({
      preferences: {
        id: null,
        tenantId,
        userId,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        voicemailNotify: true,
        missedCallNotify: true,
        smsNotify: true,
        dailySummary: false,
        weeklySummary: true,
        systemAlerts: true,
        billingAlerts: true,
        quietHoursEnabled: false,
        quietHoursStart: null,
        quietHoursEnd: null,
        timezone: "America/New_York",
      },
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification preferences" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications/preferences
 * Update notification preferences (creates if doesn't exist)
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;
    const body = await request.json();

    const {
      emailEnabled,
      smsEnabled,
      pushEnabled,
      voicemailNotify,
      missedCallNotify,
      smsNotify,
      dailySummary,
      weeklySummary,
      systemAlerts,
      billingAlerts,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
      timezone,
    } = body;

    // Check if preferences exist
    const existing = await db
      .select()
      .from(notificationPreferences)
      .where(
        and(
          eq(notificationPreferences.tenantId, tenantId),
          eq(notificationPreferences.userId, userId)
        )
      );

    let preferences;

    if (existing.length > 0) {
      // Update existing
      [preferences] = await db
        .update(notificationPreferences)
        .set({
          emailEnabled: emailEnabled ?? existing[0].emailEnabled,
          smsEnabled: smsEnabled ?? existing[0].smsEnabled,
          pushEnabled: pushEnabled ?? existing[0].pushEnabled,
          voicemailNotify: voicemailNotify ?? existing[0].voicemailNotify,
          missedCallNotify: missedCallNotify ?? existing[0].missedCallNotify,
          smsNotify: smsNotify ?? existing[0].smsNotify,
          dailySummary: dailySummary ?? existing[0].dailySummary,
          weeklySummary: weeklySummary ?? existing[0].weeklySummary,
          systemAlerts: systemAlerts ?? existing[0].systemAlerts,
          billingAlerts: billingAlerts ?? existing[0].billingAlerts,
          quietHoursEnabled: quietHoursEnabled ?? existing[0].quietHoursEnabled,
          quietHoursStart: quietHoursStart ?? existing[0].quietHoursStart,
          quietHoursEnd: quietHoursEnd ?? existing[0].quietHoursEnd,
          timezone: timezone ?? existing[0].timezone,
          updatedAt: new Date(),
        })
        .where(eq(notificationPreferences.id, existing[0].id))
        .returning();
    } else {
      // Create new
      [preferences] = await db
        .insert(notificationPreferences)
        .values({
          tenantId,
          userId,
          emailEnabled: emailEnabled ?? true,
          smsEnabled: smsEnabled ?? false,
          pushEnabled: pushEnabled ?? true,
          voicemailNotify: voicemailNotify ?? true,
          missedCallNotify: missedCallNotify ?? true,
          smsNotify: smsNotify ?? true,
          dailySummary: dailySummary ?? false,
          weeklySummary: weeklySummary ?? true,
          systemAlerts: systemAlerts ?? true,
          billingAlerts: billingAlerts ?? true,
          quietHoursEnabled: quietHoursEnabled ?? false,
          quietHoursStart: quietHoursStart || null,
          quietHoursEnd: quietHoursEnd || null,
          timezone: timezone ?? "America/New_York",
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications/preferences
 * Partially update notification preferences
 */
export async function PATCH(request: NextRequest) {
  // PATCH behaves same as PUT for this endpoint
  return PUT(request);
}

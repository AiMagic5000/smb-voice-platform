import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { organizations, phoneNumbers, subscriptions, invoices, callLogs, voicemails, users } from "@/lib/db/schema";
import { sql, eq, gte, and, count, sum, avg } from "drizzle-orm";

// Admin-only endpoint for platform statistics
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a super admin (you'd implement proper role checking)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get total clients (organizations)
    const [orgCount] = await db
      .select({ count: count() })
      .from(organizations);

    // Get active phone numbers
    const [phoneCount] = await db
      .select({ count: count() })
      .from(phoneNumbers)
      .where(eq(phoneNumbers.status, "active"));

    // Get monthly revenue from paid invoices
    const [revenueData] = await db
      .select({ total: sum(invoices.amountPaid) })
      .from(invoices)
      .where(
        and(
          eq(invoices.status, "paid"),
          gte(invoices.createdAt, thirtyDaysAgo)
        )
      );

    // Get active subscriptions count
    const [activeSubCount] = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"));

    // Get trialing subscriptions count
    const [trialingSubCount] = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, "trialing"));

    // Get total calls in last 30 days
    const [callCount] = await db
      .select({ count: count() })
      .from(callLogs)
      .where(gte(callLogs.createdAt, thirtyDaysAgo));

    // Get average call duration
    const [avgDuration] = await db
      .select({ avg: avg(callLogs.duration) })
      .from(callLogs)
      .where(
        and(
          gte(callLogs.createdAt, thirtyDaysAgo),
          sql`${callLogs.duration} IS NOT NULL`
        )
      );

    // Get voicemail count
    const [voicemailCount] = await db
      .select({ count: count() })
      .from(voicemails)
      .where(gte(voicemails.createdAt, thirtyDaysAgo));

    // Get user count
    const [userCount] = await db
      .select({ count: count() })
      .from(users);

    // Get new clients this month
    const [newClientsCount] = await db
      .select({ count: count() })
      .from(organizations)
      .where(gte(organizations.createdAt, thirtyDaysAgo));

    // Get new phone numbers this month
    const [newPhonesCount] = await db
      .select({ count: count() })
      .from(phoneNumbers)
      .where(gte(phoneNumbers.createdAt, thirtyDaysAgo));

    // Recent activity (last 10 actions)
    const recentOrgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        createdAt: organizations.createdAt,
      })
      .from(organizations)
      .orderBy(sql`${organizations.createdAt} DESC`)
      .limit(5);

    const recentPhones = await db
      .select({
        id: phoneNumbers.id,
        number: phoneNumbers.number,
        createdAt: phoneNumbers.createdAt,
      })
      .from(phoneNumbers)
      .orderBy(sql`${phoneNumbers.createdAt} DESC`)
      .limit(5);

    // Format average duration
    const avgDurationSeconds = Number(avgDuration?.avg) || 0;
    const minutes = Math.floor(avgDurationSeconds / 60);
    const seconds = Math.floor(avgDurationSeconds % 60);
    const avgCallDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Build recent activity list
    const recentActivity = [
      ...recentOrgs.map((org) => ({
        type: "New Client",
        name: org.name,
        time: formatTimeAgo(org.createdAt),
        createdAt: org.createdAt,
      })),
      ...recentPhones.map((phone) => ({
        type: "Phone Provisioned",
        name: phone.number,
        time: formatTimeAgo(phone.createdAt),
        createdAt: phone.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(({ type, name, time }) => ({ type, name, time }));

    return NextResponse.json({
      stats: {
        totalClients: orgCount?.count || 0,
        activePhoneNumbers: phoneCount?.count || 0,
        monthlyRevenue: (Number(revenueData?.total) || 0) / 100, // Convert from cents
        totalCalls: callCount?.count || 0,
        avgCallDuration,
        voicemails: voicemailCount?.count || 0,
        uptime: "99.97%", // Would come from monitoring service
        activeUsers: userCount?.count || 0,
        activeSubscriptions: activeSubCount?.count || 0,
        trialingSubscriptions: trialingSubCount?.count || 0,
        newClientsThisMonth: newClientsCount?.count || 0,
        newPhonesThisMonth: newPhonesCount?.count || 0,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

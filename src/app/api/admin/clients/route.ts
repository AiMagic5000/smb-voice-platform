import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, organizations, phoneNumbers, subscriptions } from "@/lib/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a super admin
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get all organizations with phone count
    const orgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        tier: organizations.tier,
        createdAt: organizations.createdAt,
      })
      .from(organizations)
      .orderBy(desc(organizations.createdAt));

    // Get phone counts per org
    const phoneCounts = await db
      .select({
        tenantId: phoneNumbers.tenantId,
        count: count(),
      })
      .from(phoneNumbers)
      .groupBy(phoneNumbers.tenantId);

    const phoneCountMap = new Map(
      phoneCounts.map((p) => [p.tenantId, Number(p.count)])
    );

    // Get subscription status per org
    const subs = await db
      .select({
        organizationId: subscriptions.organizationId,
        status: subscriptions.status,
      })
      .from(subscriptions);

    const subStatusMap = new Map(
      subs.map((s) => [s.organizationId, s.status])
    );

    const clients = orgs.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      tier: org.tier || "starter",
      phoneCount: phoneCountMap.get(org.id) || 0,
      createdAt: org.createdAt,
      status: subStatusMap.get(org.id) || "active",
    }));

    return NextResponse.json({
      clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

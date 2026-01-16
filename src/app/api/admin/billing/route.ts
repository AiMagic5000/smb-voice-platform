import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, invoices, subscriptions, organizations } from "@/lib/db/schema";
import { eq, desc, sum, count, gte, and } from "drizzle-orm";

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

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get total revenue
    const [totalRevenueData] = await db
      .select({ total: sum(invoices.amountPaid) })
      .from(invoices)
      .where(eq(invoices.status, "paid"));

    // Get monthly revenue
    const [monthlyRevenueData] = await db
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

    // Get pending invoices count
    const [pendingInvoiceCount] = await db
      .select({ count: count() })
      .from(invoices)
      .where(eq(invoices.status, "pending"));

    // Get recent invoices
    const recentInvoices = await db
      .select({
        id: invoices.id,
        organizationId: invoices.organizationId,
        amountDue: invoices.amountDue,
        amountPaid: invoices.amountPaid,
        status: invoices.status,
        createdAt: invoices.createdAt,
        paidAt: invoices.paidAt,
      })
      .from(invoices)
      .orderBy(desc(invoices.createdAt))
      .limit(50);

    // Get organization names
    const orgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
      })
      .from(organizations);

    const orgNameMap = new Map(orgs.map((o) => [o.id, o.name]));

    const invoicesWithOrg = recentInvoices.map((invoice) => ({
      id: invoice.id,
      organizationName: orgNameMap.get(invoice.organizationId) || "Unknown",
      amount: invoice.amount,
      status: invoice.status,
      createdAt: invoice.createdAt,
      paidAt: invoice.paidAt,
    }));

    return NextResponse.json({
      stats: {
        totalRevenue: Number(totalRevenueData?.total) || 0,
        monthlyRevenue: Number(monthlyRevenueData?.total) || 0,
        activeSubscriptions: activeSubCount?.count || 0,
        pendingInvoices: pendingInvoiceCount?.count || 0,
      },
      invoices: invoicesWithOrg,
    });
  } catch (error) {
    console.error("Error fetching billing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { eq, desc, sql, and, gte, lte, or, ilike } from "drizzle-orm";

/**
 * GET /api/audit-logs
 * List audit logs for the tenant (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId, orgRole } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can view audit logs
    if (orgId && orgRole !== "org:admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const tenantId = orgId || userId;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = (page - 1) * limit;
    const action = searchParams.get("action");
    const resourceType = searchParams.get("resourceType");
    const userIdFilter = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    // Build conditions
    const conditions = [eq(auditLogs.tenantId, tenantId)];

    if (action) {
      conditions.push(eq(auditLogs.action, action));
    }
    if (resourceType) {
      conditions.push(eq(auditLogs.resourceType, resourceType));
    }
    if (userIdFilter) {
      conditions.push(eq(auditLogs.userId, userIdFilter));
    }
    if (status) {
      conditions.push(eq(auditLogs.status, status));
    }
    if (startDate) {
      conditions.push(gte(auditLogs.createdAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(auditLogs.createdAt, new Date(endDate)));
    }
    if (search) {
      conditions.push(
        or(
          ilike(auditLogs.resourceName, `%${search}%`),
          ilike(auditLogs.userEmail, `%${search}%`),
          ilike(auditLogs.action, `%${search}%`)
        ) ?? sql`true`
      );
    }

    // Get logs
    const logs = await db
      .select()
      .from(auditLogs)
      .where(and(...conditions))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(and(...conditions));

    const total = Number(countResult[0]?.count || 0);

    // Get unique action types for filters
    const actionTypes = await db
      .selectDistinct({ action: auditLogs.action })
      .from(auditLogs)
      .where(eq(auditLogs.tenantId, tenantId));

    // Get unique resource types for filters
    const resourceTypes = await db
      .selectDistinct({ resourceType: auditLogs.resourceType })
      .from(auditLogs)
      .where(eq(auditLogs.tenantId, tenantId));

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        actions: actionTypes.map((a) => a.action),
        resourceTypes: resourceTypes.map((r) => r.resourceType),
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/audit-logs
 * Create an audit log entry (internal use)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;
    const body = await request.json();

    const {
      action,
      resourceType,
      resourceId,
      resourceName,
      details,
      previousValues,
      newValues,
      status = "success",
      errorMessage,
    } = body;

    if (!action || !resourceType) {
      return NextResponse.json(
        { error: "Action and resourceType are required" },
        { status: 400 }
      );
    }

    // Get IP and user agent from headers
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || undefined;

    const [log] = await db
      .insert(auditLogs)
      .values({
        tenantId,
        userId,
        action,
        resourceType,
        resourceId,
        resourceName,
        details,
        previousValues,
        newValues,
        ipAddress,
        userAgent,
        status,
        errorMessage,
      })
      .returning();

    return NextResponse.json({
      success: true,
      log,
    });
  } catch (error) {
    console.error("Error creating audit log:", error);
    return NextResponse.json(
      { error: "Failed to create audit log" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Blocklist Management API
 * Manage blocked phone numbers and spam protection
 */

interface BlockedNumber {
  id: string;
  phoneNumber: string;
  reason: string;
  type: "manual" | "auto" | "spam";
  callerName?: string;
  blockedAt: string;
  callsBlocked: number;
  lastAttempt?: string;
  tenantId: string;
}

// In-memory store (replace with database in production)
const blockedNumbers: Map<string, BlockedNumber[]> = new Map();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

/**
 * GET /api/blocklist
 * Get all blocked numbers for the tenant
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get tenant's blocked numbers
    let numbers = blockedNumbers.get(tenantId) || [];

    // Apply filters
    if (type) {
      numbers = numbers.filter((n) => n.type === type);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      numbers = numbers.filter(
        (n) =>
          n.phoneNumber.toLowerCase().includes(searchLower) ||
          n.callerName?.toLowerCase().includes(searchLower) ||
          n.reason.toLowerCase().includes(searchLower)
      );
    }

    // Sort by most recently blocked
    numbers.sort(
      (a, b) =>
        new Date(b.blockedAt).getTime() - new Date(a.blockedAt).getTime()
    );

    // Calculate stats
    const stats = {
      total: numbers.length,
      manual: numbers.filter((n) => n.type === "manual").length,
      auto: numbers.filter((n) => n.type === "auto").length,
      spam: numbers.filter((n) => n.type === "spam").length,
      totalCallsBlocked: numbers.reduce((sum, n) => sum + n.callsBlocked, 0),
    };

    // Paginate
    const paginatedNumbers = numbers.slice(offset, offset + limit);

    return NextResponse.json({
      blockedNumbers: paginatedNumbers,
      stats,
      pagination: {
        total: numbers.length,
        limit,
        offset,
        hasMore: offset + limit < numbers.length,
      },
    });
  } catch (error) {
    console.error("Error fetching blocklist:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocklist" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blocklist
 * Add a number to the blocklist
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();
    const { phoneNumber, reason, callerName, type = "manual" } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedNumber = phoneNumber.replace(/\D/g, "");

    // Check if already blocked
    const existing = blockedNumbers.get(tenantId) || [];
    if (
      existing.some((n) => n.phoneNumber.replace(/\D/g, "") === normalizedNumber)
    ) {
      return NextResponse.json(
        { error: "Number is already blocked" },
        { status: 409 }
      );
    }

    const newEntry: BlockedNumber = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      phoneNumber,
      reason: reason || "Manually blocked",
      type,
      callerName,
      blockedAt: new Date().toISOString(),
      callsBlocked: 0,
      tenantId,
    };

    existing.push(newEntry);
    blockedNumbers.set(tenantId, existing);

    return NextResponse.json({
      success: true,
      blockedNumber: newEntry,
    });
  } catch (error) {
    console.error("Error adding to blocklist:", error);
    return NextResponse.json(
      { error: "Failed to add to blocklist" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blocklist
 * Remove a number from the blocklist (bulk delete)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required" },
        { status: 400 }
      );
    }

    const existing = blockedNumbers.get(tenantId) || [];
    const updated = existing.filter((n) => !ids.includes(n.id));
    const removed = existing.length - updated.length;

    blockedNumbers.set(tenantId, updated);

    return NextResponse.json({
      success: true,
      removed,
    });
  } catch (error) {
    console.error("Error removing from blocklist:", error);
    return NextResponse.json(
      { error: "Failed to remove from blocklist" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Single Blocklist Entry API
 * Manage individual blocked number entries
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
 * GET /api/blocklist/[id]
 * Get a specific blocked number
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tenantId = getTenantId(userId, orgId);
    const numbers = blockedNumbers.get(tenantId) || [];
    const entry = numbers.find((n) => n.id === id);

    if (!entry) {
      return NextResponse.json(
        { error: "Blocked number not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ blockedNumber: entry });
  } catch (error) {
    console.error("Error fetching blocked number:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocked number" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/blocklist/[id]
 * Update a blocked number entry
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();
    const { reason, callerName, type } = body;

    const numbers = blockedNumbers.get(tenantId) || [];
    const index = numbers.findIndex((n) => n.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Blocked number not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (reason !== undefined) numbers[index].reason = reason;
    if (callerName !== undefined) numbers[index].callerName = callerName;
    if (type !== undefined) numbers[index].type = type;

    blockedNumbers.set(tenantId, numbers);

    return NextResponse.json({
      success: true,
      blockedNumber: numbers[index],
    });
  } catch (error) {
    console.error("Error updating blocked number:", error);
    return NextResponse.json(
      { error: "Failed to update blocked number" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blocklist/[id]
 * Remove a blocked number
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tenantId = getTenantId(userId, orgId);
    const numbers = blockedNumbers.get(tenantId) || [];
    const index = numbers.findIndex((n) => n.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Blocked number not found" },
        { status: 404 }
      );
    }

    const removed = numbers.splice(index, 1)[0];
    blockedNumbers.set(tenantId, numbers);

    return NextResponse.json({
      success: true,
      removed: removed,
    });
  } catch (error) {
    console.error("Error removing blocked number:", error);
    return NextResponse.json(
      { error: "Failed to remove blocked number" },
      { status: 500 }
    );
  }
}

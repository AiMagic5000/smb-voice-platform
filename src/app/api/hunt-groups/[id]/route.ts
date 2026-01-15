import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Hunt group types
interface HuntGroupAgent {
  id: string;
  name: string;
  extension: string;
  available: boolean;
  weight: number;
  skills: string[];
  currentCalls: number;
  totalCallsToday: number;
}

interface HuntGroup {
  id: string;
  tenantId: string;
  name: string;
  extension: string;
  distribution: "linear" | "circular" | "uniform" | "weighted" | "skill-based";
  wrapUpTime: number;
  maxWaitTime: number;
  agents: HuntGroupAgent[];
  overflowDestination: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory store (shared with main route in production would use database)
const huntGroupsStore = new Map<string, HuntGroup>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get single hunt group
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
    const huntGroup = huntGroupsStore.get(id);

    if (!huntGroup || huntGroup.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Hunt group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(huntGroup);
  } catch (error) {
    console.error("Error fetching hunt group:", error);
    return NextResponse.json(
      { error: "Failed to fetch hunt group" },
      { status: 500 }
    );
  }
}

// PATCH - Update hunt group
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
    const huntGroup = huntGroupsStore.get(id);

    if (!huntGroup || huntGroup.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Hunt group not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields = [
      "name",
      "extension",
      "distribution",
      "wrapUpTime",
      "maxWaitTime",
      "agents",
      "overflowDestination",
      "isActive",
    ];

    const updates: Partial<HuntGroup> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    // Check for duplicate extension if changing
    if (updates.extension && updates.extension !== huntGroup.extension) {
      const existingGroup = Array.from(huntGroupsStore.values()).find(
        (group) =>
          group.tenantId === tenantId &&
          group.extension === updates.extension &&
          group.id !== id
      );

      if (existingGroup) {
        return NextResponse.json(
          { error: "Extension already in use" },
          { status: 400 }
        );
      }
    }

    const updatedHuntGroup: HuntGroup = {
      ...huntGroup,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    huntGroupsStore.set(id, updatedHuntGroup);

    return NextResponse.json(updatedHuntGroup);
  } catch (error) {
    console.error("Error updating hunt group:", error);
    return NextResponse.json(
      { error: "Failed to update hunt group" },
      { status: 500 }
    );
  }
}

// DELETE - Delete hunt group
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
    const huntGroup = huntGroupsStore.get(id);

    if (!huntGroup || huntGroup.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Hunt group not found" },
        { status: 404 }
      );
    }

    huntGroupsStore.delete(id);

    return NextResponse.json({ success: true, message: "Hunt group deleted" });
  } catch (error) {
    console.error("Error deleting hunt group:", error);
    return NextResponse.json(
      { error: "Failed to delete hunt group" },
      { status: 500 }
    );
  }
}

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Ring group type
interface RingGroupMember {
  id: string;
  name: string;
  extension: string;
  available: boolean;
}

interface RingGroup {
  id: string;
  tenantId: string;
  name: string;
  extension: string;
  strategy: "simultaneous" | "sequential" | "random" | "least-recent";
  ringTime: number;
  members: RingGroupMember[];
  noAnswerDestination: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory store (shared with main route in production would use database)
const ringGroupsStore = new Map<string, RingGroup>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get single ring group
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
    const ringGroup = ringGroupsStore.get(id);

    if (!ringGroup || ringGroup.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Ring group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ringGroup);
  } catch (error) {
    console.error("Error fetching ring group:", error);
    return NextResponse.json(
      { error: "Failed to fetch ring group" },
      { status: 500 }
    );
  }
}

// PATCH - Update ring group
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
    const ringGroup = ringGroupsStore.get(id);

    if (!ringGroup || ringGroup.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Ring group not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields = [
      "name",
      "extension",
      "strategy",
      "ringTime",
      "members",
      "noAnswerDestination",
      "isActive",
    ];

    const updates: Partial<RingGroup> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    // Check for duplicate extension if changing
    if (updates.extension && updates.extension !== ringGroup.extension) {
      const existingGroup = Array.from(ringGroupsStore.values()).find(
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

    const updatedRingGroup: RingGroup = {
      ...ringGroup,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    ringGroupsStore.set(id, updatedRingGroup);

    return NextResponse.json(updatedRingGroup);
  } catch (error) {
    console.error("Error updating ring group:", error);
    return NextResponse.json(
      { error: "Failed to update ring group" },
      { status: 500 }
    );
  }
}

// DELETE - Delete ring group
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
    const ringGroup = ringGroupsStore.get(id);

    if (!ringGroup || ringGroup.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Ring group not found" },
        { status: 404 }
      );
    }

    ringGroupsStore.delete(id);

    return NextResponse.json({ success: true, message: "Ring group deleted" });
  } catch (error) {
    console.error("Error deleting ring group:", error);
    return NextResponse.json(
      { error: "Failed to delete ring group" },
      { status: 500 }
    );
  }
}

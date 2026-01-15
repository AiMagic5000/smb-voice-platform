import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Call tag type
interface CallTag {
  id: string;
  tenantId: string;
  name: string;
  color: string;
  description: string | null;
  usageCount: number;
  createdAt: string;
}

// In-memory store (shared with main route)
const tagsStore = new Map<string, CallTag>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get single tag
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
    const tag = tagsStore.get(id);

    if (!tag || tag.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch tag" },
      { status: 500 }
    );
  }
}

// PATCH - Update tag
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
    const tag = tagsStore.get(id);

    if (!tag || tag.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields = ["name", "color", "description"];

    const updates: Partial<CallTag> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    // Check for duplicate name if changing
    if (updates.name && updates.name !== tag.name) {
      const existingTag = Array.from(tagsStore.values()).find(
        (t) =>
          t.tenantId === tenantId &&
          t.name.toLowerCase() === (updates.name as string).toLowerCase() &&
          t.id !== id
      );

      if (existingTag) {
        return NextResponse.json(
          { error: "Tag with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updatedTag: CallTag = {
      ...tag,
      ...updates,
    };

    tagsStore.set(id, updatedTag);

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

// DELETE - Delete tag
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
    const tag = tagsStore.get(id);

    if (!tag || tag.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    tagsStore.delete(id);

    return NextResponse.json({ success: true, message: "Tag deleted" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}

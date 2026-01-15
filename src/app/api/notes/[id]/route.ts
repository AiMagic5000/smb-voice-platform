import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Call note type
interface CallNote {
  id: string;
  tenantId: string;
  callId: string;
  contactId: string | null;
  content: string;
  createdBy: string;
  createdByName: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory store (shared with main route)
const notesStore = new Map<string, CallNote>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get single note
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
    const note = notesStore.get(id);

    if (!note || note.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

// PATCH - Update note
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
    const note = notesStore.get(id);

    if (!note || note.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields = ["content", "isPinned"];

    const updates: Partial<CallNote> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    const updatedNote: CallNote = {
      ...note,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    notesStore.set(id, updatedNote);

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE - Delete note
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
    const note = notesStore.get(id);

    if (!note || note.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    notesStore.delete(id);

    return NextResponse.json({ success: true, message: "Note deleted" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}

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

// In-memory store
const notesStore = new Map<string, CallNote>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - List notes
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const callId = searchParams.get("callId");
    const contactId = searchParams.get("contactId");

    let notes = Array.from(notesStore.values()).filter(
      (n) => n.tenantId === tenantId
    );

    if (callId) {
      notes = notes.filter((n) => n.callId === callId);
    }

    if (contactId) {
      notes = notes.filter((n) => n.contactId === contactId);
    }

    // Sort by pinned first, then by date
    notes.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      notes,
      total: notes.length,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST - Create note
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { callId, contactId, content, createdByName } = body;

    if (!callId || !content) {
      return NextResponse.json(
        { error: "Call ID and content are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const note: CallNote = {
      id: `note_${Date.now()}`,
      tenantId,
      callId,
      contactId: contactId || null,
      content,
      createdBy: userId,
      createdByName: createdByName || "User",
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };

    notesStore.set(note.id, note);

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

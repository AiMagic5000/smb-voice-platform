import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Voicemail greeting type
interface VoicemailGreeting {
  id: string;
  tenantId: string;
  name: string;
  type: "default" | "business-hours" | "after-hours" | "holiday" | "custom";
  duration: number;
  fileUrl: string | null;
  transcript: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory store (shared with main route)
const greetingsStore = new Map<string, VoicemailGreeting>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get single greeting
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
    const greeting = greetingsStore.get(id);

    if (!greeting || greeting.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Voicemail greeting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(greeting);
  } catch (error) {
    console.error("Error fetching voicemail greeting:", error);
    return NextResponse.json(
      { error: "Failed to fetch voicemail greeting" },
      { status: 500 }
    );
  }
}

// PATCH - Update greeting
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
    const greeting = greetingsStore.get(id);

    if (!greeting || greeting.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Voicemail greeting not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields = ["name", "type", "duration", "fileUrl", "transcript", "isActive"];

    const updates: Partial<VoicemailGreeting> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    // If setting as active, deactivate others of same type
    if (updates.isActive) {
      const type = updates.type || greeting.type;
      Array.from(greetingsStore.values())
        .filter(
          (g) =>
            g.tenantId === tenantId &&
            g.type === type &&
            g.isActive &&
            g.id !== id
        )
        .forEach((g) => {
          greetingsStore.set(g.id, { ...g, isActive: false });
        });
    }

    const updatedGreeting: VoicemailGreeting = {
      ...greeting,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    greetingsStore.set(id, updatedGreeting);

    return NextResponse.json(updatedGreeting);
  } catch (error) {
    console.error("Error updating voicemail greeting:", error);
    return NextResponse.json(
      { error: "Failed to update voicemail greeting" },
      { status: 500 }
    );
  }
}

// DELETE - Delete greeting
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
    const greeting = greetingsStore.get(id);

    if (!greeting || greeting.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Voicemail greeting not found" },
        { status: 404 }
      );
    }

    greetingsStore.delete(id);

    return NextResponse.json({ success: true, message: "Voicemail greeting deleted" });
  } catch (error) {
    console.error("Error deleting voicemail greeting:", error);
    return NextResponse.json(
      { error: "Failed to delete voicemail greeting" },
      { status: 500 }
    );
  }
}

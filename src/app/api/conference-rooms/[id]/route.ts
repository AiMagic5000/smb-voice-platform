import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Single Conference Room API
 * Manage individual conference rooms
 */

interface Participant {
  id: string;
  name: string;
  phoneNumber: string;
  isMuted: boolean;
  isHost: boolean;
  joinedAt: string;
}

interface ConferenceRoom {
  id: string;
  name: string;
  pin: string;
  dialInNumber: string;
  moderatorPin?: string;
  maxParticipants: number;
  isActive: boolean;
  isLocked: boolean;
  participants: Participant[];
  createdAt: string;
  tenantId: string;
  settings: {
    muteOnEntry: boolean;
    recordCalls: boolean;
    announceJoinLeave: boolean;
    waitForModerator: boolean;
  };
}

// In-memory store (replace with database in production)
const conferenceRooms: Map<string, ConferenceRoom[]> = new Map();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

/**
 * GET /api/conference-rooms/[id]
 * Get a specific conference room
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
    const rooms = conferenceRooms.get(tenantId) || [];
    const room = rooms.find((r) => r.id === id);

    if (!room) {
      return NextResponse.json(
        { error: "Conference room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Error fetching conference room:", error);
    return NextResponse.json(
      { error: "Failed to fetch conference room" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/conference-rooms/[id]
 * Update a conference room
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
    const { name, maxParticipants, isLocked, settings } = body;

    const rooms = conferenceRooms.get(tenantId) || [];
    const index = rooms.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Conference room not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (name !== undefined) rooms[index].name = name;
    if (maxParticipants !== undefined)
      rooms[index].maxParticipants = Math.min(Math.max(maxParticipants, 2), 100);
    if (isLocked !== undefined) rooms[index].isLocked = isLocked;
    if (settings) {
      rooms[index].settings = {
        ...rooms[index].settings,
        ...settings,
      };
    }

    conferenceRooms.set(tenantId, rooms);

    return NextResponse.json({
      success: true,
      room: rooms[index],
    });
  } catch (error) {
    console.error("Error updating conference room:", error);
    return NextResponse.json(
      { error: "Failed to update conference room" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/conference-rooms/[id]
 * Delete a conference room
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
    const rooms = conferenceRooms.get(tenantId) || [];
    const index = rooms.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Conference room not found" },
        { status: 404 }
      );
    }

    // Don't allow deleting active rooms with participants
    if (rooms[index].isActive && rooms[index].participants.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete room with active participants" },
        { status: 400 }
      );
    }

    const removed = rooms.splice(index, 1)[0];
    conferenceRooms.set(tenantId, rooms);

    return NextResponse.json({
      success: true,
      removed,
    });
  } catch (error) {
    console.error("Error deleting conference room:", error);
    return NextResponse.json(
      { error: "Failed to delete conference room" },
      { status: 500 }
    );
  }
}

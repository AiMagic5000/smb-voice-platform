import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Conference Rooms API
 * Manage audio conference bridges
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

function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateDialInNumber(): string {
  return `+1 (555) 800-${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * GET /api/conference-rooms
 * Get all conference rooms for the tenant
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get("active") === "true";

    let rooms = conferenceRooms.get(tenantId) || [];

    if (activeOnly) {
      rooms = rooms.filter((r) => r.isActive);
    }

    // Sort by creation date, most recent first
    rooms.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const stats = {
      total: rooms.length,
      active: rooms.filter((r) => r.isActive).length,
      totalParticipants: rooms.reduce(
        (sum, r) => sum + r.participants.length,
        0
      ),
    };

    return NextResponse.json({
      rooms,
      stats,
    });
  } catch (error) {
    console.error("Error fetching conference rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch conference rooms" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conference-rooms
 * Create a new conference room
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();
    const { name, maxParticipants = 50, settings } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    const room: ConferenceRoom = {
      id: `conf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      pin: generatePin(),
      dialInNumber: generateDialInNumber(),
      moderatorPin: generatePin(),
      maxParticipants: Math.min(Math.max(maxParticipants, 2), 100),
      isActive: false,
      isLocked: false,
      participants: [],
      createdAt: new Date().toISOString(),
      tenantId,
      settings: {
        muteOnEntry: settings?.muteOnEntry ?? true,
        recordCalls: settings?.recordCalls ?? false,
        announceJoinLeave: settings?.announceJoinLeave ?? true,
        waitForModerator: settings?.waitForModerator ?? false,
      },
    };

    const existing = conferenceRooms.get(tenantId) || [];
    existing.push(room);
    conferenceRooms.set(tenantId, existing);

    return NextResponse.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Error creating conference room:", error);
    return NextResponse.json(
      { error: "Failed to create conference room" },
      { status: 500 }
    );
  }
}

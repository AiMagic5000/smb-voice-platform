import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Agent presence type
interface AgentPresence {
  id: string;
  tenantId: string;
  agentId: string;
  agentName: string;
  extension: string;
  status: "available" | "busy" | "away" | "dnd" | "offline";
  statusMessage: string | null;
  onCall: boolean;
  currentCallId: string | null;
  lastActivity: string;
  updatedAt: string;
}

// In-memory store
const presenceStore = new Map<string, AgentPresence>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get presence for all agents or specific agent
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const agentId = searchParams.get("agentId");
    const statusFilter = searchParams.get("status");

    let presenceList = Array.from(presenceStore.values()).filter(
      (p) => p.tenantId === tenantId
    );

    if (agentId) {
      presenceList = presenceList.filter((p) => p.agentId === agentId);
    }

    if (statusFilter) {
      presenceList = presenceList.filter((p) => p.status === statusFilter);
    }

    // Sort by status (available first) then by name
    const statusOrder = ["available", "busy", "away", "dnd", "offline"];
    presenceList.sort((a, b) => {
      const statusDiff =
        statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      if (statusDiff !== 0) return statusDiff;
      return a.agentName.localeCompare(b.agentName);
    });

    // Calculate stats
    const stats = {
      total: presenceList.length,
      available: presenceList.filter((p) => p.status === "available").length,
      busy: presenceList.filter((p) => p.status === "busy").length,
      away: presenceList.filter((p) => p.status === "away").length,
      dnd: presenceList.filter((p) => p.status === "dnd").length,
      offline: presenceList.filter((p) => p.status === "offline").length,
      onCall: presenceList.filter((p) => p.onCall).length,
    };

    return NextResponse.json({
      presence: presenceList,
      stats,
    });
  } catch (error) {
    console.error("Error fetching presence:", error);
    return NextResponse.json(
      { error: "Failed to fetch presence" },
      { status: 500 }
    );
  }
}

// POST - Update presence status
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { agentId, agentName, extension, status, statusMessage, onCall, currentCallId } = body;

    if (!agentId || !agentName || !extension) {
      return NextResponse.json(
        { error: "Agent ID, name, and extension are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["available", "busy", "away", "dnd", "offline"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Find existing presence or create new
    const existingEntry = Array.from(presenceStore.entries()).find(
      ([, p]) => p.tenantId === tenantId && p.agentId === agentId
    );

    const now = new Date().toISOString();
    const presence: AgentPresence = {
      id: existingEntry?.[0] || `presence_${Date.now()}`,
      tenantId,
      agentId,
      agentName,
      extension,
      status: status || (existingEntry?.[1].status ?? "available"),
      statusMessage: statusMessage ?? (existingEntry?.[1].statusMessage ?? null),
      onCall: onCall ?? (existingEntry?.[1].onCall ?? false),
      currentCallId: currentCallId ?? (existingEntry?.[1].currentCallId ?? null),
      lastActivity: now,
      updatedAt: now,
    };

    presenceStore.set(presence.id, presence);

    return NextResponse.json(presence, { status: existingEntry ? 200 : 201 });
  } catch (error) {
    console.error("Error updating presence:", error);
    return NextResponse.json(
      { error: "Failed to update presence" },
      { status: 500 }
    );
  }
}

// PATCH - Update status only
export async function PATCH(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { agentId, status, statusMessage, onCall, currentCallId } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    // Find existing presence
    const entry = Array.from(presenceStore.entries()).find(
      ([, p]) => p.tenantId === tenantId && p.agentId === agentId
    );

    if (!entry) {
      return NextResponse.json(
        { error: "Agent presence not found" },
        { status: 404 }
      );
    }

    const validStatuses = ["available", "busy", "away", "dnd", "offline"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const updatedPresence: AgentPresence = {
      ...entry[1],
      status: status ?? entry[1].status,
      statusMessage: statusMessage !== undefined ? statusMessage : entry[1].statusMessage,
      onCall: onCall ?? entry[1].onCall,
      currentCallId: currentCallId !== undefined ? currentCallId : entry[1].currentCallId,
      lastActivity: now,
      updatedAt: now,
    };

    presenceStore.set(entry[0], updatedPresence);

    return NextResponse.json(updatedPresence);
  } catch (error) {
    console.error("Error updating presence:", error);
    return NextResponse.json(
      { error: "Failed to update presence" },
      { status: 500 }
    );
  }
}

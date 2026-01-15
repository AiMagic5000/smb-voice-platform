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

// In-memory store
const ringGroupsStore = new Map<string, RingGroup>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - List ring groups
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get("active") === "true";

    // Get ring groups for tenant
    let ringGroups = Array.from(ringGroupsStore.values()).filter(
      (group) => group.tenantId === tenantId
    );

    if (activeOnly) {
      ringGroups = ringGroups.filter((group) => group.isActive);
    }

    // Sort by name
    ringGroups.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      ringGroups,
      total: ringGroups.length,
    });
  } catch (error) {
    console.error("Error fetching ring groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch ring groups" },
      { status: 500 }
    );
  }
}

// POST - Create ring group
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { name, extension, strategy, ringTime, members, noAnswerDestination } = body;

    if (!name || !extension) {
      return NextResponse.json(
        { error: "Name and extension are required" },
        { status: 400 }
      );
    }

    // Check for duplicate extension
    const existingGroup = Array.from(ringGroupsStore.values()).find(
      (group) => group.tenantId === tenantId && group.extension === extension
    );

    if (existingGroup) {
      return NextResponse.json(
        { error: "Extension already in use" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const ringGroup: RingGroup = {
      id: `rg_${Date.now()}`,
      tenantId,
      name,
      extension,
      strategy: strategy || "simultaneous",
      ringTime: ringTime || 20,
      members: members || [],
      noAnswerDestination: noAnswerDestination || "voicemail",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    ringGroupsStore.set(ringGroup.id, ringGroup);

    return NextResponse.json(ringGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating ring group:", error);
    return NextResponse.json(
      { error: "Failed to create ring group" },
      { status: 500 }
    );
  }
}

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

// In-memory store
const huntGroupsStore = new Map<string, HuntGroup>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - List hunt groups
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get("active") === "true";

    // Get hunt groups for tenant
    let huntGroups = Array.from(huntGroupsStore.values()).filter(
      (group) => group.tenantId === tenantId
    );

    if (activeOnly) {
      huntGroups = huntGroups.filter((group) => group.isActive);
    }

    // Sort by name
    huntGroups.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      huntGroups,
      total: huntGroups.length,
    });
  } catch (error) {
    console.error("Error fetching hunt groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch hunt groups" },
      { status: 500 }
    );
  }
}

// POST - Create hunt group
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const {
      name,
      extension,
      distribution,
      wrapUpTime,
      maxWaitTime,
      agents,
      overflowDestination,
    } = body;

    if (!name || !extension) {
      return NextResponse.json(
        { error: "Name and extension are required" },
        { status: 400 }
      );
    }

    // Check for duplicate extension
    const existingGroup = Array.from(huntGroupsStore.values()).find(
      (group) => group.tenantId === tenantId && group.extension === extension
    );

    if (existingGroup) {
      return NextResponse.json(
        { error: "Extension already in use" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const huntGroup: HuntGroup = {
      id: `hg_${Date.now()}`,
      tenantId,
      name,
      extension,
      distribution: distribution || "linear",
      wrapUpTime: wrapUpTime || 10,
      maxWaitTime: maxWaitTime || 300,
      agents: agents || [],
      overflowDestination: overflowDestination || "voicemail",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    huntGroupsStore.set(huntGroup.id, huntGroup);

    return NextResponse.json(huntGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating hunt group:", error);
    return NextResponse.json(
      { error: "Failed to create hunt group" },
      { status: 500 }
    );
  }
}

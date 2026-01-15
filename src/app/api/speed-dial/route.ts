import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Speed dial type
interface SpeedDial {
  id: string;
  tenantId: string;
  slot: number;
  name: string;
  number: string;
  type: "person" | "business" | "extension";
  createdAt: string;
  updatedAt: string;
}

// In-memory store
const speedDialsStore = new Map<string, SpeedDial>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - List speed dials
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);

    // Get speed dials for tenant
    const speedDials = Array.from(speedDialsStore.values())
      .filter((sd) => sd.tenantId === tenantId)
      .sort((a, b) => a.slot - b.slot);

    return NextResponse.json({
      speedDials,
      total: speedDials.length,
    });
  } catch (error) {
    console.error("Error fetching speed dials:", error);
    return NextResponse.json(
      { error: "Failed to fetch speed dials" },
      { status: 500 }
    );
  }
}

// POST - Create or update speed dial
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { slot, name, number, type } = body;

    if (!slot || slot < 1 || slot > 9) {
      return NextResponse.json(
        { error: "Slot must be between 1 and 9" },
        { status: 400 }
      );
    }

    if (!name || !number) {
      return NextResponse.json(
        { error: "Name and number are required" },
        { status: 400 }
      );
    }

    // Check if slot already exists for this tenant
    const existingId = Array.from(speedDialsStore.entries()).find(
      ([, sd]) => sd.tenantId === tenantId && sd.slot === slot
    )?.[0];

    const now = new Date().toISOString();
    const speedDial: SpeedDial = {
      id: existingId || `sd_${Date.now()}`,
      tenantId,
      slot,
      name,
      number,
      type: type || "person",
      createdAt: existingId
        ? speedDialsStore.get(existingId)!.createdAt
        : now,
      updatedAt: now,
    };

    speedDialsStore.set(speedDial.id, speedDial);

    return NextResponse.json(speedDial, { status: existingId ? 200 : 201 });
  } catch (error) {
    console.error("Error creating speed dial:", error);
    return NextResponse.json(
      { error: "Failed to create speed dial" },
      { status: 500 }
    );
  }
}

// DELETE - Clear speed dial slot
export async function DELETE(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const { searchParams } = new URL(request.url);
    const slot = parseInt(searchParams.get("slot") || "0");

    if (!slot || slot < 1 || slot > 9) {
      return NextResponse.json(
        { error: "Valid slot (1-9) is required" },
        { status: 400 }
      );
    }

    // Find and delete the speed dial
    const entry = Array.from(speedDialsStore.entries()).find(
      ([, sd]) => sd.tenantId === tenantId && sd.slot === slot
    );

    if (!entry) {
      return NextResponse.json(
        { error: "Speed dial not found" },
        { status: 404 }
      );
    }

    speedDialsStore.delete(entry[0]);

    return NextResponse.json({ success: true, message: "Speed dial cleared" });
  } catch (error) {
    console.error("Error deleting speed dial:", error);
    return NextResponse.json(
      { error: "Failed to delete speed dial" },
      { status: 500 }
    );
  }
}

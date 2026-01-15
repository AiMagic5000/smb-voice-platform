import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Parked call type
interface ParkedCall {
  id: string;
  tenantId: string;
  slot: number;
  callId: string;
  callerNumber: string;
  callerName: string;
  calledNumber: string;
  parkedBy: string;
  parkedByExtension: string;
  parkedAt: string;
  timeout: number;
  expiresAt: string;
}

// In-memory store
const parkedCallsStore = new Map<string, ParkedCall>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - List parked calls
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const now = new Date();

    // Get active parked calls (not expired)
    const parkedCalls = Array.from(parkedCallsStore.values())
      .filter((call) => {
        if (call.tenantId !== tenantId) return false;
        // Remove expired calls
        if (new Date(call.expiresAt) < now) {
          parkedCallsStore.delete(call.id);
          return false;
        }
        return true;
      })
      .sort((a, b) => a.slot - b.slot);

    // Create slots array with parked calls
    const slots = Array.from({ length: 10 }, (_, i) => {
      const parkedCall = parkedCalls.find((c) => c.slot === i + 1);
      return {
        slot: i + 1,
        isOccupied: !!parkedCall,
        call: parkedCall || null,
      };
    });

    return NextResponse.json({
      slots,
      parkedCount: parkedCalls.length,
      availableSlots: 10 - parkedCalls.length,
    });
  } catch (error) {
    console.error("Error fetching parked calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch parked calls" },
      { status: 500 }
    );
  }
}

// POST - Park a call
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const {
      callId,
      callerNumber,
      callerName,
      calledNumber,
      parkedBy,
      parkedByExtension,
      slot,
      timeout,
    } = body;

    if (!callId || !callerNumber) {
      return NextResponse.json(
        { error: "Call ID and caller number are required" },
        { status: 400 }
      );
    }

    // Clean up expired calls
    const now = new Date();
    Array.from(parkedCallsStore.entries()).forEach(([id, call]) => {
      if (new Date(call.expiresAt) < now) {
        parkedCallsStore.delete(id);
      }
    });

    // Find available slot or use requested slot
    const tenantCalls = Array.from(parkedCallsStore.values()).filter(
      (c) => c.tenantId === tenantId
    );
    const occupiedSlots = new Set(tenantCalls.map((c) => c.slot));

    let assignedSlot = slot;
    if (slot) {
      if (slot < 1 || slot > 10) {
        return NextResponse.json(
          { error: "Slot must be between 1 and 10" },
          { status: 400 }
        );
      }
      if (occupiedSlots.has(slot)) {
        return NextResponse.json(
          { error: "Slot is already occupied" },
          { status: 400 }
        );
      }
    } else {
      // Find first available slot
      for (let i = 1; i <= 10; i++) {
        if (!occupiedSlots.has(i)) {
          assignedSlot = i;
          break;
        }
      }
      if (!assignedSlot) {
        return NextResponse.json(
          { error: "No available parking slots" },
          { status: 400 }
        );
      }
    }

    const parkTimeout = timeout || 180; // Default 3 minutes
    const parkedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + parkTimeout * 1000).toISOString();

    const parkedCall: ParkedCall = {
      id: `park_${Date.now()}`,
      tenantId,
      slot: assignedSlot,
      callId,
      callerNumber,
      callerName: callerName || "Unknown",
      calledNumber: calledNumber || "",
      parkedBy: parkedBy || "System",
      parkedByExtension: parkedByExtension || "",
      parkedAt,
      timeout: parkTimeout,
      expiresAt,
    };

    parkedCallsStore.set(parkedCall.id, parkedCall);

    return NextResponse.json(parkedCall, { status: 201 });
  } catch (error) {
    console.error("Error parking call:", error);
    return NextResponse.json(
      { error: "Failed to park call" },
      { status: 500 }
    );
  }
}

// DELETE - Retrieve (unpark) a call
export async function DELETE(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const { searchParams } = new URL(request.url);
    const slot = parseInt(searchParams.get("slot") || "0");

    if (!slot || slot < 1 || slot > 10) {
      return NextResponse.json(
        { error: "Valid slot (1-10) is required" },
        { status: 400 }
      );
    }

    // Find parked call in slot
    const entry = Array.from(parkedCallsStore.entries()).find(
      ([, call]) => call.tenantId === tenantId && call.slot === slot
    );

    if (!entry) {
      return NextResponse.json(
        { error: "No call parked in this slot" },
        { status: 404 }
      );
    }

    const parkedCall = entry[1];
    parkedCallsStore.delete(entry[0]);

    return NextResponse.json({
      success: true,
      message: "Call retrieved from park",
      call: parkedCall,
    });
  } catch (error) {
    console.error("Error retrieving parked call:", error);
    return NextResponse.json(
      { error: "Failed to retrieve parked call" },
      { status: 500 }
    );
  }
}

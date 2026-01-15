import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// E911 location type
interface E911Location {
  id: string;
  tenantId: string;
  phoneNumberId: string;
  phoneNumber: string;
  locationName: string;
  address: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  callerName: string;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-memory store (shared with main route)
const e911Store = new Map<string, E911Location>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get single E911 location
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
    const location = e911Store.get(id);

    if (!location || location.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "E911 location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error("Error fetching E911 location:", error);
    return NextResponse.json(
      { error: "Failed to fetch E911 location" },
      { status: 500 }
    );
  }
}

// POST - Verify E911 location (trigger verification)
export async function POST(
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
    const location = e911Store.get(id);

    if (!location || location.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "E911 location not found" },
        { status: 404 }
      );
    }

    // Simulate verification process (in production would call E911 provider API)
    const now = new Date().toISOString();
    const verifiedLocation: E911Location = {
      ...location,
      isVerified: true,
      verifiedAt: now,
      updatedAt: now,
    };

    e911Store.set(id, verifiedLocation);

    return NextResponse.json({
      success: true,
      message: "E911 location verified successfully",
      location: verifiedLocation,
    });
  } catch (error) {
    console.error("Error verifying E911 location:", error);
    return NextResponse.json(
      { error: "Failed to verify E911 location" },
      { status: 500 }
    );
  }
}

// DELETE - Delete E911 location
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
    const location = e911Store.get(id);

    if (!location || location.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "E911 location not found" },
        { status: 404 }
      );
    }

    e911Store.delete(id);

    return NextResponse.json({ success: true, message: "E911 location deleted" });
  } catch (error) {
    console.error("Error deleting E911 location:", error);
    return NextResponse.json(
      { error: "Failed to delete E911 location" },
      { status: 500 }
    );
  }
}

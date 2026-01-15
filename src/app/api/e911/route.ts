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

// In-memory store
const e911Store = new Map<string, E911Location>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - List E911 locations
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);

    // Get E911 locations for tenant
    const locations = Array.from(e911Store.values())
      .filter((loc) => loc.tenantId === tenantId)
      .sort((a, b) => a.locationName.localeCompare(b.locationName));

    return NextResponse.json({
      locations,
      total: locations.length,
    });
  } catch (error) {
    console.error("Error fetching E911 locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch E911 locations" },
      { status: 500 }
    );
  }
}

// POST - Create E911 location
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { phoneNumberId, phoneNumber, locationName, address, callerName } = body;

    if (!phoneNumber || !locationName || !address || !callerName) {
      return NextResponse.json(
        { error: "Phone number, location name, address, and caller name are required" },
        { status: 400 }
      );
    }

    // Validate address fields
    const requiredAddressFields = ["street1", "city", "state", "zipCode", "country"];
    for (const field of requiredAddressFields) {
      if (!address[field]) {
        return NextResponse.json(
          { error: `Address ${field} is required` },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();
    const location: E911Location = {
      id: `e911_${Date.now()}`,
      tenantId,
      phoneNumberId: phoneNumberId || `pn_${Date.now()}`,
      phoneNumber,
      locationName,
      address: {
        street1: address.street1,
        street2: address.street2 || "",
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      },
      callerName,
      isVerified: false,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    e911Store.set(location.id, location);

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error("Error creating E911 location:", error);
    return NextResponse.json(
      { error: "Failed to create E911 location" },
      { status: 500 }
    );
  }
}

// PATCH - Update E911 location
export async function PATCH(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    const location = e911Store.get(id);

    if (!location || location.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "E911 location not found" },
        { status: 404 }
      );
    }

    // Update address if provided
    const updatedAddress = updates.address
      ? { ...location.address, ...updates.address }
      : location.address;

    const updatedLocation: E911Location = {
      ...location,
      ...updates,
      address: updatedAddress,
      // Reset verification if address changed
      isVerified: updates.address ? false : location.isVerified,
      verifiedAt: updates.address ? null : location.verifiedAt,
      updatedAt: new Date().toISOString(),
    };

    e911Store.set(id, updatedLocation);

    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error("Error updating E911 location:", error);
    return NextResponse.json(
      { error: "Failed to update E911 location" },
      { status: 500 }
    );
  }
}

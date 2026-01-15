import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/phone-numbers - List phone numbers for organization
export async function GET() {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Fetch phone numbers from database
    // For now, return mock data
    const phoneNumbers = [
      {
        id: "pn_1",
        number: "+18885344145",
        type: "toll-free",
        label: "Main Business Line",
        status: "active",
        organizationId: orgId,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ phoneNumbers });
  } catch (error) {
    console.error("Error fetching phone numbers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/phone-numbers - Provision a new phone number
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, areaCode, label } = body;

    if (!type || !["local", "toll-free"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid phone number type" },
        { status: 400 }
      );
    }

    // TODO: Call SignalWire API to provision number
    // TODO: Store in database

    const newPhoneNumber = {
      id: `pn_${Date.now()}`,
      number: type === "toll-free" ? "+18001234567" : `+1${areaCode}5551234`,
      type,
      label: label || "New Phone Number",
      status: "active",
      organizationId: orgId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ phoneNumber: newPhoneNumber }, { status: 201 });
  } catch (error) {
    console.error("Error provisioning phone number:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

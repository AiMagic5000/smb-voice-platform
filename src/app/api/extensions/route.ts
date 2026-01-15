import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/extensions - List extensions for organization
export async function GET() {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Fetch extensions from database
    // For now, return mock data
    const extensions = [
      {
        id: "ext_1",
        extension: "101",
        name: "John Smith",
        email: "john@company.com",
        phone: "+15551234567",
        status: "available",
        organizationId: orgId,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ extensions });
  } catch (error) {
    console.error("Error fetching extensions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/extensions - Create a new extension
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, extension } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // TODO: Validate extension number is unique
    // TODO: Store in database
    // TODO: Create user in FusionPBX

    const newExtension = {
      id: `ext_${Date.now()}`,
      extension: extension || String(100 + Math.floor(Math.random() * 900)),
      name,
      email,
      phone: phone || null,
      status: "available",
      organizationId: orgId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ extension: newExtension }, { status: 201 });
  } catch (error) {
    console.error("Error creating extension:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/extensions/[id] - Get extension details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Fetch extension from database
    const extension = {
      id,
      extension: "101",
      name: "John Smith",
      email: "john@company.com",
      phone: "+15551234567",
      status: "available",
      sipUsername: `ext_${id}`,
      voicemailEnabled: true,
      voicemailPin: "1234",
      callerIdName: "John Smith",
      callerIdNumber: "+15551234567",
      callWaiting: true,
      doNotDisturb: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ extension });
  } catch (error) {
    console.error("Error fetching extension:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/extensions/[id] - Update extension
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, status, forwardTo, voicemailEnabled, callerIdName, doNotDisturb } = body;

    // TODO: Update in database
    // TODO: Update in FusionPBX if SIP settings changed

    const updatedExtension = {
      id,
      extension: "101",
      name: name || "John Smith",
      email: email || "john@company.com",
      phone: phone || "+15551234567",
      status: status || "available",
      forwardTo,
      voicemailEnabled: voicemailEnabled ?? true,
      callerIdName: callerIdName || "John Smith",
      doNotDisturb: doNotDisturb ?? false,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ extension: updatedExtension });
  } catch (error) {
    console.error("Error updating extension:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/extensions/[id] - Delete extension
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Delete from database
    // TODO: Delete from FusionPBX
    // TODO: Reassign any phone numbers routed to this extension

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting extension:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

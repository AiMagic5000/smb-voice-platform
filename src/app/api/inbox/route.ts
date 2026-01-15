import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/inbox - Get shared inbox items
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // new, open, pending, resolved
    const type = searchParams.get("type"); // call, sms, voicemail, email
    const assignedTo = searchParams.get("assignedTo");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // TODO: Fetch inbox items from database (calls, sms, voicemails)
    const items = [
      {
        id: "inbox_1",
        type: "call",
        direction: "inbound",
        status: "new",
        contact: {
          name: "John Smith",
          phone: "+15551234567",
        },
        preview: "Missed call - 2 minutes",
        assignedTo: null,
        organizationId: orgId,
        createdAt: new Date(Date.now() - 300000).toISOString(),
        updatedAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: "inbox_2",
        type: "sms",
        direction: "inbound",
        status: "open",
        contact: {
          name: "Sarah Johnson",
          phone: "+15552345678",
        },
        preview: "Hi, I need help with my order...",
        assignedTo: {
          id: "user_123",
          name: "Mike Chen",
        },
        organizationId: orgId,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 900000).toISOString(),
      },
    ];

    // Apply filters
    let filtered = items;
    if (status) {
      filtered = filtered.filter((i) => i.status === status);
    }
    if (type) {
      filtered = filtered.filter((i) => i.type === type);
    }

    return NextResponse.json({
      items: filtered,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
      stats: {
        new: items.filter((i) => i.status === "new").length,
        open: items.filter((i) => i.status === "open").length,
        pending: items.filter((i) => i.status === "pending").length,
        resolved: items.filter((i) => i.status === "resolved").length,
      },
    });
  } catch (error) {
    console.error("Error fetching inbox:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/inbox - Bulk update inbox items
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemIds, status, assignedTo } = body;

    if (!itemIds || itemIds.length === 0) {
      return NextResponse.json(
        { error: "Item IDs are required" },
        { status: 400 }
      );
    }

    // TODO: Update items in database
    return NextResponse.json({
      success: true,
      updatedCount: itemIds.length,
      message: `Updated ${itemIds.length} items`,
    });
  } catch (error) {
    console.error("Error updating inbox:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/fax - List faxes
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const direction = searchParams.get("direction"); // sent, received
    const status = searchParams.get("status"); // queued, sending, delivered, failed
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // TODO: Fetch faxes from database with pagination
    const faxes = [
      {
        id: "fax_1",
        direction: "received",
        fromNumber: "+15551234567",
        toNumber: "+15559876543",
        pages: 3,
        status: "delivered",
        contentType: "application/pdf",
        fileUrl: "/api/fax/fax_1/download",
        callerName: "ABC Company",
        receivedAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "fax_2",
        direction: "sent",
        fromNumber: "+15559876543",
        toNumber: "+15552345678",
        pages: 5,
        status: "delivered",
        contentType: "application/pdf",
        fileUrl: "/api/fax/fax_2/download",
        recipientName: "Client Corp",
        sentAt: new Date(Date.now() - 7200000).toISOString(),
        deliveredAt: new Date(Date.now() - 7100000).toISOString(),
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    // Apply filters
    let filtered = faxes;
    if (direction) {
      filtered = filtered.filter((f) => f.direction === direction);
    }
    if (status) {
      filtered = filtered.filter((f) => f.status === status);
    }

    return NextResponse.json({
      faxes: filtered,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching faxes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/fax - Send a fax
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const toNumber = formData.get("toNumber") as string;
    const fromNumberId = formData.get("fromNumberId") as string;
    const file = formData.get("file") as File;
    const recipientName = formData.get("recipientName") as string;
    const coverPageMessage = formData.get("coverPageMessage") as string;
    const includeCoverPage = formData.get("includeCoverPage") === "true";

    if (!toNumber || !file) {
      return NextResponse.json(
        { error: "Recipient number and file are required" },
        { status: 400 }
      );
    }

    // Validate file type (PDF, TIF, PNG, JPG)
    const allowedTypes = [
      "application/pdf",
      "image/tiff",
      "image/png",
      "image/jpeg",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File must be PDF, TIFF, PNG, or JPEG" },
        { status: 400 }
      );
    }

    // TODO: Upload file to storage
    // TODO: Send fax via SignalWire
    // TODO: Store fax record in database

    const newFax = {
      id: `fax_${Date.now()}`,
      direction: "sent",
      fromNumber: "+15559876543", // TODO: Get from phone number ID
      toNumber,
      pages: 1, // Will be calculated after processing
      status: "queued",
      contentType: file.type,
      fileName: file.name,
      fileSize: file.size,
      recipientName: recipientName || null,
      includeCoverPage,
      coverPageMessage: includeCoverPage ? coverPageMessage : null,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 300000).toISOString(), // ~5 min
    };

    return NextResponse.json({ fax: newFax }, { status: 201 });
  } catch (error) {
    console.error("Error sending fax:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

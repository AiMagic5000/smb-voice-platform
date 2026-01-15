import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/fax/[id] - Get fax details
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

    // TODO: Fetch fax from database
    const fax = {
      id,
      direction: "received",
      fromNumber: "+15551234567",
      toNumber: "+15559876543",
      pages: 3,
      status: "delivered",
      contentType: "application/pdf",
      fileUrl: `/api/fax/${id}/download`,
      thumbnailUrl: `/api/fax/${id}/thumbnail`,
      callerName: "ABC Company",
      duration: 45, // seconds to transmit
      resolution: "fine", // standard, fine, superfine
      errorCode: null,
      errorMessage: null,
      retryCount: 0,
      metadata: {
        width: 8.5,
        height: 11,
        dpi: 200,
        compression: "MMR",
      },
      receivedAt: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    };

    return NextResponse.json({ fax });
  } catch (error) {
    console.error("Error fetching fax:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/fax/[id] - Delete fax
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

    // TODO: Delete fax from database
    // TODO: Delete file from storage

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting fax:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/fax/[id] - Resend/retry fax
export async function POST(
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
    const { action } = body; // resend, forward

    if (action === "resend") {
      // TODO: Re-queue the fax for sending
      return NextResponse.json({
        success: true,
        message: "Fax queued for resending",
        newFaxId: `fax_${Date.now()}`,
      });
    }

    if (action === "forward") {
      const { toNumber, toEmail } = body;
      if (!toNumber && !toEmail) {
        return NextResponse.json(
          { error: "Forward destination required" },
          { status: 400 }
        );
      }

      // TODO: Forward fax via email or to another number
      return NextResponse.json({
        success: true,
        message: toEmail
          ? `Fax forwarded to ${toEmail}`
          : `Fax queued for forwarding to ${toNumber}`,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing fax action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

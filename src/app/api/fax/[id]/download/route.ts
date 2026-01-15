import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/fax/[id]/download - Download fax file
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

    // TODO: Fetch fax from database to get file URL
    // TODO: Stream file from storage (S3/SignalWire)

    // For now, return a placeholder response
    // In production, this would stream the actual PDF/TIFF file
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", `attachment; filename="fax-${id}.pdf"`);
    headers.set("Cache-Control", "private, max-age=3600");

    // Placeholder: Return a simple PDF-like response
    // In production, fetch from storage and stream
    return new NextResponse(
      "Fax download endpoint - file would be streamed here",
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Error downloading fax:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/hold-music - List hold music tracks
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tracks = [
      {
        id: "track_1",
        name: "Classic Hold Music",
        fileName: "classic_hold.mp3",
        duration: 180,
        fileSize: 2850000,
        isDefault: true,
        isActive: true,
        organizationId: orgId,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Error fetching hold music:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/hold-music - Upload new hold music
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;
    const setAsDefault = formData.get("setAsDefault") === "true";

    if (!name || !file) {
      return NextResponse.json({ error: "Name and file are required" }, { status: 400 });
    }

    // TODO: Upload to storage, get duration
    const newTrack = {
      id: `track_${Date.now()}`,
      name,
      fileName: file.name,
      duration: 180,
      fileSize: file.size,
      isDefault: setAsDefault,
      isActive: true,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ track: newTrack }, { status: 201 });
  } catch (error) {
    console.error("Error uploading hold music:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

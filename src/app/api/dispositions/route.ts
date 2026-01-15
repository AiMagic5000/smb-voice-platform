import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/dispositions - List call dispositions
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dispositions = [
      { id: "1", name: "Sale Completed", code: "SALE", category: "positive", isActive: true },
      { id: "2", name: "Callback Requested", code: "CALLBACK", category: "followup", isActive: true },
      { id: "3", name: "Not Interested", code: "NI", category: "negative", isActive: true },
      { id: "4", name: "Voicemail Left", code: "VM", category: "neutral", isActive: true },
      { id: "5", name: "No Answer", code: "NA", category: "neutral", isActive: true },
    ];

    return NextResponse.json({ dispositions });
  } catch (error) {
    console.error("Error fetching dispositions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/dispositions - Create new disposition
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, description, category, color, requiresNote, autoScheduleFollowup, followupDays } = body;

    if (!name || !code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
    }

    const newDisposition = {
      id: `disp_${Date.now()}`,
      name,
      code,
      description: description || "",
      category: category || "neutral",
      color: color || "gray",
      requiresNote: requiresNote || false,
      autoScheduleFollowup: autoScheduleFollowup || false,
      followupDays: followupDays || null,
      usageCount: 0,
      isActive: true,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ disposition: newDisposition }, { status: 201 });
  } catch (error) {
    console.error("Error creating disposition:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

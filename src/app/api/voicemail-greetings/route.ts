import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Voicemail greeting type
interface VoicemailGreeting {
  id: string;
  tenantId: string;
  name: string;
  type: "default" | "business-hours" | "after-hours" | "holiday" | "custom";
  duration: number;
  fileUrl: string | null;
  transcript: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory store
const greetingsStore = new Map<string, VoicemailGreeting>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - List voicemail greetings
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const activeOnly = searchParams.get("active") === "true";

    let greetings = Array.from(greetingsStore.values()).filter(
      (g) => g.tenantId === tenantId
    );

    if (type) {
      greetings = greetings.filter((g) => g.type === type);
    }

    if (activeOnly) {
      greetings = greetings.filter((g) => g.isActive);
    }

    greetings.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      greetings,
      total: greetings.length,
    });
  } catch (error) {
    console.error("Error fetching voicemail greetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch voicemail greetings" },
      { status: 500 }
    );
  }
}

// POST - Create voicemail greeting
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { name, type, duration, fileUrl, transcript, isActive } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    const validTypes = ["default", "business-hours", "after-hours", "holiday", "custom"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid greeting type" },
        { status: 400 }
      );
    }

    // If setting as active, deactivate others of same type
    if (isActive) {
      Array.from(greetingsStore.values())
        .filter((g) => g.tenantId === tenantId && g.type === type && g.isActive)
        .forEach((g) => {
          greetingsStore.set(g.id, { ...g, isActive: false });
        });
    }

    const now = new Date().toISOString();
    const greeting: VoicemailGreeting = {
      id: `vg_${Date.now()}`,
      tenantId,
      name,
      type,
      duration: duration || 0,
      fileUrl: fileUrl || null,
      transcript: transcript || null,
      isActive: isActive ?? false,
      createdAt: now,
      updatedAt: now,
    };

    greetingsStore.set(greeting.id, greeting);

    return NextResponse.json(greeting, { status: 201 });
  } catch (error) {
    console.error("Error creating voicemail greeting:", error);
    return NextResponse.json(
      { error: "Failed to create voicemail greeting" },
      { status: 500 }
    );
  }
}

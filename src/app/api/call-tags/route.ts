import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Call tag type
interface CallTag {
  id: string;
  tenantId: string;
  name: string;
  color: string;
  description: string | null;
  usageCount: number;
  createdAt: string;
}

// In-memory store
const tagsStore = new Map<string, CallTag>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

const defaultColors = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#1E3A5F",
];

// GET - List call tags
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);

    const tags = Array.from(tagsStore.values())
      .filter((t) => t.tenantId === tenantId)
      .sort((a, b) => b.usageCount - a.usageCount);

    return NextResponse.json({
      tags,
      total: tags.length,
    });
  } catch (error) {
    console.error("Error fetching call tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch call tags" },
      { status: 500 }
    );
  }
}

// POST - Create call tag
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { name, color, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existingTag = Array.from(tagsStore.values()).find(
      (t) => t.tenantId === tenantId && t.name.toLowerCase() === name.toLowerCase()
    );

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag with this name already exists" },
        { status: 400 }
      );
    }

    const tag: CallTag = {
      id: `tag_${Date.now()}`,
      tenantId,
      name,
      color: color || defaultColors[Math.floor(Math.random() * defaultColors.length)],
      description: description || null,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    tagsStore.set(tag.id, tag);

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating call tag:", error);
    return NextResponse.json(
      { error: "Failed to create call tag" },
      { status: 500 }
    );
  }
}

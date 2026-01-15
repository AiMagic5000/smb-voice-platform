import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/scripts - List call scripts
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("active");

    // TODO: Fetch scripts from database
    const scripts = [
      {
        id: "script_1",
        name: "New Customer Welcome",
        description: "Standard greeting script for new customers",
        category: "onboarding",
        steps: [
          { id: "s1", title: "Greeting", content: "Thank you for calling...", type: "greeting" },
          { id: "s2", title: "Verify", content: "May I have your account number?", type: "question" },
        ],
        tags: ["welcome", "new-customer"],
        usageCount: 245,
        isActive: true,
        organizationId: orgId,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ scripts });
  } catch (error) {
    console.error("Error fetching scripts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/scripts - Create a new call script
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, steps, tags } = body;

    if (!name || !steps || steps.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one step are required" },
        { status: 400 }
      );
    }

    // TODO: Store in database
    const newScript = {
      id: `script_${Date.now()}`,
      name,
      description: description || "",
      category: category || "general",
      steps,
      tags: tags || [],
      usageCount: 0,
      isActive: true,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ script: newScript }, { status: 201 });
  } catch (error) {
    console.error("Error creating script:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

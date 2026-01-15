import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// SMS template type
interface SMSTemplate {
  id: string;
  tenantId: string;
  name: string;
  category: "appointment" | "follow-up" | "greeting" | "reminder" | "custom";
  content: string;
  variables: string[];
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory store
const templatesStore = new Map<string, SMSTemplate>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// Extract variables from template content
function extractVariables(content: string): string[] {
  const matches = content.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "").trim()))];
}

// GET - List SMS templates
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const activeOnly = searchParams.get("active") === "true";

    let templates = Array.from(templatesStore.values()).filter(
      (t) => t.tenantId === tenantId
    );

    if (category) {
      templates = templates.filter((t) => t.category === category);
    }

    if (activeOnly) {
      templates = templates.filter((t) => t.isActive);
    }

    templates.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      templates,
      total: templates.length,
    });
  } catch (error) {
    console.error("Error fetching SMS templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch SMS templates" },
      { status: 500 }
    );
  }
}

// POST - Create SMS template
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { name, category, content, isActive } = body;

    if (!name || !category || !content) {
      return NextResponse.json(
        { error: "Name, category, and content are required" },
        { status: 400 }
      );
    }

    const validCategories = ["appointment", "follow-up", "greeting", "reminder", "custom"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid template category" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const template: SMSTemplate = {
      id: `sms_t_${Date.now()}`,
      tenantId,
      name,
      category,
      content,
      variables: extractVariables(content),
      isActive: isActive ?? true,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    templatesStore.set(template.id, template);

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating SMS template:", error);
    return NextResponse.json(
      { error: "Failed to create SMS template" },
      { status: 500 }
    );
  }
}

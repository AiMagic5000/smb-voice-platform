import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Email template type
interface EmailTemplate {
  id: string;
  tenantId: string;
  name: string;
  subject: string;
  body: string;
  category: "voicemail" | "missed-call" | "welcome" | "notification" | "custom";
  variables: string[];
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory store
const templatesStore = new Map<string, EmailTemplate>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// Extract variables from template content
function extractVariables(content: string): string[] {
  const matches = content.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "").trim()))];
}

// GET - List email templates
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
    console.error("Error fetching email templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch email templates" },
      { status: 500 }
    );
  }
}

// POST - Create email template
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { name, subject, body: templateBody, category, isActive } = body;

    if (!name || !subject || !templateBody || !category) {
      return NextResponse.json(
        { error: "Name, subject, body, and category are required" },
        { status: 400 }
      );
    }

    const validCategories = ["voicemail", "missed-call", "welcome", "notification", "custom"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid template category" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const allVariables = [
      ...extractVariables(subject),
      ...extractVariables(templateBody),
    ];

    const template: EmailTemplate = {
      id: `email_t_${Date.now()}`,
      tenantId,
      name,
      subject,
      body: templateBody,
      category,
      variables: [...new Set(allVariables)],
      isActive: isActive ?? true,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    templatesStore.set(template.id, template);

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating email template:", error);
    return NextResponse.json(
      { error: "Failed to create email template" },
      { status: 500 }
    );
  }
}

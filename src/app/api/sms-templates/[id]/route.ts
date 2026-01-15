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

// In-memory store (shared with main route)
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

// GET - Get single template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tenantId = getTenantId(userId, orgId);
    const template = templatesStore.get(id);

    if (!template || template.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "SMS template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching SMS template:", error);
    return NextResponse.json(
      { error: "Failed to fetch SMS template" },
      { status: 500 }
    );
  }
}

// PATCH - Update template
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tenantId = getTenantId(userId, orgId);
    const template = templatesStore.get(id);

    if (!template || template.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "SMS template not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields = ["name", "category", "content", "isActive"];

    const updates: Partial<SMSTemplate> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    // Re-extract variables if content changed
    if (updates.content) {
      updates.variables = extractVariables(updates.content as string);
    }

    const updatedTemplate: SMSTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    templatesStore.set(id, updatedTemplate);

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("Error updating SMS template:", error);
    return NextResponse.json(
      { error: "Failed to update SMS template" },
      { status: 500 }
    );
  }
}

// POST - Use template (increment usage count and return rendered content)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tenantId = getTenantId(userId, orgId);
    const template = templatesStore.get(id);

    if (!template || template.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "SMS template not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { variables } = body;

    // Render template with variables
    let renderedContent = template.content;
    if (variables && typeof variables === "object") {
      for (const [key, value] of Object.entries(variables)) {
        renderedContent = renderedContent.replace(
          new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"),
          String(value)
        );
      }
    }

    // Increment usage count
    const updatedTemplate: SMSTemplate = {
      ...template,
      usageCount: template.usageCount + 1,
      updatedAt: new Date().toISOString(),
    };
    templatesStore.set(id, updatedTemplate);

    return NextResponse.json({
      original: template.content,
      rendered: renderedContent,
      characterCount: renderedContent.length,
      segmentCount: Math.ceil(renderedContent.length / 160),
    });
  } catch (error) {
    console.error("Error using SMS template:", error);
    return NextResponse.json(
      { error: "Failed to use SMS template" },
      { status: 500 }
    );
  }
}

// DELETE - Delete template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tenantId = getTenantId(userId, orgId);
    const template = templatesStore.get(id);

    if (!template || template.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "SMS template not found" },
        { status: 404 }
      );
    }

    templatesStore.delete(id);

    return NextResponse.json({ success: true, message: "SMS template deleted" });
  } catch (error) {
    console.error("Error deleting SMS template:", error);
    return NextResponse.json(
      { error: "Failed to delete SMS template" },
      { status: 500 }
    );
  }
}

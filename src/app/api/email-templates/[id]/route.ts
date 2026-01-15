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

// In-memory store (shared with main route)
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
        { error: "Email template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching email template:", error);
    return NextResponse.json(
      { error: "Failed to fetch email template" },
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
        { error: "Email template not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields = ["name", "subject", "body", "category", "isActive"];

    const updates: Partial<EmailTemplate> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    // Re-extract variables if subject or body changed
    if (updates.subject || updates.body) {
      const newSubject = (updates.subject as string) || template.subject;
      const newBody = (updates.body as string) || template.body;
      const allVariables = [
        ...extractVariables(newSubject),
        ...extractVariables(newBody),
      ];
      updates.variables = [...new Set(allVariables)];
    }

    const updatedTemplate: EmailTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    templatesStore.set(id, updatedTemplate);

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("Error updating email template:", error);
    return NextResponse.json(
      { error: "Failed to update email template" },
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
        { error: "Email template not found" },
        { status: 404 }
      );
    }

    templatesStore.delete(id);

    return NextResponse.json({ success: true, message: "Email template deleted" });
  } catch (error) {
    console.error("Error deleting email template:", error);
    return NextResponse.json(
      { error: "Failed to delete email template" },
      { status: 500 }
    );
  }
}

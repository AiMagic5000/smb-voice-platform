import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// API key type
interface APIKey {
  id: string;
  tenantId: string;
  name: string;
  key: string;
  maskedKey: string;
  permissions: string[];
  lastUsed: string | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

// In-memory store (shared with main route)
const apiKeysStore = new Map<string, APIKey>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get single API key
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
    const apiKey = apiKeysStore.get(id);

    if (!apiKey || apiKey.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    // Don't return full key
    return NextResponse.json({
      ...apiKey,
      key: undefined,
    });
  } catch (error) {
    console.error("Error fetching API key:", error);
    return NextResponse.json(
      { error: "Failed to fetch API key" },
      { status: 500 }
    );
  }
}

// PATCH - Update API key (name, permissions, status)
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
    const apiKey = apiKeysStore.get(id);

    if (!apiKey || apiKey.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields = ["name", "permissions", "isActive", "expiresAt"];

    const updates: Partial<APIKey> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    const updatedKey: APIKey = {
      ...apiKey,
      ...updates,
    };

    apiKeysStore.set(id, updatedKey);

    return NextResponse.json({
      ...updatedKey,
      key: undefined,
    });
  } catch (error) {
    console.error("Error updating API key:", error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 }
    );
  }
}

// DELETE - Revoke API key
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
    const apiKey = apiKeysStore.get(id);

    if (!apiKey || apiKey.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    apiKeysStore.delete(id);

    return NextResponse.json({ success: true, message: "API key revoked" });
  } catch (error) {
    console.error("Error revoking API key:", error);
    return NextResponse.json(
      { error: "Failed to revoke API key" },
      { status: 500 }
    );
  }
}

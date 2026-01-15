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

// In-memory store
const apiKeysStore = new Map<string, APIKey>();

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

function generateAPIKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "smb_";
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

function maskKey(key: string): string {
  return key.substring(0, 8) + "..." + key.substring(key.length - 4);
}

// GET - List API keys
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);

    const apiKeys = Array.from(apiKeysStore.values())
      .filter((k) => k.tenantId === tenantId)
      .map((k) => ({
        ...k,
        key: undefined, // Don't return full key
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      apiKeys,
      total: apiKeys.length,
    });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

// POST - Create API key
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { name, permissions, expiresAt } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const key = generateAPIKey();
    const now = new Date().toISOString();

    const apiKey: APIKey = {
      id: `key_${Date.now()}`,
      tenantId,
      name,
      key,
      maskedKey: maskKey(key),
      permissions: permissions || ["read"],
      lastUsed: null,
      usageCount: 0,
      isActive: true,
      expiresAt: expiresAt || null,
      createdAt: now,
    };

    apiKeysStore.set(apiKey.id, apiKey);

    // Return full key only on creation
    return NextResponse.json(
      {
        ...apiKey,
        message: "Store this key securely. It won't be shown again.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}

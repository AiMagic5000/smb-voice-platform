import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Integration type
interface Integration {
  id: string;
  tenantId: string;
  appId: string;
  appName: string;
  category: string;
  isInstalled: boolean;
  isConnected: boolean;
  config: Record<string, string>;
  installedAt: string | null;
  connectedAt: string | null;
}

// In-memory store
const integrationsStore = new Map<string, Integration>();

// Available apps
const availableApps = [
  { id: "salesforce", name: "Salesforce", category: "CRM" },
  { id: "hubspot", name: "HubSpot", category: "CRM" },
  { id: "slack", name: "Slack", category: "Communication" },
  { id: "teams", name: "Microsoft Teams", category: "Communication" },
  { id: "zendesk", name: "Zendesk", category: "Support" },
  { id: "zapier", name: "Zapier", category: "Automation" },
  { id: "google-calendar", name: "Google Calendar", category: "Productivity" },
  { id: "zoho", name: "Zoho CRM", category: "CRM" },
  { id: "intercom", name: "Intercom", category: "Support" },
  { id: "pipedrive", name: "Pipedrive", category: "CRM" },
];

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - List integrations
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const installedOnly = searchParams.get("installed") === "true";

    // Get tenant integrations
    const tenantIntegrations = Array.from(integrationsStore.values()).filter(
      (i) => i.tenantId === tenantId
    );

    // Build list with available apps
    let integrations = availableApps.map((app) => {
      const existing = tenantIntegrations.find((i) => i.appId === app.id);
      return {
        id: existing?.id || `int_${app.id}`,
        appId: app.id,
        appName: app.name,
        category: app.category,
        isInstalled: existing?.isInstalled || false,
        isConnected: existing?.isConnected || false,
        config: existing?.config || {},
        installedAt: existing?.installedAt || null,
        connectedAt: existing?.connectedAt || null,
      };
    });

    if (category) {
      integrations = integrations.filter((i) => i.category === category);
    }

    if (installedOnly) {
      integrations = integrations.filter((i) => i.isInstalled);
    }

    return NextResponse.json({
      integrations,
      total: integrations.length,
      installed: integrations.filter((i) => i.isInstalled).length,
      connected: integrations.filter((i) => i.isConnected).length,
    });
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch integrations" },
      { status: 500 }
    );
  }
}

// POST - Install/connect integration
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const body = await request.json();

    const { appId, config } = body;

    if (!appId) {
      return NextResponse.json(
        { error: "App ID is required" },
        { status: 400 }
      );
    }

    const app = availableApps.find((a) => a.id === appId);
    if (!app) {
      return NextResponse.json(
        { error: "App not found" },
        { status: 404 }
      );
    }

    // Find existing or create new
    const existingId = Array.from(integrationsStore.entries()).find(
      ([, i]) => i.tenantId === tenantId && i.appId === appId
    )?.[0];

    const now = new Date().toISOString();
    const integration: Integration = {
      id: existingId || `int_${Date.now()}`,
      tenantId,
      appId,
      appName: app.name,
      category: app.category,
      isInstalled: true,
      isConnected: !!config,
      config: config || {},
      installedAt: existingId
        ? integrationsStore.get(existingId)!.installedAt
        : now,
      connectedAt: config ? now : null,
    };

    integrationsStore.set(integration.id, integration);

    return NextResponse.json(integration, { status: existingId ? 200 : 201 });
  } catch (error) {
    console.error("Error installing integration:", error);
    return NextResponse.json(
      { error: "Failed to install integration" },
      { status: 500 }
    );
  }
}

// DELETE - Uninstall integration
export async function DELETE(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get("appId");

    if (!appId) {
      return NextResponse.json(
        { error: "App ID is required" },
        { status: 400 }
      );
    }

    const entry = Array.from(integrationsStore.entries()).find(
      ([, i]) => i.tenantId === tenantId && i.appId === appId
    );

    if (!entry) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      );
    }

    integrationsStore.delete(entry[0]);

    return NextResponse.json({ success: true, message: "Integration uninstalled" });
  } catch (error) {
    console.error("Error uninstalling integration:", error);
    return NextResponse.json(
      { error: "Failed to uninstall integration" },
      { status: 500 }
    );
  }
}

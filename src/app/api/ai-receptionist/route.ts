import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { aiReceptionists } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// Default AI configuration
const defaultAIConfig = {
  greeting: "Hello! Thank you for calling. How can I help you today?",
  businessDescription: "We are a professional business dedicated to providing excellent service.",
  businessHours: "Monday through Friday, 9 AM to 5 PM",
  transferExtension: "101",
  isEnabled: true,
  swmlConfig: {
    voice: "en-US-Standard-C",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 150,
    systemPrompt: "You are a helpful AI receptionist. Be professional, friendly, and concise.",
  },
};

// GET - Get AI receptionist configuration
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.standard
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const tenantId = orgId || userId;

    const configs = await db
      .select()
      .from(aiReceptionists)
      .where(eq(aiReceptionists.tenantId, tenantId))
      .limit(1);

    if (configs.length === 0) {
      // Return default configuration
      return NextResponse.json({
        id: null,
        ...defaultAIConfig,
      });
    }

    return NextResponse.json(configs[0]);
  } catch (error) {
    console.error("Error fetching AI receptionist config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update AI receptionist configuration
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.standard
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const body = await request.json();

    const {
      greeting,
      businessDescription,
      businessHours,
      transferExtension,
      isEnabled,
      swmlConfig,
    } = body;

    const tenantId = orgId || userId;

    // Check if config already exists for this tenant
    const existing = await db
      .select()
      .from(aiReceptionists)
      .where(eq(aiReceptionists.tenantId, tenantId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      const updated = await db
        .update(aiReceptionists)
        .set({
          greeting: greeting ?? existing[0].greeting,
          businessDescription: businessDescription ?? existing[0].businessDescription,
          businessHours: businessHours ?? existing[0].businessHours,
          transferExtension: transferExtension ?? existing[0].transferExtension,
          isEnabled: isEnabled ?? existing[0].isEnabled,
          swmlConfig: swmlConfig ?? existing[0].swmlConfig,
          updatedAt: new Date(),
        })
        .where(eq(aiReceptionists.id, existing[0].id))
        .returning();

      return NextResponse.json(updated[0]);
    }

    // Create new
    const created = await db
      .insert(aiReceptionists)
      .values({
        tenantId,
        greeting: greeting || defaultAIConfig.greeting,
        businessDescription: businessDescription || defaultAIConfig.businessDescription,
        businessHours: businessHours || defaultAIConfig.businessHours,
        transferExtension: transferExtension || defaultAIConfig.transferExtension,
        isEnabled: isEnabled ?? defaultAIConfig.isEnabled,
        swmlConfig: swmlConfig || defaultAIConfig.swmlConfig,
      })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error("Error saving AI receptionist config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle AI receptionist on/off
export async function PATCH(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.standard
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const tenantId = orgId || userId;
    const body = await request.json();
    const { isEnabled } = body;

    if (typeof isEnabled !== "boolean") {
      return NextResponse.json(
        { error: "isEnabled must be a boolean" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(aiReceptionists)
      .where(eq(aiReceptionists.tenantId, tenantId))
      .limit(1);

    if (existing.length === 0) {
      // Create new with default config
      const created = await db
        .insert(aiReceptionists)
        .values({
          tenantId,
          greeting: defaultAIConfig.greeting,
          businessDescription: defaultAIConfig.businessDescription,
          businessHours: defaultAIConfig.businessHours,
          transferExtension: defaultAIConfig.transferExtension,
          isEnabled,
          swmlConfig: defaultAIConfig.swmlConfig,
        })
        .returning();

      return NextResponse.json(created[0]);
    }

    const updated = await db
      .update(aiReceptionists)
      .set({
        isEnabled,
        updatedAt: new Date(),
      })
      .where(eq(aiReceptionists.id, existing[0].id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error toggling AI receptionist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

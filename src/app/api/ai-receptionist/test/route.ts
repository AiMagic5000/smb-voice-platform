import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { aiReceptionists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// POST - Test AI receptionist with a sample conversation
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.strict // Use strict limit for AI testing
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get current AI configuration for this tenant
    const configs = await db
      .select()
      .from(aiReceptionists)
      .where(eq(aiReceptionists.tenantId, tenantId))
      .limit(1);

    const config = configs[0] || {
      greeting: "Hello! Thank you for calling. How can I help you today?",
      businessDescription: "We are a professional business.",
      businessHours: "Monday through Friday, 9 AM to 5 PM",
    };

    // Simulate AI response (in production, this would call SignalWire AI or OpenAI)
    const simulatedResponses: Record<string, string> = {
      hello: config.greeting,
      hi: config.greeting,
      hours: `Our business hours are ${config.businessHours}. Is there anything else I can help you with?`,
      "business hours": `Our business hours are ${config.businessHours}. Is there anything else I can help you with?`,
      "what do you do": `${config.businessDescription} How can I assist you today?`,
      transfer: "I'll connect you with a team member right away. Please hold.",
      operator: "I'll transfer you to our operator now. One moment please.",
      default: "I understand. Let me help you with that. Could you provide more details about what you need?",
    };

    // Simple keyword matching for demo
    const lowerMessage = message.toLowerCase();
    let response = simulatedResponses.default;

    for (const [keyword, resp] of Object.entries(simulatedResponses)) {
      if (lowerMessage.includes(keyword)) {
        response = resp;
        break;
      }
    }

    return NextResponse.json({
      input: message,
      response,
      config: {
        greeting: config.greeting,
        businessDescription: config.businessDescription,
        businessHours: config.businessHours,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error testing AI receptionist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

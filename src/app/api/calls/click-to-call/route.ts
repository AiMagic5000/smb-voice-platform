import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { phoneNumbers, callLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { getSignalWireClient } from "@/lib/signalwire";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// Format phone number to E.164
function formatToE164(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  return `+${cleaned}`;
}

// POST - Initiate a click-to-call
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.strict // Strict limit for call initiation
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const body = await request.json();
    const { to, fromNumberId, connectTo } = body;

    if (!to) {
      return NextResponse.json(
        { error: "Destination number (to) is required" },
        { status: 400 }
      );
    }

    const tenantId = orgId || userId;

    // Get the caller ID (from number)
    let fromNumber: string;

    if (fromNumberId) {
      // Use specific number
      const numbers = await db
        .select()
        .from(phoneNumbers)
        .where(
          and(
            eq(phoneNumbers.id, fromNumberId),
            eq(phoneNumbers.tenantId, tenantId)
          )
        )
        .limit(1);

      if (numbers.length === 0) {
        return NextResponse.json(
          { error: "Phone number not found" },
          { status: 404 }
        );
      }

      fromNumber = numbers[0].number;
    } else {
      // Use first available number
      const numbers = await db
        .select()
        .from(phoneNumbers)
        .where(
          and(
            eq(phoneNumbers.tenantId, tenantId),
            eq(phoneNumbers.voiceEnabled, true)
          )
        )
        .limit(1);

      if (numbers.length === 0) {
        return NextResponse.json(
          { error: "No phone numbers available for outbound calls" },
          { status: 400 }
        );
      }

      fromNumber = numbers[0].number;
    }

    // Format numbers
    const formattedTo = formatToE164(to);
    const formattedFrom = formatToE164(fromNumber);

    // Get SignalWire client and initiate call
    const signalwire = getSignalWireClient();

    const call = await signalwire.makeCall({
      from: formattedFrom,
      to: formattedTo,
      timeout: 30,
      record: false,
    });

    // Log the call
    await db.insert(callLogs).values({
      tenantId,
      direction: "outbound",
      fromNumber: formattedFrom,
      toNumber: formattedTo,
      status: "answered", // Will be updated by webhook
    });

    return NextResponse.json({
      success: true,
      callId: call.id,
      status: call.status,
      from: formattedFrom,
      to: formattedTo,
      message: "Call initiated successfully",
    });
  } catch (error) {
    console.error("Error initiating click-to-call:", error);

    // Handle SignalWire-specific errors gracefully
    if (error instanceof Error && error.message.includes("SignalWire")) {
      return NextResponse.json(
        { error: "Failed to initiate call. Please check your SignalWire configuration." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

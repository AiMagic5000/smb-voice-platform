import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { phoneNumbers, aiReceptionists, ivrMenus, callLogs, businessHours } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SWMLGenerator } from "@/lib/signalwire/swml";

interface VoiceWebhookRequest {
  call_id: string;
  call_state: string;
  direction: string;
  from: string;
  to: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// POST - Handle incoming voice calls
export async function POST(request: NextRequest) {
  try {
    const body: VoiceWebhookRequest = await request.json();

    console.log("Voice webhook received:", JSON.stringify(body, null, 2));

    const { call_id, direction, from, to } = body;

    // Look up the destination number to find tenant configuration
    const phoneNumberRecords = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.number, to))
      .limit(1);

    if (phoneNumberRecords.length === 0) {
      // Number not found, return basic greeting
      console.log(`Phone number ${to} not found in database`);
      return NextResponse.json(
        SWMLGenerator.voicemail({
          greeting: "Thank you for calling. Please leave a message after the tone.",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const phoneRecord = phoneNumberRecords[0];
    const tenantId = phoneRecord.tenantId;
    const routesTo = phoneRecord.routesTo;

    // Log the incoming call with resolved tenantId
    try {
      await db.insert(callLogs).values({
        tenantId,
        direction: direction === "inbound" ? "inbound" : "outbound",
        fromNumber: from,
        toNumber: to,
        status: "answered",
      });
    } catch (dbError) {
      console.error("Failed to log call:", dbError);
    }

    // Check if routing to AI receptionist
    if (routesTo === "ai") {
      // Get AI receptionist configuration
      const aiConfigs = await db
        .select()
        .from(aiReceptionists)
        .where(eq(aiReceptionists.tenantId, tenantId))
        .limit(1);

      if (aiConfigs.length > 0 && aiConfigs[0].isEnabled) {
        const aiConfig = aiConfigs[0];

        // Get business hours for context
        const hoursRecords = await db
          .select()
          .from(businessHours)
          .where(eq(businessHours.tenantId, tenantId))
          .limit(1);

        const businessHoursText = hoursRecords.length > 0
          ? aiConfig.businessHours || "Monday through Friday, 9 AM to 5 PM"
          : aiConfig.businessHours;

        // Generate AI receptionist SWML
        const swmlConfig = (aiConfig.swmlConfig as Record<string, unknown>) || {};

        const swml = SWMLGenerator.aiReceptionist({
          greeting: aiConfig.greeting,
          systemPrompt: (swmlConfig.systemPrompt as string) ||
            `You are a helpful AI receptionist for a professional business. ${aiConfig.businessDescription || ""}`,
          businessHours: businessHoursText || undefined,
          transferNumber: aiConfig.transferExtension || undefined,
          voice: (swmlConfig.voice as string) || "en-US-Standard-C",
          temperature: (swmlConfig.temperature as number) || 0.7,
          maxTokens: (swmlConfig.maxTokens as number) || 150,
        });

        return NextResponse.json(swml, {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Check if routing to IVR menu
    if (routesTo?.startsWith("ivr:")) {
      const ivrId = routesTo.replace("ivr:", "");

      const ivrRecords = await db
        .select()
        .from(ivrMenus)
        .where(eq(ivrMenus.id, ivrId))
        .limit(1);

      if (ivrRecords.length > 0 && ivrRecords[0].isEnabled) {
        const ivr = ivrRecords[0];
        const options = (ivr.options as Array<{
          digit: string;
          label: string;
          action: string;
          target?: string;
        }>) || [];

        const swml = SWMLGenerator.ivrMenu({
          greeting: ivr.greeting,
          options: options.map((opt) => ({
            digit: opt.digit,
            label: opt.label,
            action: opt.action as "transfer" | "voicemail" | "submenu" | "hangup" | "repeat",
            target: opt.target,
          })),
          timeout: ivr.timeout || 10,
        });

        return NextResponse.json(swml, {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Route to extension (simple forward)
    if (routesTo && /^\d+$/.test(routesTo)) {
      // It's an extension number - would need SIP address lookup
      // For now, return voicemail
      const swml = SWMLGenerator.voicemail({
        greeting: `Extension ${routesTo} is not available. Please leave a message.`,
      });

      return NextResponse.json(swml, {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Route to external number
    if (routesTo && routesTo.startsWith("+")) {
      const swml = SWMLGenerator.forward({
        to: routesTo,
        from,
        timeout: 30,
        announcement: "Please hold while we connect your call.",
      });

      return NextResponse.json(swml, {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Default: voicemail
    const swml = SWMLGenerator.voicemail({
      greeting: "Thank you for calling. No one is available to take your call. Please leave a message after the tone.",
      transcribe: true,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/signalwire/transcription`,
    });

    return NextResponse.json(swml, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing voice webhook:", error);

    // Return basic voicemail on error
    return NextResponse.json(
      SWMLGenerator.voicemail({
        greeting: "We're sorry, we're experiencing technical difficulties. Please leave a message.",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}

// Handle status callbacks
export async function GET(request: NextRequest) {
  // Health check for webhook endpoint
  return NextResponse.json({
    status: "ok",
    endpoint: "signalwire-voice-webhook",
    timestamp: new Date().toISOString(),
  });
}

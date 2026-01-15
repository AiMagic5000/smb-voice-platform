import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  callLogs,
  voicemails,
  phoneNumbers,
  smsMessages,
  conversations,
  usageRecords,
  subscriptions,
  organizations
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Usage tracking pricing (cents)
const USAGE_PRICING = {
  ai_minutes: 2, // $0.02 per AI minute
  call_minutes: 1, // $0.01 per call minute (US/Canada included, but tracked)
  sms_outbound: 1, // $0.01 per outbound SMS segment
  sms_inbound: 0, // Free inbound SMS
  call_recording: 0, // Included
  international_minutes: 10, // $0.10 per international minute
};

// POST /api/webhooks/signalwire - Handle SignalWire webhooks
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const signature = headersList.get("x-signalwire-signature");

    // In production, validate SignalWire webhook signature
    if (process.env.NODE_ENV === "production" && !signature) {
      console.warn("Missing SignalWire signature in production");
    }

    const body = await request.json();
    const { event_type, data } = body;

    console.log(`SignalWire webhook received: ${event_type}`, data);

    switch (event_type) {
      case "call.received":
        await handleIncomingCall(data);
        break;

      case "call.answered":
        await handleCallAnswered(data);
        break;

      case "call.ended":
        await handleCallEnded(data);
        break;

      case "message.received":
        await handleSMSReceived(data);
        break;

      case "voicemail.received":
        await handleVoicemailReceived(data);
        break;

      case "ai.session.ended":
        await handleAISessionEnded(data);
        break;

      default:
        console.log(`Unhandled SignalWire event: ${event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing SignalWire webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

interface CallEventData {
  call_id?: string;
  from?: string;
  to?: string;
  direction?: string;
  duration?: number;
  status?: string;
  recording_url?: string;
  started_at?: string;
  ended_at?: string;
}

interface SMSEventData {
  message_id?: string;
  from?: string;
  to?: string;
  body?: string;
  segments?: number;
}

interface VoicemailEventData {
  voicemail_id?: string;
  caller_number?: string;
  caller_name?: string;
  duration?: number;
  transcription?: string;
  audio_url?: string;
  to?: string;
}

interface AISessionData {
  session_id?: string;
  call_id?: string;
  duration_seconds?: number;
  to?: string;
  from?: string;
}

async function handleIncomingCall(data: CallEventData) {
  try {
    // Find tenant by phone number
    const toNumber = data.to?.replace(/\D/g, "");
    const [phone] = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.number, toNumber || ""))
      .limit(1);

    if (!phone) {
      console.error("Phone number not found:", toNumber);
      return;
    }

    // Create call log entry
    await db.insert(callLogs).values({
      tenantId: phone.tenantId,
      organizationId: phone.organizationId,
      direction: "inbound",
      fromNumber: data.from || "unknown",
      toNumber: data.to || "unknown",
      callerNumber: data.from,
      calledNumber: data.to,
      status: "ringing",
      startTime: data.started_at ? new Date(data.started_at) : new Date(),
    });

    console.log("Incoming call logged:", data.call_id);
  } catch (error) {
    console.error("Failed to handle incoming call:", error);
  }
}

async function handleCallAnswered(data: CallEventData) {
  try {
    // Update call status
    const toNumber = data.to?.replace(/\D/g, "");
    const [phone] = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.number, toNumber || ""))
      .limit(1);

    if (phone) {
      // Update the most recent call for this phone number
      await db
        .update(callLogs)
        .set({
          status: "answered",
        })
        .where(
          and(
            eq(callLogs.tenantId, phone.tenantId),
            eq(callLogs.toNumber, data.to || ""),
            eq(callLogs.status, "ringing")
          )
        );
    }

    console.log("Call answered:", data.call_id);
  } catch (error) {
    console.error("Failed to update call status:", error);
  }
}

async function handleCallEnded(data: CallEventData) {
  try {
    const toNumber = data.to?.replace(/\D/g, "");
    const [phone] = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.number, toNumber || ""))
      .limit(1);

    if (!phone) return;

    // Update call record
    await db
      .update(callLogs)
      .set({
        status: data.status === "completed" ? "answered" : (data.status || "missed"),
        duration: data.duration || 0,
        endTime: data.ended_at ? new Date(data.ended_at) : new Date(),
        recordingUrl: data.recording_url,
      })
      .where(
        and(
          eq(callLogs.tenantId, phone.tenantId),
          eq(callLogs.toNumber, data.to || "")
        )
      );

    // Track usage if call had duration
    if (data.duration && data.duration > 0) {
      await trackUsage(
        phone.organizationId || "",
        "call_minutes",
        Math.ceil(data.duration / 60),
        `Call from ${data.from} to ${data.to}`
      );
    }

    console.log("Call ended:", data.call_id, "Duration:", data.duration);
  } catch (error) {
    console.error("Failed to handle call ended:", error);
  }
}

async function handleSMSReceived(data: SMSEventData) {
  try {
    const toNumber = data.to?.replace(/\D/g, "");
    const fromNumber = data.from?.replace(/\D/g, "");

    // Find the phone number record
    const [phone] = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.number, toNumber || ""))
      .limit(1);

    if (!phone) {
      console.error("Phone number not found for SMS:", toNumber);
      return;
    }

    // Find or create conversation
    let [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.tenantId, phone.tenantId),
          eq(conversations.participantPhone, fromNumber || "")
        )
      )
      .limit(1);

    if (!conversation) {
      [conversation] = await db
        .insert(conversations)
        .values({
          tenantId: phone.tenantId,
          phoneNumberId: phone.id,
          participantPhone: fromNumber || "",
          lastMessage: data.body || "",
          lastMessageAt: new Date(),
          unreadCount: 1,
        })
        .returning();
    } else {
      await db
        .update(conversations)
        .set({
          lastMessage: data.body || "",
          lastMessageAt: new Date(),
          unreadCount: conversation.unreadCount + 1,
        })
        .where(eq(conversations.id, conversation.id));
    }

    // Store message
    await db.insert(smsMessages).values({
      tenantId: phone.tenantId,
      conversationId: conversation.id,
      phoneNumberId: phone.id,
      direction: "inbound",
      fromNumber: data.from || "",
      toNumber: data.to || "",
      body: data.body || "",
      status: "delivered",
      segmentCount: data.segments || 1,
      signalwireSid: data.message_id,
      deliveredAt: new Date(),
    });

    // Track inbound SMS usage (free but tracked for analytics)
    await trackUsage(
      phone.organizationId || "",
      "sms_inbound",
      data.segments || 1,
      `SMS from ${fromNumber}`
    );

    console.log("SMS received and stored:", data.message_id);
  } catch (error) {
    console.error("Failed to handle SMS:", error);
  }
}

async function handleVoicemailReceived(data: VoicemailEventData) {
  try {
    const toNumber = data.to?.replace(/\D/g, "");

    // Find phone number
    const [phone] = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.number, toNumber || ""))
      .limit(1);

    if (!phone) {
      console.error("Phone number not found for voicemail:", toNumber);
      return;
    }

    // Store voicemail
    await db.insert(voicemails).values({
      tenantId: phone.tenantId,
      organizationId: phone.organizationId,
      extension: phone.routesTo || "main",
      callerNumber: data.caller_number || "unknown",
      callerName: data.caller_name,
      duration: data.duration || 0,
      transcription: data.transcription,
      audioUrl: data.audio_url || "",
      isRead: false,
    });

    console.log("Voicemail stored:", data.voicemail_id);
  } catch (error) {
    console.error("Failed to handle voicemail:", error);
  }
}

async function handleAISessionEnded(data: AISessionData) {
  try {
    const toNumber = data.to?.replace(/\D/g, "");

    // Find phone number to get organization
    const [phone] = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.number, toNumber || ""))
      .limit(1);

    if (!phone || !phone.organizationId) {
      console.error("Phone number not found for AI session:", toNumber);
      return;
    }

    // Track AI minutes usage
    const aiMinutes = Math.ceil((data.duration_seconds || 0) / 60);
    if (aiMinutes > 0) {
      await trackUsage(
        phone.organizationId,
        "ai_minutes",
        aiMinutes,
        `AI Receptionist session: ${data.session_id}`
      );
    }

    console.log("AI session usage tracked:", aiMinutes, "minutes");
  } catch (error) {
    console.error("Failed to track AI session:", error);
  }
}

async function trackUsage(
  organizationId: string,
  type: string,
  quantity: number,
  description: string
) {
  if (!organizationId || quantity <= 0) return;

  try {
    // Get current subscription for billing period
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (!org) return;

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, organizationId))
      .limit(1);

    const unitPrice = USAGE_PRICING[type as keyof typeof USAGE_PRICING] || 0;
    const totalPrice = unitPrice * quantity;

    // Get billing period dates
    const periodStart = subscription?.currentPeriodStart || new Date();
    const periodEnd = subscription?.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(usageRecords).values({
      organizationId,
      subscriptionId: subscription?.id,
      type,
      quantity,
      unitPrice,
      totalPrice,
      description,
      billingPeriodStart: periodStart,
      billingPeriodEnd: periodEnd,
      reportedToStripe: false,
    });

    console.log(`Usage tracked: ${type} x${quantity} for org ${organizationId}`);
  } catch (error) {
    console.error("Failed to track usage:", error);
  }
}

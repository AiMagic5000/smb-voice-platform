import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  phoneNumbers,
  smsMessages,
  conversations,
  usageRecords,
  subscriptions,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// POST /api/webhooks/signalwire/sms - Handle incoming SMS from SignalWire
// SignalWire sends SMS webhooks in TwiML-compatible format
export async function POST(request: NextRequest) {
  try {
    // SignalWire can send as JSON or form-encoded
    const contentType = request.headers.get("content-type") || "";
    let from: string, to: string, body: string, messageSid: string, numSegments: number;

    if (contentType.includes("application/json")) {
      const data = await request.json();
      from = data.From || data.from || "";
      to = data.To || data.to || "";
      body = data.Body || data.body || "";
      messageSid = data.MessageSid || data.message_sid || "";
      numSegments = parseInt(data.NumSegments || data.segments || "1");
    } else {
      // Form-encoded (TwiML format)
      const formData = await request.formData();
      from = formData.get("From")?.toString() || "";
      to = formData.get("To")?.toString() || "";
      body = formData.get("Body")?.toString() || "";
      messageSid = formData.get("MessageSid")?.toString() || "";
      numSegments = parseInt(formData.get("NumSegments")?.toString() || "1");
    }

    console.log(`SMS webhook received: From ${from} to ${to}: ${body.substring(0, 50)}...`);

    // Normalize phone numbers
    const toNumber = to.replace(/\D/g, "");
    const fromNumber = from.replace(/\D/g, "");

    // Find the phone number record
    const [phone] = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.number, toNumber))
      .limit(1);

    if (!phone) {
      console.error("Phone number not found:", toNumber);
      // Return 200 to prevent retries
      return NextResponse.json({ success: true, warning: "Phone number not found" });
    }

    // Find or create conversation
    let [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.tenantId, phone.tenantId),
          eq(conversations.participantPhone, fromNumber)
        )
      )
      .limit(1);

    if (!conversation) {
      [conversation] = await db
        .insert(conversations)
        .values({
          tenantId: phone.tenantId,
          phoneNumberId: phone.id,
          participantPhone: fromNumber,
          lastMessage: body,
          lastMessageAt: new Date(),
          unreadCount: 1,
        })
        .returning();
    } else {
      await db
        .update(conversations)
        .set({
          lastMessage: body,
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
      fromNumber: from,
      toNumber: to,
      body,
      status: "delivered",
      segmentCount: numSegments,
      signalwireSid: messageSid,
      deliveredAt: new Date(),
    });

    // Track usage (inbound SMS are free but tracked)
    if (phone.organizationId) {
      try {
        const [subscription] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.organizationId, phone.organizationId))
          .limit(1);

        await db.insert(usageRecords).values({
          organizationId: phone.organizationId,
          subscriptionId: subscription?.id,
          type: "sms_inbound",
          quantity: numSegments,
          unitPrice: 0,
          totalPrice: 0,
          description: `Inbound SMS from ${fromNumber}`,
          billingPeriodStart: subscription?.currentPeriodStart || new Date(),
          billingPeriodEnd: subscription?.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          reportedToStripe: false,
        });
      } catch (usageErr) {
        console.error("Failed to track SMS usage:", usageErr);
      }
    }

    console.log("SMS stored successfully:", messageSid);

    // Return TwiML-compatible response
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: {
          "Content-Type": "application/xml",
        },
      }
    );
  } catch (error) {
    console.error("Error processing SMS webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

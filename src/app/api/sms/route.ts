import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { smsMessages, conversations, phoneNumbers } from "@/lib/db/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { checkSmsLimit, getOrganizationByClerkId, createLimitExceededResponse, recordUsage } from "@/lib/usage-tracker";
import { OVERAGE_PRICING } from "@/lib/tier-limits";

// GET - List SMS conversations or messages
async function handleGet(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await db
        .select()
        .from(smsMessages)
        .where(
          and(
            eq(smsMessages.conversationId, conversationId),
            eq(smsMessages.tenantId, orgId || userId)
          )
        )
        .orderBy(desc(smsMessages.createdAt))
        .limit(limit)
        .offset(offset);

      return NextResponse.json({
        messages,
        page,
        limit,
        hasMore: messages.length === limit,
      });
    }

    // Get all conversations
    const convos = await db
      .select()
      .from(conversations)
      .where(eq(conversations.tenantId, orgId || userId))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      conversations: convos,
      page,
      limit,
      hasMore: convos.length === limit,
    });
  } catch (error) {
    console.error("Error fetching SMS:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send a new SMS message
async function handlePost(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { to, message, fromNumberId } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, message" },
        { status: 400 }
      );
    }

    // Check SMS tier limits
    let organizationId: string | null = null;
    let willIncurOverage = false;

    if (orgId) {
      const org = await getOrganizationByClerkId(orgId);
      if (org) {
        organizationId = org.id;
        const smsCheck = await checkSmsLimit(org.id);
        willIncurOverage = smsCheck.willIncurOverage;

        // Optionally, you could block SMS if limit exceeded (hard limit mode)
        // Uncomment below to enforce hard limits instead of overage billing
        /*
        if (!smsCheck.allowed) {
          return NextResponse.json(
            createLimitExceededResponse('sms', smsCheck.reason || 'SMS limit exceeded'),
            { status: 403 }
          );
        }
        */
      }
    }

    // Validate phone number ownership
    const fromNumber = await db
      .select()
      .from(phoneNumbers)
      .where(
        and(
          eq(phoneNumbers.id, fromNumberId),
          eq(phoneNumbers.tenantId, orgId || userId),
          eq(phoneNumbers.smsEnabled, true)
        )
      )
      .limit(1);

    if (fromNumber.length === 0) {
      return NextResponse.json(
        { error: "Invalid or SMS-disabled phone number" },
        { status: 400 }
      );
    }

    // Find or create conversation
    const conversation = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.tenantId, orgId || userId),
          or(
            eq(conversations.participantPhone, to),
            eq(conversations.participantPhone, to.replace(/\D/g, ""))
          )
        )
      )
      .limit(1);

    let conversationId: string;

    if (conversation.length === 0) {
      // Create new conversation
      const [newConvo] = await db
        .insert(conversations)
        .values({
          tenantId: orgId || userId,
          phoneNumberId: fromNumberId,
          participantPhone: to.replace(/\D/g, ""),
          participantName: null,
          lastMessage: message,
          lastMessageAt: new Date(),
          unreadCount: 0,
          isStarred: false,
        })
        .returning();
      conversationId = newConvo.id;
    } else {
      conversationId = conversation[0].id;
      // Update conversation
      await db
        .update(conversations)
        .set({
          lastMessage: message,
          lastMessageAt: new Date(),
        })
        .where(eq(conversations.id, conversationId));
    }

    // Create message record
    const [newMessage] = await db
      .insert(smsMessages)
      .values({
        tenantId: orgId || userId,
        conversationId,
        phoneNumberId: fromNumberId,
        direction: "outbound",
        fromNumber: fromNumber[0].number,
        toNumber: to.replace(/\D/g, ""),
        body: message,
        status: "queued",
        segmentCount: Math.ceil(message.length / 160),
      })
      .returning();

    // Queue message for sending via SignalWire
    // In production, this would be handled by a background job
    // For now, we'll mark it as sent
    await db
      .update(smsMessages)
      .set({ status: "sent", sentAt: new Date() })
      .where(eq(smsMessages.id, newMessage.id));

    return NextResponse.json({
      success: true,
      message: {
        ...newMessage,
        status: "sent",
      },
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handleGet, rateLimitConfigs.standard);
export const POST = withRateLimit(handlePost, rateLimitConfigs.standard);

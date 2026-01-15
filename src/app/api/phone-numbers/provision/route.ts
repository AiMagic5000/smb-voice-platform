import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { phoneNumbers } from "@/lib/db/schema";

/**
 * POST /api/phone-numbers/provision
 * Provision (purchase) a phone number
 *
 * Note: In production, this would integrate with SignalWire's
 * IncomingPhoneNumbers API. For now, creates a mock provisioned number.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;

    const body = await request.json();
    const { phoneNumber, friendlyName } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Create a mock provisioned number for demo
    // In production, this would call SignalWire's IncomingPhoneNumbers API
    const provisionedNumber = {
      sid: `PN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      phoneNumber,
      friendlyName: friendlyName || phoneNumber,
      capabilities: { voice: true, sms: true, mms: true },
    };

    // Save to database

    const type = phoneNumber.startsWith("+1800") ||
      phoneNumber.startsWith("+1888") ||
      phoneNumber.startsWith("+1877") ||
      phoneNumber.startsWith("+1866") ||
      phoneNumber.startsWith("+1855")
      ? "tollfree"
      : "local";

    const [newNumber] = await db.insert(phoneNumbers).values({
      tenantId,
      organizationId: orgId || null,
      number: phoneNumber,
      type,
      signalwireId: provisionedNumber.sid,
      routesTo: "ai",
      status: "active",
      voiceEnabled: true,
      smsEnabled: true,
    }).returning();

    return NextResponse.json({
      success: true,
      phoneNumber: newNumber,
      message: `Successfully provisioned ${phoneNumber}`,
    });
  } catch (error) {
    console.error("Error provisioning phone number:", error);
    return NextResponse.json(
      { error: "Failed to provision phone number" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/phone-numbers/provision
 * Release (cancel) a phone number
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;

    const body = await request.json();
    const { phoneNumberId } = body;

    if (!phoneNumberId) {
      return NextResponse.json(
        { error: "Phone number ID is required" },
        { status: 400 }
      );
    }

    // Get the phone number record
    const { eq, and } = await import("drizzle-orm");
    const existingNumbers = await db
      .select()
      .from(phoneNumbers)
      .where(
        and(
          eq(phoneNumbers.id, phoneNumberId),
          eq(phoneNumbers.tenantId, tenantId)
        )
      );

    if (existingNumbers.length === 0) {
      return NextResponse.json(
        { error: "Phone number not found" },
        { status: 404 }
      );
    }

    const numberRecord = existingNumbers[0];

    // In production, this would also call SignalWire to release the number
    // For now, we just update the database

    // Soft delete - update status to cancelled
    await db
      .update(phoneNumbers)
      .set({ status: "cancelled" })
      .where(eq(phoneNumbers.id, phoneNumberId));

    return NextResponse.json({
      success: true,
      message: `Released phone number ${numberRecord.number}`,
    });
  } catch (error) {
    console.error("Error releasing phone number:", error);
    return NextResponse.json(
      { error: "Failed to release phone number" },
      { status: 500 }
    );
  }
}

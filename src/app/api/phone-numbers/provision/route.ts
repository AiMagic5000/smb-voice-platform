import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { phoneNumbers } from "@/lib/db/schema";
import { getSignalWireClient } from "@/lib/signalwire";
import { eq, and } from "drizzle-orm";
import { checkPhoneNumberLimit, getOrganizationByClerkId, createLimitExceededResponse } from "@/lib/usage-tracker";

/**
 * POST /api/phone-numbers/provision
 * Provision (purchase) a phone number via SignalWire API
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;

    // Check tier limits before provisioning
    if (orgId) {
      const org = await getOrganizationByClerkId(orgId);
      if (org) {
        const limitCheck = await checkPhoneNumberLimit(org.id);
        if (!limitCheck.allowed) {
          return NextResponse.json(
            createLimitExceededResponse('phone_numbers', limitCheck.reason || 'Phone number limit exceeded'),
            { status: 403 }
          );
        }
      }
    }

    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Check if SignalWire is configured
    const hasSignalWireConfig =
      process.env.SIGNALWIRE_PROJECT_ID &&
      process.env.SIGNALWIRE_API_TOKEN &&
      process.env.SIGNALWIRE_SPACE_URL;

    let signalWireId: string;
    let isMock = false;

    if (hasSignalWireConfig) {
      try {
        // Purchase via SignalWire API
        const client = getSignalWireClient();
        const purchasedNumber = await client.purchaseNumber(phoneNumber);
        signalWireId = purchasedNumber.id;

        // Configure webhook URL for incoming calls
        await client.configureCallForwarding(purchasedNumber.id, "");
      } catch (signalWireError) {
        console.error("SignalWire purchase error:", signalWireError);
        return NextResponse.json(
          {
            error: "Failed to purchase number from SignalWire",
            details:
              signalWireError instanceof Error
                ? signalWireError.message
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    } else {
      // Create mock provisioned number for demo
      signalWireId = `PN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      isMock = true;
    }

    // Determine number type
    const type =
      phoneNumber.startsWith("+1800") ||
      phoneNumber.startsWith("+1888") ||
      phoneNumber.startsWith("+1877") ||
      phoneNumber.startsWith("+1866") ||
      phoneNumber.startsWith("+1855")
        ? "tollfree"
        : "local";

    // Save to database
    const [newNumber] = await db
      .insert(phoneNumbers)
      .values({
        tenantId,
        organizationId: orgId || null,
        number: phoneNumber,
        type,
        signalwireId: signalWireId,
        routesTo: "ai",
        status: "active",
        voiceEnabled: true,
        smsEnabled: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      phoneNumber: newNumber,
      message: `Successfully provisioned ${phoneNumber}`,
      mock: isMock,
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

    // Check if SignalWire is configured and release the number
    const hasSignalWireConfig =
      process.env.SIGNALWIRE_PROJECT_ID &&
      process.env.SIGNALWIRE_API_TOKEN &&
      process.env.SIGNALWIRE_SPACE_URL;

    if (hasSignalWireConfig && numberRecord.signalwireId) {
      try {
        const client = getSignalWireClient();
        await client.releaseNumber(numberRecord.signalwireId);
      } catch (signalWireError) {
        console.error("SignalWire release error:", signalWireError);
        // Continue with database update even if SignalWire fails
      }
    }

    // Update status to cancelled
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

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { organizations, phoneNumbers, aiReceptionists, businessHours } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSignalWireClient } from "@/lib/signalwire/client";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;
    const body = await request.json();

    const {
      companyName,
      industry,
      selectedNumber,
      numberType,
      greeting,
      businessDescription,
      timezone,
      schedule,
    } = body;

    // Get or create organization
    let [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.clerkOrgId, tenantId))
      .limit(1);

    if (!org) {
      // Create organization if it doesn't exist
      const [newOrg] = await db
        .insert(organizations)
        .values({
          clerkOrgId: tenantId,
          name: companyName || "My Business",
          domain: `${tenantId}.smbvoice.app`,
          plan: "starter",
          monthlyPrice: 795,
        })
        .returning();
      org = newOrg;
    } else {
      // Update organization name if provided
      if (companyName) {
        await db
          .update(organizations)
          .set({ name: companyName, updatedAt: new Date() })
          .where(eq(organizations.id, org.id));
      }
    }

    // Purchase and provision phone number if selected
    if (selectedNumber) {
      try {
        const signalwire = getSignalWireClient();
        const purchasedNumber = await signalwire.purchaseNumber(selectedNumber);

        await db.insert(phoneNumbers).values({
          tenantId,
          organizationId: org.id,
          number: selectedNumber,
          type: numberType || "local",
          signalwireId: purchasedNumber.id || `sw_${Date.now()}`,
          routesTo: "ai",
          status: "active",
          voiceEnabled: true,
          smsEnabled: true,
        });
      } catch (error) {
        console.error("Error purchasing phone number:", error);
        // Continue with onboarding even if number purchase fails
        // Still record the number in pending status
        await db.insert(phoneNumbers).values({
          tenantId,
          organizationId: org.id,
          number: selectedNumber,
          type: numberType || "local",
          signalwireId: `pending_${Date.now()}`,
          routesTo: "ai",
          status: "pending",
          voiceEnabled: true,
          smsEnabled: true,
        });
      }
    }

    // Create AI receptionist configuration
    if (greeting || businessDescription) {
      await db.insert(aiReceptionists).values({
        tenantId,
        organizationId: org.id,
        greeting: greeting || `Thank you for calling ${companyName || "our company"}. How may I help you today?`,
        businessDescription: businessDescription || "",
        businessHours: schedule ? JSON.stringify(schedule) : null,
        isEnabled: true,
      });
    }

    // Create business hours configuration
    if (schedule) {
      await db.insert(businessHours).values({
        tenantId,
        organizationId: org.id,
        timezone: timezone || "America/New_York",
        schedule: schedule,
        afterHoursAction: "voicemail",
        isActive: true,
      });
    }

    // Send welcome email
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    const firstName = user?.firstName || companyName?.split(" ")[0] || "there";

    if (userEmail) {
      try {
        await sendWelcomeEmail({
          to: userEmail,
          firstName,
          phoneNumber: selectedNumber,
        });
      } catch (error) {
        console.error("Error sending welcome email:", error);
        // Don't fail onboarding if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
      organizationId: org.id,
      phoneNumber: selectedNumber,
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

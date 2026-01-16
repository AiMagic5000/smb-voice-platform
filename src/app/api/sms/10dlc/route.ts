import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { organizations, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// 10DLC Campaign Registration Status
interface Campaign10DLC {
  id: string;
  brandId: string;
  brandName: string;
  useCase: string;
  description: string;
  sampleMessages: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  approvedAt: string | null;
}

// GET - Get 10DLC campaign status
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get organization's 10DLC status
    const tenantId = orgId || userId;

    // In production, this would query SignalWire or TCR (The Campaign Registry)
    // For now, return a placeholder response
    return NextResponse.json({
      registered: false,
      campaign: null,
      requirements: {
        brandRegistration: {
          required: true,
          description: "Register your business with The Campaign Registry (TCR)",
          fields: [
            "Legal Business Name",
            "EIN/Tax ID",
            "Business Address",
            "Website URL",
            "Business Type",
            "Contact Information",
          ],
        },
        campaignRegistration: {
          required: true,
          description: "Register your messaging use case",
          fields: [
            "Use Case Type",
            "Campaign Description",
            "Sample Messages (2-5)",
            "Opt-in/Opt-out Process",
            "Message Volume Estimate",
          ],
        },
        useCaseTypes: [
          { id: "2fa", name: "Two-Factor Authentication", description: "OTP and verification codes" },
          { id: "account_notification", name: "Account Notifications", description: "Account alerts and updates" },
          { id: "customer_care", name: "Customer Care", description: "Support and service messages" },
          { id: "delivery_notification", name: "Delivery Notifications", description: "Shipping and delivery updates" },
          { id: "marketing", name: "Marketing", description: "Promotional messages (requires explicit consent)" },
          { id: "mixed", name: "Mixed/Low Volume", description: "Various message types, low volume" },
        ],
      },
      info: {
        what: "10DLC (10-Digit Long Code) is a system for registering business messaging campaigns",
        why: "Required by carriers to send SMS messages to US phone numbers",
        benefits: [
          "Higher message throughput",
          "Better deliverability rates",
          "Reduced filtering and blocking",
          "Compliance with carrier regulations",
        ],
        timeline: "Brand approval: 1-7 days, Campaign approval: 1-14 days",
      },
    });
  } catch (error) {
    console.error("Error fetching 10DLC status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Submit 10DLC registration
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      // Brand information
      legalBusinessName,
      ein,
      businessAddress,
      city,
      state,
      zipCode,
      country,
      websiteUrl,
      businessType,
      contactFirstName,
      contactLastName,
      contactEmail,
      contactPhone,
      // Campaign information
      useCase,
      campaignDescription,
      sampleMessages,
      optInProcess,
      optOutProcess,
      monthlyMessageVolume,
      termsAccepted,
    } = body;

    // Validate required fields
    const requiredFields = [
      "legalBusinessName",
      "ein",
      "businessAddress",
      "city",
      "state",
      "zipCode",
      "websiteUrl",
      "businessType",
      "contactFirstName",
      "contactLastName",
      "contactEmail",
      "contactPhone",
      "useCase",
      "campaignDescription",
      "sampleMessages",
      "optInProcess",
      "optOutProcess",
      "monthlyMessageVolume",
      "termsAccepted",
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "You must accept the terms and conditions" },
        { status: 400 }
      );
    }

    if (!Array.isArray(sampleMessages) || sampleMessages.length < 2) {
      return NextResponse.json(
        { error: "At least 2 sample messages are required" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Create a brand registration with SignalWire/TCR
    // 2. Create a campaign registration
    // 3. Store the registration details in the database
    // 4. Send confirmation email

    // For now, return success response
    return NextResponse.json({
      success: true,
      message: "10DLC registration submitted successfully",
      registrationId: `reg_${Date.now()}`,
      status: "pending",
      estimatedApprovalTime: "1-14 business days",
      nextSteps: [
        "Your brand registration is being processed",
        "You will receive an email when your brand is approved",
        "After brand approval, your campaign will be submitted for review",
        "SMS messaging will be enabled once the campaign is approved",
      ],
    });
  } catch (error) {
    console.error("Error submitting 10DLC registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

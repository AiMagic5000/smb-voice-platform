import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// Default user settings
const defaultSettings = {
  notifications: {
    emailOnMissedCall: true,
    emailOnVoicemail: true,
    emailOnSMS: false,
    pushNotifications: true,
    dailyDigest: false,
  },
  callHandling: {
    defaultRingTimeout: 20,
    sendToVoicemailAfter: 30,
    recordAllCalls: false,
    transcribeVoicemails: true,
    callScreening: false,
  },
  display: {
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    language: "en",
  },
  privacy: {
    showCallerIdOnOutbound: true,
    blockAnonymousCalls: false,
    doNotDisturb: false,
    doNotDisturbSchedule: null,
  },
};

// GET - Get user/organization settings
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.standard
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    // For now, return default settings
    // In production, these would be stored in a settings table
    return NextResponse.json({
      userId,
      orgId: orgId || null,
      settings: defaultSettings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user/organization settings
export async function PUT(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.standard
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const body = await request.json();
    const { notifications, callHandling, display, privacy } = body;

    // Merge with defaults
    const updatedSettings = {
      notifications: { ...defaultSettings.notifications, ...notifications },
      callHandling: { ...defaultSettings.callHandling, ...callHandling },
      display: { ...defaultSettings.display, ...display },
      privacy: { ...defaultSettings.privacy, ...privacy },
    };

    // In production, save to database
    // For now, just return the merged settings
    return NextResponse.json({
      userId,
      orgId: orgId || null,
      settings: updatedSettings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update specific setting section
export async function PATCH(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.standard
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const body = await request.json();
    const { section, updates } = body;

    if (!section || !updates) {
      return NextResponse.json(
        { error: "Section and updates are required" },
        { status: 400 }
      );
    }

    const validSections = ["notifications", "callHandling", "display", "privacy"];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: "Invalid section" },
        { status: 400 }
      );
    }

    // Merge updates with defaults for the section
    const sectionDefaults = defaultSettings[section as keyof typeof defaultSettings];
    const updatedSection = { ...sectionDefaults, ...updates };

    return NextResponse.json({
      section,
      settings: updatedSection,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error patching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

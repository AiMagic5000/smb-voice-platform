/**
 * Database Seed Script for SMB Voice Platform
 *
 * Run with: npx tsx src/lib/db/seed.ts
 *
 * This script seeds the database with sample data for development and testing.
 */

import { db } from "./index";
import {
  organizations,
  users,
  phoneNumbers,
  extensions,
  callLogs,
  voicemails,
} from "./schema";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Create demo organization
    console.log("Creating demo organization...");
    const [demoOrg] = await db
      .insert(organizations)
      .values({
        clerkOrgId: "org_clerk_demo",
        name: "Demo Business",
        domain: "demo-business.startmybusiness.us",
        plan: "basic",
        status: "active",
      })
      .onConflictDoNothing()
      .returning();

    const orgId = demoOrg?.id;
    if (!orgId) {
      console.log("Organization already exists, skipping...");
      return;
    }

    // Create demo user
    console.log("Creating demo user...");
    await db
      .insert(users)
      .values({
        clerkUserId: "user_clerk_demo",
        organizationId: orgId,
        email: "demo@startmybusiness.us",
        firstName: "John",
        lastName: "Demo",
        role: "admin",
      })
      .onConflictDoNothing();

    // Create demo phone numbers
    console.log("Creating demo phone numbers...");
    const phoneNumbersData = [
      {
        tenantId: "org_clerk_demo",
        organizationId: orgId,
        number: "+18885344145",
        type: "toll_free",
        signalwireId: "sw_demo_toll_free",
        routesTo: "ai",
        status: "active",
        voiceEnabled: true,
        smsEnabled: true,
      },
      {
        tenantId: "org_clerk_demo",
        organizationId: orgId,
        number: "+15125550123",
        type: "local",
        signalwireId: "sw_demo_local",
        routesTo: "101",
        status: "active",
        voiceEnabled: true,
        smsEnabled: true,
      },
    ];

    for (const pn of phoneNumbersData) {
      await db.insert(phoneNumbers).values(pn).onConflictDoNothing();
    }

    // Create demo extensions
    console.log("Creating demo extensions...");
    const extensionsData = [
      {
        organizationId: orgId,
        extension: "101",
        name: "John Demo",
        email: "john@startmybusiness.us",
        sipPassword: "demo_sip_pass_101",
        voicemailPin: "1234",
        status: "active",
      },
      {
        organizationId: orgId,
        extension: "102",
        name: "Sarah Support",
        email: "sarah@startmybusiness.us",
        sipPassword: "demo_sip_pass_102",
        voicemailPin: "5678",
        status: "active",
      },
      {
        organizationId: orgId,
        extension: "103",
        name: "Mike Sales",
        email: "mike@startmybusiness.us",
        sipPassword: "demo_sip_pass_103",
        voicemailPin: "9012",
        status: "active",
      },
    ];

    for (const ext of extensionsData) {
      await db.insert(extensions).values(ext).onConflictDoNothing();
    }

    // Create demo call logs
    console.log("Creating demo call logs...");
    const callLogsData = [
      {
        tenantId: "org_clerk_demo",
        direction: "inbound",
        fromNumber: "+15551112222",
        toNumber: "+18885344145",
        extension: "101",
        duration: 245,
        status: "answered",
      },
      {
        tenantId: "org_clerk_demo",
        direction: "inbound",
        fromNumber: "+15553334444",
        toNumber: "+18885344145",
        extension: "102",
        duration: 180,
        status: "answered",
      },
      {
        tenantId: "org_clerk_demo",
        direction: "outbound",
        fromNumber: "+15125550123",
        toNumber: "+15559998888",
        extension: "101",
        duration: 420,
        status: "answered",
      },
      {
        tenantId: "org_clerk_demo",
        direction: "inbound",
        fromNumber: "+15557778888",
        toNumber: "+18885344145",
        duration: 0,
        status: "missed",
      },
    ];

    for (const call of callLogsData) {
      await db.insert(callLogs).values(call).onConflictDoNothing();
    }

    // Create demo voicemails
    console.log("Creating demo voicemails...");
    const voicemailsData = [
      {
        tenantId: "org_clerk_demo",
        extension: "101",
        callerNumber: "+15557778888",
        callerName: "Unknown Caller",
        duration: 23,
        transcription:
          "Hi, I was calling about the quote you sent over. Can you give me a call back? Thanks.",
        audioUrl: "https://example.com/voicemail/demo1.mp3",
        isRead: false,
      },
      {
        tenantId: "org_clerk_demo",
        extension: "101",
        callerNumber: "+15551234567",
        callerName: "David Williams",
        duration: 45,
        transcription:
          "Hello, this is David from Williams Construction. I wanted to discuss the project timeline with you. Please call me back at your earliest convenience.",
        audioUrl: "https://example.com/voicemail/demo2.mp3",
        isRead: true,
      },
    ];

    for (const vm of voicemailsData) {
      await db.insert(voicemails).values(vm).onConflictDoNothing();
    }

    console.log("✅ Database seeded successfully!");
    console.log("");
    console.log("Demo credentials:");
    console.log("  Email: demo@startmybusiness.us");
    console.log("  Organization: Demo Business");
    console.log("");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run if executed directly
seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

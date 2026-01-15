import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/db";
import { users, organizations, aiReceptionists, businessHours } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type ClerkWebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

interface ClerkUser {
  id: string;
  email_addresses: Array<{ email_address: string; id: string }>;
  first_name: string | null;
  last_name: string | null;
  primary_email_address_id: string;
}

interface ClerkOrganization {
  id: string;
  name: string;
  slug: string;
  created_by: string;
}

interface ClerkMembership {
  id: string;
  organization: { id: string; name: string };
  public_user_data: { user_id: string };
  role: string;
}

// POST /api/webhooks/clerk - Handle Clerk webhooks
export async function POST(request: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  // Get the headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkWebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  console.log(`Clerk webhook received: ${eventType}`, evt.data);

  switch (eventType) {
    case "user.created":
      await handleUserCreated(evt.data);
      break;

    case "user.updated":
      await handleUserUpdated(evt.data);
      break;

    case "user.deleted":
      await handleUserDeleted(evt.data);
      break;

    case "organization.created":
      await handleOrganizationCreated(evt.data);
      break;

    case "organization.updated":
      await handleOrganizationUpdated(evt.data);
      break;

    case "organizationMembership.created":
      await handleMembershipCreated(evt.data);
      break;

    case "organizationMembership.deleted":
      await handleMembershipDeleted(evt.data);
      break;

    default:
      console.log(`Unhandled Clerk event: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}

async function handleUserCreated(data: Record<string, unknown>) {
  const userData = data as unknown as ClerkUser;
  const primaryEmail = userData.email_addresses.find(
    (e) => e.id === userData.primary_email_address_id
  )?.email_address;

  if (!primaryEmail) {
    console.error("No primary email found for user:", userData.id);
    return;
  }

  try {
    await db.insert(users).values({
      clerkUserId: userData.id,
      email: primaryEmail,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: "member",
    });
    console.log("User created in database:", userData.id);
  } catch (error) {
    console.error("Failed to create user:", error);
  }
}

async function handleUserUpdated(data: Record<string, unknown>) {
  const userData = data as unknown as ClerkUser;
  const primaryEmail = userData.email_addresses.find(
    (e) => e.id === userData.primary_email_address_id
  )?.email_address;

  try {
    await db
      .update(users)
      .set({
        email: primaryEmail || undefined,
        firstName: userData.first_name,
        lastName: userData.last_name,
      })
      .where(eq(users.clerkUserId, userData.id));
    console.log("User updated in database:", userData.id);
  } catch (error) {
    console.error("Failed to update user:", error);
  }
}

async function handleUserDeleted(data: Record<string, unknown>) {
  const userData = data as { id: string };

  try {
    // Delete user record (cascade will handle related records)
    await db.delete(users).where(eq(users.clerkUserId, userData.id));
    console.log("User deleted from database:", userData.id);
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
}

async function handleOrganizationCreated(data: Record<string, unknown>) {
  const orgData = data as unknown as ClerkOrganization;

  try {
    // Create organization
    const [newOrg] = await db
      .insert(organizations)
      .values({
        clerkOrgId: orgData.id,
        name: orgData.name,
        domain: orgData.slug,
        status: "active",
        plan: "starter",
        monthlyPrice: 795, // $7.95
      })
      .returning();

    // Create default AI receptionist for new org
    await db.insert(aiReceptionists).values({
      tenantId: orgData.id,
      organizationId: newOrg.id,
      greeting: `Thank you for calling ${orgData.name}. How may I direct your call?`,
      businessDescription: `${orgData.name} business phone system`,
      businessHours: "Monday through Friday, 9 AM to 5 PM",
      isEnabled: true,
    });

    // Create default business hours
    const defaultSchedule = {
      monday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
      tuesday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
      wednesday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
      thursday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
      friday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
      saturday: { enabled: false, openTime: "09:00", closeTime: "17:00" },
      sunday: { enabled: false, openTime: "09:00", closeTime: "17:00" },
    };

    await db.insert(businessHours).values({
      tenantId: orgData.id,
      organizationId: newOrg.id,
      timezone: "America/New_York",
      schedule: defaultSchedule,
      afterHoursAction: "voicemail",
      isActive: true,
    });

    console.log("Organization created with defaults:", orgData.id);
  } catch (error) {
    console.error("Failed to create organization:", error);
  }
}

async function handleOrganizationUpdated(data: Record<string, unknown>) {
  const orgData = data as unknown as ClerkOrganization;

  try {
    await db
      .update(organizations)
      .set({
        name: orgData.name,
        domain: orgData.slug,
        updatedAt: new Date(),
      })
      .where(eq(organizations.clerkOrgId, orgData.id));
    console.log("Organization updated:", orgData.id);
  } catch (error) {
    console.error("Failed to update organization:", error);
  }
}

async function handleMembershipCreated(data: Record<string, unknown>) {
  const memberData = data as unknown as ClerkMembership;
  const clerkUserId = memberData.public_user_data.user_id;
  const clerkOrgId = memberData.organization.id;

  try {
    // Get organization ID
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.clerkOrgId, clerkOrgId))
      .limit(1);

    if (org) {
      // Update user with organization membership
      await db
        .update(users)
        .set({
          organizationId: org.id,
          role: memberData.role === "admin" ? "admin" : "member",
        })
        .where(eq(users.clerkUserId, clerkUserId));
      console.log("Membership created:", clerkUserId, "->", clerkOrgId);
    }
  } catch (error) {
    console.error("Failed to create membership:", error);
  }
}

async function handleMembershipDeleted(data: Record<string, unknown>) {
  const memberData = data as unknown as ClerkMembership;
  const clerkUserId = memberData.public_user_data.user_id;

  try {
    // Remove organization membership from user
    await db
      .update(users)
      .set({
        organizationId: null,
        role: "member",
      })
      .where(eq(users.clerkUserId, clerkUserId));
    console.log("Membership deleted:", clerkUserId);
  } catch (error) {
    console.error("Failed to delete membership:", error);
  }
}

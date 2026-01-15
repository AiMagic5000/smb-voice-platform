import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

type ClerkWebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

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
  // TODO: Create user record in database
  // TODO: Send welcome email
  console.log("User created:", data);
}

async function handleUserUpdated(data: Record<string, unknown>) {
  // TODO: Update user record in database
  console.log("User updated:", data);
}

async function handleUserDeleted(data: Record<string, unknown>) {
  // TODO: Soft delete user record
  // TODO: Clean up user's data
  console.log("User deleted:", data);
}

async function handleOrganizationCreated(data: Record<string, unknown>) {
  // TODO: Create organization record in database
  // TODO: Provision initial resources
  console.log("Organization created:", data);
}

async function handleOrganizationUpdated(data: Record<string, unknown>) {
  // TODO: Update organization record
  console.log("Organization updated:", data);
}

async function handleMembershipCreated(data: Record<string, unknown>) {
  // TODO: Add user to organization in database
  // TODO: Create extension for user
  console.log("Membership created:", data);
}

async function handleMembershipDeleted(data: Record<string, unknown>) {
  // TODO: Remove user from organization
  // TODO: Deactivate extension
  console.log("Membership deleted:", data);
}

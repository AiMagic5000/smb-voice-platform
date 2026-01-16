import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, organizations, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// POST - Create a new user account with tier (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a super admin
    const [adminUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (!adminUser || adminUser.role !== "super_admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      organizationName,
      tier, // "starter" | "professional" | "enterprise"
      role, // "user" | "admin" | "super_admin"
      skipPayment, // Allow creating without payment
      notes,
    } = body;

    // Validate required fields
    if (!email || !organizationName || !tier) {
      return NextResponse.json(
        { error: "Missing required fields: email, organizationName, tier" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate placeholder IDs for admin-created accounts
    // These will be updated when user signs up via Clerk
    const placeholderClerkOrgId = `admin_org_${Date.now()}`;
    const placeholderClerkUserId = `admin_user_${Date.now()}`;
    const placeholderSubId = `admin_sub_${Date.now()}`;

    // Create organization
    const [newOrg] = await db
      .insert(organizations)
      .values({
        clerkOrgId: placeholderClerkOrgId,
        name: organizationName,
        domain: organizationName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        plan: tier,
        status: "active",
        billingEmail: email,
      })
      .returning();

    // Create user record (will be linked when they sign up via Clerk)
    const [newUser] = await db
      .insert(users)
      .values({
        clerkUserId: placeholderClerkUserId,
        email: email,
        firstName: firstName || null,
        lastName: lastName || null,
        role: role || "member",
        organizationId: newOrg.id,
      })
      .returning();

    // Create subscription (only if skipPayment is true, since we don't have real Stripe data)
    let subscription = null;
    if (skipPayment) {
      const now = new Date();
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      [subscription] = await db
        .insert(subscriptions)
        .values({
          id: placeholderSubId,
          organizationId: newOrg.id,
          stripeCustomerId: `admin_cus_${Date.now()}`,
          stripeSubscriptionId: `admin_sub_${Date.now()}`,
          stripePriceId: `price_${tier}`,
          planId: tier,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      organization: {
        id: newOrg.id,
        name: newOrg.name,
        plan: newOrg.plan,
      },
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        planId: subscription.planId,
      } : null,
      message: skipPayment
        ? "Account created with full access (payment skipped)"
        : "Account created. User will need to complete payment to activate.",
      signupLink: `https://voice.startmybusiness.us/sign-up?email=${encodeURIComponent(email)}&org=${newOrg.id}`,
      notes: notes ? `Admin notes: ${notes}` : undefined,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update user tier or status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a super admin
    const [adminUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (!adminUser || adminUser.role !== "super_admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      userId: targetUserId,
      organizationId,
      newTier,
      newRole,
      notes,
    } = body;

    if (!targetUserId && !organizationId) {
      return NextResponse.json(
        { error: "Must provide userId or organizationId" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    // Update user role
    if (targetUserId && newRole) {
      await db
        .update(users)
        .set({ role: newRole })
        .where(eq(users.id, targetUserId));

      updates.user = { role: newRole };
    }

    // Update organization plan
    if (organizationId && newTier) {
      await db
        .update(organizations)
        .set({ plan: newTier, updatedAt: new Date() })
        .where(eq(organizations.id, organizationId));

      // Also update subscription planId
      await db
        .update(subscriptions)
        .set({ planId: newTier, updatedAt: new Date() })
        .where(eq(subscriptions.organizationId, organizationId));

      updates.organization = { plan: newTier };
    }

    return NextResponse.json({
      success: true,
      updates,
      message: "Account updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

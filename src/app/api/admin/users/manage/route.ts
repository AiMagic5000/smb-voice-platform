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

    // Create organization
    const [newOrg] = await db
      .insert(organizations)
      .values({
        name: organizationName,
        slug: organizationName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        tier: tier,
        ownerId: null, // Will be updated when user signs up
        createdByAdmin: true,
        adminNotes: notes || null,
      })
      .returning();

    // Create user record (will be linked when they sign up via Clerk)
    const [newUser] = await db
      .insert(users)
      .values({
        email: email,
        firstName: firstName || null,
        lastName: lastName || null,
        role: role || "user",
        organizationId: newOrg.id,
        status: "pending", // Will be "active" after they complete signup
        createdByAdmin: true,
      })
      .returning();

    // Create subscription
    const [subscription] = await db
      .insert(subscriptions)
      .values({
        organizationId: newOrg.id,
        tier: tier,
        status: skipPayment ? "active" : "pending",
        gumroadSubscriptionId: skipPayment ? `admin_${Date.now()}` : null,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdByAdmin: skipPayment,
        adminNotes: skipPayment ? `Created by admin without payment: ${adminUser.email}` : null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
      organization: {
        id: newOrg.id,
        name: newOrg.name,
        tier: newOrg.tier,
      },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        tier: subscription.tier,
      },
      message: skipPayment
        ? "Account created with full access (payment skipped)"
        : "Account created. User will need to complete Gumroad payment to activate.",
      signupLink: `https://voice.startmybusiness.us/sign-up?email=${encodeURIComponent(email)}&org=${newOrg.id}`,
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
      newStatus,
      notes,
    } = body;

    if (!targetUserId && !organizationId) {
      return NextResponse.json(
        { error: "Must provide userId or organizationId" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    // Update user role/status
    if (targetUserId && (newRole || newStatus)) {
      const userUpdates: Record<string, unknown> = {};
      if (newRole) userUpdates.role = newRole;
      if (newStatus) userUpdates.status = newStatus;
      userUpdates.updatedAt = new Date();

      await db
        .update(users)
        .set(userUpdates)
        .where(eq(users.id, targetUserId));

      updates.user = userUpdates;
    }

    // Update organization tier
    if (organizationId && newTier) {
      await db
        .update(organizations)
        .set({ tier: newTier, updatedAt: new Date() })
        .where(eq(organizations.id, organizationId));

      // Also update subscription
      await db
        .update(subscriptions)
        .set({ tier: newTier, updatedAt: new Date() })
        .where(eq(subscriptions.organizationId, organizationId));

      updates.organization = { tier: newTier };
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

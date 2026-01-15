import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

/**
 * GET /api/account
 * Get current user's account information
 */
export async function GET() {
  try {
    const { userId, orgId, orgRole } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get organization info if user is part of one
    let organization = null;
    if (orgId) {
      const client = await clerkClient();
      try {
        const org = await client.organizations.getOrganization({
          organizationId: orgId,
        });
        organization = {
          id: org.id,
          name: org.name,
          slug: org.slug,
          imageUrl: org.imageUrl,
          membersCount: org.membersCount,
          createdAt: org.createdAt,
        };
      } catch (e) {
        console.error("Error fetching organization:", e);
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        hasImage: user.hasImage,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        twoFactorEnabled: user.twoFactorEnabled,
        primaryEmailVerified:
          user.emailAddresses[0]?.verification?.status === "verified",
      },
      organization,
      role: orgRole || "owner",
      hasOrganization: !!orgId,
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account information" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/account
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName } = body;

    const client = await clerkClient();

    // Build update payload
    const updatePayload: {
      firstName?: string;
      lastName?: string;
    } = {};

    if (firstName !== undefined) updatePayload.firstName = firstName;
    if (lastName !== undefined) updatePayload.lastName = lastName;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await client.users.updateUser(userId, updatePayload);

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.emailAddresses[0]?.emailAddress,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: `${updatedUser.firstName || ""} ${
          updatedUser.lastName || ""
        }`.trim(),
        imageUrl: updatedUser.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

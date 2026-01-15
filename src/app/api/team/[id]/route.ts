import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/team/[id]
 * Update a team member's role
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: memberId } = await params;
    const { userId, orgId, orgRole } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization required" },
        { status: 400 }
      );
    }

    // Check if user has permission
    if (orgRole !== "org:admin") {
      return NextResponse.json(
        { error: "Admin role required to update members" },
        { status: 403 }
      );
    }

    // Can't modify yourself
    if (memberId === userId) {
      return NextResponse.json(
        { error: "Cannot modify your own role" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !["admin", "member", "viewer"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const client = await clerkClient();

    // Find the membership
    const memberships = await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    const membership = memberships.data.find(
      (m) => m.publicUserData?.userId === memberId
    );

    if (!membership) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Update the role
    await client.organizations.updateOrganizationMembership({
      organizationId: orgId,
      userId: memberId,
      role: role === "admin" ? "org:admin" : "org:member",
    });

    return NextResponse.json({
      success: true,
      memberId,
      newRole: role,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/team/[id]
 * Remove a team member or revoke an invitation
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id: memberId } = await params;
    const { userId, orgId, orgRole } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization required" },
        { status: 400 }
      );
    }

    // Check if user has permission
    if (orgRole !== "org:admin") {
      return NextResponse.json(
        { error: "Admin role required to remove members" },
        { status: 403 }
      );
    }

    // Can't remove yourself
    if (memberId === userId) {
      return NextResponse.json(
        { error: "Cannot remove yourself from the organization" },
        { status: 400 }
      );
    }

    const client = await clerkClient();

    // Check if this is a pending invitation
    if (memberId.startsWith("inv_")) {
      // Revoke invitation
      await client.organizations.revokeOrganizationInvitation({
        organizationId: orgId,
        invitationId: memberId,
        requestingUserId: userId,
      });

      return NextResponse.json({
        success: true,
        message: "Invitation revoked",
      });
    }

    // Remove membership
    await client.organizations.deleteOrganizationMembership({
      organizationId: orgId,
      userId: memberId,
    });

    return NextResponse.json({
      success: true,
      message: "Member removed from organization",
    });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team/[id]
 * Resend invitation to a pending member
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id: invitationId } = await params;
    const { userId, orgId, orgRole } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization required" },
        { status: 400 }
      );
    }

    if (orgRole !== "org:admin") {
      return NextResponse.json(
        { error: "Admin role required" },
        { status: 403 }
      );
    }

    if (!invitationId.startsWith("inv_")) {
      return NextResponse.json(
        { error: "Invalid invitation ID" },
        { status: 400 }
      );
    }

    const client = await clerkClient();

    // Get the existing invitation to get the email
    const invitations = await client.organizations.getOrganizationInvitationList({
      organizationId: orgId,
    });

    const existingInvite = invitations.data.find((i) => i.id === invitationId);

    if (!existingInvite) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Revoke old invitation and create new one
    await client.organizations.revokeOrganizationInvitation({
      organizationId: orgId,
      invitationId,
      requestingUserId: userId,
    });

    const newInvitation = await client.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: existingInvite.emailAddress,
      role: existingInvite.role,
      inviterUserId: userId,
    });

    return NextResponse.json({
      success: true,
      message: "Invitation resent",
      invitation: {
        id: newInvitation.id,
        email: newInvitation.emailAddress,
      },
    });
  } catch (error) {
    console.error("Error resending invitation:", error);
    return NextResponse.json(
      { error: "Failed to resend invitation" },
      { status: 500 }
    );
  }
}

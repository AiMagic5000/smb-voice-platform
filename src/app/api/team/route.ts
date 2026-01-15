import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * GET /api/team
 * List all team members in the organization
 */
export async function GET() {
  try {
    const { userId, orgId, orgRole } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If no organization, return just the current user
    if (!orgId) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);

      return NextResponse.json({
        members: [
          {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName,
            lastName: user.lastName,
            role: "owner",
            status: "active",
            avatarUrl: user.imageUrl,
            joinedAt: user.createdAt,
          },
        ],
        total: 1,
      });
    }

    // Get organization members
    const client = await clerkClient();
    const memberships = await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
      limit: 100,
    });

    const members = memberships.data.map((membership) => ({
      id: membership.publicUserData?.userId || membership.id,
      email: membership.publicUserData?.identifier || "",
      firstName: membership.publicUserData?.firstName,
      lastName: membership.publicUserData?.lastName,
      role: membership.role === "org:admin" ? "admin" : "member",
      status: "active",
      avatarUrl: membership.publicUserData?.imageUrl,
      joinedAt: membership.createdAt,
    }));

    // Get pending invitations
    const invitations = await client.organizations.getOrganizationInvitationList({
      organizationId: orgId,
      status: ["pending"],
    });

    const pendingMembers = invitations.data.map((invite) => ({
      id: invite.id,
      email: invite.emailAddress,
      firstName: null,
      lastName: null,
      role: invite.role === "org:admin" ? "admin" : "member",
      status: "pending",
      invitedAt: invite.createdAt,
    }));

    return NextResponse.json({
      members: [...members, ...pendingMembers],
      total: members.length + pendingMembers.length,
      currentUserRole: orgRole,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team
 * Invite a new team member
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId, orgRole } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization required to invite members" },
        { status: 400 }
      );
    }

    // Check if user has permission to invite
    if (orgRole !== "org:admin") {
      return NextResponse.json(
        { error: "Admin role required to invite members" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role = "member" } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clerkClient();

    // Create invitation
    const invitation = await client.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role: role === "admin" ? "org:admin" : "org:member",
      inviterUserId: userId,
    });

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.emailAddress,
        role: role,
        status: "pending",
        createdAt: invitation.createdAt,
      },
    });
  } catch (error) {
    console.error("Error inviting team member:", error);

    // Handle specific Clerk errors
    const errorMessage = error instanceof Error ? error.message : "Failed to invite member";
    if (errorMessage.includes("already a member")) {
      return NextResponse.json(
        { error: "This email is already a member of the organization" },
        { status: 400 }
      );
    }
    if (errorMessage.includes("already invited")) {
      return NextResponse.json(
        { error: "This email has already been invited" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to invite team member" },
      { status: 500 }
    );
  }
}

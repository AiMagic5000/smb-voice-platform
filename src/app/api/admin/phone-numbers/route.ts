import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, phoneNumbers, organizations } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a super admin
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get all phone numbers with organization info
    const phones = await db
      .select({
        id: phoneNumbers.id,
        number: phoneNumbers.number,
        friendlyName: phoneNumbers.friendlyName,
        type: phoneNumbers.type,
        status: phoneNumbers.status,
        voiceEnabled: phoneNumbers.voiceEnabled,
        smsEnabled: phoneNumbers.smsEnabled,
        tenantId: phoneNumbers.tenantId,
        createdAt: phoneNumbers.createdAt,
      })
      .from(phoneNumbers)
      .orderBy(desc(phoneNumbers.createdAt));

    // Get organization names
    const orgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
      })
      .from(organizations);

    const orgNameMap = new Map(orgs.map((o) => [o.id, o.name]));

    const phoneNumbersWithOrg = phones.map((phone) => ({
      id: phone.id,
      number: phone.number,
      friendlyName: phone.friendlyName,
      type: phone.type || "local",
      status: phone.status,
      voiceEnabled: phone.voiceEnabled,
      smsEnabled: phone.smsEnabled,
      organizationName: orgNameMap.get(phone.tenantId) || null,
      createdAt: phone.createdAt,
    }));

    return NextResponse.json({
      phoneNumbers: phoneNumbersWithOrg,
    });
  } catch (error) {
    console.error("Error fetching phone numbers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

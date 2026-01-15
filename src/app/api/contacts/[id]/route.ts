import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { contacts, contactTags } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { z } from "zod";

const updateContactSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(10).max(20).optional(),
  company: z.string().max(200).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  isFavorite: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// Helper to get rate limit identifier
function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// GET - Get a single contact
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(getRateLimitId(request, userId), rateLimitConfigs.standard);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;

    const contact = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.id, id),
          eq(contacts.tenantId, orgId || userId)
        )
      )
      .limit(1);

    if (contact.length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Get tags
    const tags = await db
      .select()
      .from(contactTags)
      .where(eq(contactTags.contactId, id));

    return NextResponse.json({
      contact: {
        ...contact[0],
        tags: tags.map((t) => t.tag),
      },
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}

// PATCH - Update a contact
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(getRateLimitId(request, userId), rateLimitConfigs.standard);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = updateContactSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.issues },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.id, id),
          eq(contacts.tenantId, orgId || userId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const { tags, ...contactData } = validated.data;

    // Update contact
    const updateData: Record<string, unknown> = { ...contactData };
    if (contactData.phone) {
      updateData.phone = contactData.phone.replace(/\D/g, "");
    }
    updateData.updatedAt = new Date();

    const [updatedContact] = await db
      .update(contacts)
      .set(updateData)
      .where(eq(contacts.id, id))
      .returning();

    // Update tags if provided
    if (tags !== undefined) {
      // Remove existing tags
      await db.delete(contactTags).where(eq(contactTags.contactId, id));

      // Add new tags
      if (tags.length > 0) {
        await db.insert(contactTags).values(
          tags.map((tag) => ({
            contactId: id,
            tag,
          }))
        );
      }
    }

    // Get updated tags
    const updatedTags = await db
      .select()
      .from(contactTags)
      .where(eq(contactTags.contactId, id));

    return NextResponse.json({
      success: true,
      contact: {
        ...updatedContact,
        tags: updatedTags.map((t) => t.tag),
      },
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(getRateLimitId(request, userId), rateLimitConfigs.standard);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.id, id),
          eq(contacts.tenantId, orgId || userId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Delete tags first
    await db.delete(contactTags).where(eq(contactTags.contactId, id));

    // Delete contact
    await db.delete(contacts).where(eq(contacts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}

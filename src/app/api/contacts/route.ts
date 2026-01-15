import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { contacts, contactTags } from "@/lib/db/schema";
import { eq, and, or, ilike, desc, asc } from "drizzle-orm";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { z } from "zod";

const createContactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(10).max(20),
  company: z.string().max(200).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional(),
});

const updateContactSchema = createContactSchema.partial().extend({
  isFavorite: z.boolean().optional(),
});

// GET - List contacts with search and filters
async function handleGet(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");
    const favoritesOnly = searchParams.get("favorites") === "true";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [eq(contacts.tenantId, orgId || userId)];

    if (favoritesOnly) {
      conditions.push(eq(contacts.isFavorite, true));
    }

    // Get contacts
    let query = db
      .select()
      .from(contacts)
      .where(and(...conditions));

    // Apply search filter in memory for complex OR conditions
    let results = await query;

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (c) =>
          c.firstName.toLowerCase().includes(searchLower) ||
          c.lastName.toLowerCase().includes(searchLower) ||
          c.email?.toLowerCase().includes(searchLower) ||
          c.phone.includes(search) ||
          c.company?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by tag
    if (tag) {
      const contactsWithTag = await db
        .select({ contactId: contactTags.contactId })
        .from(contactTags)
        .where(eq(contactTags.tag, tag));
      const taggedIds = new Set(contactsWithTag.map((t) => t.contactId));
      results = results.filter((c) => taggedIds.has(c.id));
    }

    // Sort
    results.sort((a, b) => {
      let aVal: string | boolean | Date | null;
      let bVal: string | boolean | Date | null;

      switch (sortBy) {
        case "company":
          aVal = a.company || "";
          bVal = b.company || "";
          break;
        case "lastContacted":
          aVal = a.lastContactedAt;
          bVal = b.lastContactedAt;
          break;
        default:
          aVal = `${a.firstName} ${a.lastName}`;
          bVal = `${b.firstName} ${b.lastName}`;
      }

      // Favorites always first
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }

      if (aVal === null) return 1;
      if (bVal === null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });

    // Paginate
    const total = results.length;
    const paginatedResults = results.slice(offset, offset + limit);

    // Get tags for each contact
    const contactIds = paginatedResults.map((c) => c.id);
    const tags =
      contactIds.length > 0
        ? await db.select().from(contactTags).where(
            or(...contactIds.map((id) => eq(contactTags.contactId, id)))
          )
        : [];

    const tagsByContact = tags.reduce((acc, t) => {
      if (!acc[t.contactId]) acc[t.contactId] = [];
      acc[t.contactId].push(t.tag);
      return acc;
    }, {} as Record<string, string[]>);

    const contactsWithTags = paginatedResults.map((c) => ({
      ...c,
      tags: tagsByContact[c.id] || [],
    }));

    return NextResponse.json({
      contacts: contactsWithTags,
      total,
      page,
      limit,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST - Create a new contact
async function handlePost(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createContactSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.issues },
        { status: 400 }
      );
    }

    const { tags, ...contactData } = validated.data;

    // Create contact
    const [newContact] = await db
      .insert(contacts)
      .values({
        ...contactData,
        tenantId: orgId || userId,
        phone: contactData.phone.replace(/\D/g, ""),
        isFavorite: false,
      })
      .returning();

    // Add tags
    if (tags && tags.length > 0) {
      await db.insert(contactTags).values(
        tags.map((tag) => ({
          contactId: newContact.id,
          tag,
        }))
      );
    }

    return NextResponse.json({
      success: true,
      contact: {
        ...newContact,
        tags: tags || [],
      },
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handleGet, rateLimitConfigs.standard);
export const POST = withRateLimit(handlePost, rateLimitConfigs.standard);

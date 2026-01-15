import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

function getRateLimitId(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return `ip:${forwardedFor.split(",")[0].trim()}`;
  return `ip:unknown`;
}

// Sample invoice data (in production, fetch from Stripe)
const sampleInvoices = [
  {
    id: "inv_2024_01",
    number: "INV-2024-001",
    date: "2024-01-01",
    dueDate: "2024-01-15",
    status: "paid",
    amount: 1295,
    currency: "usd",
    items: [
      { description: "SMB Voice Pro - Monthly", amount: 795 },
      { description: "Additional Phone Number (1)", amount: 500 },
    ],
    paidAt: "2024-01-03",
    pdfUrl: "/invoices/INV-2024-001.pdf",
  },
  {
    id: "inv_2023_12",
    number: "INV-2023-012",
    date: "2023-12-01",
    dueDate: "2023-12-15",
    status: "paid",
    amount: 795,
    currency: "usd",
    items: [
      { description: "SMB Voice Pro - Monthly", amount: 795 },
    ],
    paidAt: "2023-12-02",
    pdfUrl: "/invoices/INV-2023-012.pdf",
  },
  {
    id: "inv_2023_11",
    number: "INV-2023-011",
    date: "2023-11-01",
    dueDate: "2023-11-15",
    status: "paid",
    amount: 795,
    currency: "usd",
    items: [
      { description: "SMB Voice Pro - Monthly", amount: 795 },
    ],
    paidAt: "2023-11-01",
    pdfUrl: "/invoices/INV-2023-011.pdf",
  },
];

// GET - List invoices
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      getRateLimitId(request, userId),
      rateLimitConfigs.standard
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // paid, pending, failed
    const limit = parseInt(searchParams.get("limit") || "10");
    const year = searchParams.get("year");

    let invoices = [...sampleInvoices];

    // Filter by status
    if (status) {
      invoices = invoices.filter((inv) => inv.status === status);
    }

    // Filter by year
    if (year) {
      invoices = invoices.filter((inv) => inv.date.startsWith(year));
    }

    // Apply limit
    invoices = invoices.slice(0, limit);

    // Calculate totals
    const totalPaid = sampleInvoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0);

    const totalPending = sampleInvoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + inv.amount, 0);

    return NextResponse.json({
      invoices,
      summary: {
        total: sampleInvoices.length,
        totalPaid,
        totalPending,
        currency: "usd",
      },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

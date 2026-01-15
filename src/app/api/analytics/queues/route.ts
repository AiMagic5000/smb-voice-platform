import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// Mock queue names
const queueNames = [
  "Sales",
  "Support",
  "Billing",
  "Technical",
  "General",
];

// GET - Get queue analytics
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "7d";

    // Generate mock queue analytics data
    const queues = queueNames.map((name, index) => ({
      id: `queue_${index + 1}`,
      name,

      calls: {
        total: Math.floor(Math.random() * 300) + 100,
        answered: Math.floor(Math.random() * 250) + 80,
        abandoned: Math.floor(Math.random() * 30) + 5,
        transferred: Math.floor(Math.random() * 20) + 5,
      },

      wait: {
        avgTime: Math.floor(Math.random() * 120) + 15,
        maxTime: Math.floor(Math.random() * 300) + 60,
        serviceLevelMet: (Math.random() * 20 + 75).toFixed(1),
      },

      agents: {
        total: Math.floor(Math.random() * 8) + 2,
        available: Math.floor(Math.random() * 5) + 1,
        onCall: Math.floor(Math.random() * 3) + 1,
      },

      performance: {
        avgHandleTime: Math.floor(Math.random() * 300) + 60,
        abandonmentRate: (Math.random() * 10 + 2).toFixed(1),
        serviceLevel: (Math.random() * 15 + 80).toFixed(1),
      },

      current: {
        waiting: Math.floor(Math.random() * 5),
        longestWait: Math.floor(Math.random() * 120),
        inProgress: Math.floor(Math.random() * 4) + 1,
      },
    }));

    return NextResponse.json({
      tenantId,
      period,
      generatedAt: new Date().toISOString(),
      queues,
      summary: {
        totalQueues: queues.length,
        totalCalls: queues.reduce((sum, q) => sum + q.calls.total, 0),
        avgWaitTime: Math.floor(queues.reduce((sum, q) => sum + q.wait.avgTime, 0) / queues.length),
        avgServiceLevel: (queues.reduce((sum, q) => sum + parseFloat(q.performance.serviceLevel), 0) / queues.length).toFixed(1),
        totalWaiting: queues.reduce((sum, q) => sum + q.current.waiting, 0),
      },
    });
  } catch (error) {
    console.error("Error fetching queue analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue analytics" },
      { status: 500 }
    );
  }
}

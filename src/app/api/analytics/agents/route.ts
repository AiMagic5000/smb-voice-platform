import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// Mock agent names
const agentNames = [
  "Sarah Johnson",
  "Mike Wilson",
  "Emily Chen",
  "David Brown",
  "Jessica Lee",
  "Chris Taylor",
  "Amanda Martinez",
  "Ryan Thompson",
];

// GET - Get agent performance analytics
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "7d";
    const sortBy = searchParams.get("sortBy") || "calls";

    // Generate mock agent performance data
    const agents = agentNames.map((name, index) => ({
      id: `agent_${index + 1}`,
      name,
      extension: `10${index + 1}`,

      calls: {
        total: Math.floor(Math.random() * 200) + 50,
        answered: Math.floor(Math.random() * 180) + 40,
        missed: Math.floor(Math.random() * 20) + 2,
        avgDuration: Math.floor(Math.random() * 300) + 60,
        avgWaitTime: Math.floor(Math.random() * 30) + 5,
      },

      availability: {
        totalTime: Math.floor(Math.random() * 40 * 60) + 20 * 60, // minutes
        availableTime: Math.floor(Math.random() * 30 * 60) + 15 * 60,
        busyTime: Math.floor(Math.random() * 10 * 60) + 5 * 60,
        utilizationRate: (Math.random() * 30 + 60).toFixed(1),
      },

      performance: {
        firstCallResolution: (Math.random() * 20 + 75).toFixed(1),
        customerSatisfaction: (Math.random() * 15 + 80).toFixed(1),
        avgHandleTime: Math.floor(Math.random() * 180) + 60,
        afterCallWork: Math.floor(Math.random() * 60) + 15,
      },

      status: ["available", "busy", "away", "offline"][Math.floor(Math.random() * 4)],
    }));

    // Sort agents
    const sortedAgents = [...agents].sort((a, b) => {
      switch (sortBy) {
        case "calls":
          return b.calls.total - a.calls.total;
        case "satisfaction":
          return parseFloat(b.performance.customerSatisfaction) - parseFloat(a.performance.customerSatisfaction);
        case "utilization":
          return parseFloat(b.availability.utilizationRate) - parseFloat(a.availability.utilizationRate);
        default:
          return 0;
      }
    });

    return NextResponse.json({
      tenantId,
      period,
      generatedAt: new Date().toISOString(),
      agents: sortedAgents,
      summary: {
        totalAgents: agents.length,
        avgCallsPerAgent: Math.floor(agents.reduce((sum, a) => sum + a.calls.total, 0) / agents.length),
        avgUtilization: (agents.reduce((sum, a) => sum + parseFloat(a.availability.utilizationRate), 0) / agents.length).toFixed(1),
        avgSatisfaction: (agents.reduce((sum, a) => sum + parseFloat(a.performance.customerSatisfaction), 0) / agents.length).toFixed(1),
      },
    });
  } catch (error) {
    console.error("Error fetching agent analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent analytics" },
      { status: 500 }
    );
  }
}

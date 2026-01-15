import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get analytics summary
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "7d";

    // Generate mock analytics data
    const now = new Date();
    const generateTrend = () => {
      const values = [];
      const days = period === "30d" ? 30 : period === "90d" ? 90 : 7;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        values.push({
          date: date.toISOString().split("T")[0],
          value: Math.floor(Math.random() * 100) + 50,
        });
      }
      return values;
    };

    const summary = {
      tenantId,
      period,
      generatedAt: now.toISOString(),

      calls: {
        total: Math.floor(Math.random() * 1000) + 500,
        inbound: Math.floor(Math.random() * 600) + 300,
        outbound: Math.floor(Math.random() * 400) + 200,
        missed: Math.floor(Math.random() * 50) + 10,
        avgDuration: Math.floor(Math.random() * 300) + 60,
        trend: generateTrend(),
      },

      messages: {
        total: Math.floor(Math.random() * 500) + 200,
        sent: Math.floor(Math.random() * 300) + 100,
        received: Math.floor(Math.random() * 200) + 100,
        avgResponseTime: Math.floor(Math.random() * 300) + 60,
      },

      voicemails: {
        total: Math.floor(Math.random() * 100) + 20,
        unplayed: Math.floor(Math.random() * 20) + 5,
        avgLength: Math.floor(Math.random() * 60) + 15,
      },

      agents: {
        total: Math.floor(Math.random() * 20) + 5,
        available: Math.floor(Math.random() * 15) + 3,
        onCall: Math.floor(Math.random() * 5) + 1,
        avgHandleTime: Math.floor(Math.random() * 180) + 60,
      },

      quality: {
        avgMOS: (Math.random() * 1.5 + 3.5).toFixed(2),
        avgJitter: (Math.random() * 20 + 5).toFixed(2),
        avgPacketLoss: (Math.random() * 2).toFixed(2),
        satisfaction: (Math.random() * 20 + 80).toFixed(1),
      },
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics summary" },
      { status: 500 }
    );
  }
}

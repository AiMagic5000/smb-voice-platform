import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Call Quality Metrics API
 * Provides VoIP call quality statistics and metrics
 */

interface CallQualityMetric {
  id: string;
  callId: string;
  timestamp: string;
  mos: number; // Mean Opinion Score (1-5)
  jitter: number; // ms
  packetLoss: number; // percentage
  latency: number; // ms (round-trip)
  codec: string;
  direction: "inbound" | "outbound";
  duration: number; // seconds
  quality: "excellent" | "good" | "fair" | "poor";
}

// Mock call quality data
function generateMockMetrics(
  days: number = 7,
  count: number = 100
): CallQualityMetric[] {
  const codecs = ["OPUS", "G.711", "G.722", "G.729"];
  const metrics: CallQualityMetric[] = [];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(
      Date.now() - Math.random() * days * 24 * 60 * 60 * 1000
    ).toISOString();

    // Generate realistic quality metrics
    const mos = 3.5 + Math.random() * 1.4; // MOS between 3.5-4.9 (most calls)
    const jitter = Math.random() * 30; // 0-30ms
    const packetLoss = Math.random() * 2; // 0-2%
    const latency = 20 + Math.random() * 80; // 20-100ms

    let quality: CallQualityMetric["quality"];
    if (mos >= 4.3) quality = "excellent";
    else if (mos >= 4.0) quality = "good";
    else if (mos >= 3.6) quality = "fair";
    else quality = "poor";

    metrics.push({
      id: `cqm_${i + 1}`,
      callId: `call_${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      mos: Math.round(mos * 100) / 100,
      jitter: Math.round(jitter * 10) / 10,
      packetLoss: Math.round(packetLoss * 100) / 100,
      latency: Math.round(latency),
      codec: codecs[Math.floor(Math.random() * codecs.length)],
      direction: Math.random() > 0.5 ? "inbound" : "outbound",
      duration: Math.floor(Math.random() * 600) + 30,
      quality,
    });
  }

  return metrics.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * GET /api/call-quality
 * Get call quality metrics with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7");
    const direction = searchParams.get("direction");
    const quality = searchParams.get("quality");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Generate mock data
    let metrics = generateMockMetrics(days, 200);

    // Apply filters
    if (direction) {
      metrics = metrics.filter((m) => m.direction === direction);
    }
    if (quality) {
      metrics = metrics.filter((m) => m.quality === quality);
    }

    // Calculate summary statistics
    const totalCalls = metrics.length;
    const avgMos =
      metrics.reduce((sum, m) => sum + m.mos, 0) / metrics.length || 0;
    const avgJitter =
      metrics.reduce((sum, m) => sum + m.jitter, 0) / metrics.length || 0;
    const avgPacketLoss =
      metrics.reduce((sum, m) => sum + m.packetLoss, 0) / metrics.length || 0;
    const avgLatency =
      metrics.reduce((sum, m) => sum + m.latency, 0) / metrics.length || 0;

    const qualityDistribution = {
      excellent: metrics.filter((m) => m.quality === "excellent").length,
      good: metrics.filter((m) => m.quality === "good").length,
      fair: metrics.filter((m) => m.quality === "fair").length,
      poor: metrics.filter((m) => m.quality === "poor").length,
    };

    const codecUsage: Record<string, number> = {};
    metrics.forEach((m) => {
      codecUsage[m.codec] = (codecUsage[m.codec] || 0) + 1;
    });

    // Pagination
    const paginatedMetrics = metrics.slice(offset, offset + limit);

    return NextResponse.json({
      metrics: paginatedMetrics,
      summary: {
        totalCalls,
        averages: {
          mos: Math.round(avgMos * 100) / 100,
          jitter: Math.round(avgJitter * 10) / 10,
          packetLoss: Math.round(avgPacketLoss * 100) / 100,
          latency: Math.round(avgLatency),
        },
        qualityDistribution,
        codecUsage,
        period: {
          days,
          startDate: new Date(
            Date.now() - days * 24 * 60 * 60 * 1000
          ).toISOString(),
          endDate: new Date().toISOString(),
        },
      },
      pagination: {
        total: metrics.length,
        limit,
        offset,
        hasMore: offset + limit < metrics.length,
      },
    });
  } catch (error) {
    console.error("Error fetching call quality metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch call quality metrics" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/call-quality/trends
 * Get call quality trends over time
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { granularity = "hour", days = 7 } = body;

    // Generate trend data
    const metrics = generateMockMetrics(days, 500);

    // Group by time period
    const trends: Record<
      string,
      {
        timestamp: string;
        avgMos: number;
        avgJitter: number;
        avgPacketLoss: number;
        avgLatency: number;
        callCount: number;
      }
    > = {};

    metrics.forEach((metric) => {
      const date = new Date(metric.timestamp);
      let key: string;

      if (granularity === "hour") {
        key = `${date.toISOString().split("T")[0]}T${date.getHours().toString().padStart(2, "0")}:00`;
      } else if (granularity === "day") {
        key = date.toISOString().split("T")[0];
      } else {
        // week
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      }

      if (!trends[key]) {
        trends[key] = {
          timestamp: key,
          avgMos: 0,
          avgJitter: 0,
          avgPacketLoss: 0,
          avgLatency: 0,
          callCount: 0,
        };
      }

      const t = trends[key];
      const count = t.callCount + 1;
      t.avgMos = (t.avgMos * t.callCount + metric.mos) / count;
      t.avgJitter = (t.avgJitter * t.callCount + metric.jitter) / count;
      t.avgPacketLoss =
        (t.avgPacketLoss * t.callCount + metric.packetLoss) / count;
      t.avgLatency = (t.avgLatency * t.callCount + metric.latency) / count;
      t.callCount = count;
    });

    // Convert to array and sort
    const trendData = Object.values(trends)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      .map((t) => ({
        ...t,
        avgMos: Math.round(t.avgMos * 100) / 100,
        avgJitter: Math.round(t.avgJitter * 10) / 10,
        avgPacketLoss: Math.round(t.avgPacketLoss * 100) / 100,
        avgLatency: Math.round(t.avgLatency),
      }));

    return NextResponse.json({
      trends: trendData,
      granularity,
      period: {
        days,
        startDate: new Date(
          Date.now() - days * 24 * 60 * 60 * 1000
        ).toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching call quality trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch call quality trends" },
      { status: 500 }
    );
  }
}

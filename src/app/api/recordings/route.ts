import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { callLogs } from "@/lib/db/schema";
import { eq, and, desc, sql, isNotNull } from "drizzle-orm";

/**
 * GET /api/recordings
 * List all call recordings for the tenant
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = (page - 1) * limit;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query for calls with recordings
    const conditions = [
      eq(callLogs.tenantId, tenantId),
      isNotNull(callLogs.recordingUrl),
    ];

    // Date filters
    if (startDate) {
      conditions.push(sql`${callLogs.startTime} >= ${new Date(startDate)}`);
    }
    if (endDate) {
      conditions.push(sql`${callLogs.startTime} <= ${new Date(endDate)}`);
    }

    // Get recordings
    const recordings = await db
      .select({
        id: callLogs.id,
        callId: callLogs.id,
        direction: callLogs.direction,
        callerNumber: callLogs.callerNumber,
        calledNumber: callLogs.calledNumber,
        duration: callLogs.duration,
        recordingUrl: callLogs.recordingUrl,
        transcription: callLogs.transcription,
        startTime: callLogs.startTime,
        endTime: callLogs.endTime,
      })
      .from(callLogs)
      .where(and(...conditions))
      .orderBy(desc(callLogs.startTime))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(callLogs)
      .where(and(...conditions));

    const total = Number(countResult[0]?.count || 0);

    return NextResponse.json({
      recordings: recordings.map((r) => ({
        id: r.id,
        callId: r.callId,
        direction: r.direction,
        callerNumber: r.callerNumber,
        calledNumber: r.calledNumber,
        duration: r.duration,
        recordingUrl: r.recordingUrl,
        hasTranscription: !!r.transcription,
        transcription: r.transcription,
        recordedAt: r.startTime,
        endTime: r.endTime,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return NextResponse.json(
      { error: "Failed to fetch recordings" },
      { status: 500 }
    );
  }
}

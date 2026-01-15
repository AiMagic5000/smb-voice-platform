import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { callLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/recordings/[id]
 * Get a specific recording with full details
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;

    const recordings = await db
      .select()
      .from(callLogs)
      .where(and(eq(callLogs.id, id), eq(callLogs.tenantId, tenantId)));

    if (recordings.length === 0 || !recordings[0].recordingUrl) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    const recording = recordings[0];

    return NextResponse.json({
      id: recording.id,
      callId: recording.id,
      direction: recording.direction,
      callerNumber: recording.callerNumber,
      calledNumber: recording.calledNumber,
      duration: recording.duration,
      recordingUrl: recording.recordingUrl,
      transcription: recording.transcription,
      startTime: recording.startTime,
      endTime: recording.endTime,
      status: recording.status,
    });
  } catch (error) {
    console.error("Error fetching recording:", error);
    return NextResponse.json(
      { error: "Failed to fetch recording" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/recordings/[id]
 * Update recording metadata (e.g., add/edit transcription notes)
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;
    const body = await request.json();
    const { transcription } = body;

    // Verify ownership
    const existing = await db
      .select()
      .from(callLogs)
      .where(and(eq(callLogs.id, id), eq(callLogs.tenantId, tenantId)));

    if (existing.length === 0 || !existing[0].recordingUrl) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    // Update transcription
    const [updated] = await db
      .update(callLogs)
      .set({
        transcription: transcription || existing[0].transcription,
      })
      .where(eq(callLogs.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      recording: {
        id: updated.id,
        transcription: updated.transcription,
      },
    });
  } catch (error) {
    console.error("Error updating recording:", error);
    return NextResponse.json(
      { error: "Failed to update recording" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recordings/[id]
 * Delete a recording (removes recording URL, keeps call log)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = orgId || userId;

    // Verify ownership
    const existing = await db
      .select()
      .from(callLogs)
      .where(and(eq(callLogs.id, id), eq(callLogs.tenantId, tenantId)));

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    // Clear the recording URL (keeps the call log)
    // In production, would also delete from storage
    await db
      .update(callLogs)
      .set({
        recordingUrl: null,
        transcription: null,
      })
      .where(eq(callLogs.id, id));

    return NextResponse.json({
      success: true,
      message: "Recording deleted",
    });
  } catch (error) {
    console.error("Error deleting recording:", error);
    return NextResponse.json(
      { error: "Failed to delete recording" },
      { status: 500 }
    );
  }
}

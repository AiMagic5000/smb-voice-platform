import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { callLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/recordings/[id]/transcribe
 * Request transcription for a recording
 *
 * In production, this would integrate with a transcription service
 * like OpenAI Whisper, Deepgram, or AssemblyAI
 */
export async function POST(
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

    // Get the recording
    const recordings = await db
      .select()
      .from(callLogs)
      .where(and(eq(callLogs.id, id), eq(callLogs.tenantId, tenantId)));

    if (recordings.length === 0) {
      return NextResponse.json(
        { error: "Call log not found" },
        { status: 404 }
      );
    }

    const recording = recordings[0];

    if (!recording.recordingUrl) {
      return NextResponse.json(
        { error: "No recording available for this call" },
        { status: 400 }
      );
    }

    if (recording.transcription) {
      return NextResponse.json({
        success: true,
        message: "Transcription already exists",
        transcription: recording.transcription,
        status: "completed",
      });
    }

    // In production, this would:
    // 1. Download the audio from recording.recordingUrl
    // 2. Send to transcription service (OpenAI Whisper, Deepgram, etc.)
    // 3. Store the result in the database
    //
    // For now, simulate with mock transcription

    const mockTranscription = generateMockTranscription(
      recording.callerNumber || "Unknown",
      recording.duration || 0
    );

    // Save transcription
    await db
      .update(callLogs)
      .set({ transcription: mockTranscription })
      .where(eq(callLogs.id, id));

    return NextResponse.json({
      success: true,
      message: "Transcription completed",
      transcription: mockTranscription,
      status: "completed",
    });
  } catch (error) {
    console.error("Error transcribing recording:", error);
    return NextResponse.json(
      { error: "Failed to transcribe recording" },
      { status: 500 }
    );
  }
}

// Generate mock transcription for demo
function generateMockTranscription(
  callerNumber: string,
  duration: number
): string {
  const exchanges = [
    { caller: "Hello, I'm calling about your services.", agent: "Hi there! Thank you for calling. How can I help you today?" },
    { caller: "I wanted to know more about your pricing.", agent: "Of course! Our plans start at $7.95 per month." },
    { caller: "That sounds reasonable. What's included?", agent: "You get a business phone number, AI receptionist, voicemail, and mobile apps." },
    { caller: "Great, can I start a free trial?", agent: "Absolutely! I can set that up for you right now." },
    { caller: "Perfect, thank you for your help.", agent: "You're welcome! Is there anything else I can help you with?" },
    { caller: "No, that's all. Have a good day!", agent: "You too! Thank you for calling." },
  ];

  // Select exchanges based on call duration
  const numExchanges = Math.min(Math.floor(duration / 30) + 1, exchanges.length);
  const selectedExchanges = exchanges.slice(0, numExchanges);

  let transcript = `Call Transcription\nCaller: ${callerNumber}\n\n`;

  selectedExchanges.forEach((exchange, index) => {
    const timestamp = formatTimestamp(index * 30);
    transcript += `[${timestamp}] Caller: ${exchange.caller}\n`;
    transcript += `[${formatTimestamp(index * 30 + 10)}] Agent: ${exchange.agent}\n\n`;
  });

  return transcript.trim();
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

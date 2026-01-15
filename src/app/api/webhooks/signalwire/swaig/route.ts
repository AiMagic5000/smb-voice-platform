import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { voicemails } from "@/lib/db/schema";

interface SWAIGRequest {
  action: string;
  function: string;
  argument: {
    parsed: Record<string, unknown>;
    raw: string;
  };
  call_id: string;
  conversation_id: string;
  global_data?: Record<string, unknown>;
}

interface SWAIGResponse {
  action: string;
  response?: string;
  data?: Record<string, unknown>;
}

// POST - Handle SWAIG function calls from SignalWire AI
export async function POST(request: NextRequest) {
  try {
    const body: SWAIGRequest = await request.json();

    console.log("SWAIG webhook received:", JSON.stringify(body, null, 2));

    const { function: functionName, argument, call_id } = body;
    const params = argument?.parsed || {};

    let response: SWAIGResponse;

    switch (functionName) {
      case "transfer_call":
        // Handle call transfer request
        const transferReason = params.reason as string || "Customer requested transfer";
        console.log(`Transfer requested for call ${call_id}: ${transferReason}`);

        response = {
          action: "transfer",
          data: {
            destination: process.env.TRANSFER_DEFAULT_NUMBER || "+18885551234",
            reason: transferReason,
          },
        };
        break;

      case "end_call":
        // Handle call end request
        const endReason = params.reason as string || "Conversation completed";
        console.log(`Call end requested for ${call_id}: ${endReason}`);

        response = {
          action: "hangup",
          response: "Thank you for calling. Have a great day!",
        };
        break;

      case "take_message":
        // Handle voicemail/message taking
        const callerName = params.name as string || "Unknown";
        const callbackPhone = params.phone as string || "Not provided";
        const messageContent = params.message as string || "";

        console.log(`Message taken for call ${call_id}:`, {
          name: callerName,
          phone: callbackPhone,
          message: messageContent,
        });

        // Store the message (in production, you'd resolve tenantId from call context)
        try {
          await db.insert(voicemails).values({
            tenantId: "system", // Would be resolved from call metadata in production
            extension: "AI",
            callerNumber: callbackPhone,
            callerName: callerName,
            duration: 0,
            transcription: messageContent,
            audioUrl: "", // AI-taken messages don't have audio
            isRead: false,
          });
        } catch (dbError) {
          console.error("Failed to save message to database:", dbError);
        }

        response = {
          action: "continue",
          response: `I've taken your message. Let me confirm: your name is ${callerName}, your callback number is ${callbackPhone}, and your message is: ${messageContent}. Is that correct?`,
        };
        break;

      case "get_business_hours":
        // Return business hours (would fetch from DB in production)
        response = {
          action: "continue",
          response: "Our business hours are Monday through Friday, 9 AM to 5 PM Eastern Time. We are closed on weekends and major holidays.",
        };
        break;

      case "schedule_callback":
        // Handle callback scheduling
        const preferredTime = params.preferred_time as string || "as soon as possible";

        response = {
          action: "continue",
          response: `I've noted that you'd like a callback ${preferredTime}. Someone from our team will reach out to you soon.`,
        };
        break;

      default:
        // Unknown function
        console.warn(`Unknown SWAIG function called: ${functionName}`);
        response = {
          action: "continue",
          response: "I'm sorry, I couldn't process that request. How else can I help you?",
        };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing SWAIG webhook:", error);

    // Return a graceful response even on error
    return NextResponse.json({
      action: "continue",
      response: "I apologize, but I encountered an issue. Could you please repeat that?",
    });
  }
}

// Handle SWAIG validation (SignalWire may send OPTIONS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

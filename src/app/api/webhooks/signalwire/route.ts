import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// POST /api/webhooks/signalwire - Handle SignalWire webhooks
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    // Signature for webhook validation (to be implemented)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const signature = headersList.get("x-signalwire-signature");

    // TODO: Validate SignalWire webhook signature
    // const isValid = validateSignalWireSignature(signature, body);

    const body = await request.json();
    const { event_type, data } = body;

    console.log(`SignalWire webhook received: ${event_type}`, data);

    switch (event_type) {
      case "call.received":
        // Handle incoming call
        await handleIncomingCall(data);
        break;

      case "call.answered":
        // Handle call answered
        await handleCallAnswered(data);
        break;

      case "call.ended":
        // Handle call ended
        await handleCallEnded(data);
        break;

      case "message.received":
        // Handle SMS received
        await handleSMSReceived(data);
        break;

      case "voicemail.received":
        // Handle new voicemail
        await handleVoicemailReceived(data);
        break;

      default:
        console.log(`Unhandled SignalWire event: ${event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing SignalWire webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleIncomingCall(data: Record<string, unknown>) {
  // TODO: Log call to database
  // TODO: Route to appropriate extension or AI receptionist
  console.log("Incoming call:", data);
}

async function handleCallAnswered(data: Record<string, unknown>) {
  // TODO: Update call status in database
  console.log("Call answered:", data);
}

async function handleCallEnded(data: Record<string, unknown>) {
  // TODO: Update call record with duration
  // TODO: Process recording if enabled
  console.log("Call ended:", data);
}

async function handleSMSReceived(data: Record<string, unknown>) {
  // TODO: Store SMS in database
  // TODO: Forward to user if configured
  console.log("SMS received:", data);
}

async function handleVoicemailReceived(data: Record<string, unknown>) {
  // TODO: Store voicemail in database
  // TODO: Transcribe voicemail
  // TODO: Send notification to user
  console.log("Voicemail received:", data);
}

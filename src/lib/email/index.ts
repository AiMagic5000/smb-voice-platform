import { Resend } from "resend";
import { WelcomeEmail } from "./templates/welcome";
import { VoicemailEmail } from "./templates/voicemail";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender
const defaultFrom = "SMB Voice <noreply@startmybusiness.us>";

export async function sendWelcomeEmail({
  to,
  firstName,
  phoneNumber,
}: {
  to: string;
  firstName: string;
  phoneNumber?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to,
      subject: "Welcome to SMB Voice - Your Business Phone is Ready!",
      react: WelcomeEmail({ firstName, phoneNumber }),
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
}

export async function sendVoicemailNotification({
  to,
  recipientName,
  callerName,
  callerNumber,
  duration,
  timestamp,
  transcription,
  voicemailUrl,
}: {
  to: string;
  recipientName: string;
  callerName?: string;
  callerNumber: string;
  duration: string;
  timestamp: string;
  transcription?: string;
  voicemailUrl?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to,
      subject: `New Voicemail from ${callerName || callerNumber}`,
      react: VoicemailEmail({
        recipientName,
        callerName,
        callerNumber,
        duration,
        timestamp,
        transcription,
        voicemailUrl,
      }),
    });

    if (error) {
      console.error("Failed to send voicemail notification:", error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending voicemail notification:", error);
    return { success: false, error };
  }
}

export { WelcomeEmail, VoicemailEmail };

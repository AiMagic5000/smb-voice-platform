import { Resend } from "resend";
import { WelcomeEmail } from "./templates/welcome";
import { VoicemailEmail } from "./templates/voicemail";
import { InvoiceEmail } from "./templates/invoice";
import { PaymentFailedEmail } from "./templates/payment-failed";
import { PaymentConfirmationEmail } from "./templates/payment-confirmation";
import { TrialEndingEmail } from "./templates/trial-ending";

// Initialize Resend with API key (handle missing key gracefully for build time)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Default sender
const defaultFrom = "SMB Voice <noreply@startmybusiness.us>";
const billingFrom = "SMB Voice Billing <billing@startmybusiness.us>";

export async function sendWelcomeEmail({
  to,
  firstName,
  phoneNumber,
}: {
  to: string;
  firstName: string;
  phoneNumber?: string;
}) {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

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
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

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

export async function sendInvoiceEmail({
  to,
  customerName,
  invoiceNumber,
  invoiceDate,
  dueDate,
  lineItems,
  subtotal,
  tax,
  total,
  invoiceUrl,
  pdfUrl,
  status,
}: {
  to: string;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: { description: string; quantity?: number; unitPrice?: number; amount: number }[];
  subtotal: number;
  tax?: number;
  total: number;
  invoiceUrl: string;
  pdfUrl?: string;
  status: "paid" | "open" | "overdue";
}) {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const statusSubject = status === "paid" ? "Receipt" : status === "overdue" ? "Overdue Invoice" : "Invoice";

    const { data, error } = await resend.emails.send({
      from: billingFrom,
      to,
      subject: `${statusSubject} #${invoiceNumber} - SMB Voice`,
      react: InvoiceEmail({
        customerName,
        invoiceNumber,
        invoiceDate,
        dueDate,
        lineItems,
        subtotal,
        tax,
        total,
        invoiceUrl,
        pdfUrl,
        status,
      }),
    });

    if (error) {
      console.error("Failed to send invoice email:", error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return { success: false, error };
  }
}

export async function sendPaymentFailedEmail({
  to,
  customerName,
  amount,
  invoiceNumber,
  lastFourDigits,
  cardBrand,
  updatePaymentUrl,
  retryDate,
  daysUntilSuspension,
}: {
  to: string;
  customerName: string;
  amount: number;
  invoiceNumber: string;
  lastFourDigits: string;
  cardBrand: string;
  updatePaymentUrl: string;
  retryDate?: string;
  daysUntilSuspension?: number;
}) {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: billingFrom,
      to,
      subject: `Action Required: Payment Failed - Invoice #${invoiceNumber}`,
      react: PaymentFailedEmail({
        customerName,
        amount,
        invoiceNumber,
        lastFourDigits,
        cardBrand,
        updatePaymentUrl,
        retryDate,
        daysUntilSuspension,
      }),
    });

    if (error) {
      console.error("Failed to send payment failed email:", error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending payment failed email:", error);
    return { success: false, error };
  }
}

export async function sendPaymentConfirmationEmail({
  to,
  customerName,
  amount,
  invoiceNumber,
  paymentDate,
  planName,
  nextBillingDate,
  lastFourDigits,
  cardBrand,
  invoiceUrl,
  dashboardUrl,
}: {
  to: string;
  customerName: string;
  amount: number;
  invoiceNumber: string;
  paymentDate: string;
  planName: string;
  nextBillingDate: string;
  lastFourDigits: string;
  cardBrand: string;
  invoiceUrl?: string;
  dashboardUrl: string;
}) {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: billingFrom,
      to,
      subject: `Payment Received - Thank You!`,
      react: PaymentConfirmationEmail({
        customerName,
        amount,
        invoiceNumber,
        paymentDate,
        planName,
        nextBillingDate,
        lastFourDigits,
        cardBrand,
        invoiceUrl,
        dashboardUrl,
      }),
    });

    if (error) {
      console.error("Failed to send payment confirmation email:", error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendTrialEndingEmail({
  to,
  customerName,
  trialEndDate,
  daysRemaining,
  planName,
  planPrice,
  phoneNumber,
  upgradeUrl,
}: {
  to: string;
  customerName: string;
  trialEndDate: string;
  daysRemaining: number;
  planName: string;
  planPrice: number;
  phoneNumber?: string;
  upgradeUrl: string;
}) {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to,
      subject: `Your SMB Voice trial ends in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`,
      react: TrialEndingEmail({
        customerName,
        trialEndDate,
        daysRemaining,
        planName,
        planPrice,
        phoneNumber,
        upgradeUrl,
      }),
    });

    if (error) {
      console.error("Failed to send trial ending email:", error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending trial ending email:", error);
    return { success: false, error };
  }
}

// Export all templates
export {
  WelcomeEmail,
  VoicemailEmail,
  InvoiceEmail,
  PaymentFailedEmail,
  PaymentConfirmationEmail,
  TrialEndingEmail,
};

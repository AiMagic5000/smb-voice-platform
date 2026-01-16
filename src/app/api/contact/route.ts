import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import {
  sendContactFormEmail,
  sendContactAutoReply,
  SUPPORT_EMAIL,
} from "@/lib/email";

// POST /api/contact - Handle contact form submissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, message } = validationResult.data;

    // Log the contact form submission
    console.log("Contact form submission:", {
      name: `${firstName} ${lastName}`,
      email,
      phone: phone || "Not provided",
      message,
      timestamp: new Date().toISOString(),
    });

    // Send email notification to support team
    const notificationResult = await sendContactFormEmail({
      to: SUPPORT_EMAIL,
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    if (!notificationResult.success) {
      console.error("Failed to send notification email:", notificationResult.error);
    }

    // Send auto-reply to customer
    const autoReplyResult = await sendContactAutoReply({
      to: email,
      firstName,
    });

    if (!autoReplyResult.success) {
      console.error("Failed to send auto-reply email:", autoReplyResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again or call us at 888-534-4145.",
      },
      { status: 500 }
    );
  }
}

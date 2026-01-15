import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";

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

    // TODO: Send email notification to support team
    // TODO: Store in database for follow-up

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

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

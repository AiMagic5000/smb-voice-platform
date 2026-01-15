import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();

  // Check environment configuration
  const checks = {
    clerk: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    database: !!process.env.DATABASE_URL,
    signalwire: !!process.env.SIGNALWIRE_PROJECT_ID,
    stripe: !!process.env.STRIPE_SECRET_KEY,
    resend: !!process.env.RESEND_API_KEY,
  };

  const allConfigured = Object.values(checks).every(Boolean);
  const responseTime = Date.now() - startTime;

  return NextResponse.json({
    status: allConfigured ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    service: "smb-voice-platform",
    environment: process.env.NODE_ENV || "development",
    responseTime: `${responseTime}ms`,
    checks,
    uptime: process.uptime ? `${Math.floor(process.uptime())}s` : "N/A",
  });
}

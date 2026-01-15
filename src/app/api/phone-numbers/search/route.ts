import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSignalWireClient } from "@/lib/signalwire";

/**
 * GET /api/phone-numbers/search
 * Search for available phone numbers - alias endpoint for onboarding flow
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "local";
    const areaCode = searchParams.get("areaCode");
    const contains = searchParams.get("contains");
    const quantity = parseInt(searchParams.get("quantity") || "10");

    // Check if SignalWire is configured
    const hasSignalWireConfig =
      process.env.SIGNALWIRE_PROJECT_ID &&
      process.env.SIGNALWIRE_API_TOKEN &&
      process.env.SIGNALWIRE_SPACE_URL;

    if (!hasSignalWireConfig) {
      // Return mock data if SignalWire not configured
      const mockNumbers = generateMockNumbers(
        type as "local" | "tollfree",
        areaCode,
        quantity
      );
      return NextResponse.json({
        numbers: mockNumbers,
        searchParams: { type, areaCode, contains },
        mock: true,
        message: "SignalWire not configured - showing demo numbers",
      });
    }

    try {
      // Use real SignalWire API
      const client = getSignalWireClient();
      const numbers = await client.searchAvailableNumbers({
        type: type === "tollfree" ? "toll-free" : "local",
        areaCode: areaCode || undefined,
        contains: contains || undefined,
        limit: quantity,
      });

      // Transform to consistent format
      const formattedNumbers = numbers.map((n) => ({
        phoneNumber: n.number,
        type: n.type === "toll-free" ? "tollfree" : "local",
        region: "US",
        monthlyPrice: n.monthlyPrice,
        setupFee: n.setupPrice,
        capabilities: {
          voice: true,
          sms: true,
          mms: n.type !== "toll-free",
        },
      }));

      return NextResponse.json({
        numbers: formattedNumbers,
        searchParams: { type, areaCode, contains },
        mock: false,
      });
    } catch (signalWireError) {
      console.error("SignalWire API error:", signalWireError);
      // Fall back to mock data on SignalWire error
      const mockNumbers = generateMockNumbers(
        type as "local" | "tollfree",
        areaCode,
        quantity
      );
      return NextResponse.json({
        numbers: mockNumbers,
        searchParams: { type, areaCode, contains },
        mock: true,
        error: "SignalWire API error - showing demo numbers",
      });
    }
  } catch (error) {
    console.error("Error searching phone numbers:", error);
    return NextResponse.json(
      { error: "Failed to search phone numbers" },
      { status: 500 }
    );
  }
}

// Generate mock numbers for demo/fallback purposes
function generateMockNumbers(
  type: "local" | "tollfree",
  areaCode?: string | null,
  count: number = 10
) {
  const numbers = [];
  const cities = [
    { city: "New York", state: "NY", areaCode: "212" },
    { city: "Los Angeles", state: "CA", areaCode: "310" },
    { city: "San Francisco", state: "CA", areaCode: "415" },
    { city: "Austin", state: "TX", areaCode: "512" },
    { city: "Miami", state: "FL", areaCode: "786" },
    { city: "Chicago", state: "IL", areaCode: "312" },
    { city: "Seattle", state: "WA", areaCode: "206" },
    { city: "Denver", state: "CO", areaCode: "303" },
  ];

  const tollfreePrefixes = ["800", "888", "877", "866", "855"];

  for (let i = 0; i < count; i++) {
    const prefix = String(Math.floor(Math.random() * 900) + 100);
    const line = String(Math.floor(Math.random() * 9000) + 1000);

    let phoneNumber: string;
    let city: string | undefined;
    let state: string | undefined;

    if (type === "tollfree") {
      const tfPrefix =
        tollfreePrefixes[Math.floor(Math.random() * tollfreePrefixes.length)];
      phoneNumber = `+1${tfPrefix}${prefix}${line}`;
    } else {
      const location = areaCode
        ? cities.find((c) => c.areaCode === areaCode) || cities[0]
        : cities[Math.floor(Math.random() * cities.length)];
      phoneNumber = `+1${location.areaCode}${prefix}${line}`;
      city = location.city;
      state = location.state;
    }

    numbers.push({
      phoneNumber,
      type,
      region: "US",
      city,
      state,
      monthlyPrice: type === "tollfree" ? 4.95 : 1.95,
      setupFee: 0,
      capabilities: {
        voice: true,
        sms: true,
        mms: type !== "tollfree",
      },
    });
  }

  return numbers;
}

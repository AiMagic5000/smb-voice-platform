import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function getTenantId(userId: string, orgId: string | null | undefined): string {
  return orgId || userId;
}

// GET - Get usage data
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = getTenantId(userId, orgId);
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "current";

    // Generate mock usage data
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();

    const usage = {
      tenantId,
      period,
      billingPeriod: {
        start: startOfMonth.toISOString(),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
        daysRemaining: daysInMonth - daysPassed,
      },

      plan: {
        name: "Professional",
        monthlyFee: 7.95,
        includedMinutes: 1000,
        includedSMS: 500,
        includedPhoneNumbers: 2,
      },

      current: {
        minutes: {
          used: Math.floor(Math.random() * 800) + 100,
          included: 1000,
          overage: 0,
          overageRate: 0.03,
        },
        sms: {
          used: Math.floor(Math.random() * 400) + 50,
          included: 500,
          overage: 0,
          overageRate: 0.01,
        },
        phoneNumbers: {
          active: Math.floor(Math.random() * 3) + 1,
          included: 2,
          additionalRate: 2.00,
        },
        recordings: {
          storageMB: Math.floor(Math.random() * 500) + 50,
          includedMB: 1000,
          overageRatePerGB: 0.10,
        },
        aiMinutes: {
          used: Math.floor(Math.random() * 200) + 20,
          included: 500,
          overageRate: 0.05,
        },
      },

      charges: {
        basePlan: 7.95,
        overageMinutes: 0,
        overageSMS: 0,
        additionalNumbers: 0,
        storageOverage: 0,
        aiOverage: 0,
        taxes: 0.64,
        total: 8.59,
      },

      history: Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
        return {
          month: date.toLocaleString("default", { month: "short", year: "numeric" }),
          minutes: Math.floor(Math.random() * 1200) + 200,
          sms: Math.floor(Math.random() * 600) + 100,
          total: (Math.random() * 20 + 7.95).toFixed(2),
        };
      }),
    };

    // Calculate overages
    if (usage.current.minutes.used > usage.current.minutes.included) {
      usage.current.minutes.overage = usage.current.minutes.used - usage.current.minutes.included;
      usage.charges.overageMinutes = usage.current.minutes.overage * usage.current.minutes.overageRate;
    }

    if (usage.current.sms.used > usage.current.sms.included) {
      usage.current.sms.overage = usage.current.sms.used - usage.current.sms.included;
      usage.charges.overageSMS = usage.current.sms.overage * usage.current.sms.overageRate;
    }

    if (usage.current.phoneNumbers.active > usage.current.phoneNumbers.included) {
      usage.charges.additionalNumbers =
        (usage.current.phoneNumbers.active - usage.current.phoneNumbers.included) *
        usage.current.phoneNumbers.additionalRate;
    }

    // Recalculate total
    usage.charges.total =
      usage.charges.basePlan +
      usage.charges.overageMinutes +
      usage.charges.overageSMS +
      usage.charges.additionalNumbers +
      usage.charges.storageOverage +
      usage.charges.aiOverage +
      usage.charges.taxes;

    return NextResponse.json(usage);
  } catch (error) {
    console.error("Error fetching usage data:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { ReportingDashboard } from "@/components/dashboard/reporting-dashboard";

export const metadata: Metadata = {
  title: "Analytics | SMB Voice",
  description: "View call analytics and performance reports",
};

export default async function AnalyticsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      {/* Reporting Dashboard Component */}
      <ReportingDashboard />
    </div>
  );
}

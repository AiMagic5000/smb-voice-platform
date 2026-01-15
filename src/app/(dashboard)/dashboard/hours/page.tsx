import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { BusinessHours } from "@/components/dashboard/business-hours";

export const metadata: Metadata = {
  title: "Business Hours | SMB Voice",
  description: "Set your business hours and call handling rules",
};

export default async function BusinessHoursPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Business Hours</h1>
        <p className="text-gray-500 mt-1">
          Set when your phones are open and how calls are handled
        </p>
      </div>

      {/* Business Hours Component */}
      <BusinessHours />
    </div>
  );
}

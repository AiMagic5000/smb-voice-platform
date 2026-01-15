import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SMSMessaging } from "@/components/dashboard/sms-messaging";

export const metadata: Metadata = {
  title: "Messaging | SMB Voice",
  description: "Send and receive SMS messages with your business phone numbers",
};

export default async function MessagingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Messaging</h1>
        <p className="text-gray-500 mt-1">
          Send and receive SMS messages with your business numbers
        </p>
      </div>

      {/* SMS Messaging Component */}
      <SMSMessaging className="h-[calc(100vh-220px)]" />
    </div>
  );
}

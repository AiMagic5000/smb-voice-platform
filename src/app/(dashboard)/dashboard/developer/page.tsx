import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { WebhookLogs } from "@/components/dashboard/webhook-logs";

export const metadata: Metadata = {
  title: "Developer | SMB Voice",
  description: "Manage webhooks and API integrations",
};

export default async function DeveloperPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Developer Tools</h1>
        <p className="text-gray-500 mt-1">
          Manage webhooks, API keys, and integrations
        </p>
      </div>

      {/* Webhook Logs Component */}
      <WebhookLogs />
    </div>
  );
}

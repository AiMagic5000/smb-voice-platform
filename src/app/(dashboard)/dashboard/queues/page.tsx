import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { CallQueueManager } from "@/components/dashboard/call-queue";

export const metadata: Metadata = {
  title: "Call Queues | SMB Voice",
  description: "Manage call queues and agent assignments",
};

export default async function QueuesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Call Queues</h1>
        <p className="text-gray-500 mt-1">
          Manage call queues and distribute calls to your team
        </p>
      </div>

      {/* Call Queue Manager Component */}
      <CallQueueManager />
    </div>
  );
}

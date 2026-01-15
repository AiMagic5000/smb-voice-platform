import { Suspense } from "react";
import { LiveCallMonitor } from "@/components/dashboard/live-call-monitor";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Live Calls - SMB Voice",
  description: "Monitor active calls in real-time",
};

export default function LiveCallsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <LiveCallMonitor />
      </Suspense>
    </div>
  );
}

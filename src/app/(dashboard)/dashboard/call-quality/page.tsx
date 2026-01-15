import { Suspense } from "react";
import { CallQualityDashboard } from "@/components/dashboard/call-quality-dashboard";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Call Quality - SMB Voice",
  description: "Monitor VoIP call quality metrics",
};

export default function CallQualityPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <CallQualityDashboard />
      </Suspense>
    </div>
  );
}

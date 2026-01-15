import { Suspense } from "react";
import { CallPark } from "@/components/dashboard/call-park";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Call Park - SMB Voice",
  description: "Park and retrieve calls",
};

export default function CallParkPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <CallPark />
      </Suspense>
    </div>
  );
}

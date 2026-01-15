import { Suspense } from "react";
import { SpeedDial } from "@/components/dashboard/speed-dial";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Speed Dial - SMB Voice",
  description: "Manage your quick dial contacts",
};

export default function SpeedDialPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <SpeedDial />
      </Suspense>
    </div>
  );
}

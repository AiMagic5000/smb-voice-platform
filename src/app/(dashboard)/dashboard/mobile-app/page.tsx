import { Suspense } from "react";
import { MobileApps } from "@/components/dashboard/mobile-apps";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Mobile App - SMB Voice",
  description: "Download and set up the SMB Voice mobile app",
};

export default function MobileAppPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <MobileApps />
      </Suspense>
    </div>
  );
}

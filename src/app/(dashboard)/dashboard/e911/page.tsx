import { Suspense } from "react";
import { E911Config } from "@/components/dashboard/e911-config";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "E911 Configuration - SMB Voice",
  description: "Configure emergency calling locations",
};

export default function E911Page() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <E911Config />
      </Suspense>
    </div>
  );
}

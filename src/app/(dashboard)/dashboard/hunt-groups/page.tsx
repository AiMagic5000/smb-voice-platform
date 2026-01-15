import { Suspense } from "react";
import { HuntGroups } from "@/components/dashboard/hunt-groups";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Hunt Groups - SMB Voice",
  description: "Manage advanced call distribution groups",
};

export default function HuntGroupsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <HuntGroups />
      </Suspense>
    </div>
  );
}

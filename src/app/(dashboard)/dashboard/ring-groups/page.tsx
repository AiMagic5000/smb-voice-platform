import { Suspense } from "react";
import { RingGroups } from "@/components/dashboard/ring-groups";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Ring Groups - SMB Voice",
  description: "Manage call ring groups and distribution",
};

export default function RingGroupsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <RingGroups />
      </Suspense>
    </div>
  );
}

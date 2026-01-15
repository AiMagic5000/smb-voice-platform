import { Suspense } from "react";
import { BlocklistManager } from "@/components/dashboard/blocklist-manager";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Blocklist - SMB Voice",
  description: "Manage blocked callers and spam protection",
};

export default function BlocklistPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <BlocklistManager />
      </Suspense>
    </div>
  );
}

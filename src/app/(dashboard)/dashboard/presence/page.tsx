import { Suspense } from "react";
import { AgentPresencePanel } from "@/components/dashboard/agent-presence-panel";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Team Presence - SMB Voice",
  description: "View team availability and status",
};

export default function PresencePage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <AgentPresencePanel />
      </Suspense>
    </div>
  );
}

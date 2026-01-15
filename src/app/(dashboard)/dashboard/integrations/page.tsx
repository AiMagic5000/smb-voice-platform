import { Suspense } from "react";
import { IntegrationMarketplace } from "@/components/dashboard/integration-marketplace";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Integrations - SMB Voice",
  description: "Connect with your favorite business tools",
};

export default function IntegrationsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <IntegrationMarketplace />
      </Suspense>
    </div>
  );
}

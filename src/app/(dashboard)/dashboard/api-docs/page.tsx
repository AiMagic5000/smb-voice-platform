import { Suspense } from "react";
import { APIDocumentation } from "@/components/dashboard/api-documentation";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "API Documentation - SMB Voice",
  description: "API reference and documentation for developers",
};

export default function APIDocsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <APIDocumentation />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import { SMSTemplates } from "@/components/dashboard/sms-templates";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "SMS Templates - SMB Voice",
  description: "Manage text message templates",
};

export default function SMSTemplatesPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <SMSTemplates />
      </Suspense>
    </div>
  );
}

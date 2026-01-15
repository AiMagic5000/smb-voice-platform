import { Suspense } from "react";
import { EmailTemplateEditor } from "@/components/dashboard/email-template-editor";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Email Templates - SMB Voice",
  description: "Manage email notification templates",
};

export default function EmailTemplatesPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <EmailTemplateEditor />
      </Suspense>
    </div>
  );
}

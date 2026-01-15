import { Suspense } from "react";
import { VoicemailGreetingManager } from "@/components/dashboard/voicemail-greeting-manager";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Voicemail Greetings - SMB Voice",
  description: "Manage voicemail greeting recordings",
};

export default function GreetingsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <VoicemailGreetingManager />
      </Suspense>
    </div>
  );
}

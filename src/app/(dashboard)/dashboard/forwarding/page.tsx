import { Suspense } from "react";
import { CallForwardingRules } from "@/components/dashboard/call-forwarding-rules";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Call Forwarding - SMB Voice",
  description: "Manage call forwarding rules and conditions",
};

// Default rules for demonstration
const defaultRules = [
  {
    id: "1",
    name: "Always Forward",
    type: "always" as const,
    enabled: false,
    priority: 1,
    destination: {
      type: "phone" as const,
      value: "",
      label: "Not configured",
    },
  },
  {
    id: "2",
    name: "Forward When Busy",
    type: "busy" as const,
    enabled: true,
    priority: 2,
    destination: {
      type: "voicemail" as const,
      value: "voicemail",
      label: "Voicemail",
    },
  },
  {
    id: "3",
    name: "Forward on No Answer",
    type: "no_answer" as const,
    enabled: true,
    priority: 3,
    destination: {
      type: "voicemail" as const,
      value: "voicemail",
      label: "Voicemail",
    },
    conditions: {
      ringTimeout: 20,
    },
  },
];

export default function ForwardingPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <CallForwardingRules rules={defaultRules} />
      </Suspense>
    </div>
  );
}

import { SystemHealth } from "@/components/dashboard/system-health";

export const metadata = {
  title: "System Health | SMB Voice",
  description: "Infrastructure and service monitoring",
};

export default function SystemHealthPage() {
  return <SystemHealth />;
}

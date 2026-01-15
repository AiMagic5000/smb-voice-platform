import { NotificationsCenter } from "@/components/dashboard/notifications-center";

export const metadata = {
  title: "Notifications | SMB Voice",
  description: "Manage alerts and notification preferences",
};

export default function NotificationsPage() {
  return <NotificationsCenter />;
}

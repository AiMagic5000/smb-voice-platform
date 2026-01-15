import { Suspense } from "react";
import { ConferenceRooms } from "@/components/dashboard/conference-rooms";
import { PageLoading } from "@/components/ui/loading-states";

export const metadata = {
  title: "Conference Rooms - SMB Voice",
  description: "Manage conference call rooms and participants",
};

export default function ConferencesPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<PageLoading />}>
        <ConferenceRooms />
      </Suspense>
    </div>
  );
}

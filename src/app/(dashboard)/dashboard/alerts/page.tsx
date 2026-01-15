"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { EmergencyNotifications } from "@/components/dashboard/emergency-notifications";

export default function AlertsPage() {
  return (
    <>
      <Header
        title="Emergency Alerts"
        description="Send mass notifications to your team"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EmergencyNotifications />
        </motion.div>
      </div>
    </>
  );
}

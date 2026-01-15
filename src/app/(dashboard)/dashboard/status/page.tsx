"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { SystemStatus } from "@/components/dashboard/system-status";

export default function StatusPage() {
  return (
    <>
      <Header
        title="System Status"
        description="Monitor service health and uptime"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SystemStatus />
        </motion.div>
      </div>
    </>
  );
}

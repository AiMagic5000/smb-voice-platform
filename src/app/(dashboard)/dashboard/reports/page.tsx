"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { ScheduledReports } from "@/components/dashboard/scheduled-reports";

export default function ReportsPage() {
  return (
    <>
      <Header
        title="Scheduled Reports"
        description="Automate and schedule recurring reports"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ScheduledReports />
        </motion.div>
      </div>
    </>
  );
}

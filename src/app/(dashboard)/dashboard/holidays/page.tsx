"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { HolidaySchedules } from "@/components/dashboard/holiday-schedules";

export default function HolidaysPage() {
  return (
    <>
      <Header
        title="Holiday Schedules"
        description="Configure business closures and special routing"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HolidaySchedules />
        </motion.div>
      </div>
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { AutoAttendantBuilder } from "@/components/dashboard/auto-attendant-builder";

export default function AutoAttendantPage() {
  return (
    <>
      <Header
        title="Auto Attendant"
        description="Build and customize your phone menu system"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AutoAttendantBuilder />
        </motion.div>
      </div>
    </>
  );
}

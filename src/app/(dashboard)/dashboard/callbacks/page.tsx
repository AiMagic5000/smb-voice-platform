"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { CallbackScheduler } from "@/components/dashboard/callback-scheduler";

export default function CallbacksPage() {
  return (
    <>
      <Header
        title="Callback Scheduler"
        description="Manage customer callback requests and follow-ups"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CallbackScheduler />
        </motion.div>
      </div>
    </>
  );
}

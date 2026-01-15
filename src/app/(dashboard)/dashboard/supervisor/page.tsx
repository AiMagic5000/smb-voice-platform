"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { SupervisorTools } from "@/components/dashboard/supervisor-tools";

export default function SupervisorPage() {
  return (
    <>
      <Header
        title="Supervisor Tools"
        description="Monitor, whisper, and barge into agent calls in real-time"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SupervisorTools />
        </motion.div>
      </div>
    </>
  );
}

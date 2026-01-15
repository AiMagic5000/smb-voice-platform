"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { CallerIdConfig } from "@/components/dashboard/caller-id-config";

export default function CallerIdPage() {
  return (
    <>
      <Header
        title="Caller ID"
        description="Configure outbound caller ID settings"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CallerIdConfig />
        </motion.div>
      </div>
    </>
  );
}

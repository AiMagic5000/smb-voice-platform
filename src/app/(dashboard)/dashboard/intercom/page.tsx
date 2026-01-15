"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { IntercomSettings } from "@/components/dashboard/intercom-settings";

export default function IntercomPage() {
  return (
    <>
      <Header
        title="Intercom"
        description="Configure intercom settings for quick internal communication"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <IntercomSettings />
        </motion.div>
      </div>
    </>
  );
}

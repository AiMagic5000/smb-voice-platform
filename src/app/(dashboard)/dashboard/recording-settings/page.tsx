"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { CallRecordingSettings } from "@/components/dashboard/call-recording-settings";

export default function RecordingSettingsPage() {
  return (
    <>
      <Header
        title="Recording Settings"
        description="Configure call recording policies and compliance"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CallRecordingSettings />
        </motion.div>
      </div>
    </>
  );
}

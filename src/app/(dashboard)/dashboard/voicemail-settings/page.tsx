"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { VoicemailSettings } from "@/components/dashboard/voicemail-settings";

export default function VoicemailSettingsPage() {
  return (
    <>
      <Header
        title="Voicemail Settings"
        description="Configure voicemail, notifications, and greetings"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <VoicemailSettings />
        </motion.div>
      </div>
    </>
  );
}

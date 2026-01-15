"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { CallScripts } from "@/components/dashboard/call-scripts";

export default function ScriptsPage() {
  return (
    <>
      <Header
        title="Call Scripts"
        description="Manage scripts and prompts for your team"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CallScripts />
        </motion.div>
      </div>
    </>
  );
}

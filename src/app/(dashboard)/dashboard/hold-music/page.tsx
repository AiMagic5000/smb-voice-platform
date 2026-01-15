"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { HoldMusicManager } from "@/components/dashboard/hold-music-manager";

export default function HoldMusicPage() {
  return (
    <>
      <Header
        title="Hold Music"
        description="Manage custom hold music for your callers"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HoldMusicManager />
        </motion.div>
      </div>
    </>
  );
}

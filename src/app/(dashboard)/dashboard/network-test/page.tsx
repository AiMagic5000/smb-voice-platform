"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { NetworkDiagnostics } from "@/components/dashboard/network-diagnostics";

export default function NetworkTestPage() {
  return (
    <>
      <Header
        title="Network Diagnostics"
        description="Test your network connection and VoIP quality"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <NetworkDiagnostics />
        </motion.div>
      </div>
    </>
  );
}

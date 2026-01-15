"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { CallDispositions } from "@/components/dashboard/call-dispositions";

export default function DispositionsPage() {
  return (
    <>
      <Header
        title="Call Dispositions"
        description="Manage call outcome codes for your team"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CallDispositions />
        </motion.div>
      </div>
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { ComplianceDashboard } from "@/components/dashboard/compliance-dashboard";

export default function CompliancePage() {
  return (
    <>
      <Header
        title="Compliance Dashboard"
        description="Monitor TCPA, DNC, and regulatory compliance status"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ComplianceDashboard />
        </motion.div>
      </div>
    </>
  );
}

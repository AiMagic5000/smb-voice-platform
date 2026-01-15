"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { NumberPortingTracker } from "@/components/dashboard/number-porting-tracker";

export default function PortingPage() {
  return (
    <>
      <Header
        title="Number Porting"
        description="Transfer existing phone numbers to SMB Voice"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <NumberPortingTracker />
        </motion.div>
      </div>
    </>
  );
}

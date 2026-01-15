"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { QAScorecards } from "@/components/dashboard/qa-scorecards";

export default function QAPage() {
  return (
    <>
      <Header
        title="Quality Assurance"
        description="Evaluate calls and track agent quality with scorecards"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <QAScorecards />
        </motion.div>
      </div>
    </>
  );
}

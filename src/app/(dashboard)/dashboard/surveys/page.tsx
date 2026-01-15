"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { CallSurvey } from "@/components/dashboard/call-survey";

export default function SurveysPage() {
  return (
    <>
      <Header
        title="Call Surveys"
        description="Manage post-call surveys and feedback collection"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CallSurvey />
        </motion.div>
      </div>
    </>
  );
}

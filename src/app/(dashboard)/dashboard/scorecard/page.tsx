"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { AgentScorecard } from "@/components/dashboard/agent-scorecard";

export default function ScorecardPage() {
  return (
    <>
      <Header
        title="Agent Scorecard"
        description="Track agent performance metrics and rankings"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AgentScorecard />
        </motion.div>
      </div>
    </>
  );
}

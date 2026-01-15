"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { SkillsRouting } from "@/components/dashboard/skills-routing";

export default function SkillsPage() {
  return (
    <>
      <Header
        title="Skills-Based Routing"
        description="Configure agent skills and intelligent call routing rules"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SkillsRouting />
        </motion.div>
      </div>
    </>
  );
}

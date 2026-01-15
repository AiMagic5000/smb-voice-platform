"use client";

import { motion } from "framer-motion";
import { Wallboard } from "@/components/dashboard/wallboard";

export default function WallboardPage() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Wallboard />
      </motion.div>
    </div>
  );
}

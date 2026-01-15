"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { ClickToCallWidget } from "@/components/dashboard/click-to-call-widget";

export default function WebWidgetPage() {
  return (
    <>
      <Header
        title="Click-to-Call Widget"
        description="Create and manage website call widgets"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ClickToCallWidget />
        </motion.div>
      </div>
    </>
  );
}

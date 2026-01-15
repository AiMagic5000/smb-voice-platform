"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { WebhookManager } from "@/components/dashboard/webhook-manager";

export default function WebhooksPage() {
  return (
    <>
      <Header
        title="Webhook Management"
        description="Configure webhook endpoints for real-time event notifications"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <WebhookManager />
        </motion.div>
      </div>
    </>
  );
}

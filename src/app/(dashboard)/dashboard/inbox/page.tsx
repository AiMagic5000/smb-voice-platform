"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { SharedInbox } from "@/components/dashboard/shared-inbox";

export default function InboxPage() {
  return (
    <>
      <Header
        title="Shared Inbox"
        description="Manage all team communications in one place"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SharedInbox showFilters={true} />
        </motion.div>
      </div>
    </>
  );
}

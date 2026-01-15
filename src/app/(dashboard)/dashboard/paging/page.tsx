"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { PagingGroups } from "@/components/dashboard/paging-groups";

export default function PagingPage() {
  return (
    <>
      <Header
        title="Paging Groups"
        description="Configure paging groups for company-wide announcements"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PagingGroups />
        </motion.div>
      </div>
    </>
  );
}

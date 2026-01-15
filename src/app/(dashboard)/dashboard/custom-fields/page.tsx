"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { CustomFields } from "@/components/dashboard/custom-fields";

export default function CustomFieldsPage() {
  return (
    <>
      <Header
        title="Custom Fields"
        description="Define custom data fields for contacts, calls, and other entities"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CustomFields />
        </motion.div>
      </div>
    </>
  );
}

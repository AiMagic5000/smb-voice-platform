"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { DIDInventory } from "@/components/dashboard/did-inventory";

export default function DIDInventoryPage() {
  return (
    <>
      <Header
        title="DID Inventory"
        description="Manage your phone number inventory and assignments"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DIDInventory />
        </motion.div>
      </div>
    </>
  );
}

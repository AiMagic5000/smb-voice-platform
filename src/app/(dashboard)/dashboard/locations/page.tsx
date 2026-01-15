"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { MultiLocationManager } from "@/components/dashboard/multi-location-manager";

export default function LocationsPage() {
  return (
    <>
      <Header
        title="Locations"
        description="Manage your business locations and their phone systems"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MultiLocationManager />
        </motion.div>
      </div>
    </>
  );
}

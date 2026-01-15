"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { DeviceProvisioning } from "@/components/dashboard/device-provisioning";

export default function DevicesPage() {
  return (
    <>
      <Header
        title="Device Provisioning"
        description="Manage desk phones and device configurations"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DeviceProvisioning />
        </motion.div>
      </div>
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { ReceptionistConsole } from "@/components/dashboard/receptionist-console";

export default function ReceptionistPage() {
  return (
    <>
      <Header
        title="Receptionist Console"
        description="Manage incoming calls, transfers, and company directory"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ReceptionistConsole />
        </motion.div>
      </div>
    </>
  );
}

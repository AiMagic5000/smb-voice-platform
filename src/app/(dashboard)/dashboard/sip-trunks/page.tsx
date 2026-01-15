"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { SipTrunkConfig } from "@/components/dashboard/sip-trunk-config";

export default function SipTrunksPage() {
  return (
    <>
      <Header
        title="SIP Trunks"
        description="Manage VoIP carrier connections"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SipTrunkConfig />
        </motion.div>
      </div>
    </>
  );
}

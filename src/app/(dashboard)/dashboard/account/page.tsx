"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { AccountProfile } from "@/components/dashboard/account-profile";

export default function AccountPage() {
  return (
    <>
      <Header
        title="Account Settings"
        description="Manage your profile, company information, and security settings"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AccountProfile />
        </motion.div>
      </div>
    </>
  );
}

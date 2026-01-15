"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle,
  Phone,
  Users,
  Voicemail,
  AlertCircle,
} from "lucide-react";

const invoices = [
  {
    id: "INV-2026-001",
    date: "Jan 1, 2026",
    amount: "$7.95",
    status: "paid",
  },
  {
    id: "INV-2025-012",
    date: "Dec 1, 2025",
    amount: "$7.95",
    status: "paid",
  },
  {
    id: "INV-2025-011",
    date: "Nov 1, 2025",
    amount: "$7.95",
    status: "paid",
  },
  {
    id: "INV-2025-010",
    date: "Oct 1, 2025",
    amount: "$12.45",
    status: "paid",
  },
];

const usageData = {
  minutesUsed: 423,
  minutesIncluded: 500,
  extraMinutes: 0,
  extensions: 4,
  extensionsIncluded: 5,
  phoneNumbers: 2,
  voicemails: 12,
};

export default function BillingPage() {
  const minutesPercentage = (usageData.minutesUsed / usageData.minutesIncluded) * 100;

  return (
    <>
      <Header
        title="Billing"
        description="Manage your subscription and payment methods"
      />

      <div className="p-8 space-y-8">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">SMB Voice Basic</h2>
                    <Badge className="bg-[#C9A227] text-white">Active</Badge>
                  </div>
                  <p className="text-white/70">
                    Your plan renews on February 1, 2026
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">$7.95</p>
                  <p className="text-white/70">per month</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Minutes</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-[#1E3A5F]">
                        {usageData.minutesUsed}
                      </span>
                      <span className="text-gray-400">
                        /{usageData.minutesIncluded}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {Math.round(minutesPercentage)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        minutesPercentage > 90
                          ? "bg-red-500"
                          : minutesPercentage > 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(minutesPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Extensions</span>
                  </div>
                  <p>
                    <span className="text-2xl font-bold text-[#1E3A5F]">
                      {usageData.extensions}
                    </span>
                    <span className="text-gray-400">
                      /{usageData.extensionsIncluded}
                    </span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Phone Numbers</span>
                  </div>
                  <p className="text-2xl font-bold text-[#1E3A5F]">
                    {usageData.phoneNumbers}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Voicemail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Voicemails</span>
                  </div>
                  <p className="text-2xl font-bold text-[#1E3A5F]">
                    {usageData.voicemails}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1E3A5F]">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-sm text-gray-500">Expires 12/2027</p>
                  </div>
                </div>
                <Button variant="outline">Update Card</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                  <Calendar className="h-5 w-5" />
                  Billing History
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {invoices.map((invoice, i) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1E3A5F]">
                          {invoice.id}
                        </p>
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[#1E3A5F]">
                        {invoice.amount}
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Paid
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-[#FDF8E8] border-[#C9A227]/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-[#C9A227] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#1E3A5F]">
                      Need help with billing?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Our support team is available 24/7 to answer your questions.
                    </p>
                  </div>
                </div>
                <Button className="btn-primary">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

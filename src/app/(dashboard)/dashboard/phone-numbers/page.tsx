"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Plus,
  Settings,
  Copy,
  Check,
  Globe,
  Building,
} from "lucide-react";

const phoneNumbers = [
  {
    id: "1",
    number: "+1 (888) 534-4145",
    type: "toll-free",
    label: "Main Business Line",
    status: "active",
    calls: 145,
    forwarding: "+1 (555) 123-4567",
  },
  {
    id: "2",
    number: "+1 (512) 555-0123",
    type: "local",
    label: "Austin Office",
    status: "active",
    calls: 89,
    forwarding: null,
  },
];

export default function PhoneNumbersPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (number: string, id: string) => {
    navigator.clipboard.writeText(number);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <Header
        title="Phone Numbers"
        description="Manage your business phone numbers"
      />

      <div className="p-8 space-y-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1E3A5F]">
              Your Numbers
            </h2>
            <p className="text-sm text-gray-500">
              {phoneNumbers.length} phone number(s) active
            </p>
          </div>
          <Button className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Add Number
          </Button>
        </div>

        {/* Phone Numbers Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {phoneNumbers.map((phone, i) => (
            <motion.div
              key={phone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          phone.type === "toll-free"
                            ? "bg-purple-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {phone.type === "toll-free" ? (
                          <Globe
                            className={`h-6 w-6 ${
                              phone.type === "toll-free"
                                ? "text-purple-600"
                                : "text-blue-600"
                            }`}
                          />
                        ) : (
                          <Building className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-500 text-sm">
                          {phone.label}
                        </p>
                        <Badge
                          variant={
                            phone.type === "toll-free" ? "default" : "secondary"
                          }
                          className="mt-1"
                        >
                          {phone.type === "toll-free" ? "Toll-Free" : "Local"}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Active
                    </Badge>
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-center gap-2 mb-6">
                    <p className="text-2xl font-bold text-[#1E3A5F]">
                      {phone.number}
                    </p>
                    <button
                      onClick={() => copyToClipboard(phone.number, phone.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {copied === phone.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-2xl font-bold text-[#1E3A5F]">
                        {phone.calls}
                      </p>
                      <p className="text-sm text-gray-500">Calls this month</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-sm font-medium text-[#1E3A5F] truncate">
                        {phone.forwarding || "No forwarding"}
                      </p>
                      <p className="text-sm text-gray-500">Forward to</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Settings className="h-4 w-4" />
                      Configure
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Phone className="h-4 w-4" />
                      Test Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Add Number Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-dashed border-2 hover:border-[#C9A227] hover:bg-[#FDF8E8]/50 transition-all cursor-pointer h-full">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-[#1E3A5F] mb-2">
                  Add New Number
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Get a local or toll-free number in seconds
                </p>
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Number
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}

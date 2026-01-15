"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Printer,
  Send,
  Inbox,
  FileText,
  Download,
  Trash2,
  RefreshCw,
  Forward,
  Eye,
  Upload,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Filter,
} from "lucide-react";

type Fax = {
  id: string;
  direction: "sent" | "received";
  fromNumber: string;
  toNumber: string;
  pages: number;
  status: "queued" | "sending" | "delivered" | "failed";
  callerName?: string;
  recipientName?: string;
  createdAt: string;
  deliveredAt?: string;
};

const mockFaxes: Fax[] = [
  {
    id: "fax_1",
    direction: "received",
    fromNumber: "+15551234567",
    toNumber: "+15559876543",
    pages: 3,
    status: "delivered",
    callerName: "ABC Company",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    deliveredAt: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: "fax_2",
    direction: "sent",
    fromNumber: "+15559876543",
    toNumber: "+15552345678",
    pages: 5,
    status: "delivered",
    recipientName: "Client Corp",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    deliveredAt: new Date(Date.now() - 7100000).toISOString(),
  },
  {
    id: "fax_3",
    direction: "sent",
    fromNumber: "+15559876543",
    toNumber: "+15553456789",
    pages: 2,
    status: "sending",
    recipientName: "Partner LLC",
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "fax_4",
    direction: "sent",
    fromNumber: "+15559876543",
    toNumber: "+15554567890",
    pages: 1,
    status: "failed",
    recipientName: "Test Inc",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "sending":
    case "queued":
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Delivered
        </Badge>
      );
    case "sending":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Sending
        </Badge>
      );
    case "queued":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          Queued
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          Failed
        </Badge>
      );
    default:
      return null;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function FaxPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSendDialog, setShowSendDialog] = useState(false);

  const filteredFaxes = mockFaxes.filter((fax) => {
    if (activeTab === "sent" && fax.direction !== "sent") return false;
    if (activeTab === "received" && fax.direction !== "received") return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        fax.fromNumber.includes(query) ||
        fax.toNumber.includes(query) ||
        fax.callerName?.toLowerCase().includes(query) ||
        fax.recipientName?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    total: mockFaxes.length,
    sent: mockFaxes.filter((f) => f.direction === "sent").length,
    received: mockFaxes.filter((f) => f.direction === "received").length,
    pending: mockFaxes.filter((f) =>
      ["queued", "sending"].includes(f.status)
    ).length,
  };

  return (
    <>
      <Header
        title="Fax"
        description="Send and receive faxes digitally"
      />

      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                    <Printer className="h-6 w-6 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Faxes</p>
                    <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sent</p>
                    <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                      {stats.sent}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Inbox className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Received</p>
                    <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                      {stats.received}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                      {stats.pending}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search faxes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              className="btn-primary gap-2"
              onClick={() => setShowSendDialog(true)}
            >
              <Send className="h-4 w-4" />
              Send Fax
            </Button>
          </div>
        </motion.div>

        {/* Fax List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b dark:border-gray-800 px-6 pt-4">
                  <TabsList className="bg-transparent p-0 h-auto gap-6">
                    <TabsTrigger
                      value="all"
                      className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#C9A227] rounded-none pb-3 px-0"
                    >
                      All Faxes
                    </TabsTrigger>
                    <TabsTrigger
                      value="received"
                      className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#C9A227] rounded-none pb-3 px-0"
                    >
                      Received
                    </TabsTrigger>
                    <TabsTrigger
                      value="sent"
                      className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#C9A227] rounded-none pb-3 px-0"
                    >
                      Sent
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="mt-0">
                  {filteredFaxes.length === 0 ? (
                    <div className="p-12 text-center">
                      <Printer className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No faxes found
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y dark:divide-gray-800">
                      {filteredFaxes.map((fax, i) => (
                        <motion.div
                          key={fax.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                fax.direction === "received"
                                  ? "bg-green-100 dark:bg-green-900/30"
                                  : "bg-blue-100 dark:bg-blue-900/30"
                              }`}
                            >
                              {fax.direction === "received" ? (
                                <Inbox
                                  className={`h-5 w-5 ${
                                    fax.direction === "received"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-blue-600 dark:text-blue-400"
                                  }`}
                                />
                              ) : (
                                <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-[#1E3A5F] dark:text-white">
                                  {fax.direction === "received"
                                    ? fax.callerName || fax.fromNumber
                                    : fax.recipientName || fax.toNumber}
                                </span>
                                {getStatusBadge(fax.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {fax.direction === "received"
                                    ? fax.fromNumber
                                    : fax.toNumber}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {fax.pages} page{fax.pages !== 1 ? "s" : ""}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(fax.createdAt)}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {fax.status === "failed" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Retry"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Forward"
                              >
                                <Forward className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Delete"
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Send Fax Dialog Placeholder */}
        {showSendDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="w-full max-w-lg mx-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                    Send a Fax
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Recipient Fax Number
                      </label>
                      <Input placeholder="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Recipient Name (Optional)
                      </label>
                      <Input placeholder="Company Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Upload Document
                      </label>
                      <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-[#C9A227] transition-colors cursor-pointer dark:border-gray-700">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Drop PDF, TIFF, PNG, or JPEG here
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          or click to browse
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="coverPage"
                        className="rounded"
                      />
                      <label
                        htmlFor="coverPage"
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        Include cover page
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowSendDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="btn-primary gap-2">
                      <Send className="h-4 w-4" />
                      Send Fax
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

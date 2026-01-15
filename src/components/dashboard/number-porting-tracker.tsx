"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  ArrowRightLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  FileText,
  Plus,
  Search,
  ChevronRight,
} from "lucide-react";

type PortingRequest = {
  id: string;
  phoneNumber: string;
  currentCarrier: string;
  status: "submitted" | "pending" | "approved" | "scheduled" | "complete" | "rejected";
  submittedAt: string;
  estimatedCompletion?: string;
  scheduledDate?: string;
  notes?: string;
  rejectionReason?: string;
};

const mockPortingRequests: PortingRequest[] = [
  {
    id: "port_1",
    phoneNumber: "+1 (555) 123-4567",
    currentCarrier: "Verizon",
    status: "complete",
    submittedAt: new Date(Date.now() - 604800000).toISOString(),
    notes: "Successfully ported",
  },
  {
    id: "port_2",
    phoneNumber: "+1 (555) 234-5678",
    currentCarrier: "AT&T",
    status: "scheduled",
    submittedAt: new Date(Date.now() - 259200000).toISOString(),
    scheduledDate: new Date(Date.now() + 172800000).toISOString(),
    estimatedCompletion: new Date(Date.now() + 172800000).toISOString(),
  },
  {
    id: "port_3",
    phoneNumber: "+1 (555) 345-6789",
    currentCarrier: "T-Mobile",
    status: "approved",
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    estimatedCompletion: new Date(Date.now() + 345600000).toISOString(),
  },
  {
    id: "port_4",
    phoneNumber: "+1 (555) 456-7890",
    currentCarrier: "Sprint",
    status: "pending",
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    estimatedCompletion: new Date(Date.now() + 518400000).toISOString(),
  },
  {
    id: "port_5",
    phoneNumber: "+1 (555) 567-8901",
    currentCarrier: "Comcast",
    status: "rejected",
    submittedAt: new Date(Date.now() - 432000000).toISOString(),
    rejectionReason: "Account number mismatch - please verify and resubmit",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "complete":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "rejected":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "scheduled":
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case "approved":
      return <CheckCircle className="h-5 w-5 text-blue-500" />;
    case "pending":
      return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
    case "submitted":
      return <Clock className="h-5 w-5 text-gray-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "complete":
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Complete</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</Badge>;
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Scheduled</Badge>;
    case "approved":
      return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Approved</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Pending Review</Badge>;
    case "submitted":
      return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Submitted</Badge>;
    default:
      return null;
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function NumberPortingTracker() {
  const [filter, setFilter] = useState<"all" | "active" | "complete" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPort, setShowNewPort] = useState(false);

  const filteredRequests = mockPortingRequests.filter((req) => {
    if (filter === "active" && ["complete", "rejected"].includes(req.status)) return false;
    if (filter === "complete" && req.status !== "complete") return false;
    if (filter === "rejected" && req.status !== "rejected") return false;
    if (searchQuery) {
      return req.phoneNumber.includes(searchQuery) || req.currentCarrier.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const stats = {
    total: mockPortingRequests.length,
    active: mockPortingRequests.filter((r) => !["complete", "rejected"].includes(r.status)).length,
    complete: mockPortingRequests.filter((r) => r.status === "complete").length,
    rejected: mockPortingRequests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <ArrowRightLeft className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Requests</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.complete}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rejected</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by number or carrier..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["all", "active", "complete", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  filter === f
                    ? "bg-white dark:bg-gray-700 shadow-sm font-medium"
                    : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <Button className="btn-primary gap-2" onClick={() => setShowNewPort(true)}>
          <Plus className="h-4 w-4" />
          Port Number
        </Button>
      </div>

      {/* Porting Requests List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-gray-800">
            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center">
                <ArrowRightLeft className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No porting requests found</p>
              </div>
            ) : (
              filteredRequests.map((request, i) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getStatusIcon(request.status)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#1E3A5F] dark:text-white">
                          {request.phoneNumber}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>From: {request.currentCarrier}</span>
                        <span>Submitted: {formatDate(request.submittedAt)}</span>
                        {request.scheduledDate && (
                          <span className="text-blue-600 dark:text-blue-400">
                            Scheduled: {formatDate(request.scheduledDate)}
                          </span>
                        )}
                      </div>
                      {request.rejectionReason && (
                        <p className="text-sm text-red-500 mt-1">{request.rejectionReason}</p>
                      )}
                    </div>

                    {/* ETA */}
                    {request.estimatedCompletion && !["complete", "rejected"].includes(request.status) && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Est. Completion</p>
                        <p className="font-medium text-[#1E3A5F] dark:text-white">
                          {formatDate(request.estimatedCompletion)}
                        </p>
                      </div>
                    )}

                    <ChevronRight className="h-5 w-5 text-gray-300" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Port Number Dialog (placeholder) */}
      {showNewPort && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Port a Phone Number
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number to Port</label>
                    <Input placeholder="+1 (555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Carrier</label>
                    <Input placeholder="e.g., Verizon, AT&T" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Account Number</label>
                    <Input placeholder="Your account number with current carrier" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Account PIN/Password</label>
                    <Input type="password" placeholder="PIN or password for porting authorization" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowNewPort(false)}>Cancel</Button>
                  <Button className="btn-primary">Submit Port Request</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

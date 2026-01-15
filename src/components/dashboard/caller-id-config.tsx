"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  User,
  Building2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Info,
  Star,
  RefreshCw,
} from "lucide-react";

type CallerIdStatus = "verified" | "pending" | "failed";

type CallerId = {
  id: string;
  phoneNumber: string;
  name: string;
  type: "business" | "personal" | "toll-free";
  status: CallerIdStatus;
  isDefault: boolean;
  verifiedAt?: string;
  lastUsed?: string;
};

const mockCallerIds: CallerId[] = [
  {
    id: "cid_1",
    phoneNumber: "+1 (555) 123-4567",
    name: "Main Business Line",
    type: "business",
    status: "verified",
    isDefault: true,
    verifiedAt: new Date(Date.now() - 2592000000).toISOString(),
    lastUsed: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "cid_2",
    phoneNumber: "+1 (555) 234-5678",
    name: "Sales Department",
    type: "business",
    status: "verified",
    isDefault: false,
    verifiedAt: new Date(Date.now() - 1296000000).toISOString(),
    lastUsed: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "cid_3",
    phoneNumber: "+1 (800) 555-0199",
    name: "Customer Support",
    type: "toll-free",
    status: "verified",
    isDefault: false,
    verifiedAt: new Date(Date.now() - 604800000).toISOString(),
    lastUsed: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "cid_4",
    phoneNumber: "+1 (555) 345-6789",
    name: "New Marketing Line",
    type: "business",
    status: "pending",
    isDefault: false,
  },
  {
    id: "cid_5",
    phoneNumber: "+1 (555) 456-7890",
    name: "Personal Cell",
    type: "personal",
    status: "failed",
    isDefault: false,
  },
];

const getStatusIcon = (status: CallerIdStatus) => {
  switch (status) {
    case "verified":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "failed":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
  }
};

const getStatusBadge = (status: CallerIdStatus) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Verified</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "business":
      return <Building2 className="h-4 w-4" />;
    case "toll-free":
      return <Phone className="h-4 w-4" />;
    case "personal":
      return <User className="h-4 w-4" />;
    default:
      return <Phone className="h-4 w-4" />;
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function CallerIdConfig() {
  const [callerIds, setCallerIds] = useState(mockCallerIds);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");

  const filteredIds = callerIds.filter((cid) => {
    if (filter === "verified") return cid.status === "verified";
    if (filter === "pending") return cid.status === "pending" || cid.status === "failed";
    return true;
  });

  const setDefault = (id: string) => {
    setCallerIds(callerIds.map((cid) => ({
      ...cid,
      isDefault: cid.id === id,
    })));
  };

  const deleteCallerId = (id: string) => {
    setCallerIds(callerIds.filter((cid) => cid.id !== id));
  };

  const stats = {
    total: callerIds.length,
    verified: callerIds.filter((c) => c.status === "verified").length,
    pending: callerIds.filter((c) => c.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">About Caller ID</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Configure which phone numbers appear as your caller ID when making outbound calls.
                  All numbers must be verified before use to prevent spam and ensure compliance with regulations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total IDs</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.total}</p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Verified</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.verified}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(["all", "verified", "pending"] as const).map((f) => (
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
        <Button className="btn-primary gap-2" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Add Caller ID
        </Button>
      </div>

      {/* Caller ID List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-gray-800">
            {filteredIds.length === 0 ? (
              <div className="p-12 text-center">
                <Phone className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No caller IDs found</p>
              </div>
            ) : (
              filteredIds.map((callerId, i) => (
                <motion.div
                  key={callerId.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      callerId.status === "verified"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : callerId.status === "pending"
                        ? "bg-yellow-100 dark:bg-yellow-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      {getStatusIcon(callerId.status)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#1E3A5F] dark:text-white">
                          {callerId.phoneNumber}
                        </span>
                        {callerId.isDefault && (
                          <Badge className="bg-[#FDF8E8] text-[#C9A227] dark:bg-[#C9A227]/20">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {getStatusBadge(callerId.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          {getTypeIcon(callerId.type)}
                          {callerId.name}
                        </span>
                        {callerId.verifiedAt && (
                          <span>Verified: {formatDate(callerId.verifiedAt)}</span>
                        )}
                        {callerId.lastUsed && (
                          <span>Last used: {formatDate(callerId.lastUsed)}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {callerId.status === "verified" && !callerId.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefault(callerId.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      {callerId.status === "pending" && (
                        <Button variant="outline" size="sm" className="gap-1">
                          <RefreshCw className="h-3.5 w-3.5" />
                          Verify
                        </Button>
                      )}
                      {callerId.status === "failed" && (
                        <Button variant="outline" size="sm" className="gap-1 text-yellow-600 border-yellow-300">
                          <RefreshCw className="h-3.5 w-3.5" />
                          Retry
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCallerId(callerId.id)}
                        disabled={callerId.isDefault}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* STIR/SHAKEN Compliance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white">STIR/SHAKEN Compliance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your calls are authenticated to prevent spoofing
                </p>
              </div>
              <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Compliant
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">A</p>
                <p className="text-xs text-gray-500">Attestation Level</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-green-600">100%</p>
                <p className="text-xs text-gray-500">Signed Calls</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">0</p>
                <p className="text-xs text-gray-500">Spam Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Caller ID Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Add Caller ID
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input placeholder="+1 (555) 123-4567" />
                    <p className="text-xs text-gray-500 mt-1">
                      You must own or have authorization to use this number
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <Input placeholder="e.g., Main Office Line" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="p-3 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-center">
                        <Building2 className="h-5 w-5 mx-auto mb-1 text-[#1E3A5F] dark:text-white" />
                        <span className="text-xs">Business</span>
                      </button>
                      <button className="p-3 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-center">
                        <Phone className="h-5 w-5 mx-auto mb-1 text-[#1E3A5F] dark:text-white" />
                        <span className="text-xs">Toll-Free</span>
                      </button>
                      <button className="p-3 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-center">
                        <User className="h-5 w-5 mx-auto mb-1 text-[#1E3A5F] dark:text-white" />
                        <span className="text-xs">Personal</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      Verification Required
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      After adding, you will need to verify ownership by receiving a call
                      with a 6-digit code at this number.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button className="btn-primary">Add & Verify</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

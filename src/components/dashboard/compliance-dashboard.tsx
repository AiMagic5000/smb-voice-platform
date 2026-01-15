"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileCheck,
  Phone,
  Ban,
  Clock,
  Download,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Eye,
  Upload,
  AlertOctagon,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Lock,
  Verified,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ComplianceStatus = "compliant" | "warning" | "violation" | "pending";
type ConsentType = "express" | "implied" | "written" | "none";

interface ComplianceCheck {
  id: string;
  name: string;
  category: "tcpa" | "dnd" | "stir_shaken" | "gdpr" | "state";
  status: ComplianceStatus;
  lastChecked: string;
  nextReview: string;
  score: number;
  issues: number;
  description: string;
}

interface DNCEntry {
  id: string;
  phoneNumber: string;
  source: "federal" | "state" | "internal" | "carrier";
  addedDate: string;
  expiresDate: string | null;
  reason: string;
  status: "active" | "expired" | "removed";
}

interface ConsentRecord {
  id: string;
  phoneNumber: string;
  contactName: string;
  consentType: ConsentType;
  consentDate: string;
  expiresDate: string | null;
  method: "web_form" | "verbal" | "written" | "sms_optin";
  campaignId: string;
  status: "active" | "revoked" | "expired";
}

interface ComplianceAlert {
  id: string;
  type: "violation" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  affectedRecords: number;
}

const mockComplianceChecks: ComplianceCheck[] = [
  {
    id: "1",
    name: "TCPA Compliance",
    category: "tcpa",
    status: "compliant",
    lastChecked: "2024-01-15T10:30:00Z",
    nextReview: "2024-02-15T10:30:00Z",
    score: 98,
    issues: 0,
    description: "Telephone Consumer Protection Act compliance status",
  },
  {
    id: "2",
    name: "Do Not Call Registry",
    category: "dnd",
    status: "warning",
    lastChecked: "2024-01-15T08:00:00Z",
    nextReview: "2024-01-22T08:00:00Z",
    score: 85,
    issues: 3,
    description: "Federal and state DNC list synchronization",
  },
  {
    id: "3",
    name: "STIR/SHAKEN",
    category: "stir_shaken",
    status: "compliant",
    lastChecked: "2024-01-15T12:00:00Z",
    nextReview: "2024-01-16T12:00:00Z",
    score: 100,
    issues: 0,
    description: "Caller ID authentication and attestation",
  },
  {
    id: "4",
    name: "State Regulations",
    category: "state",
    status: "warning",
    lastChecked: "2024-01-14T15:00:00Z",
    nextReview: "2024-01-21T15:00:00Z",
    score: 78,
    issues: 5,
    description: "State-specific telemarketing regulations",
  },
  {
    id: "5",
    name: "GDPR Data Handling",
    category: "gdpr",
    status: "compliant",
    lastChecked: "2024-01-15T09:00:00Z",
    nextReview: "2024-02-15T09:00:00Z",
    score: 95,
    issues: 1,
    description: "European data protection compliance",
  },
];

const mockDNCEntries: DNCEntry[] = [
  {
    id: "1",
    phoneNumber: "+1 (555) 123-4567",
    source: "federal",
    addedDate: "2023-06-15",
    expiresDate: null,
    reason: "Consumer request",
    status: "active",
  },
  {
    id: "2",
    phoneNumber: "+1 (555) 234-5678",
    source: "internal",
    addedDate: "2024-01-10",
    expiresDate: "2025-01-10",
    reason: "Customer complaint",
    status: "active",
  },
  {
    id: "3",
    phoneNumber: "+1 (555) 345-6789",
    source: "state",
    addedDate: "2023-12-01",
    expiresDate: null,
    reason: "State registry",
    status: "active",
  },
  {
    id: "4",
    phoneNumber: "+1 (555) 456-7890",
    source: "carrier",
    addedDate: "2023-09-20",
    expiresDate: "2024-09-20",
    reason: "Carrier block list",
    status: "active",
  },
];

const mockConsentRecords: ConsentRecord[] = [
  {
    id: "1",
    phoneNumber: "+1 (555) 111-2222",
    contactName: "John Smith",
    consentType: "express",
    consentDate: "2024-01-10",
    expiresDate: "2025-01-10",
    method: "web_form",
    campaignId: "CAMP-001",
    status: "active",
  },
  {
    id: "2",
    phoneNumber: "+1 (555) 222-3333",
    contactName: "Jane Doe",
    consentType: "written",
    consentDate: "2024-01-05",
    expiresDate: null,
    method: "written",
    campaignId: "CAMP-002",
    status: "active",
  },
  {
    id: "3",
    phoneNumber: "+1 (555) 333-4444",
    contactName: "Bob Wilson",
    consentType: "express",
    consentDate: "2023-12-15",
    expiresDate: "2024-12-15",
    method: "sms_optin",
    campaignId: "CAMP-001",
    status: "active",
  },
  {
    id: "4",
    phoneNumber: "+1 (555) 444-5555",
    contactName: "Alice Brown",
    consentType: "implied",
    consentDate: "2023-11-20",
    expiresDate: "2024-02-20",
    method: "verbal",
    campaignId: "CAMP-003",
    status: "revoked",
  },
];

const mockAlerts: ComplianceAlert[] = [
  {
    id: "1",
    type: "warning",
    title: "DNC List Update Required",
    description: "Federal DNC list hasn't been updated in 28 days. Update required within 31 days.",
    timestamp: "2024-01-15T08:00:00Z",
    resolved: false,
    affectedRecords: 0,
  },
  {
    id: "2",
    type: "violation",
    title: "Consent Expiration",
    description: "15 consent records will expire in the next 7 days.",
    timestamp: "2024-01-14T16:30:00Z",
    resolved: false,
    affectedRecords: 15,
  },
  {
    id: "3",
    type: "info",
    title: "STIR/SHAKEN Certificate Renewed",
    description: "Your STIR/SHAKEN certificate has been automatically renewed.",
    timestamp: "2024-01-13T10:00:00Z",
    resolved: true,
    affectedRecords: 0,
  },
];

export function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "dnc" | "consent" | "alerts">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDNC, setShowAddDNC] = useState(false);
  const [newDNCNumber, setNewDNCNumber] = useState("");
  const [newDNCReason, setNewDNCReason] = useState("");

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "dnc", label: "DNC Management", icon: Ban },
    { id: "consent", label: "Consent Records", icon: FileCheck },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
  ] as const;

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-amber-600 bg-amber-100";
      case "violation":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "violation":
        return XCircle;
      case "pending":
        return Clock;
    }
  };

  const getCategoryLabel = (category: ComplianceCheck["category"]) => {
    switch (category) {
      case "tcpa":
        return "TCPA";
      case "dnd":
        return "DNC";
      case "stir_shaken":
        return "STIR/SHAKEN";
      case "gdpr":
        return "GDPR";
      case "state":
        return "State Regs";
    }
  };

  const getSourceBadge = (source: DNCEntry["source"]) => {
    switch (source) {
      case "federal":
        return "bg-blue-100 text-blue-700";
      case "state":
        return "bg-purple-100 text-purple-700";
      case "internal":
        return "bg-gray-100 text-gray-700";
      case "carrier":
        return "bg-orange-100 text-orange-700";
    }
  };

  const getConsentBadge = (type: ConsentType) => {
    switch (type) {
      case "express":
        return "bg-green-100 text-green-700";
      case "written":
        return "bg-blue-100 text-blue-700";
      case "implied":
        return "bg-amber-100 text-amber-700";
      case "none":
        return "bg-red-100 text-red-700";
    }
  };

  const overallScore = Math.round(
    mockComplianceChecks.reduce((sum, check) => sum + check.score, 0) / mockComplianceChecks.length
  );

  const totalIssues = mockComplianceChecks.reduce((sum, check) => sum + check.issues, 0);

  const unresolvedAlerts = mockAlerts.filter((a) => !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                overallScore >= 90
                  ? "bg-green-100 text-green-700"
                  : overallScore >= 70
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
              )}
            >
              {overallScore >= 90 ? "Healthy" : overallScore >= 70 ? "Needs Attention" : "Critical"}
            </span>
          </div>
          <p className="text-sm text-gray-500">Compliance Score</p>
          <p className="text-3xl font-bold text-gray-900">{overallScore}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Active Issues</p>
          <p className="text-3xl font-bold text-gray-900">{totalIssues}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Ban className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">DNC Entries</p>
          <p className="text-3xl font-bold text-gray-900">
            {mockDNCEntries.filter((e) => e.status === "active").length.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <FileCheck className="h-6 w-6 text-purple-600" />
            </div>
            {unresolvedAlerts > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                {unresolvedAlerts} New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">Consent Records</p>
          <p className="text-3xl font-bold text-gray-900">
            {mockConsentRecords.filter((c) => c.status === "active").length.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-2 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-[#1E3A5F] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* STIR/SHAKEN Status */}
                <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                        <Verified className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">STIR/SHAKEN Status</h3>
                        <p className="text-white/70 text-sm">Caller ID Authentication</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="font-semibold">Full Attestation (A)</span>
                      </div>
                      <p className="text-white/70 text-sm">Certificate valid until Mar 2025</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-white/70 text-xs">Calls Verified</p>
                      <p className="text-xl font-bold">12,458</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-white/70 text-xs">Attestation Rate</p>
                      <p className="text-xl font-bold">99.8%</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-white/70 text-xs">Robocall Score</p>
                      <p className="text-xl font-bold">Low Risk</p>
                    </div>
                  </div>
                </div>

                {/* Compliance Checks */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Compliance Checks</h3>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#1E3A5F] hover:bg-[#1E3A5F]/5 rounded-lg transition-colors">
                      <RefreshCw className="h-4 w-4" />
                      Run All Checks
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mockComplianceChecks.map((check) => {
                      const StatusIcon = getStatusIcon(check.status);
                      return (
                        <div
                          key={check.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                getStatusColor(check.status)
                              )}
                            >
                              <StatusIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900">{check.name}</h4>
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                                  {getCategoryLabel(check.category)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">{check.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Score</p>
                              <p className="text-lg font-semibold text-gray-900">{check.score}%</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Issues</p>
                              <p
                                className={cn(
                                  "text-lg font-semibold",
                                  check.issues > 0 ? "text-amber-600" : "text-gray-900"
                                )}
                              >
                                {check.issues}
                              </p>
                            </div>
                            <button className="p-2 hover:bg-white rounded-lg transition-colors">
                              <Eye className="h-5 w-5 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "dnc" && (
              <motion.div
                key="dnc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* DNC Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search phone numbers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      Import
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                    <button
                      onClick={() => setShowAddDNC(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Number
                    </button>
                  </div>
                </div>

                {/* DNC Update Status */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Federal DNC List</p>
                    <p className="text-sm text-blue-700">Last updated: January 10, 2024</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Update Now
                  </button>
                </div>

                {/* DNC Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Phone Number
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Source
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Added Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Expires
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Reason
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockDNCEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{entry.phoneNumber}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                getSourceBadge(entry.source)
                              )}
                            >
                              {entry.source}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{entry.addedDate}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {entry.expiresDate || "Never"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{entry.reason}</td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                entry.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : entry.status === "expired"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-red-100 text-red-700"
                              )}
                            >
                              {entry.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="h-4 w-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "consent" && (
              <motion.div
                key="consent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Consent Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors">
                      <Plus className="h-4 w-4" />
                      Add Record
                    </button>
                  </div>
                </div>

                {/* Consent Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Phone Number
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Consent Type
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Method
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Expires
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockConsentRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-[#1E3A5F]" />
                              </div>
                              <span className="font-medium text-gray-900">{record.contactName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{record.phoneNumber}</td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                getConsentBadge(record.consentType)
                              )}
                            >
                              {record.consentType}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 capitalize">
                            {record.method.replace("_", " ")}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{record.consentDate}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {record.expiresDate || "Never"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                record.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : record.status === "revoked"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                              )}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="h-4 w-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-4 rounded-xl border-l-4",
                      alert.type === "violation"
                        ? "bg-red-50 border-red-500"
                        : alert.type === "warning"
                          ? "bg-amber-50 border-amber-500"
                          : "bg-blue-50 border-blue-500",
                      alert.resolved && "opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            alert.type === "violation"
                              ? "bg-red-100"
                              : alert.type === "warning"
                                ? "bg-amber-100"
                                : "bg-blue-100"
                          )}
                        >
                          {alert.type === "violation" ? (
                            <AlertOctagon
                              className={cn(
                                "h-5 w-5",
                                alert.type === "violation" ? "text-red-600" : ""
                              )}
                            />
                          ) : alert.type === "warning" ? (
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{alert.title}</h4>
                            {alert.resolved && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Resolved
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                            {alert.affectedRecords > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {alert.affectedRecords} affected records
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!alert.resolved && (
                        <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add DNC Modal */}
      <AnimatePresence>
        {showAddDNC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddDNC(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add to Do Not Call List</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newDNCNumber}
                    onChange={(e) => setNewDNCNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={newDNCReason}
                    onChange={(e) => setNewDNCReason(e.target.value)}
                    placeholder="Enter reason for adding to DNC list..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddDNC(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddDNC(false);
                    setNewDNCNumber("");
                    setNewDNCReason("");
                  }}
                  className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors"
                >
                  Add to DNC
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

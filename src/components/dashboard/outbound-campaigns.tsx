"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  Square,
  Search,
  Filter,
  Download,
  Upload,
  Users,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  BarChart3,
  PhoneOutgoing,
  PhoneIncoming,
  PhoneMissed,
  Voicemail,
  UserCheck,
  Settings,
  Copy,
  Eye,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CampaignStatus = "draft" | "scheduled" | "active" | "paused" | "completed" | "cancelled";
type CampaignType = "predictive" | "progressive" | "preview" | "manual";
type DialMode = "power" | "preview" | "predictive";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  type: CampaignType;
  dialMode: DialMode;
  startDate: string;
  endDate: string | null;
  totalContacts: number;
  contactsReached: number;
  contactsPending: number;
  successfulCalls: number;
  failedCalls: number;
  voicemails: number;
  callbacksScheduled: number;
  averageCallDuration: number;
  connectRate: number;
  conversionRate: number;
  assignedAgents: number;
  callerId: string;
  script: string;
  timezone: string;
  callingHours: { start: string; end: string };
  maxAttemptsPerContact: number;
  retryInterval: number;
  createdAt: string;
}

interface CampaignStats {
  totalCalls: number;
  connected: number;
  noAnswer: number;
  busy: number;
  voicemail: number;
  invalid: number;
  scheduled: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Q1 Customer Outreach",
    description: "Quarterly check-in with existing customers",
    status: "active",
    type: "progressive",
    dialMode: "power",
    startDate: "2024-01-15T09:00:00Z",
    endDate: "2024-01-31T17:00:00Z",
    totalContacts: 5000,
    contactsReached: 2847,
    contactsPending: 2153,
    successfulCalls: 1823,
    failedCalls: 456,
    voicemails: 568,
    callbacksScheduled: 234,
    averageCallDuration: 245,
    connectRate: 64.1,
    conversionRate: 23.5,
    assignedAgents: 12,
    callerId: "+1 (555) 100-2000",
    script: "customer_outreach_q1",
    timezone: "America/New_York",
    callingHours: { start: "09:00", end: "17:00" },
    maxAttemptsPerContact: 3,
    retryInterval: 24,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "New Product Launch",
    description: "Announcing new product to prospects",
    status: "scheduled",
    type: "predictive",
    dialMode: "predictive",
    startDate: "2024-02-01T09:00:00Z",
    endDate: "2024-02-28T17:00:00Z",
    totalContacts: 10000,
    contactsReached: 0,
    contactsPending: 10000,
    successfulCalls: 0,
    failedCalls: 0,
    voicemails: 0,
    callbacksScheduled: 0,
    averageCallDuration: 0,
    connectRate: 0,
    conversionRate: 0,
    assignedAgents: 20,
    callerId: "+1 (555) 100-3000",
    script: "product_launch_2024",
    timezone: "America/New_York",
    callingHours: { start: "10:00", end: "18:00" },
    maxAttemptsPerContact: 5,
    retryInterval: 48,
    createdAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "3",
    name: "Appointment Reminders",
    description: "Automated reminder calls for scheduled appointments",
    status: "active",
    type: "preview",
    dialMode: "preview",
    startDate: "2024-01-01T08:00:00Z",
    endDate: null,
    totalContacts: 1500,
    contactsReached: 1234,
    contactsPending: 266,
    successfulCalls: 1156,
    failedCalls: 78,
    voicemails: 189,
    callbacksScheduled: 45,
    averageCallDuration: 120,
    connectRate: 82.3,
    conversionRate: 93.7,
    assignedAgents: 5,
    callerId: "+1 (555) 100-4000",
    script: "appointment_reminder",
    timezone: "America/Chicago",
    callingHours: { start: "08:00", end: "20:00" },
    maxAttemptsPerContact: 2,
    retryInterval: 4,
    createdAt: "2023-12-20T10:00:00Z",
  },
  {
    id: "4",
    name: "Win-Back Campaign",
    description: "Re-engaging churned customers",
    status: "paused",
    type: "manual",
    dialMode: "power",
    startDate: "2024-01-05T09:00:00Z",
    endDate: "2024-01-20T17:00:00Z",
    totalContacts: 800,
    contactsReached: 456,
    contactsPending: 344,
    successfulCalls: 234,
    failedCalls: 122,
    voicemails: 100,
    callbacksScheduled: 67,
    averageCallDuration: 380,
    connectRate: 51.3,
    conversionRate: 15.2,
    assignedAgents: 4,
    callerId: "+1 (555) 100-5000",
    script: "winback_offer",
    timezone: "America/Los_Angeles",
    callingHours: { start: "09:00", end: "17:00" },
    maxAttemptsPerContact: 4,
    retryInterval: 72,
    createdAt: "2024-01-03T10:00:00Z",
  },
  {
    id: "5",
    name: "December Sales Push",
    description: "End of year promotion campaign",
    status: "completed",
    type: "progressive",
    dialMode: "power",
    startDate: "2023-12-01T09:00:00Z",
    endDate: "2023-12-31T17:00:00Z",
    totalContacts: 3000,
    contactsReached: 3000,
    contactsPending: 0,
    successfulCalls: 2100,
    failedCalls: 450,
    voicemails: 450,
    callbacksScheduled: 0,
    averageCallDuration: 290,
    connectRate: 70.0,
    conversionRate: 28.5,
    assignedAgents: 15,
    callerId: "+1 (555) 100-6000",
    script: "december_promo",
    timezone: "America/New_York",
    callingHours: { start: "09:00", end: "18:00" },
    maxAttemptsPerContact: 3,
    retryInterval: 24,
    createdAt: "2023-11-25T10:00:00Z",
  },
];

export function OutboundCampaigns() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "analytics">("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { id: "campaigns", label: "Campaigns", icon: Megaphone },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ] as const;

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case "active":
        return { color: "bg-green-100 text-green-700", icon: Play };
      case "scheduled":
        return { color: "bg-blue-100 text-blue-700", icon: Calendar };
      case "paused":
        return { color: "bg-amber-100 text-amber-700", icon: Pause };
      case "completed":
        return { color: "bg-gray-100 text-gray-700", icon: CheckCircle };
      case "cancelled":
        return { color: "bg-red-100 text-red-700", icon: XCircle };
      case "draft":
        return { color: "bg-gray-100 text-gray-600", icon: Edit2 };
    }
  };

  const getTypeBadge = (type: CampaignType) => {
    switch (type) {
      case "predictive":
        return "bg-purple-100 text-purple-700";
      case "progressive":
        return "bg-blue-100 text-blue-700";
      case "preview":
        return "bg-green-100 text-green-700";
      case "manual":
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch =
      searchQuery === "" ||
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalContacts = mockCampaigns.reduce((sum, c) => sum + c.totalContacts, 0);
  const totalReached = mockCampaigns.reduce((sum, c) => sum + c.contactsReached, 0);
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active").length;
  const avgConnectRate =
    mockCampaigns.filter((c) => c.connectRate > 0).reduce((sum, c) => sum + c.connectRate, 0) /
      mockCampaigns.filter((c) => c.connectRate > 0).length || 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-blue-600" />
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {activeCampaigns} Active
            </span>
          </div>
          <p className="text-sm text-gray-500">Total Campaigns</p>
          <p className="text-3xl font-bold text-gray-900">{mockCampaigns.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="h-4 w-4" />
              +8%
            </div>
          </div>
          <p className="text-sm text-gray-500">Contacts Reached</p>
          <p className="text-3xl font-bold text-gray-900">
            {totalReached.toLocaleString()}
            <span className="text-sm text-gray-500 font-normal">
              /{totalContacts.toLocaleString()}
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <PhoneOutgoing className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Connect Rate</p>
          <p className="text-3xl font-bold text-gray-900">{avgConnectRate.toFixed(1)}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Avg Conversion</p>
          <p className="text-3xl font-bold text-gray-900">
            {(
              mockCampaigns.filter((c) => c.conversionRate > 0).reduce((sum, c) => sum + c.conversionRate, 0) /
                mockCampaigns.filter((c) => c.conversionRate > 0).length || 0
            ).toFixed(1)}
            %
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
            {activeTab === "campaigns" && (
              <motion.div
                key="campaigns"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | "all")}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    New Campaign
                  </button>
                </div>

                {/* Campaigns List */}
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => {
                    const statusBadge = getStatusBadge(campaign.status);
                    const StatusIcon = statusBadge.icon;
                    const isExpanded = expandedCampaign === campaign.id;
                    const progress =
                      (campaign.contactsReached / campaign.totalContacts) * 100;

                    return (
                      <div
                        key={campaign.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() =>
                            setExpandedCampaign(isExpanded ? null : campaign.id)
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                                <span
                                  className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                    statusBadge.color
                                  )}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {campaign.status}
                                </span>
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                    getTypeBadge(campaign.type)
                                  )}
                                >
                                  {campaign.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mb-3">{campaign.description}</p>

                              {/* Progress bar */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-gray-500">Progress</span>
                                  <span className="text-gray-700 font-medium">
                                    {campaign.contactsReached.toLocaleString()} /{" "}
                                    {campaign.totalContacts.toLocaleString()} contacts
                                  </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full">
                                  <div
                                    className={cn(
                                      "h-2 rounded-full",
                                      campaign.status === "completed"
                                        ? "bg-gray-500"
                                        : campaign.status === "active"
                                          ? "bg-green-500"
                                          : "bg-blue-500"
                                    )}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-6 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {campaign.assignedAgents} agents
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {campaign.callerId}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {campaign.callingHours.start} - {campaign.callingHours.end}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Connect Rate</p>
                                <p
                                  className={cn(
                                    "text-lg font-semibold",
                                    campaign.connectRate >= 60
                                      ? "text-green-600"
                                      : campaign.connectRate >= 40
                                        ? "text-amber-600"
                                        : "text-red-600"
                                  )}
                                >
                                  {campaign.connectRate}%
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {campaign.status === "active" ? (
                                  <button className="p-2 hover:bg-amber-50 rounded-lg transition-colors">
                                    <Pause className="h-4 w-4 text-amber-600" />
                                  </button>
                                ) : campaign.status === "paused" ||
                                  campaign.status === "scheduled" ? (
                                  <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                                    <Play className="h-4 w-4 text-green-600" />
                                  </button>
                                ) : null}
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Settings className="h-4 w-4 text-gray-400" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Copy className="h-4 w-4 text-gray-400" />
                                </button>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-gray-200 bg-gray-50"
                            >
                              <div className="p-5">
                                <h4 className="font-medium text-gray-900 mb-4">Campaign Stats</h4>
                                <div className="grid grid-cols-6 gap-4">
                                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <PhoneOutgoing className="h-4 w-4 text-green-600" />
                                      <span className="text-xs text-gray-500">Successful</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                      {campaign.successfulCalls.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <PhoneMissed className="h-4 w-4 text-red-600" />
                                      <span className="text-xs text-gray-500">Failed</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                      {campaign.failedCalls.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Voicemail className="h-4 w-4 text-blue-600" />
                                      <span className="text-xs text-gray-500">Voicemails</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                      {campaign.voicemails.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Calendar className="h-4 w-4 text-purple-600" />
                                      <span className="text-xs text-gray-500">Callbacks</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                      {campaign.callbacksScheduled.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Clock className="h-4 w-4 text-amber-600" />
                                      <span className="text-xs text-gray-500">Avg Duration</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                      {formatDuration(campaign.averageCallDuration)}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Target className="h-4 w-4 text-green-600" />
                                      <span className="text-xs text-gray-500">Conversion</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                      {campaign.conversionRate}%
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                  <div className="text-sm text-gray-500">
                                    <span>Max attempts: {campaign.maxAttemptsPerContact}</span>
                                    <span className="mx-2">•</span>
                                    <span>Retry interval: {campaign.retryInterval}h</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors">
                                      <Upload className="h-4 w-4" />
                                      Import Contacts
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors">
                                      <Download className="h-4 w-4" />
                                      Export Results
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors">
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Overall Stats */}
                <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Campaign Performance Overview</h3>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Total Calls Made</p>
                      <p className="text-2xl font-bold">
                        {mockCampaigns
                          .reduce(
                            (sum, c) => sum + c.successfulCalls + c.failedCalls + c.voicemails,
                            0
                          )
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Successful Connections</p>
                      <p className="text-2xl font-bold">
                        {mockCampaigns.reduce((sum, c) => sum + c.successfulCalls, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Voicemails Left</p>
                      <p className="text-2xl font-bold">
                        {mockCampaigns.reduce((sum, c) => sum + c.voicemails, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Callbacks Scheduled</p>
                      <p className="text-2xl font-bold">
                        {mockCampaigns
                          .reduce((sum, c) => sum + c.callbacksScheduled, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Active Agents</p>
                      <p className="text-2xl font-bold">
                        {mockCampaigns
                          .filter((c) => c.status === "active")
                          .reduce((sum, c) => sum + c.assignedAgents, 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Campaign Comparison */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Comparison</h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Campaign
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Total Contacts
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Reached
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Connect Rate
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Conversion
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Avg Call
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockCampaigns.map((campaign) => (
                          <tr key={campaign.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{campaign.name}</span>
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                    getStatusBadge(campaign.status).color
                                  )}
                                >
                                  {campaign.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {campaign.totalContacts.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {campaign.contactsReached.toLocaleString()} (
                              {((campaign.contactsReached / campaign.totalContacts) * 100).toFixed(0)}
                              %)
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "font-semibold",
                                  campaign.connectRate >= 60
                                    ? "text-green-600"
                                    : campaign.connectRate >= 40
                                      ? "text-amber-600"
                                      : "text-red-600"
                                )}
                              >
                                {campaign.connectRate}%
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "font-semibold",
                                  campaign.conversionRate >= 20
                                    ? "text-green-600"
                                    : campaign.conversionRate >= 10
                                      ? "text-amber-600"
                                      : "text-red-600"
                                )}
                              >
                                {campaign.conversionRate}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {formatDuration(campaign.averageCallDuration)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

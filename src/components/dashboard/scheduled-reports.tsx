"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileBarChart,
  Plus,
  Clock,
  Mail,
  Calendar,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Edit2,
  Send,
  Download,
  Phone,
  MessageSquare,
  Users,
  DollarSign,
  Bot,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type ReportType = "calls" | "sms" | "billing" | "agents" | "ai" | "usage";
type Frequency = "daily" | "weekly" | "monthly" | "quarterly";

type ScheduledReport = {
  id: string;
  name: string;
  type: ReportType;
  frequency: Frequency;
  recipients: string[];
  nextRun: string;
  lastRun?: string;
  lastStatus?: "success" | "failed";
  isActive: boolean;
  format: "pdf" | "csv" | "excel";
  createdAt: string;
};

const mockReports: ScheduledReport[] = [
  {
    id: "rpt_1",
    name: "Weekly Call Summary",
    type: "calls",
    frequency: "weekly",
    recipients: ["admin@company.com", "manager@company.com"],
    nextRun: new Date(Date.now() + 259200000).toISOString(),
    lastRun: new Date(Date.now() - 604800000).toISOString(),
    lastStatus: "success",
    isActive: true,
    format: "pdf",
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    id: "rpt_2",
    name: "Monthly Billing Report",
    type: "billing",
    frequency: "monthly",
    recipients: ["finance@company.com"],
    nextRun: new Date(Date.now() + 1209600000).toISOString(),
    lastRun: new Date(Date.now() - 2592000000).toISOString(),
    lastStatus: "success",
    isActive: true,
    format: "excel",
    createdAt: new Date(Date.now() - 7776000000).toISOString(),
  },
  {
    id: "rpt_3",
    name: "Daily Agent Performance",
    type: "agents",
    frequency: "daily",
    recipients: ["supervisor@company.com"],
    nextRun: new Date(Date.now() + 43200000).toISOString(),
    lastRun: new Date(Date.now() - 86400000).toISOString(),
    lastStatus: "success",
    isActive: true,
    format: "pdf",
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "rpt_4",
    name: "SMS Usage Report",
    type: "sms",
    frequency: "weekly",
    recipients: ["admin@company.com"],
    nextRun: new Date(Date.now() + 345600000).toISOString(),
    lastRun: new Date(Date.now() - 604800000).toISOString(),
    lastStatus: "failed",
    isActive: false,
    format: "csv",
    createdAt: new Date(Date.now() - 1296000000).toISOString(),
  },
  {
    id: "rpt_5",
    name: "AI Receptionist Analytics",
    type: "ai",
    frequency: "monthly",
    recipients: ["tech@company.com", "admin@company.com"],
    nextRun: new Date(Date.now() + 604800000).toISOString(),
    isActive: true,
    format: "pdf",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

const reportTypes: { value: ReportType; label: string; icon: React.ElementType }[] = [
  { value: "calls", label: "Call Analytics", icon: Phone },
  { value: "sms", label: "SMS Usage", icon: MessageSquare },
  { value: "billing", label: "Billing", icon: DollarSign },
  { value: "agents", label: "Agent Performance", icon: Users },
  { value: "ai", label: "AI Receptionist", icon: Bot },
  { value: "usage", label: "Usage Summary", icon: FileBarChart },
];

const frequencies: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

const getReportIcon = (type: ReportType) => {
  const found = reportTypes.find((t) => t.value === type);
  return found?.icon || FileBarChart;
};

const getFrequencyBadge = (frequency: Frequency) => {
  const colors: Record<Frequency, string> = {
    daily: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    weekly: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    monthly: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    quarterly: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };
  return <Badge className={colors[frequency]}>{frequency.charAt(0).toUpperCase() + frequency.slice(1)}</Badge>;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ScheduledReports() {
  const [reports, setReports] = useState(mockReports);
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");
  const [showNewReport, setShowNewReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const filteredReports = reports.filter((report) => {
    if (filter === "active") return report.isActive;
    if (filter === "paused") return !report.isActive;
    return true;
  });

  const toggleReport = (id: string) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
    setSelectedReport(null);
  };

  const stats = {
    total: reports.length,
    active: reports.filter((r) => r.isActive).length,
    failed: reports.filter((r) => r.lastStatus === "failed").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <FileBarChart className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Reports</p>
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
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
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
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Failed</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.failed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(["all", "active", "paused"] as const).map((f) => (
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
        <Button className="btn-primary gap-2" onClick={() => setShowNewReport(true)}>
          <Plus className="h-4 w-4" />
          New Report
        </Button>
      </div>

      {/* Reports List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-gray-800">
            {filteredReports.length === 0 ? (
              <div className="p-12 text-center">
                <FileBarChart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No scheduled reports found</p>
              </div>
            ) : (
              filteredReports.map((report, i) => {
                const Icon = getReportIcon(report.type);
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        report.isActive
                          ? "bg-[#FDF8E8] dark:bg-[#C9A227]/20"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          report.isActive
                            ? "text-[#C9A227]"
                            : "text-gray-400"
                        }`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#1E3A5F] dark:text-white">
                            {report.name}
                          </span>
                          {getFrequencyBadge(report.frequency)}
                          {!report.isActive && (
                            <Badge variant="outline" className="text-gray-500">Paused</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {report.recipients.length} recipient{report.recipients.length !== 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Next: {formatDate(report.nextRun)}
                          </span>
                          {report.lastRun && (
                            <span className="flex items-center gap-1">
                              {report.lastStatus === "success" ? (
                                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                              )}
                              Last: {formatDate(report.lastRun)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Format Badge */}
                      <Badge variant="outline" className="uppercase text-xs">
                        {report.format}
                      </Badge>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReport(report.id)}
                          title={report.isActive ? "Pause" : "Resume"}
                        >
                          {report.isActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" title="Send Now">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          {selectedReport === report.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-10">
                              <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                <Edit2 className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => deleteReport(report.id)}
                                className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Report Dialog */}
      {showNewReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Create Scheduled Report
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Name</label>
                    <Input placeholder="e.g., Weekly Call Summary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {reportTypes.map((type) => (
                        <button
                          key={type.value}
                          className="p-3 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-center"
                        >
                          <type.icon className="h-5 w-5 mx-auto mb-1 text-[#1E3A5F] dark:text-white" />
                          <span className="text-xs">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <div className="grid grid-cols-4 gap-2">
                      {frequencies.map((freq) => (
                        <button
                          key={freq.value}
                          className="p-2 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-sm"
                        >
                          {freq.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipients</label>
                    <Input placeholder="email@example.com (comma-separated)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <div className="flex gap-2">
                      {["pdf", "csv", "excel"].map((fmt) => (
                        <button
                          key={fmt}
                          className="px-4 py-2 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-sm uppercase"
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowNewReport(false)}>Cancel</Button>
                  <Button className="btn-primary">Create Report</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

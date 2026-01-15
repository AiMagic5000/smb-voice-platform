"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Webhook,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WebhookStatus = "success" | "failed" | "pending" | "retrying";
type WebhookEvent =
  | "call.started"
  | "call.ended"
  | "call.missed"
  | "sms.received"
  | "sms.sent"
  | "voicemail.new"
  | "recording.ready";

interface WebhookLog {
  id: string;
  event: WebhookEvent;
  endpoint: string;
  status: WebhookStatus;
  statusCode?: number;
  timestamp: Date;
  duration: number;
  requestBody: object;
  responseBody?: object;
  error?: string;
  retryCount: number;
}

interface WebhookLogsProps {
  logs?: WebhookLog[];
  onRefresh?: () => void;
  onRetry?: (id: string) => void;
  className?: string;
}

const sampleLogs: WebhookLog[] = [
  {
    id: "1",
    event: "call.ended",
    endpoint: "https://api.example.com/webhooks/calls",
    status: "success",
    statusCode: 200,
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    duration: 145,
    requestBody: {
      event: "call.ended",
      call_id: "call_abc123",
      from: "+15551234567",
      to: "+15559876543",
      duration: 342,
      recording_url: "https://recordings.example.com/abc123.mp3",
    },
    responseBody: { status: "received" },
    retryCount: 0,
  },
  {
    id: "2",
    event: "sms.received",
    endpoint: "https://api.example.com/webhooks/sms",
    status: "success",
    statusCode: 200,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    duration: 89,
    requestBody: {
      event: "sms.received",
      from: "+15551234567",
      to: "+15559876543",
      body: "Thanks for the follow-up!",
    },
    responseBody: { processed: true },
    retryCount: 0,
  },
  {
    id: "3",
    event: "voicemail.new",
    endpoint: "https://api.example.com/webhooks/voicemail",
    status: "failed",
    statusCode: 500,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    duration: 2500,
    requestBody: {
      event: "voicemail.new",
      voicemail_id: "vm_xyz789",
      from: "+15553334444",
      duration: 45,
      transcription: "Hi, this is about the appointment...",
    },
    error: "Internal Server Error: Database connection timeout",
    retryCount: 2,
  },
  {
    id: "4",
    event: "call.started",
    endpoint: "https://api.example.com/webhooks/calls",
    status: "retrying",
    statusCode: 503,
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    duration: 30000,
    requestBody: {
      event: "call.started",
      call_id: "call_def456",
      from: "+15555556666",
      to: "+15557778888",
    },
    error: "Service Unavailable",
    retryCount: 1,
  },
  {
    id: "5",
    event: "recording.ready",
    endpoint: "https://api.example.com/webhooks/recordings",
    status: "success",
    statusCode: 200,
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    duration: 234,
    requestBody: {
      event: "recording.ready",
      recording_id: "rec_ghi012",
      call_id: "call_abc123",
      url: "https://recordings.example.com/ghi012.mp3",
      duration: 342,
    },
    responseBody: { stored: true, location: "s3://bucket/recordings/ghi012.mp3" },
    retryCount: 0,
  },
  {
    id: "6",
    event: "sms.sent",
    endpoint: "https://api.example.com/webhooks/sms",
    status: "pending",
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    duration: 0,
    requestBody: {
      event: "sms.sent",
      to: "+15551112222",
      body: "Your appointment is confirmed for tomorrow at 2pm.",
    },
    retryCount: 0,
  },
];

const eventLabels: Record<WebhookEvent, string> = {
  "call.started": "Call Started",
  "call.ended": "Call Ended",
  "call.missed": "Call Missed",
  "sms.received": "SMS Received",
  "sms.sent": "SMS Sent",
  "voicemail.new": "New Voicemail",
  "recording.ready": "Recording Ready",
};

const eventColors: Record<WebhookEvent, string> = {
  "call.started": "bg-blue-100 text-blue-700",
  "call.ended": "bg-green-100 text-green-700",
  "call.missed": "bg-red-100 text-red-700",
  "sms.received": "bg-purple-100 text-purple-700",
  "sms.sent": "bg-indigo-100 text-indigo-700",
  "voicemail.new": "bg-yellow-100 text-yellow-700",
  "recording.ready": "bg-teal-100 text-teal-700",
};

const statusConfig: Record<
  WebhookStatus,
  { icon: typeof CheckCircle; color: string; bgColor: string; label: string }
> = {
  success: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    label: "Success",
  },
  failed: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    label: "Failed",
  },
  pending: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    label: "Pending",
  },
  retrying: {
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    label: "Retrying",
  },
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

function formatDuration(ms: number): string {
  if (ms === 0) return "-";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export function WebhookLogs({
  logs: initialLogs = sampleLogs,
  onRefresh,
  onRetry,
  className,
}: WebhookLogsProps) {
  const [logs] = useState(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<WebhookStatus | "all">("all");
  const [filterEvent, setFilterEvent] = useState<WebhookEvent | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filterStatus !== "all" && log.status !== filterStatus) return false;
      if (filterEvent !== "all" && log.event !== filterEvent) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.endpoint.toLowerCase().includes(query) ||
          log.event.toLowerCase().includes(query) ||
          JSON.stringify(log.requestBody).toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [logs, filterStatus, filterEvent, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: logs.length,
      success: logs.filter((l) => l.status === "success").length,
      failed: logs.filter((l) => l.status === "failed").length,
      pending: logs.filter((l) => l.status === "pending" || l.status === "retrying").length,
    };
  }, [logs]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E3A5F] flex items-center gap-2">
            <Webhook className="h-7 w-7" />
            Webhook Logs
          </h2>
          <p className="text-gray-500 mt-1">
            Monitor webhook deliveries and debug issues
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#1E3A5F]">{stats.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.success}</p>
            <p className="text-sm text-gray-500">Success</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-sm text-gray-500">Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as WebhookStatus | "all")}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="retrying">Retrying</option>
            </select>
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value as WebhookEvent | "all")}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
            >
              <option value="all">All Events</option>
              {Object.entries(eventLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const status = statusConfig[log.status];
                const StatusIcon = status.icon;
                const isExpanded = expandedId === log.id;

                return (
                  <div key={log.id}>
                    {/* Log Header */}
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    >
                      {/* Expand Icon */}
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}

                      {/* Status */}
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          status.bgColor,
                          status.color
                        )}
                      >
                        <StatusIcon className="h-4 w-4" />
                      </div>

                      {/* Event */}
                      <span
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-full",
                          eventColors[log.event]
                        )}
                      >
                        {eventLabels[log.event]}
                      </span>

                      {/* Endpoint */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1E3A5F] truncate">
                          {log.endpoint}
                        </p>
                        {log.error && (
                          <p className="text-xs text-red-500 truncate mt-0.5">
                            {log.error}
                          </p>
                        )}
                      </div>

                      {/* Status Code */}
                      {log.statusCode && (
                        <span
                          className={cn(
                            "text-sm font-mono",
                            log.statusCode >= 200 && log.statusCode < 300
                              ? "text-green-600"
                              : log.statusCode >= 400
                              ? "text-red-600"
                              : "text-yellow-600"
                          )}
                        >
                          {log.statusCode}
                        </span>
                      )}

                      {/* Duration */}
                      <span className="text-sm text-gray-500 w-16 text-right">
                        {formatDuration(log.duration)}
                      </span>

                      {/* Time */}
                      <span className="text-sm text-gray-400 w-20 text-right">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 space-y-4">
                            <div className="grid lg:grid-cols-2 gap-4">
                              {/* Request */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Request Body
                                  </h4>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        JSON.stringify(log.requestBody, null, 2)
                                      )
                                    }
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    title="Copy"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </button>
                                </div>
                                <pre className="p-3 bg-gray-900 text-gray-100 rounded-xl text-xs overflow-x-auto">
                                  {JSON.stringify(log.requestBody, null, 2)}
                                </pre>
                              </div>

                              {/* Response */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Response Body
                                  </h4>
                                  {log.responseBody && (
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          JSON.stringify(log.responseBody, null, 2)
                                        )
                                      }
                                      className="p-1 text-gray-400 hover:text-gray-600"
                                      title="Copy"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                                <pre className="p-3 bg-gray-900 text-gray-100 rounded-xl text-xs overflow-x-auto">
                                  {log.responseBody
                                    ? JSON.stringify(log.responseBody, null, 2)
                                    : log.error || "No response"}
                                </pre>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="text-sm text-gray-500">
                                {log.retryCount > 0 && (
                                  <span>Retry attempts: {log.retryCount}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {log.status === "failed" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() => onRetry?.(log.id)}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                    Retry
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => window.open(log.endpoint, "_blank")}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Open Endpoint
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Webhook className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No webhook logs found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery || filterStatus !== "all" || filterEvent !== "all"
                    ? "Try adjusting your filters"
                    : "Webhook events will appear here"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WebhookLogs;

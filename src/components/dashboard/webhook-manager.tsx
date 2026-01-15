"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Webhook,
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Eye,
  EyeOff,
  Play,
  Pause,
  Send,
  Activity,
  Lock,
  Unlock,
  ExternalLink,
  Code,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WebhookStatus = "active" | "paused" | "failed" | "disabled";
type EventType =
  | "call.started"
  | "call.ended"
  | "call.missed"
  | "call.transferred"
  | "voicemail.received"
  | "sms.received"
  | "sms.sent"
  | "contact.created"
  | "contact.updated"
  | "fax.received"
  | "recording.ready";

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: EventType[];
  status: WebhookStatus;
  retryEnabled: boolean;
  maxRetries: number;
  timeoutMs: number;
  createdAt: string;
  lastTriggered: string | null;
  successRate: number;
  totalDeliveries: number;
  failedDeliveries: number;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: EventType;
  status: "success" | "failed" | "pending" | "retrying";
  statusCode: number | null;
  requestBody: string;
  responseBody: string | null;
  latencyMs: number | null;
  attempts: number;
  timestamp: string;
  errorMessage: string | null;
}

const eventOptions: { value: EventType; label: string; description: string }[] = [
  { value: "call.started", label: "Call Started", description: "When a call begins" },
  { value: "call.ended", label: "Call Ended", description: "When a call completes" },
  { value: "call.missed", label: "Call Missed", description: "When a call is missed" },
  { value: "call.transferred", label: "Call Transferred", description: "When a call is transferred" },
  { value: "voicemail.received", label: "Voicemail Received", description: "When a voicemail is left" },
  { value: "sms.received", label: "SMS Received", description: "When an SMS is received" },
  { value: "sms.sent", label: "SMS Sent", description: "When an SMS is sent" },
  { value: "contact.created", label: "Contact Created", description: "When a contact is added" },
  { value: "contact.updated", label: "Contact Updated", description: "When a contact is modified" },
  { value: "fax.received", label: "Fax Received", description: "When a fax arrives" },
  { value: "recording.ready", label: "Recording Ready", description: "When a recording is available" },
];

const mockWebhooks: WebhookEndpoint[] = [
  {
    id: "1",
    name: "CRM Integration",
    url: "https://api.example-crm.com/webhooks/calls",
    secret: "whsec_abc123def456ghi789",
    events: ["call.started", "call.ended", "voicemail.received"],
    status: "active",
    retryEnabled: true,
    maxRetries: 3,
    timeoutMs: 30000,
    createdAt: "2024-01-01T10:00:00Z",
    lastTriggered: "2024-01-15T14:30:00Z",
    successRate: 98.5,
    totalDeliveries: 1247,
    failedDeliveries: 19,
  },
  {
    id: "2",
    name: "Analytics Pipeline",
    url: "https://analytics.internal.com/ingest/voip",
    secret: "whsec_xyz789abc123def456",
    events: ["call.ended", "sms.received", "sms.sent"],
    status: "active",
    retryEnabled: true,
    maxRetries: 5,
    timeoutMs: 60000,
    createdAt: "2024-01-05T08:00:00Z",
    lastTriggered: "2024-01-15T14:28:00Z",
    successRate: 99.8,
    totalDeliveries: 3456,
    failedDeliveries: 7,
  },
  {
    id: "3",
    name: "Slack Notifications",
    url: "https://hooks.slack.com/services/T00/B00/xxx",
    secret: "whsec_slack123456789",
    events: ["call.missed", "voicemail.received"],
    status: "paused",
    retryEnabled: false,
    maxRetries: 0,
    timeoutMs: 10000,
    createdAt: "2024-01-10T12:00:00Z",
    lastTriggered: "2024-01-12T09:15:00Z",
    successRate: 95.0,
    totalDeliveries: 234,
    failedDeliveries: 12,
  },
  {
    id: "4",
    name: "Backup System",
    url: "https://backup.company.com/api/events",
    secret: "whsec_backup_secret_key",
    events: ["recording.ready", "fax.received"],
    status: "failed",
    retryEnabled: true,
    maxRetries: 3,
    timeoutMs: 45000,
    createdAt: "2024-01-08T15:00:00Z",
    lastTriggered: "2024-01-14T16:00:00Z",
    successRate: 45.0,
    totalDeliveries: 100,
    failedDeliveries: 55,
  },
];

const mockDeliveries: WebhookDelivery[] = [
  {
    id: "1",
    webhookId: "1",
    event: "call.ended",
    status: "success",
    statusCode: 200,
    requestBody: '{"event":"call.ended","callId":"call_123","duration":245}',
    responseBody: '{"received":true}',
    latencyMs: 145,
    attempts: 1,
    timestamp: "2024-01-15T14:30:00Z",
    errorMessage: null,
  },
  {
    id: "2",
    webhookId: "1",
    event: "voicemail.received",
    status: "success",
    statusCode: 200,
    requestBody: '{"event":"voicemail.received","vmId":"vm_456"}',
    responseBody: '{"processed":true}',
    latencyMs: 89,
    attempts: 1,
    timestamp: "2024-01-15T14:25:00Z",
    errorMessage: null,
  },
  {
    id: "3",
    webhookId: "4",
    event: "recording.ready",
    status: "failed",
    statusCode: 503,
    requestBody: '{"event":"recording.ready","recordingId":"rec_789"}',
    responseBody: '{"error":"Service unavailable"}',
    latencyMs: 30125,
    attempts: 3,
    timestamp: "2024-01-14T16:00:00Z",
    errorMessage: "Connection timeout after 30000ms",
  },
  {
    id: "4",
    webhookId: "2",
    event: "sms.received",
    status: "success",
    statusCode: 200,
    requestBody: '{"event":"sms.received","messageId":"msg_101"}',
    responseBody: '{"ok":true}',
    latencyMs: 234,
    attempts: 1,
    timestamp: "2024-01-15T14:28:00Z",
    errorMessage: null,
  },
];

export function WebhookManager() {
  const [activeTab, setActiveTab] = useState<"endpoints" | "deliveries" | "logs">("endpoints");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);

  const tabs = [
    { id: "endpoints", label: "Endpoints", icon: Webhook },
    { id: "deliveries", label: "Recent Deliveries", icon: Send },
    { id: "logs", label: "Activity Log", icon: Activity },
  ] as const;

  const getStatusBadge = (status: WebhookStatus) => {
    switch (status) {
      case "active":
        return { color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "paused":
        return { color: "bg-amber-100 text-amber-700", icon: Pause };
      case "failed":
        return { color: "bg-red-100 text-red-700", icon: XCircle };
      case "disabled":
        return { color: "bg-gray-100 text-gray-700", icon: EyeOff };
    }
  };

  const getDeliveryStatusBadge = (status: WebhookDelivery["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      case "retrying":
        return "bg-amber-100 text-amber-700";
    }
  };

  const toggleSecret = (id: string) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalDeliveries = mockWebhooks.reduce((sum, w) => sum + w.totalDeliveries, 0);
  const avgSuccessRate =
    mockWebhooks.reduce((sum, w) => sum + w.successRate * w.totalDeliveries, 0) / totalDeliveries;
  const activeEndpoints = mockWebhooks.filter((w) => w.status === "active").length;
  const failedEndpoints = mockWebhooks.filter((w) => w.status === "failed").length;

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
              <Webhook className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Endpoints</p>
          <p className="text-3xl font-bold text-gray-900">{mockWebhooks.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {activeEndpoints} Active
            </span>
          </div>
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-3xl font-bold text-gray-900">{avgSuccessRate.toFixed(1)}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Send className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Deliveries</p>
          <p className="text-3xl font-bold text-gray-900">{totalDeliveries.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            {failedEndpoints > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                {failedEndpoints} Issues
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">Failed Deliveries</p>
          <p className="text-3xl font-bold text-gray-900">
            {mockWebhooks.reduce((sum, w) => sum + w.failedDeliveries, 0)}
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
            {activeTab === "endpoints" && (
              <motion.div
                key="endpoints"
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
                        placeholder="Search webhooks..."
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
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Endpoint
                  </button>
                </div>

                {/* Webhooks List */}
                <div className="space-y-4">
                  {mockWebhooks.map((webhook) => {
                    const statusBadge = getStatusBadge(webhook.status);
                    const StatusIcon = statusBadge.icon;
                    return (
                      <div
                        key={webhook.id}
                        className="border border-gray-200 rounded-xl p-5 hover:border-[#1E3A5F]/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                              <span
                                className={cn(
                                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                                  statusBadge.color
                                )}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {webhook.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                {webhook.url}
                              </code>
                              <button
                                onClick={() => copyToClipboard(webhook.url)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {webhook.events.map((event) => (
                                <span
                                  key={event}
                                  className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                                >
                                  {event}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {webhook.status === "active" ? (
                              <button className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-amber-600">
                                <Pause className="h-4 w-4" />
                              </button>
                            ) : (
                              <button className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600">
                                <Play className="h-4 w-4" />
                              </button>
                            )}
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit2 className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-5 gap-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500">Success Rate</p>
                            <p
                              className={cn(
                                "text-lg font-semibold",
                                webhook.successRate >= 95
                                  ? "text-green-600"
                                  : webhook.successRate >= 80
                                    ? "text-amber-600"
                                    : "text-red-600"
                              )}
                            >
                              {webhook.successRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Deliveries</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {webhook.totalDeliveries.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Failed</p>
                            <p
                              className={cn(
                                "text-lg font-semibold",
                                webhook.failedDeliveries > 0 ? "text-red-600" : "text-gray-900"
                              )}
                            >
                              {webhook.failedDeliveries}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Timeout</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {webhook.timeoutMs / 1000}s
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Last Triggered</p>
                            <p className="text-sm text-gray-700">
                              {webhook.lastTriggered
                                ? new Date(webhook.lastTriggered).toLocaleString()
                                : "Never"}
                            </p>
                          </div>
                        </div>

                        {/* Secret */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Signing Secret:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono flex-1">
                              {showSecrets[webhook.id] ? webhook.secret : "••••••••••••••••••••"}
                            </code>
                            <button
                              onClick={() => toggleSecret(webhook.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {showSecrets[webhook.id] ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(webhook.secret)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Copy className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "deliveries" && (
              <motion.div
                key="deliveries"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Deliveries List */}
                <div className="space-y-3">
                  {mockDeliveries.map((delivery) => {
                    const webhook = mockWebhooks.find((w) => w.id === delivery.webhookId);
                    const isExpanded = expandedDelivery === delivery.id;
                    return (
                      <div
                        key={delivery.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() =>
                            setExpandedDelivery(isExpanded ? null : delivery.id)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                  getDeliveryStatusBadge(delivery.status)
                                )}
                              >
                                {delivery.status}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">{webhook?.name}</p>
                                <p className="text-sm text-gray-500">{delivery.event}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Status Code</p>
                                <p
                                  className={cn(
                                    "font-semibold",
                                    delivery.statusCode &&
                                      delivery.statusCode >= 200 &&
                                      delivery.statusCode < 300
                                      ? "text-green-600"
                                      : "text-red-600"
                                  )}
                                >
                                  {delivery.statusCode || "N/A"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Latency</p>
                                <p className="font-semibold text-gray-900">
                                  {delivery.latencyMs ? `${delivery.latencyMs}ms` : "N/A"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="text-sm text-gray-700">
                                  {new Date(delivery.timestamp).toLocaleTimeString()}
                                </p>
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
                              <div className="p-4 space-y-4">
                                {delivery.errorMessage && (
                                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">
                                      <strong>Error:</strong> {delivery.errorMessage}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    Request Body
                                  </p>
                                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
                                    {JSON.stringify(JSON.parse(delivery.requestBody), null, 2)}
                                  </pre>
                                </div>
                                {delivery.responseBody && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                      Response Body
                                    </p>
                                    <pre className="bg-gray-900 text-blue-400 p-3 rounded-lg text-xs overflow-x-auto">
                                      {JSON.stringify(JSON.parse(delivery.responseBody), null, 2)}
                                    </pre>
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-2">
                                  <span className="text-xs text-gray-500">
                                    Attempts: {delivery.attempts}
                                  </span>
                                  {delivery.status === "failed" && (
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors">
                                      <RotateCcw className="h-4 w-4" />
                                      Retry
                                    </button>
                                  )}
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

            {activeTab === "logs" && (
              <motion.div
                key="logs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Activity log coming soon</p>
                  <p className="text-sm text-gray-400">
                    Track all webhook configuration changes and events
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Event Types Reference */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Event Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {eventOptions.map((event) => (
            <div
              key={event.value}
              className="p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <code className="text-xs font-mono text-[#1E3A5F]">{event.value}</code>
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Bell,
  Phone,
  MessageSquare,
  Mail,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  History,
  Plus,
  Send,
  Volume2,
  AlertOctagon,
  Info,
  AlertCircle,
  Megaphone,
} from "lucide-react";

type NotificationPriority = "critical" | "high" | "medium" | "low";
type NotificationStatus = "sent" | "sending" | "failed" | "draft";
type NotificationChannel = "sms" | "call" | "email" | "all";

type EmergencyNotification = {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  channel: NotificationChannel;
  sentAt?: string;
  recipientCount: number;
  deliveredCount: number;
  failedCount: number;
  createdBy: string;
};

const mockNotifications: EmergencyNotification[] = [
  {
    id: "emg_1",
    title: "Office Closure - Weather Emergency",
    message: "Due to severe weather conditions, the office will be closed today. Please work remotely if possible.",
    priority: "critical",
    status: "sent",
    channel: "all",
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    recipientCount: 45,
    deliveredCount: 44,
    failedCount: 1,
    createdBy: "admin@company.com",
  },
  {
    id: "emg_2",
    title: "System Maintenance Notice",
    message: "Phone systems will undergo maintenance tonight from 11 PM - 1 AM. Expect brief outages.",
    priority: "high",
    status: "sent",
    channel: "sms",
    sentAt: new Date(Date.now() - 259200000).toISOString(),
    recipientCount: 45,
    deliveredCount: 45,
    failedCount: 0,
    createdBy: "it@company.com",
  },
  {
    id: "emg_3",
    title: "Security Alert",
    message: "Please be aware of phishing attempts targeting our company. Do not click suspicious links.",
    priority: "high",
    status: "sent",
    channel: "email",
    sentAt: new Date(Date.now() - 604800000).toISOString(),
    recipientCount: 45,
    deliveredCount: 42,
    failedCount: 3,
    createdBy: "security@company.com",
  },
  {
    id: "emg_4",
    title: "Quarterly Meeting Reminder",
    message: "Reminder: All-hands meeting tomorrow at 2 PM in the main conference room.",
    priority: "medium",
    status: "sent",
    channel: "sms",
    sentAt: new Date(Date.now() - 1209600000).toISOString(),
    recipientCount: 45,
    deliveredCount: 45,
    failedCount: 0,
    createdBy: "hr@company.com",
  },
];

const getPriorityIcon = (priority: NotificationPriority) => {
  switch (priority) {
    case "critical":
      return <AlertOctagon className="h-5 w-5 text-red-500" />;
    case "high":
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case "medium":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case "low":
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getPriorityBadge = (priority: NotificationPriority) => {
  const colors: Record<NotificationPriority, string> = {
    critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };
  return <Badge className={colors[priority]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>;
};

const getChannelIcon = (channel: NotificationChannel) => {
  switch (channel) {
    case "sms":
      return <MessageSquare className="h-4 w-4" />;
    case "call":
      return <Phone className="h-4 w-4" />;
    case "email":
      return <Mail className="h-4 w-4" />;
    case "all":
      return <Megaphone className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: NotificationStatus) => {
  switch (status) {
    case "sent":
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Sent</Badge>;
    case "sending":
      return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Sending</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>;
    case "draft":
      return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Draft</Badge>;
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function EmergencyNotifications() {
  const [notifications] = useState(mockNotifications);
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<NotificationPriority>("high");
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel>("all");

  const stats = {
    total: notifications.length,
    delivered: notifications.reduce((acc, n) => acc + n.deliveredCount, 0),
    failed: notifications.reduce((acc, n) => acc + n.failedCount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Quick Alert Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-red-600 to-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <AlertOctagon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Emergency Broadcast</h3>
                  <p className="text-white/80">Instantly notify all team members via multiple channels</p>
                </div>
              </div>
              <Button
                onClick={() => setShowNewAlert(true)}
                className="bg-white text-red-600 hover:bg-white/90 gap-2"
              >
                <Bell className="h-4 w-4" />
                Send Alert
              </Button>
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
                  <Bell className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Alerts</p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Delivered</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.delivered}</p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Failed</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.failed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Notifications
            </h3>
          </div>
          <div className="space-y-3">
            {notifications.map((notification, i) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    notification.priority === "critical" ? "bg-red-100 dark:bg-red-900/30" :
                    notification.priority === "high" ? "bg-orange-100 dark:bg-orange-900/30" :
                    notification.priority === "medium" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                    "bg-blue-100 dark:bg-blue-900/30"
                  }`}>
                    {getPriorityIcon(notification.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#1E3A5F] dark:text-white">
                        {notification.title}
                      </span>
                      {getPriorityBadge(notification.priority)}
                      {getStatusBadge(notification.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {getChannelIcon(notification.channel)}
                        {notification.channel === "all" ? "All Channels" : notification.channel.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {notification.deliveredCount}/{notification.recipientCount} delivered
                      </span>
                      {notification.sentAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(notification.sentAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">
            Quick Templates
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { title: "Office Closure", icon: AlertTriangle, color: "red" },
              { title: "System Maintenance", icon: Clock, color: "yellow" },
              { title: "Security Alert", icon: AlertOctagon, color: "orange" },
            ].map((template) => (
              <button
                key={template.title}
                onClick={() => setShowNewAlert(true)}
                className={`p-4 rounded-xl border dark:border-gray-700 hover:border-${template.color}-500 hover:bg-${template.color}-50 dark:hover:bg-${template.color}-900/10 transition-colors text-left`}
              >
                <template.icon className={`h-6 w-6 text-${template.color}-500 mb-2`} />
                <p className="font-medium text-[#1E3A5F] dark:text-white">{template.title}</p>
                <p className="text-xs text-gray-500">Click to send</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Alert Dialog */}
      {showNewAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-2xl mx-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertOctagon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                      Send Emergency Alert
                    </h2>
                    <p className="text-sm text-gray-500">Notify your team immediately</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Alert Title</label>
                    <Input placeholder="e.g., Office Closure Notice" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      className="w-full h-24 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 resize-none"
                      placeholder="Enter your emergency message..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["critical", "high", "medium", "low"] as NotificationPriority[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => setSelectedPriority(p)}
                          className={`p-3 rounded-lg border transition-colors ${
                            selectedPriority === p
                              ? p === "critical" ? "border-red-500 bg-red-50 dark:bg-red-900/20" :
                                p === "high" ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" :
                                p === "medium" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" :
                                "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <span className="text-sm font-medium capitalize">{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notification Channels</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: "all", label: "All", icon: Megaphone },
                        { value: "sms", label: "SMS", icon: MessageSquare },
                        { value: "call", label: "Voice", icon: Phone },
                        { value: "email", label: "Email", icon: Mail },
                      ].map((ch) => (
                        <button
                          key={ch.value}
                          onClick={() => setSelectedChannel(ch.value as NotificationChannel)}
                          className={`p-3 rounded-lg border transition-colors ${
                            selectedChannel === ch.value
                              ? "border-[#C9A227] bg-[#FDF8E8] dark:bg-[#C9A227]/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <ch.icon className="h-5 w-5 mx-auto mb-1" />
                          <span className="text-xs">{ch.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Recipients</label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        All Team (45)
                      </Button>
                      <Button variant="outline">Select Groups</Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Volume2 className="h-4 w-4" />
                    <span>45 recipients will be notified</span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowNewAlert(false)}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                      <Send className="h-4 w-4" />
                      Send Alert
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

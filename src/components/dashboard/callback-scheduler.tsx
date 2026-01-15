"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  PhoneCall,
  Clock,
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  MessageSquare,
  Trash2,
  Edit2,
  Play,
  RefreshCw,
  ArrowRight,
  Bell,
  Users,
} from "lucide-react";

type CallbackStatus = "scheduled" | "in_progress" | "completed" | "failed" | "cancelled";
type CallbackPriority = "low" | "normal" | "high" | "urgent";

type Callback = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  reason: string;
  notes?: string;
  scheduledTime: string;
  scheduledDate: string;
  assignedTo: string;
  status: CallbackStatus;
  priority: CallbackPriority;
  attempts: number;
  maxAttempts: number;
  lastAttempt?: string;
  source: "ivr" | "web_widget" | "manual" | "voicemail";
  createdAt: string;
};

const mockCallbacks: Callback[] = [
  {
    id: "cb_1",
    customerName: "John Smith",
    customerPhone: "+1 (555) 123-4567",
    customerEmail: "john@example.com",
    reason: "Product inquiry - Enterprise plan",
    notes: "Interested in 50+ seat deployment",
    scheduledTime: "10:00 AM",
    scheduledDate: "2024-01-15",
    assignedTo: "Michael Chen",
    status: "scheduled",
    priority: "high",
    attempts: 0,
    maxAttempts: 3,
    source: "web_widget",
    createdAt: "2024-01-14T14:30:00Z",
  },
  {
    id: "cb_2",
    customerName: "Sarah Johnson",
    customerPhone: "+1 (555) 234-5678",
    reason: "Technical support follow-up",
    scheduledTime: "11:30 AM",
    scheduledDate: "2024-01-15",
    assignedTo: "David Wilson",
    status: "in_progress",
    priority: "normal",
    attempts: 1,
    maxAttempts: 3,
    lastAttempt: "2024-01-15T11:32:00Z",
    source: "voicemail",
    createdAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "cb_3",
    customerName: "Robert Taylor",
    customerPhone: "+1 (555) 345-6789",
    reason: "Billing question",
    scheduledTime: "2:00 PM",
    scheduledDate: "2024-01-15",
    assignedTo: "Lisa Brown",
    status: "completed",
    priority: "low",
    attempts: 1,
    maxAttempts: 3,
    lastAttempt: "2024-01-15T14:05:00Z",
    source: "ivr",
    createdAt: "2024-01-14T16:20:00Z",
  },
  {
    id: "cb_4",
    customerName: "Emily Davis",
    customerPhone: "+1 (555) 456-7890",
    customerEmail: "emily@company.com",
    reason: "Account upgrade request",
    notes: "VIP customer - handle with care",
    scheduledTime: "3:30 PM",
    scheduledDate: "2024-01-15",
    assignedTo: "Michael Chen",
    status: "scheduled",
    priority: "urgent",
    attempts: 0,
    maxAttempts: 3,
    source: "manual",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "cb_5",
    customerName: "James Wilson",
    customerPhone: "+1 (555) 567-8901",
    reason: "Sales demo request",
    scheduledTime: "9:00 AM",
    scheduledDate: "2024-01-15",
    assignedTo: "Emily Davis",
    status: "failed",
    priority: "normal",
    attempts: 3,
    maxAttempts: 3,
    lastAttempt: "2024-01-15T09:45:00Z",
    source: "web_widget",
    createdAt: "2024-01-13T11:00:00Z",
  },
];

const getStatusIcon = (status: CallbackStatus) => {
  switch (status) {
    case "scheduled":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "in_progress":
      return <PhoneCall className="h-4 w-4 text-yellow-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusBadge = (status: CallbackStatus) => {
  const styles: Record<CallbackStatus, string> = {
    scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };
  return <Badge className={styles[status]}>{status.replace("_", " ")}</Badge>;
};

const getPriorityBadge = (priority: CallbackPriority) => {
  const styles: Record<CallbackPriority, string> = {
    low: "bg-gray-100 text-gray-600",
    normal: "bg-blue-100 text-blue-600",
    high: "bg-orange-100 text-orange-600",
    urgent: "bg-red-100 text-red-600",
  };
  return <Badge className={styles[priority]}>{priority}</Badge>;
};

const getSourceLabel = (source: Callback["source"]) => {
  const labels = {
    ivr: "IVR",
    web_widget: "Web Widget",
    manual: "Manual",
    voicemail: "Voicemail",
  };
  return labels[source];
};

export function CallbackScheduler() {
  const [callbacks, setCallbacks] = useState(mockCallbacks);
  const [filter, setFilter] = useState<CallbackStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCallback, setShowAddCallback] = useState(false);

  const filteredCallbacks = callbacks.filter((cb) => {
    const matchesFilter = filter === "all" || cb.status === filter;
    const matchesSearch =
      cb.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cb.customerPhone.includes(searchQuery) ||
      cb.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: callbacks.length,
    scheduled: callbacks.filter((cb) => cb.status === "scheduled").length,
    inProgress: callbacks.filter((cb) => cb.status === "in_progress").length,
    completed: callbacks.filter((cb) => cb.status === "completed").length,
    failed: callbacks.filter((cb) => cb.status === "failed").length,
  };

  const initiateCall = (callbackId: string) => {
    setCallbacks((cbs) =>
      cbs.map((cb) =>
        cb.id === callbackId
          ? { ...cb, status: "in_progress", attempts: cb.attempts + 1 }
          : cb
      )
    );
  };

  const markComplete = (callbackId: string) => {
    setCallbacks((cbs) =>
      cbs.map((cb) =>
        cb.id === callbackId ? { ...cb, status: "completed" } : cb
      )
    );
  };

  const reschedule = (callbackId: string) => {
    setCallbacks((cbs) =>
      cbs.map((cb) =>
        cb.id === callbackId ? { ...cb, status: "scheduled", attempts: 0 } : cb
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
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
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.scheduled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <PhoneCall className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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

      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search callbacks..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as CallbackStatus | "all")}
              className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <Button className="btn-primary gap-2" onClick={() => setShowAddCallback(true)}>
          <Plus className="h-4 w-4" />
          Schedule Callback
        </Button>
      </div>

      {/* Callbacks List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-gray-700">
            {filteredCallbacks.map((callback, i) => (
              <motion.div
                key={callback.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      callback.priority === "urgent"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : callback.priority === "high"
                        ? "bg-orange-100 dark:bg-orange-900/30"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}>
                      <User className={`h-6 w-6 ${
                        callback.priority === "urgent"
                          ? "text-red-600"
                          : callback.priority === "high"
                          ? "text-orange-600"
                          : "text-[#1E3A5F] dark:text-white"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[#1E3A5F] dark:text-white">
                          {callback.customerName}
                        </h4>
                        {getPriorityBadge(callback.priority)}
                        {getStatusBadge(callback.status)}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{callback.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {callback.customerPhone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {callback.scheduledDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {callback.scheduledTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {callback.assignedTo}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getSourceLabel(callback.source)}
                        </Badge>
                      </div>
                      {callback.notes && (
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {callback.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {callback.status === "scheduled" && (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => initiateCall(callback.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Call Now
                      </Button>
                    )}
                    {callback.status === "in_progress" && (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => markComplete(callback.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    {callback.status === "failed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reschedule(callback.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {callback.attempts > 0 && (
                  <div className="mt-3 pt-3 border-t dark:border-gray-700">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">
                        Attempts: {callback.attempts}/{callback.maxAttempts}
                      </span>
                      {callback.lastAttempt && (
                        <span className="text-gray-400">
                          Last attempt: {new Date(callback.lastAttempt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {filteredCallbacks.length === 0 && (
              <div className="p-12 text-center">
                <Phone className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No callbacks found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Callback Dialog */}
      {showAddCallback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Schedule Callback
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Customer Name</label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email (optional)</label>
                    <Input type="email" placeholder="customer@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reason for Callback</label>
                    <Input placeholder="Product inquiry, support, billing..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Time</label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Assign To</label>
                      <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                        <option>Michael Chen</option>
                        <option>David Wilson</option>
                        <option>Lisa Brown</option>
                        <option>Emily Davis</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                        <option value="low">Low</option>
                        <option value="normal" selected>Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      rows={3}
                      placeholder="Additional notes about this callback..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowAddCallback(false)}>Cancel</Button>
                  <Button className="btn-primary">Schedule Callback</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

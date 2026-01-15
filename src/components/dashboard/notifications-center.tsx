"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  BellOff,
  Phone,
  MessageSquare,
  Voicemail,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Settings,
  Trash2,
  CheckCheck,
  Filter,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  Monitor,
  Clock,
  RefreshCw,
} from "lucide-react";

interface Notification {
  id: string;
  type: "call" | "message" | "voicemail" | "alert" | "system" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationPreference {
  id: string;
  category: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  sound: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "call",
    title: "Missed Call",
    message: "You missed a call from +1 (555) 123-4567",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: "high",
    actionUrl: "/dashboard/calls",
    actionLabel: "View Call",
  },
  {
    id: "2",
    type: "voicemail",
    title: "New Voicemail",
    message: "You have a new voicemail (0:45) from John Smith",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: "medium",
    actionUrl: "/dashboard/voicemails",
    actionLabel: "Listen",
  },
  {
    id: "3",
    type: "alert",
    title: "High Call Volume",
    message: "Call queue wait time exceeds 5 minutes. Consider adding agents.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: "urgent",
    actionUrl: "/dashboard/queues",
    actionLabel: "Manage Queue",
  },
  {
    id: "4",
    type: "message",
    title: "New SMS",
    message: "New message from +1 (555) 987-6543: 'Thanks for the quick response!'",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: true,
    priority: "low",
    actionUrl: "/dashboard/messaging",
    actionLabel: "Reply",
  },
  {
    id: "5",
    type: "system",
    title: "System Update",
    message: "New features available: Outbound campaigns and call tags",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: "low",
  },
  {
    id: "6",
    type: "info",
    title: "Weekly Report Ready",
    message: "Your weekly call analytics report is ready to view",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    priority: "low",
    actionUrl: "/dashboard/reports",
    actionLabel: "View Report",
  },
];

const notificationPreferences: NotificationPreference[] = [
  { id: "1", category: "Incoming Calls", email: false, push: true, inApp: true, sound: true },
  { id: "2", category: "Missed Calls", email: true, push: true, inApp: true, sound: false },
  { id: "3", category: "Voicemails", email: true, push: true, inApp: true, sound: true },
  { id: "4", category: "SMS Messages", email: false, push: true, inApp: true, sound: true },
  { id: "5", category: "Queue Alerts", email: true, push: true, inApp: true, sound: true },
  { id: "6", category: "System Updates", email: true, push: false, inApp: true, sound: false },
  { id: "7", category: "Billing Alerts", email: true, push: true, inApp: true, sound: false },
  { id: "8", category: "Team Activity", email: false, push: false, inApp: true, sound: false },
];

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [preferences, setPreferences] = useState<NotificationPreference[]>(notificationPreferences);
  const [filter, setFilter] = useState<string>("all");
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "call":
        return Phone;
      case "message":
        return MessageSquare;
      case "voicemail":
        return Voicemail;
      case "alert":
        return AlertTriangle;
      case "system":
        return Settings;
      default:
        return Info;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const togglePreference = (
    id: string,
    field: "email" | "push" | "inApp" | "sound"
  ) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p))
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your alerts and notification preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {doNotDisturb ? (
              <BellOff className="h-4 w-4 text-red-500" />
            ) : (
              <Bell className="h-4 w-4 text-green-500" />
            )}
            <span className="text-sm font-medium">Do Not Disturb</span>
            <Switch
              checked={doNotDisturb}
              onCheckedChange={setDoNotDisturb}
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-blue-500" />
            ) : (
              <VolumeX className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm font-medium">Sound</span>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>
      </div>

      {/* Do Not Disturb Warning */}
      <AnimatePresence>
        {doNotDisturb && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
              <CardContent className="p-4 flex items-center gap-3">
                <BellOff className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium text-orange-800 dark:text-orange-200">
                    Do Not Disturb is enabled
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    You won&apos;t receive push notifications or sounds until you turn this off
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDoNotDisturb(false)}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Turn Off
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          {/* Filter and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <div className="flex gap-1">
                {["all", "unread", "call", "message", "voicemail", "alert"].map(
                  (f) => (
                    <Button
                      key={f}
                      variant={filter === f ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilter(f)}
                      className="capitalize"
                    >
                      {f}
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                      No notifications
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      You&apos;re all caught up!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                    >
                      <Card
                        className={`transition-colors ${
                          !notification.read
                            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                            : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                notification.type === "alert"
                                  ? "bg-red-100 text-red-600"
                                  : notification.type === "call"
                                  ? "bg-green-100 text-green-600"
                                  : notification.type === "voicemail"
                                  ? "bg-purple-100 text-purple-600"
                                  : notification.type === "message"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div
                                    className={`w-2 h-2 rounded-full ${getPriorityColor(
                                      notification.priority
                                    )}`}
                                  />
                                )}
                                <Badge variant="outline" className="text-xs capitalize">
                                  {notification.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(notification.timestamp)}
                                </span>
                                {notification.actionUrl && (
                                  <Button variant="link" size="sm" className="h-auto p-0">
                                    {notification.actionLabel}
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-gray-400 hover:text-red-500"
                                title="Delete"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications for each category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-gray-600">
                        Category
                      </th>
                      <th className="text-center py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm font-medium">Email</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <Smartphone className="h-4 w-4" />
                          <span className="text-sm font-medium">Push</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <Monitor className="h-4 w-4" />
                          <span className="text-sm font-medium">In-App</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <Volume2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Sound</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {preferences.map((pref) => (
                      <tr key={pref.id} className="border-b last:border-0">
                        <td className="py-3 px-2 font-medium">{pref.category}</td>
                        <td className="text-center py-3 px-2">
                          <Switch
                            checked={pref.email}
                            onCheckedChange={() => togglePreference(pref.id, "email")}
                          />
                        </td>
                        <td className="text-center py-3 px-2">
                          <Switch
                            checked={pref.push}
                            onCheckedChange={() => togglePreference(pref.id, "push")}
                          />
                        </td>
                        <td className="text-center py-3 px-2">
                          <Switch
                            checked={pref.inApp}
                            onCheckedChange={() => togglePreference(pref.id, "inApp")}
                          />
                        </td>
                        <td className="text-center py-3 px-2">
                          <Switch
                            checked={pref.sound}
                            onCheckedChange={() => togglePreference(pref.id, "sound")}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quiet Hours</CardTitle>
                <CardDescription>
                  Automatically enable Do Not Disturb during set hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable Quiet Hours</span>
                  <Switch />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Start Time</label>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="w-full px-3 py-2 border rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">End Time</label>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="w-full px-3 py-2 border rounded-lg mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Summary</CardTitle>
                <CardDescription>
                  Receive a digest instead of individual notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable Daily Digest</span>
                  <Switch />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Delivery Time</label>
                  <input
                    type="time"
                    defaultValue="09:00"
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

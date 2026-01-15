"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Plus,
  Clock,
  Sun,
  Snowflake,
  Heart,
  Star,
  Gift,
  Flag,
  Leaf,
  Moon,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Copy,
} from "lucide-react";

type Holiday = {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  isRecurring: boolean;
  routingAction: "voicemail" | "greeting" | "forward" | "closed";
  greetingId?: string;
  forwardNumber?: string;
  isActive: boolean;
};

const mockHolidays: Holiday[] = [
  {
    id: "hol_1",
    name: "New Year's Day",
    date: "2026-01-01",
    isRecurring: true,
    routingAction: "greeting",
    greetingId: "greet_holiday",
    isActive: true,
  },
  {
    id: "hol_2",
    name: "Martin Luther King Jr. Day",
    date: "2026-01-19",
    isRecurring: true,
    routingAction: "closed",
    isActive: true,
  },
  {
    id: "hol_3",
    name: "Presidents' Day",
    date: "2026-02-16",
    isRecurring: true,
    routingAction: "voicemail",
    isActive: true,
  },
  {
    id: "hol_4",
    name: "Memorial Day",
    date: "2026-05-25",
    isRecurring: true,
    routingAction: "greeting",
    greetingId: "greet_memorial",
    isActive: true,
  },
  {
    id: "hol_5",
    name: "Independence Day",
    date: "2026-07-04",
    isRecurring: true,
    routingAction: "greeting",
    greetingId: "greet_july4",
    isActive: true,
  },
  {
    id: "hol_6",
    name: "Labor Day",
    date: "2026-09-07",
    isRecurring: true,
    routingAction: "closed",
    isActive: true,
  },
  {
    id: "hol_7",
    name: "Thanksgiving",
    date: "2026-11-26",
    endDate: "2026-11-27",
    isRecurring: true,
    routingAction: "greeting",
    greetingId: "greet_thanksgiving",
    isActive: true,
  },
  {
    id: "hol_8",
    name: "Christmas",
    date: "2026-12-24",
    endDate: "2026-12-25",
    isRecurring: true,
    routingAction: "greeting",
    greetingId: "greet_christmas",
    isActive: true,
  },
  {
    id: "hol_9",
    name: "Company Anniversary",
    date: "2026-03-15",
    isRecurring: true,
    routingAction: "forward",
    forwardNumber: "+1 (555) 999-0000",
    isActive: false,
  },
];

const getHolidayIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("christmas") || lower.includes("winter")) return Snowflake;
  if (lower.includes("valentine") || lower.includes("heart")) return Heart;
  if (lower.includes("star") || lower.includes("independence")) return Star;
  if (lower.includes("new year")) return Gift;
  if (lower.includes("memorial") || lower.includes("flag") || lower.includes("veteran")) return Flag;
  if (lower.includes("thanksgiving") || lower.includes("fall")) return Leaf;
  if (lower.includes("halloween")) return Moon;
  if (lower.includes("summer")) return Sun;
  return Calendar;
};

const getActionBadge = (action: string) => {
  switch (action) {
    case "voicemail":
      return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Voicemail</Badge>;
    case "greeting":
      return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Custom Greeting</Badge>;
    case "forward":
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Forward</Badge>;
    case "closed":
      return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Closed</Badge>;
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

const formatDateShort = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export function HolidaySchedules() {
  const [holidays, setHolidays] = useState(mockHolidays);
  const [filter, setFilter] = useState<"all" | "active" | "upcoming">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const today = new Date();
  const upcomingHolidays = holidays
    .filter((h) => h.isActive && new Date(h.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const filteredHolidays = holidays.filter((holiday) => {
    if (filter === "active") return holiday.isActive;
    if (filter === "upcoming") {
      return holiday.isActive && new Date(holiday.date) >= today;
    }
    return true;
  });

  const toggleHoliday = (id: string) => {
    setHolidays(holidays.map((h) => (h.id === id ? { ...h, isActive: !h.isActive } : h)));
  };

  const deleteHoliday = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  const stats = {
    total: holidays.length,
    active: holidays.filter((h) => h.isActive).length,
    upcoming: upcomingHolidays.length,
  };

  return (
    <div className="space-y-6">
      {/* Next Holiday Banner */}
      {upcomingHolidays[0] && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    {(() => {
                      const Icon = getHolidayIcon(upcomingHolidays[0].name);
                      return <Icon className="h-7 w-7 text-white" />;
                    })()}
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Next Holiday</p>
                    <h3 className="text-xl font-bold text-white">{upcomingHolidays[0].name}</h3>
                    <p className="text-white/80">
                      {formatDate(upcomingHolidays[0].date)}
                      {upcomingHolidays[0].endDate && ` - ${formatDate(upcomingHolidays[0].endDate)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {Math.ceil((new Date(upcomingHolidays[0].date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <p className="text-sm text-white/70">days away</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Holidays</p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.upcoming}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["all", "active", "upcoming"] as const).map((f) => (
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
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Copy className="h-4 w-4" />
            Import US Holidays
          </Button>
          <Button className="btn-primary gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4" />
            Add Holiday
          </Button>
        </div>
      </div>

      {/* Holiday List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-gray-800">
            {filteredHolidays.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No holidays configured</p>
              </div>
            ) : (
              filteredHolidays.map((holiday, i) => {
                const Icon = getHolidayIcon(holiday.name);
                const isPast = new Date(holiday.date) < today;
                return (
                  <motion.div
                    key={holiday.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      !holiday.isActive ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        holiday.isActive
                          ? "bg-[#FDF8E8] dark:bg-[#C9A227]/20"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          holiday.isActive
                            ? "text-[#C9A227]"
                            : "text-gray-400"
                        }`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#1E3A5F] dark:text-white">
                            {holiday.name}
                          </span>
                          {holiday.isRecurring && (
                            <Badge variant="outline" className="text-xs">Recurring</Badge>
                          )}
                          {!holiday.isActive && (
                            <Badge variant="outline" className="text-gray-500">Disabled</Badge>
                          )}
                          {isPast && holiday.isActive && (
                            <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Past</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateShort(holiday.date)}
                            {holiday.endDate && ` - ${formatDateShort(holiday.endDate)}`}
                          </span>
                          {getActionBadge(holiday.routingAction)}
                          {holiday.forwardNumber && (
                            <span className="text-green-600">{holiday.forwardNumber}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleHoliday(holiday.id)}
                        >
                          {holiday.isActive ? "Disable" : "Enable"}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHoliday(holiday.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Holiday Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Add Holiday
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Holiday Name</label>
                    <Input placeholder="e.g., Christmas Eve" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Date (optional)</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Recurrence</label>
                    <div className="flex gap-2">
                      <button className="flex-1 p-3 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-sm">
                        One-time
                      </button>
                      <button className="flex-1 p-3 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-sm">
                        Yearly
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">When Called</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "greeting", label: "Play Greeting" },
                        { value: "voicemail", label: "Go to Voicemail" },
                        { value: "forward", label: "Forward Call" },
                        { value: "closed", label: "Closed Message" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          className="p-3 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-sm"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button className="btn-primary">Add Holiday</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

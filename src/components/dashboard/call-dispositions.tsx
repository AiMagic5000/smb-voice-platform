"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Phone,
  PhoneOff,
  Calendar,
  UserX,
  MessageSquare,
  DollarSign,
} from "lucide-react";

type Disposition = {
  id: string;
  name: string;
  code: string;
  description: string;
  category: "positive" | "negative" | "neutral" | "followup";
  icon: string;
  color: string;
  usageCount: number;
  isActive: boolean;
  requiresNote: boolean;
  autoScheduleFollowup: boolean;
  followupDays?: number;
};

const mockDispositions: Disposition[] = [
  {
    id: "1",
    name: "Sale Completed",
    code: "SALE",
    description: "Customer made a purchase",
    category: "positive",
    icon: "dollar",
    color: "green",
    usageCount: 156,
    isActive: true,
    requiresNote: false,
    autoScheduleFollowup: false,
  },
  {
    id: "2",
    name: "Callback Requested",
    code: "CALLBACK",
    description: "Customer requested a callback at a specific time",
    category: "followup",
    icon: "calendar",
    color: "blue",
    usageCount: 234,
    isActive: true,
    requiresNote: true,
    autoScheduleFollowup: true,
    followupDays: 1,
  },
  {
    id: "3",
    name: "Not Interested",
    code: "NI",
    description: "Customer declined offer",
    category: "negative",
    icon: "x",
    color: "red",
    usageCount: 89,
    isActive: true,
    requiresNote: false,
    autoScheduleFollowup: false,
  },
  {
    id: "4",
    name: "Voicemail Left",
    code: "VM",
    description: "Left voicemail for customer",
    category: "neutral",
    icon: "message",
    color: "gray",
    usageCount: 567,
    isActive: true,
    requiresNote: false,
    autoScheduleFollowup: true,
    followupDays: 2,
  },
  {
    id: "5",
    name: "No Answer",
    code: "NA",
    description: "No response from customer",
    category: "neutral",
    icon: "phone-off",
    color: "gray",
    usageCount: 890,
    isActive: true,
    requiresNote: false,
    autoScheduleFollowup: true,
    followupDays: 1,
  },
  {
    id: "6",
    name: "Wrong Number",
    code: "WN",
    description: "Incorrect contact information",
    category: "negative",
    icon: "user-x",
    color: "orange",
    usageCount: 45,
    isActive: true,
    requiresNote: true,
    autoScheduleFollowup: false,
  },
  {
    id: "7",
    name: "Issue Resolved",
    code: "RESOLVED",
    description: "Customer issue successfully resolved",
    category: "positive",
    icon: "check",
    color: "green",
    usageCount: 678,
    isActive: true,
    requiresNote: false,
    autoScheduleFollowup: false,
  },
  {
    id: "8",
    name: "Escalated",
    code: "ESC",
    description: "Call escalated to supervisor/specialist",
    category: "followup",
    icon: "alert",
    color: "yellow",
    usageCount: 123,
    isActive: true,
    requiresNote: true,
    autoScheduleFollowup: false,
  },
];

const getIconComponent = (icon: string) => {
  switch (icon) {
    case "dollar":
      return DollarSign;
    case "calendar":
      return Calendar;
    case "x":
      return XCircle;
    case "message":
      return MessageSquare;
    case "phone-off":
      return PhoneOff;
    case "user-x":
      return UserX;
    case "check":
      return CheckCircle;
    case "alert":
      return AlertCircle;
    default:
      return Tag;
  }
};

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "positive":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Positive
        </Badge>
      );
    case "negative":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          Negative
        </Badge>
      );
    case "followup":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Follow-up
        </Badge>
      );
    case "neutral":
      return (
        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
          Neutral
        </Badge>
      );
    default:
      return null;
  }
};

const getColorClass = (color: string) => {
  switch (color) {
    case "green":
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    case "red":
      return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    case "blue":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    case "yellow":
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "orange":
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
};

export function CallDispositions() {
  const [dispositions, setDispositions] = useState(mockDispositions);
  const [filter, setFilter] = useState<"all" | "positive" | "negative" | "neutral" | "followup">("all");
  const [showCreate, setShowCreate] = useState(false);

  const filteredDispositions = dispositions.filter(
    (d) => filter === "all" || d.category === filter
  );

  const stats = {
    total: dispositions.length,
    active: dispositions.filter((d) => d.isActive).length,
    positive: dispositions.filter((d) => d.category === "positive").length,
    negative: dispositions.filter((d) => d.category === "negative").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                    {stats.active}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Positive</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                    {stats.positive}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Negative</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                    {stats.negative}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(["all", "positive", "negative", "neutral", "followup"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                filter === cat
                  ? "bg-white dark:bg-gray-700 shadow-sm font-medium"
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <Button className="btn-primary gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          Add Disposition
        </Button>
      </div>

      {/* Dispositions List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-gray-800">
            {filteredDispositions.map((disposition, i) => {
              const IconComponent = getIconComponent(disposition.icon);
              return (
                <motion.div
                  key={disposition.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Drag Handle */}
                    <GripVertical className="h-5 w-5 text-gray-300 cursor-grab" />

                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColorClass(
                        disposition.color
                      )}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#1E3A5F] dark:text-white">
                          {disposition.name}
                        </span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {disposition.code}
                        </Badge>
                        {getCategoryBadge(disposition.category)}
                        {disposition.requiresNote && (
                          <Badge variant="outline" className="text-xs">
                            Note Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {disposition.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>Used {disposition.usageCount} times</span>
                        {disposition.autoScheduleFollowup && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Auto follow-up in {disposition.followupDays} day(s)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

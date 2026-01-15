"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UsageStats {
  minutesUsed: number;
  minutesIncluded: number;
  inboundCalls: number;
  outboundCalls: number;
  avgCallDuration: number; // seconds
  peakHour: string;
  busiestDay: string;
  extensionsActive: number;
  extensionsTotal: number;
}

interface DailyUsage {
  date: string;
  minutes: number;
  calls: number;
}

interface UsageReportProps {
  stats?: UsageStats;
  dailyUsage?: DailyUsage[];
  periodLabel?: string;
  className?: string;
}

const defaultStats: UsageStats = {
  minutesUsed: 423,
  minutesIncluded: 500,
  inboundCalls: 156,
  outboundCalls: 89,
  avgCallDuration: 234,
  peakHour: "10:00 AM",
  busiestDay: "Tuesday",
  extensionsActive: 4,
  extensionsTotal: 5,
};

const defaultDailyUsage: DailyUsage[] = [
  { date: "Mon", minutes: 45, calls: 28 },
  { date: "Tue", minutes: 78, calls: 42 },
  { date: "Wed", minutes: 62, calls: 35 },
  { date: "Thu", minutes: 54, calls: 31 },
  { date: "Fri", minutes: 89, calls: 48 },
  { date: "Sat", minutes: 32, calls: 18 },
  { date: "Sun", minutes: 63, calls: 25 },
];

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function UsageReport({
  stats = defaultStats,
  dailyUsage = defaultDailyUsage,
  periodLabel = "This Month",
  className,
}: UsageReportProps) {
  const usagePercentage = (stats.minutesUsed / stats.minutesIncluded) * 100;
  const maxMinutes = Math.max(...dailyUsage.map((d) => d.minutes));
  const totalCalls = stats.inboundCalls + stats.outboundCalls;

  const trend = useMemo(() => {
    // Simple trend calculation (positive if second half > first half)
    const mid = Math.floor(dailyUsage.length / 2);
    const firstHalf = dailyUsage.slice(0, mid).reduce((sum, d) => sum + d.minutes, 0);
    const secondHalf = dailyUsage.slice(mid).reduce((sum, d) => sum + d.minutes, 0);
    return ((secondHalf - firstHalf) / firstHalf) * 100;
  }, [dailyUsage]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#1E3A5F]">
            Usage Report
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{periodLabel}</span>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Usage Meter */}
        <div className="p-4 bg-gradient-to-br from-[#1E3A5F] to-[#2D5A8F] rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm">Minutes Used</p>
              <p className="text-3xl font-bold">
                {stats.minutesUsed}
                <span className="text-lg font-normal text-white/70">
                  /{stats.minutesIncluded}
                </span>
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                {trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend >= 0 ? "text-green-400" : "text-red-400"
                  )}
                >
                  {trend >= 0 ? "+" : ""}
                  {trend.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-white/50">vs last period</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "absolute left-0 top-0 h-full rounded-full",
                usagePercentage > 90
                  ? "bg-red-400"
                  : usagePercentage > 75
                  ? "bg-yellow-400"
                  : "bg-[#C9A227]"
              )}
            />
          </div>
          <p className="text-xs text-white/50 mt-2 text-right">
            {stats.minutesIncluded - stats.minutesUsed} minutes remaining
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-blue-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <PhoneIncoming className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Inbound</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{stats.inboundCalls}</p>
            <p className="text-xs text-blue-500">calls</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-3 rounded-xl bg-green-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <PhoneOutgoing className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Outbound</span>
            </div>
            <p className="text-xl font-bold text-green-700">{stats.outboundCalls}</p>
            <p className="text-xs text-green-500">calls</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-xl bg-purple-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">Avg Duration</span>
            </div>
            <p className="text-xl font-bold text-purple-700">
              {formatDuration(stats.avgCallDuration)}
            </p>
            <p className="text-xs text-purple-500">per call</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3 rounded-xl bg-[#FDF8E8]"
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-[#C9A227]" />
              <span className="text-xs text-[#9E7E1E] font-medium">Active</span>
            </div>
            <p className="text-xl font-bold text-[#C9A227]">
              {stats.extensionsActive}/{stats.extensionsTotal}
            </p>
            <p className="text-xs text-[#9E7E1E]">extensions</p>
          </motion.div>
        </div>

        {/* Daily Usage Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[#1E3A5F]">Daily Minutes</span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              Last 7 days
            </div>
          </div>

          <div className="flex items-end gap-2 h-32">
            {dailyUsage.map((day, i) => {
              const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-[#1E3A5F] to-[#3D6A8F] rounded-t-lg relative group cursor-pointer"
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E3A5F] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {day.minutes}m / {day.calls} calls
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-500">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5 text-[#1E3A5F]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Peak Hour</p>
              <p className="font-semibold text-[#1E3A5F]">{stats.peakHour}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Calendar className="h-5 w-5 text-[#1E3A5F]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Busiest Day</p>
              <p className="font-semibold text-[#1E3A5F]">{stats.busiestDay}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-[#FDF8E8] border border-[#C9A227]/20">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-[#C9A227]" />
            <span className="text-sm font-medium text-[#1E3A5F]">Summary</span>
          </div>
          <p className="text-sm text-gray-600">
            You handled <strong className="text-[#1E3A5F]">{totalCalls} calls</strong> this
            period, using{" "}
            <strong className="text-[#1E3A5F]">{formatMinutes(stats.minutesUsed)}</strong> of
            your {formatMinutes(stats.minutesIncluded)} included minutes. Peak activity was on{" "}
            <strong className="text-[#1E3A5F]">{stats.busiestDay}</strong> around{" "}
            <strong className="text-[#1E3A5F]">{stats.peakHour}</strong>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default UsageReport;

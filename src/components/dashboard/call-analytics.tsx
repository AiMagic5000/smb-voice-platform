"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CallData {
  date: string;
  inbound: number;
  outbound: number;
  missed: number;
}

interface CallAnalyticsProps {
  data?: CallData[];
  className?: string;
}

// Sample data for demonstration
const sampleData: CallData[] = [
  { date: "Mon", inbound: 12, outbound: 8, missed: 2 },
  { date: "Tue", inbound: 15, outbound: 10, missed: 1 },
  { date: "Wed", inbound: 18, outbound: 12, missed: 3 },
  { date: "Thu", inbound: 14, outbound: 9, missed: 2 },
  { date: "Fri", inbound: 20, outbound: 15, missed: 1 },
  { date: "Sat", inbound: 8, outbound: 4, missed: 1 },
  { date: "Sun", inbound: 5, outbound: 2, missed: 0 },
];

export function CallAnalytics({ data = sampleData, className }: CallAnalyticsProps) {
  const stats = useMemo(() => {
    const totalInbound = data.reduce((sum, d) => sum + d.inbound, 0);
    const totalOutbound = data.reduce((sum, d) => sum + d.outbound, 0);
    const totalMissed = data.reduce((sum, d) => sum + d.missed, 0);
    const totalCalls = totalInbound + totalOutbound;
    const answeredRate = totalCalls > 0
      ? Math.round(((totalInbound + totalOutbound) / (totalInbound + totalOutbound + totalMissed)) * 100)
      : 0;

    return {
      totalInbound,
      totalOutbound,
      totalMissed,
      totalCalls,
      answeredRate,
    };
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.inbound + d.outbound + d.missed));
  }, [data]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#1E3A5F]">
            Call Analytics
          </CardTitle>
          <span className="text-sm text-gray-500">This Week</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-blue-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <PhoneIncoming className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Inbound</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.totalInbound}</p>
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
            <p className="text-2xl font-bold text-green-700">{stats.totalOutbound}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-xl bg-red-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <PhoneMissed className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-600 font-medium">Missed</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{stats.totalMissed}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3 rounded-xl bg-[#FDF8E8]"
          >
            <div className="flex items-center gap-2 mb-1">
              <Phone className="h-4 w-4 text-[#C9A227]" />
              <span className="text-xs text-[#9E7E1E] font-medium">Answer Rate</span>
            </div>
            <p className="text-2xl font-bold text-[#C9A227]">{stats.answeredRate}%</p>
          </motion.div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[#1E3A5F]">Daily Breakdown</span>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-500" /> Inbound
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-500" /> Outbound
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-400" /> Missed
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {data.map((day, i) => {
              const total = day.inbound + day.outbound + day.missed;
              const inboundWidth = maxValue > 0 ? (day.inbound / maxValue) * 100 : 0;
              const outboundWidth = maxValue > 0 ? (day.outbound / maxValue) * 100 : 0;
              const missedWidth = maxValue > 0 ? (day.missed / maxValue) * 100 : 0;

              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-8 text-xs text-gray-500 font-medium">
                    {day.date}
                  </span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${inboundWidth}%` }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                      className="h-full bg-blue-500"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${outboundWidth}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                      className="h-full bg-green-500"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${missedWidth}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                      className="h-full bg-red-400"
                    />
                  </div>
                  <span className="w-8 text-xs text-gray-500 text-right">
                    {total}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">vs. Last Week</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">+12% calls</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CallAnalytics;

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Users,
  Download,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: typeof Phone;
  color: string;
}

interface DailyData {
  date: string;
  inbound: number;
  outbound: number;
  missed: number;
  duration: number;
}

interface AgentPerformance {
  id: string;
  name: string;
  extension: string;
  callsHandled: number;
  avgDuration: number;
  satisfactionScore: number;
  availability: number;
}

interface ReportingDashboardProps {
  metrics?: MetricCard[];
  dailyData?: DailyData[];
  agentPerformance?: AgentPerformance[];
  onExport?: (format: "csv" | "pdf") => void;
  onRefresh?: () => void;
  className?: string;
}

const defaultMetrics: MetricCard[] = [
  {
    label: "Total Calls",
    value: "1,247",
    change: 12.5,
    changeLabel: "vs last week",
    icon: Phone,
    color: "text-[#1E3A5F]",
  },
  {
    label: "Inbound Calls",
    value: "856",
    change: 8.3,
    changeLabel: "vs last week",
    icon: PhoneIncoming,
    color: "text-green-600",
  },
  {
    label: "Outbound Calls",
    value: "391",
    change: -2.1,
    changeLabel: "vs last week",
    icon: PhoneOutgoing,
    color: "text-blue-600",
  },
  {
    label: "Missed Calls",
    value: "47",
    change: -15.2,
    changeLabel: "vs last week",
    icon: PhoneMissed,
    color: "text-red-600",
  },
];

const defaultDailyData: DailyData[] = [
  { date: "Mon", inbound: 145, outbound: 62, missed: 8, duration: 4200 },
  { date: "Tue", inbound: 132, outbound: 58, missed: 6, duration: 3900 },
  { date: "Wed", inbound: 158, outbound: 71, missed: 12, duration: 4800 },
  { date: "Thu", inbound: 141, outbound: 55, missed: 7, duration: 4100 },
  { date: "Fri", inbound: 167, outbound: 68, missed: 9, duration: 5100 },
  { date: "Sat", inbound: 72, outbound: 42, missed: 3, duration: 2400 },
  { date: "Sun", inbound: 41, outbound: 35, missed: 2, duration: 1800 },
];

const defaultAgentPerformance: AgentPerformance[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    extension: "102",
    callsHandled: 324,
    avgDuration: 245,
    satisfactionScore: 4.8,
    availability: 94,
  },
  {
    id: "2",
    name: "Mike Williams",
    extension: "103",
    callsHandled: 287,
    avgDuration: 198,
    satisfactionScore: 4.6,
    availability: 91,
  },
  {
    id: "3",
    name: "Emily Brown",
    extension: "104",
    callsHandled: 256,
    avgDuration: 312,
    satisfactionScore: 4.9,
    availability: 89,
  },
  {
    id: "4",
    name: "John Smith",
    extension: "105",
    callsHandled: 198,
    avgDuration: 267,
    satisfactionScore: 4.5,
    availability: 87,
  },
];

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ReportingDashboard({
  metrics = defaultMetrics,
  dailyData = defaultDailyData,
  agentPerformance = defaultAgentPerformance,
  onExport,
  onRefresh,
  className,
}: ReportingDashboardProps) {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const maxCallsInDay = useMemo(() => {
    return Math.max(...dailyData.map((d) => d.inbound + d.outbound + d.missed));
  }, [dailyData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const totalDuration = useMemo(() => {
    return dailyData.reduce((sum, d) => sum + d.duration, 0);
  }, [dailyData]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E3A5F] flex items-center gap-2">
            <BarChart3 className="h-7 w-7" />
            Call Analytics
          </h2>
          <p className="text-gray-500 mt-1">
            Track your call performance and agent metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  dateRange === range
                    ? "bg-[#1E3A5F] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onExport?.("csv")}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "p-2 rounded-xl bg-gray-50",
                        metric.color
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium",
                        isPositive ? "text-green-600" : "text-red-600"
                      )}
                    >
                      <TrendIcon className="h-4 w-4" />
                      {Math.abs(metric.change)}%
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-[#1E3A5F]">
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {metric.label}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {metric.changeLabel}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Call Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1E3A5F] flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Call Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyData.map((day, index) => {
                const total = day.inbound + day.outbound + day.missed;
                const inboundWidth = (day.inbound / maxCallsInDay) * 100;
                const outboundWidth = (day.outbound / maxCallsInDay) * 100;
                const missedWidth = (day.missed / maxCallsInDay) * 100;

                return (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    <span className="w-10 text-sm font-medium text-gray-600">
                      {day.date}
                    </span>
                    <div className="flex-1 flex gap-0.5 h-8 rounded-lg overflow-hidden">
                      <div
                        className="bg-green-500 transition-all"
                        style={{ width: `${inboundWidth}%` }}
                        title={`Inbound: ${day.inbound}`}
                      />
                      <div
                        className="bg-blue-500 transition-all"
                        style={{ width: `${outboundWidth}%` }}
                        title={`Outbound: ${day.outbound}`}
                      />
                      <div
                        className="bg-red-400 transition-all"
                        style={{ width: `${missedWidth}%` }}
                        title={`Missed: ${day.missed}`}
                      />
                    </div>
                    <span className="w-12 text-sm text-gray-500 text-right">
                      {total}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-sm text-gray-600">Inbound</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-sm text-gray-600">Outbound</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-400" />
                <span className="text-sm text-gray-600">Missed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call Duration Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1E3A5F] flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Call Duration Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-[#1E3A5F]">
                {formatDuration(totalDuration)}
              </p>
              <p className="text-gray-500 mt-1">Total talk time this week</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <p className="text-2xl font-semibold text-[#1E3A5F]">
                  {formatDuration(Math.floor(totalDuration / dailyData.length))}
                </p>
                <p className="text-sm text-gray-500 mt-1">Avg per day</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <p className="text-2xl font-semibold text-[#1E3A5F]">
                  {formatDuration(
                    Math.floor(
                      totalDuration /
                        dailyData.reduce((s, d) => s + d.inbound + d.outbound, 0)
                    )
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">Avg per call</p>
              </div>
            </div>

            {/* Daily breakdown */}
            <div className="mt-6 space-y-2">
              {dailyData.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">{day.date}</span>
                  <span className="font-medium text-[#1E3A5F]">
                    {formatDuration(day.duration)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1E3A5F] flex items-center gap-2">
              <Users className="h-5 w-5" />
              Agent Performance
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Agent
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Calls Handled
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Avg Duration
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Satisfaction
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Availability
                  </th>
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((agent, index) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2D5A8F] flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(agent.name)}
                        </div>
                        <div>
                          <p className="font-medium text-[#1E3A5F]">
                            {agent.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Ext. {agent.extension}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1E3A5F]">
                        {agent.callsHandled}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">
                        {formatDuration(agent.avgDuration)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={cn(
                                "text-sm",
                                star <= Math.round(agent.satisfactionScore)
                                  ? "text-[#C9A227]"
                                  : "text-gray-200"
                              )}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {agent.satisfactionScore}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-[100px]">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              agent.availability >= 90
                                ? "bg-green-500"
                                : agent.availability >= 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            )}
                            style={{ width: `${agent.availability}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {agent.availability}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReportingDashboard;

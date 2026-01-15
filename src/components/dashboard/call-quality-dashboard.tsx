"use client";

import { useState } from "react";
import {
  Activity,
  Signal,
  Wifi,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QualityMetric {
  id: string;
  callId: string;
  timestamp: string;
  mos: number;
  jitter: number;
  packetLoss: number;
  latency: number;
  codec: string;
  direction: "inbound" | "outbound";
  duration: number;
  quality: "excellent" | "good" | "fair" | "poor";
}

// Mock data generator
const generateMockData = () => {
  const codecs = ["OPUS", "G.711", "G.722", "G.729"];
  const qualities: QualityMetric["quality"][] = [
    "excellent",
    "good",
    "fair",
    "poor",
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const mos = 3.5 + Math.random() * 1.4;
    let quality: QualityMetric["quality"];
    if (mos >= 4.3) quality = "excellent";
    else if (mos >= 4.0) quality = "good";
    else if (mos >= 3.6) quality = "fair";
    else quality = "poor";

    return {
      id: `cqm_${i + 1}`,
      callId: `call_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(
        Date.now() - Math.random() * 24 * 60 * 60 * 1000
      ).toISOString(),
      mos: Math.round(mos * 100) / 100,
      jitter: Math.round(Math.random() * 30 * 10) / 10,
      packetLoss: Math.round(Math.random() * 2 * 100) / 100,
      latency: Math.round(20 + Math.random() * 80),
      codec: codecs[Math.floor(Math.random() * codecs.length)],
      direction: Math.random() > 0.5 ? "inbound" : "outbound",
      duration: Math.floor(Math.random() * 600) + 30,
      quality,
    } as QualityMetric;
  });
};

const qualityConfig = {
  excellent: {
    color: "bg-green-500",
    textColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: CheckCircle,
  },
  good: {
    color: "bg-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: CheckCircle,
  },
  fair: {
    color: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    icon: AlertTriangle,
  },
  poor: {
    color: "bg-red-500",
    textColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: AlertTriangle,
  },
};

export function CallQualityDashboard() {
  const [metrics] = useState<QualityMetric[]>(generateMockData());
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d">(
    "24h"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate aggregates
  const avgMos =
    Math.round(
      (metrics.reduce((sum, m) => sum + m.mos, 0) / metrics.length) * 100
    ) / 100;
  const avgJitter =
    Math.round(
      (metrics.reduce((sum, m) => sum + m.jitter, 0) / metrics.length) * 10
    ) / 10;
  const avgPacketLoss =
    Math.round(
      (metrics.reduce((sum, m) => sum + m.packetLoss, 0) / metrics.length) * 100
    ) / 100;
  const avgLatency = Math.round(
    metrics.reduce((sum, m) => sum + m.latency, 0) / metrics.length
  );

  const qualityDistribution = {
    excellent: metrics.filter((m) => m.quality === "excellent").length,
    good: metrics.filter((m) => m.quality === "good").length,
    fair: metrics.filter((m) => m.quality === "fair").length,
    poor: metrics.filter((m) => m.quality === "poor").length,
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getMOSRating = (mos: number) => {
    if (mos >= 4.3) return "Excellent";
    if (mos >= 4.0) return "Good";
    if (mos >= 3.6) return "Fair";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Call Quality Metrics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor VoIP call quality and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["24h", "7d", "30d"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  selectedPeriod === period
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {period}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 dark:border-gray-700"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Mean Opinion Score
            </span>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {avgMos}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              / 5.0
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400">
              {getMOSRating(avgMos)}
            </span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Avg. Jitter
            </span>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Signal className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {avgJitter}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              ms
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {avgJitter < 15 ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Healthy
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  Monitor
                </span>
              </>
            )}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Packet Loss
            </span>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Wifi className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {avgPacketLoss}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              %
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {avgPacketLoss < 1 ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Excellent
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  Investigate
                </span>
              </>
            )}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Avg. Latency
            </span>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {avgLatency}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              ms
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {avgLatency < 50 ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Excellent
                </span>
              </>
            ) : avgLatency < 100 ? (
              <>
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Good
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  High
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quality Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Quality Distribution
          </h3>
          <div className="space-y-4">
            {(
              Object.entries(qualityDistribution) as [
                keyof typeof qualityConfig,
                number,
              ][]
            ).map(([quality, count]) => {
              const config = qualityConfig[quality];
              const percentage = Math.round((count / metrics.length) * 100);

              return (
                <div key={quality} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-gray-700 dark:text-gray-300">
                      {quality}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", config.color)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Call Direction
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <PhoneIncoming className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Inbound
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.filter((m) => m.direction === "inbound").length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                calls received
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <PhoneOutgoing className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Outbound
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.filter((m) => m.direction === "outbound").length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                calls made
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Recent Call Quality
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Direction
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Quality
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  MOS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Jitter
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Packet Loss
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Latency
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Codec
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {metrics.slice(0, 10).map((metric) => {
                const config = qualityConfig[metric.quality];
                const QualityIcon = config.icon;

                return (
                  <tr
                    key={metric.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {formatTimestamp(metric.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-sm",
                          metric.direction === "inbound"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-green-600 dark:text-green-400"
                        )}
                      >
                        {metric.direction === "inbound" ? (
                          <PhoneIncoming className="h-4 w-4" />
                        ) : (
                          <PhoneOutgoing className="h-4 w-4" />
                        )}
                        <span className="capitalize">{metric.direction}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize",
                          config.bgColor,
                          config.textColor
                        )}
                      >
                        <QualityIcon className="h-3 w-3" />
                        {metric.quality}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {metric.mos}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {metric.jitter} ms
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {metric.packetLoss}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {metric.latency} ms
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {metric.codec}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Quality Thresholds
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">MOS Score:</span>
            <ul className="mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Excellent: 4.3+</li>
              <li>Good: 4.0-4.3</li>
              <li>Fair: 3.6-4.0</li>
              <li>Poor: &lt;3.6</li>
            </ul>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Jitter:</span>
            <ul className="mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Good: &lt;15ms</li>
              <li>Acceptable: 15-30ms</li>
              <li>Poor: &gt;30ms</li>
            </ul>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Packet Loss:
            </span>
            <ul className="mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Good: &lt;1%</li>
              <li>Acceptable: 1-2%</li>
              <li>Poor: &gt;2%</li>
            </ul>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Latency:</span>
            <ul className="mt-1 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Excellent: &lt;50ms</li>
              <li>Good: 50-100ms</li>
              <li>Acceptable: 100-150ms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

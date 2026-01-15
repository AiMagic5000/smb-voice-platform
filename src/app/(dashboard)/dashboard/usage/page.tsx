"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  MessageSquare,
  HardDrive,
  Bot,
  CreditCard,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UsageData {
  current: {
    minutes: { used: number; included: number; overage: number };
    sms: { used: number; included: number; overage: number };
    phoneNumbers: { active: number; included: number };
    recordings: { storageMB: number; includedMB: number };
    aiMinutes: { used: number; included: number };
  };
  charges: {
    basePlan: number;
    total: number;
  };
  billingPeriod: {
    daysRemaining: number;
  };
  history: { month: string; minutes: number; sms: number; total: string }[];
}

export default function UsagePage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsage({
        current: {
          minutes: { used: 650, included: 1000, overage: 0 },
          sms: { used: 320, included: 500, overage: 0 },
          phoneNumbers: { active: 2, included: 2 },
          recordings: { storageMB: 450, includedMB: 1000 },
          aiMinutes: { used: 180, included: 500 },
        },
        charges: {
          basePlan: 7.95,
          total: 8.59,
        },
        billingPeriod: {
          daysRemaining: 12,
        },
        history: [
          { month: "Dec 2025", minutes: 720, sms: 380, total: "8.95" },
          { month: "Nov 2025", minutes: 680, sms: 420, total: "9.25" },
          { month: "Oct 2025", minutes: 590, sms: 310, total: "7.95" },
          { month: "Sep 2025", minutes: 820, sms: 480, total: "10.45" },
          { month: "Aug 2025", minutes: 550, sms: 290, total: "7.95" },
          { month: "Jul 2025", minutes: 630, sms: 350, total: "8.15" },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  const getUsagePercent = (used: number, included: number) =>
    Math.min((used / included) * 100, 100);

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A5F]" />
      </div>
    );
  }

  if (!usage) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Usage & Billing
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor your plan usage and billing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {usage.billingPeriod.daysRemaining} days left in billing period
          </span>
          <Button className="btn-primary">Upgrade Plan</Button>
        </div>
      </div>

      {/* Current Bill */}
      <div className="p-6 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f] rounded-2xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Current Bill</p>
            <p className="text-4xl font-bold mt-1">${usage.charges.total.toFixed(2)}</p>
            <p className="text-white/70 text-sm mt-1">
              Base plan: ${usage.charges.basePlan.toFixed(2)}/mo
            </p>
          </div>
          <CreditCard className="h-16 w-16 text-white/20" />
        </div>
      </div>

      {/* Usage Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Minutes */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Voice Minutes</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {usage.current.minutes.used} / {usage.current.minutes.included}
              </p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                getUsageColor(getUsagePercent(usage.current.minutes.used, usage.current.minutes.included))
              )}
              style={{ width: `${getUsagePercent(usage.current.minutes.used, usage.current.minutes.included)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {usage.current.minutes.included - usage.current.minutes.used} minutes remaining
          </p>
        </div>

        {/* SMS */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">SMS Messages</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {usage.current.sms.used} / {usage.current.sms.included}
              </p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                getUsageColor(getUsagePercent(usage.current.sms.used, usage.current.sms.included))
              )}
              style={{ width: `${getUsagePercent(usage.current.sms.used, usage.current.sms.included)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {usage.current.sms.included - usage.current.sms.used} messages remaining
          </p>
        </div>

        {/* AI Minutes */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">AI Minutes</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {usage.current.aiMinutes.used} / {usage.current.aiMinutes.included}
              </p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                getUsageColor(getUsagePercent(usage.current.aiMinutes.used, usage.current.aiMinutes.included))
              )}
              style={{ width: `${getUsagePercent(usage.current.aiMinutes.used, usage.current.aiMinutes.included)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {usage.current.aiMinutes.included - usage.current.aiMinutes.used} AI minutes remaining
          </p>
        </div>

        {/* Storage */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Recording Storage</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {usage.current.recordings.storageMB} MB / {usage.current.recordings.includedMB} MB
              </p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                getUsageColor(getUsagePercent(usage.current.recordings.storageMB, usage.current.recordings.includedMB))
              )}
              style={{ width: `${getUsagePercent(usage.current.recordings.storageMB, usage.current.recordings.includedMB)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {(usage.current.recordings.includedMB - usage.current.recordings.storageMB) / 1000} GB remaining
          </p>
        </div>
      </div>

      {/* Usage History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Month
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Minutes
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  SMS
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {usage.history.map((row) => (
                <tr key={row.month} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="px-5 py-4 text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {row.month}
                  </td>
                  <td className="px-5 py-4 text-sm text-right text-gray-600 dark:text-gray-400">
                    {row.minutes.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-sm text-right text-gray-600 dark:text-gray-400">
                    {row.sms.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-sm text-right font-medium text-gray-900 dark:text-white">
                    ${row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

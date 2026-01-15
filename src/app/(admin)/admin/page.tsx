"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Phone,
  DollarSign,
  TrendingUp,
  PhoneCall,
  Voicemail,
  Clock,
  Activity,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminStats {
  totalClients: number;
  activePhoneNumbers: number;
  monthlyRevenue: number;
  totalCalls: number;
  avgCallDuration: string;
  voicemails: number;
  uptime: string;
  activeUsers: number;
  activeSubscriptions: number;
  trialingSubscriptions: number;
  newClientsThisMonth: number;
  newPhonesThisMonth: number;
}

interface RecentActivity {
  type: string;
  name: string;
  time: string;
}

// Stat card component
function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: "blue" | "gold" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    gold: "bg-amber-100 text-amber-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Admin access required");
        }
        throw new Error("Failed to load statistics");
      }
      const data = await response.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Fall back to demo data for non-admins
      setStats({
        totalClients: 47,
        activePhoneNumbers: 128,
        monthlyRevenue: 373.65,
        totalCalls: 2847,
        avgCallDuration: "3:42",
        voicemails: 156,
        uptime: "99.97%",
        activeUsers: 31,
        activeSubscriptions: 42,
        trialingSubscriptions: 5,
        newClientsThisMonth: 5,
        newPhonesThisMonth: 12,
      });
      setRecentActivity([
        { type: "New Client", name: "ABC Corp", time: "5 minutes ago" },
        { type: "Phone Provisioned", name: "+1 (555) 123-4567", time: "12 minutes ago" },
        { type: "Subscription Updated", name: "XYZ LLC", time: "1 hour ago" },
        { type: "New Client", name: "123 Industries", time: "2 hours ago" },
        { type: "Support Ticket", name: "Issue #1247", time: "3 hours ago" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E3A5F]" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error || "Failed to load statistics"}</p>
        </div>
        <Button onClick={fetchStats} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and metrics</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStats}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-700">
            Showing demo data. {error}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          change={stats.newClientsThisMonth > 0 ? `+${stats.newClientsThisMonth} this month` : undefined}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Phone Numbers"
          value={stats.activePhoneNumbers}
          change={stats.newPhonesThisMonth > 0 ? `+${stats.newPhonesThisMonth} this month` : undefined}
          icon={Phone}
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          change={stats.trialingSubscriptions > 0 ? `${stats.trialingSubscriptions} trialing` : undefined}
          icon={Activity}
          color="gold"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Calls (30d)"
          value={stats.totalCalls.toLocaleString()}
          icon={PhoneCall}
          color="blue"
        />
        <StatCard
          title="Avg Call Duration"
          value={stats.avgCallDuration}
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="Voicemails"
          value={stats.voicemails}
          icon={Voicemail}
          color="gold"
        />
        <StatCard
          title="System Uptime"
          value={stats.uptime}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.name}</p>
                </div>
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add Client", href: "/admin/clients/new", icon: Users },
            { label: "Provision Number", href: "/admin/provisioning", icon: Phone },
            { label: "View Billing", href: "/admin/billing", icon: DollarSign },
            { label: "System Settings", href: "/admin/settings", icon: Activity },
          ].map((action, i) => (
            <a
              key={i}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-[#C9A227] hover:bg-amber-50 transition-colors"
            >
              <action.icon className="h-6 w-6 text-[#1E3A5F]" />
              <span className="text-sm font-medium text-gray-700">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

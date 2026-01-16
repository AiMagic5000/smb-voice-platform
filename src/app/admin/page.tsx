"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Phone,
  DollarSign,
  PhoneCall,
  Clock,
  Voicemail,
  Activity,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        <p>Error: {error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Clients",
      value: stats?.totalClients || 0,
      icon: Building2,
      change: stats?.newClientsThisMonth || 0,
      changeLabel: "new this month",
      positive: true,
    },
    {
      title: "Active Phone Numbers",
      value: stats?.activePhoneNumbers || 0,
      icon: Phone,
      change: stats?.newPhonesThisMonth || 0,
      changeLabel: "new this month",
      positive: true,
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats?.monthlyRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      subtitle: "Last 30 days",
    },
    {
      title: "Total Calls",
      value: stats?.totalCalls || 0,
      icon: PhoneCall,
      subtitle: "Last 30 days",
    },
    {
      title: "Avg Call Duration",
      value: stats?.avgCallDuration || "0:00",
      icon: Clock,
      subtitle: "Last 30 days",
    },
    {
      title: "Voicemails",
      value: stats?.voicemails || 0,
      icon: Voicemail,
      subtitle: "Last 30 days",
    },
    {
      title: "Active Subscriptions",
      value: stats?.activeSubscriptions || 0,
      icon: TrendingUp,
      subtitle: `${stats?.trialingSubscriptions || 0} trialing`,
    },
    {
      title: "Platform Uptime",
      value: stats?.uptime || "99.9%",
      icon: Activity,
      subtitle: "Last 30 days",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Monitor platform performance and manage clients
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="bg-slate-800 border-slate-700"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-[#C9A227]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              {stat.change !== undefined ? (
                <div className="flex items-center text-sm mt-1">
                  {stat.positive ? (
                    <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={stat.positive ? "text-green-400" : "text-red-400"}>
                    +{stat.change}
                  </span>
                  <span className="text-slate-500 ml-1">{stat.changeLabel}</span>
                </div>
              ) : (
                <p className="text-sm text-slate-500 mt-1">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#C9A227]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      {activity.type === "New Client" ? (
                        <Building2 className="h-5 w-5 text-[#C9A227]" />
                      ) : (
                        <Phone className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{activity.type}</p>
                      <p className="text-sm text-slate-400">{activity.name}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5 border-[#C9A227]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#C9A227] text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats?.activeUsers || 0}
                </p>
              </div>
              <Users className="h-12 w-12 text-[#C9A227]/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Revenue Growth</p>
                <p className="text-3xl font-bold text-white mt-1">
                  ${((stats?.monthlyRevenue || 0) / 100).toFixed(0)}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Platform Health</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats?.uptime || "99.9%"}
                </p>
              </div>
              <Activity className="h-12 w-12 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

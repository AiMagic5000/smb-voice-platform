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
  Activity
} from "lucide-react";

// Stat card component
function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color = "blue"
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
    purple: "bg-purple-100 text-purple-600"
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

// Mock data - would be replaced with real API calls
function useAdminStats() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activePhoneNumbers: 0,
    monthlyRevenue: 0,
    totalCalls: 0,
    avgCallDuration: "0:00",
    voicemails: 0,
    uptime: "99.9%",
    activeUsers: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalClients: 47,
        activePhoneNumbers: 128,
        monthlyRevenue: 373.65,
        totalCalls: 2847,
        avgCallDuration: "3:42",
        voicemails: 156,
        uptime: "99.97%",
        activeUsers: 31
      });
    }, 500);
  }, []);

  return stats;
}

export default function AdminDashboard() {
  const stats = useAdminStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          change="+5 this month"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Phone Numbers"
          value={stats.activePhoneNumbers}
          change="+12 this month"
          icon={Phone}
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toFixed(2)}`}
          change="+8.2%"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { type: "New Client", name: "ABC Corp", time: "5 minutes ago" },
            { type: "Phone Provisioned", name: "+1 (555) 123-4567", time: "12 minutes ago" },
            { type: "Subscription Updated", name: "XYZ LLC", time: "1 hour ago" },
            { type: "New Client", name: "123 Industries", time: "2 hours ago" },
            { type: "Support Ticket", name: "Issue #1247", time: "3 hours ago" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{activity.type}</p>
                <p className="text-sm text-gray-500">{activity.name}</p>
              </div>
              <p className="text-sm text-gray-400">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
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
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

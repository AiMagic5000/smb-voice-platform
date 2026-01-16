"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  MessageSquare,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  missedCalls: number;
  voicemails: number;
  messages: number;
  avgCallDuration: string;
  phoneNumbers: number;
}

interface RecentCall {
  id: string;
  direction: "inbound" | "outbound";
  from: string;
  to: string;
  duration: number;
  status: string;
  createdAt: string;
}

interface RecentVoicemail {
  id: string;
  from: string;
  duration: number;
  transcription: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [recentVoicemails, setRecentVoicemails] = useState<RecentVoicemail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch stats
        const statsRes = await fetch("/api/analytics/dashboard");
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats);
        }

        // Fetch recent calls
        const callsRes = await fetch("/api/calls?limit=5");
        if (callsRes.ok) {
          const data = await callsRes.json();
          setRecentCalls(data.calls || []);
        }

        // Fetch recent voicemails
        const vmRes = await fetch("/api/voicemails?limit=3");
        if (vmRes.ok) {
          const data = await vmRes.json();
          setRecentVoicemails(data.voicemails || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Calls",
      value: stats?.totalCalls || 0,
      icon: PhoneCall,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Inbound",
      value: stats?.inboundCalls || 0,
      icon: PhoneIncoming,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Outbound",
      value: stats?.outboundCalls || 0,
      icon: PhoneOutgoing,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Missed",
      value: stats?.missedCalls || 0,
      icon: PhoneMissed,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Voicemails",
      value: stats?.voicemails || 0,
      icon: Voicemail,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    {
      title: "Messages",
      value: stats?.messages || 0,
      icon: MessageSquare,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
    },
    {
      title: "Avg Duration",
      value: stats?.avgCallDuration || "0:00",
      icon: Clock,
      color: "text-[#C9A227]",
      bgColor: "bg-[#C9A227]/20",
    },
    {
      title: "Phone Numbers",
      value: stats?.phoneNumbers || 0,
      icon: Phone,
      color: "text-slate-400",
      bgColor: "bg-slate-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your business phone activity</p>
        </div>
        <Button asChild className="bg-[#C9A227] hover:bg-[#B8921F] text-white">
          <Link href="/dashboard/phone-numbers">
            <Phone className="h-4 w-4 mr-2" />
            Get New Number
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Calls</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-[#C9A227]">
              <Link href="/dashboard/calls">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCalls.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <PhoneCall className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No calls yet</p>
                <p className="text-sm mt-1">Your call history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          call.direction === "inbound"
                            ? "bg-green-500/20"
                            : "bg-purple-500/20"
                        }`}
                      >
                        {call.direction === "inbound" ? (
                          <PhoneIncoming className="h-5 w-5 text-green-400" />
                        ) : (
                          <PhoneOutgoing className="h-5 w-5 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {formatPhoneNumber(call.direction === "inbound" ? call.from : call.to)}
                        </p>
                        <p className="text-sm text-slate-400">
                          {formatDuration(call.duration)} · {formatTimeAgo(call.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        call.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : call.status === "missed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {call.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Voicemails */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Voicemails</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-[#C9A227]">
              <Link href="/dashboard/voicemails">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentVoicemails.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Voicemail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No voicemails yet</p>
                <p className="text-sm mt-1">Voicemails will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentVoicemails.map((vm) => (
                  <div
                    key={vm.id}
                    className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Voicemail className="h-4 w-4 text-orange-400" />
                        <span className="text-white font-medium">
                          {formatPhoneNumber(vm.from)}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(vm.createdAt)}
                      </span>
                    </div>
                    {vm.transcription && (
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {vm.transcription}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        {formatDuration(vm.duration)}
                      </span>
                      <Button size="sm" variant="ghost" className="text-[#C9A227] h-8">
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              asChild
              className="h-auto py-4 flex-col border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Link href="/dashboard/phone-numbers">
                <Phone className="h-6 w-6 mb-2 text-[#C9A227]" />
                Get Number
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-auto py-4 flex-col border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Link href="/dashboard/messages">
                <MessageSquare className="h-6 w-6 mb-2 text-[#C9A227]" />
                Send SMS
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-auto py-4 flex-col border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Link href="/dashboard/ai-receptionist">
                <TrendingUp className="h-6 w-6 mb-2 text-[#C9A227]" />
                AI Setup
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-auto py-4 flex-col border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Link href="/dashboard/settings">
                <Clock className="h-6 w-6 mb-2 text-[#C9A227]" />
                Business Hours
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

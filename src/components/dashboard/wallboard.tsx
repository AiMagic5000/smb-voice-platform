"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Timer,
  CheckCircle,
  AlertCircle,
  Pause,
} from "lucide-react";

type AgentStatus = {
  id: string;
  name: string;
  extension: string;
  status: "available" | "on-call" | "wrap-up" | "break" | "offline";
  currentCall?: {
    duration: number;
    callerNumber: string;
  };
  callsToday: number;
  avgHandleTime: number;
};

type QueueStats = {
  name: string;
  waiting: number;
  longestWait: number;
  agentsAvailable: number;
  agentsOnCall: number;
};

const mockAgents: AgentStatus[] = [
  { id: "1", name: "John Smith", extension: "101", status: "on-call", currentCall: { duration: 245, callerNumber: "+15551234567" }, callsToday: 23, avgHandleTime: 180 },
  { id: "2", name: "Sarah Johnson", extension: "102", status: "available", callsToday: 18, avgHandleTime: 210 },
  { id: "3", name: "Mike Chen", extension: "103", status: "wrap-up", callsToday: 31, avgHandleTime: 145 },
  { id: "4", name: "Lisa Rodriguez", extension: "104", status: "on-call", currentCall: { duration: 89, callerNumber: "+15552345678" }, callsToday: 27, avgHandleTime: 165 },
  { id: "5", name: "David Wilson", extension: "105", status: "break", callsToday: 15, avgHandleTime: 195 },
  { id: "6", name: "Emily Brown", extension: "106", status: "available", callsToday: 22, avgHandleTime: 175 },
];

const mockQueues: QueueStats[] = [
  { name: "Sales", waiting: 3, longestWait: 45, agentsAvailable: 2, agentsOnCall: 2 },
  { name: "Support", waiting: 1, longestWait: 12, agentsAvailable: 3, agentsOnCall: 1 },
  { name: "Billing", waiting: 0, longestWait: 0, agentsAvailable: 1, agentsOnCall: 0 },
];

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "on-call":
      return "bg-blue-500";
    case "wrap-up":
      return "bg-yellow-500";
    case "break":
      return "bg-orange-500";
    case "offline":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "available":
      return "Available";
    case "on-call":
      return "On Call";
    case "wrap-up":
      return "Wrap-up";
    case "break":
      return "Break";
    case "offline":
      return "Offline";
    default:
      return status;
  }
};

export function Wallboard() {
  const [time, setTime] = useState(new Date());
  const [agents, setAgents] = useState(mockAgents);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Simulate call duration updates
      setAgents((prev) =>
        prev.map((agent) =>
          agent.currentCall
            ? {
                ...agent,
                currentCall: {
                  ...agent.currentCall,
                  duration: agent.currentCall.duration + 1,
                },
              }
            : agent
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = {
    totalCalls: 156,
    inbound: 98,
    outbound: 58,
    missed: 12,
    avgWaitTime: 23,
    avgHandleTime: 178,
    serviceLevel: 94,
    answered: 144,
  };

  const availableAgents = agents.filter((a) => a.status === "available").length;
  const onCallAgents = agents.filter((a) => a.status === "on-call").length;
  const totalWaiting = mockQueues.reduce((sum, q) => sum + q.waiting, 0);

  return (
    <div className="space-y-6">
      {/* Header with Time */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F] dark:text-white">
            Call Center Wallboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Real-time performance metrics</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-mono font-bold text-[#1E3A5F] dark:text-white">
            {time.toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-500">
            {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 text-center">
              <Phone className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{stats.totalCalls}</div>
              <div className="text-xs opacity-80">Total Calls</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4 text-center">
              <PhoneIncoming className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{stats.inbound}</div>
              <div className="text-xs opacity-80">Inbound</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4 text-center">
              <PhoneOutgoing className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{stats.outbound}</div>
              <div className="text-xs opacity-80">Outbound</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-4 text-center">
              <PhoneMissed className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{stats.missed}</div>
              <div className="text-xs opacity-80">Missed</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] text-white">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{availableAgents}</div>
              <div className="text-xs opacity-80">Available</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{onCallAgents}</div>
              <div className="text-xs opacity-80">On Call</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className={`text-white ${totalWaiting > 5 ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-gradient-to-br from-[#C9A227] to-[#9E7E1E]"}`}>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{totalWaiting}</div>
              <div className="text-xs opacity-80">In Queue</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className={`text-white ${stats.serviceLevel >= 90 ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-gradient-to-br from-yellow-500 to-yellow-600"}`}>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{stats.serviceLevel}%</div>
              <div className="text-xs opacity-80">SLA</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Queues and Agents */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Queue Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#C9A227]" />
                Queue Status
              </h2>
              <div className="space-y-4">
                {mockQueues.map((queue) => (
                  <div key={queue.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <div className="font-semibold text-[#1E3A5F] dark:text-white">{queue.name}</div>
                      <div className="text-sm text-gray-500">{queue.agentsAvailable} available / {queue.agentsOnCall} on call</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${queue.waiting > 3 ? "text-red-500" : queue.waiting > 0 ? "text-yellow-500" : "text-green-500"}`}>
                        {queue.waiting}
                      </div>
                      <div className="text-xs text-gray-400">
                        {queue.longestWait > 0 ? `${queue.longestWait}s wait` : "No wait"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agent Status - spans 2 columns */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#C9A227]" />
                Agent Status
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#1E3A5F] text-white text-sm">
                          {agent.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(agent.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#1E3A5F] dark:text-white truncate">{agent.name}</span>
                        <Badge variant="outline" className="text-xs">Ext {agent.extension}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`${agent.status === "available" ? "text-green-600" : agent.status === "on-call" ? "text-blue-600" : "text-gray-500"}`}>
                          {getStatusLabel(agent.status)}
                        </span>
                        {agent.currentCall && (
                          <span className="text-gray-400 font-mono">
                            {formatDuration(agent.currentCall.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#1E3A5F] dark:text-white">{agent.callsToday}</div>
                      <div className="text-xs text-gray-400">calls today</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Today's Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1E3A5F] dark:text-white">{stats.answered}</div>
                <div className="text-sm text-gray-500">Calls Answered</div>
                <div className="text-xs text-green-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +12% vs yesterday
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1E3A5F] dark:text-white">{stats.avgWaitTime}s</div>
                <div className="text-sm text-gray-500">Avg Wait Time</div>
                <div className="text-xs text-green-500 flex items-center justify-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> -8s vs yesterday
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1E3A5F] dark:text-white">{formatDuration(stats.avgHandleTime)}</div>
                <div className="text-sm text-gray-500">Avg Handle Time</div>
                <div className="text-xs text-gray-400 mt-1">Target: 3:00</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1E3A5F] dark:text-white">{Math.round((stats.answered / stats.totalCalls) * 100)}%</div>
                <div className="text-sm text-gray-500">Answer Rate</div>
                <div className="text-xs text-green-500 flex items-center justify-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3" /> Above target
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

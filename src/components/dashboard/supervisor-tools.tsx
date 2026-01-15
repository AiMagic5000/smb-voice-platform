"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Ear,
  MessageSquare,
  MicOff,
  Volume2,
  VolumeX,
  User,
  Users,
  Clock,
  Search,
  Radio,
  Eye,
  UserPlus,
  AlertCircle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react";

type AgentStatus = "available" | "on_call" | "wrap_up" | "break" | "offline";
type MonitorMode = "silent" | "whisper" | "barge" | "none";

type Agent = {
  id: string;
  name: string;
  extension: string;
  queue: string;
  status: AgentStatus;
  currentCall?: {
    callId: string;
    callerName: string;
    callerNumber: string;
    duration: number;
    queueWaitTime: number;
  };
  stats: {
    callsToday: number;
    avgHandleTime: number;
    avgHoldTime: number;
    satisfactionScore: number;
  };
  monitorMode: MonitorMode;
};

const mockAgents: Agent[] = [
  {
    id: "agent_1",
    name: "Michael Chen",
    extension: "101",
    queue: "Sales",
    status: "on_call",
    currentCall: {
      callId: "call_1",
      callerName: "John Smith",
      callerNumber: "+1 (555) 123-4567",
      duration: 245,
      queueWaitTime: 32,
    },
    stats: {
      callsToday: 18,
      avgHandleTime: 4.2,
      avgHoldTime: 0.8,
      satisfactionScore: 4.7,
    },
    monitorMode: "none",
  },
  {
    id: "agent_2",
    name: "Emily Davis",
    extension: "102",
    queue: "Sales",
    status: "on_call",
    currentCall: {
      callId: "call_2",
      callerName: "Sarah Johnson",
      callerNumber: "+1 (555) 234-5678",
      duration: 87,
      queueWaitTime: 15,
    },
    stats: {
      callsToday: 15,
      avgHandleTime: 3.8,
      avgHoldTime: 0.5,
      satisfactionScore: 4.9,
    },
    monitorMode: "whisper",
  },
  {
    id: "agent_3",
    name: "David Wilson",
    extension: "103",
    queue: "Support",
    status: "available",
    stats: {
      callsToday: 22,
      avgHandleTime: 5.1,
      avgHoldTime: 1.2,
      satisfactionScore: 4.5,
    },
    monitorMode: "none",
  },
  {
    id: "agent_4",
    name: "Lisa Brown",
    extension: "104",
    queue: "Support",
    status: "wrap_up",
    stats: {
      callsToday: 19,
      avgHandleTime: 4.5,
      avgHoldTime: 0.9,
      satisfactionScore: 4.6,
    },
    monitorMode: "none",
  },
  {
    id: "agent_5",
    name: "Robert Taylor",
    extension: "105",
    queue: "Billing",
    status: "break",
    stats: {
      callsToday: 12,
      avgHandleTime: 3.2,
      avgHoldTime: 0.4,
      satisfactionScore: 4.8,
    },
    monitorMode: "none",
  },
  {
    id: "agent_6",
    name: "Jennifer Martinez",
    extension: "106",
    queue: "Billing",
    status: "on_call",
    currentCall: {
      callId: "call_3",
      callerName: "Robert Williams",
      callerNumber: "+1 (555) 345-6789",
      duration: 156,
      queueWaitTime: 45,
    },
    stats: {
      callsToday: 16,
      avgHandleTime: 4.0,
      avgHoldTime: 0.7,
      satisfactionScore: 4.4,
    },
    monitorMode: "barge",
  },
];

const getStatusColor = (status: AgentStatus) => {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "on_call":
      return "bg-blue-500";
    case "wrap_up":
      return "bg-yellow-500";
    case "break":
      return "bg-orange-500";
    case "offline":
      return "bg-gray-400";
  }
};

const getStatusBadge = (status: AgentStatus) => {
  const styles: Record<AgentStatus, string> = {
    available: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    on_call: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    wrap_up: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    break: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    offline: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };
  return <Badge className={styles[status]}>{status.replace("_", " ")}</Badge>;
};

const getMonitorBadge = (mode: MonitorMode) => {
  if (mode === "none") return null;
  const styles: Record<MonitorMode, string> = {
    silent: "bg-purple-100 text-purple-700",
    whisper: "bg-cyan-100 text-cyan-700",
    barge: "bg-red-100 text-red-700",
    none: "",
  };
  const icons: Record<MonitorMode, React.ReactNode> = {
    silent: <Eye className="h-3 w-3 mr-1" />,
    whisper: <MessageSquare className="h-3 w-3 mr-1" />,
    barge: <UserPlus className="h-3 w-3 mr-1" />,
    none: null,
  };
  return (
    <Badge className={`${styles[mode]} flex items-center`}>
      {icons[mode]}
      {mode}
    </Badge>
  );
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function SupervisorTools() {
  const [agents, setAgents] = useState(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQueue, setFilterQueue] = useState<string>("all");
  const [isMuted, setIsMuted] = useState(true);

  // Simulate call duration updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((agents) =>
        agents.map((agent) => ({
          ...agent,
          currentCall: agent.currentCall
            ? { ...agent.currentCall, duration: agent.currentCall.duration + 1 }
            : undefined,
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.extension.includes(searchQuery);
    const matchesQueue = filterQueue === "all" || agent.queue === filterQueue;
    return matchesSearch && matchesQueue;
  });

  const selectedAgentData = agents.find((a) => a.id === selectedAgent);
  const queues = [...new Set(agents.map((a) => a.queue))];

  const stats = {
    total: agents.length,
    available: agents.filter((a) => a.status === "available").length,
    onCall: agents.filter((a) => a.status === "on_call").length,
    monitored: agents.filter((a) => a.monitorMode !== "none").length,
  };

  const setMonitorMode = (agentId: string, mode: MonitorMode) => {
    setAgents((agents) =>
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, monitorMode: mode } : agent
      )
    );
    if (mode !== "none") {
      setSelectedAgent(agentId);
    }
  };

  const stopMonitoring = (agentId: string) => {
    setAgents((agents) =>
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, monitorMode: "none" } : agent
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Agents</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.available}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <PhoneCall className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">On Call</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.onCall}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Ear className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monitoring</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.monitored}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents..."
            className="pl-9"
          />
        </div>
        <select
          value={filterQueue}
          onChange={(e) => setFilterQueue(e.target.value)}
          className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All Queues</option>
          {queues.map((queue) => (
            <option key={queue} value={queue}>{queue}</option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Agents List */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y dark:divide-gray-700">
                {filteredAgents.map((agent, i) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      selectedAgent === agent.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-[#1E3A5F]/10 dark:bg-white/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-[#1E3A5F] dark:text-white" />
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${getStatusColor(agent.status)}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#1E3A5F] dark:text-white">{agent.name}</h4>
                            {getStatusBadge(agent.status)}
                            {getMonitorBadge(agent.monitorMode)}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>Ext. {agent.extension}</span>
                            <span className="text-gray-400">•</span>
                            <span>{agent.queue}</span>
                          </div>
                        </div>
                      </div>

                      {agent.status === "on_call" && agent.currentCall && (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#1E3A5F] dark:text-white">
                              {agent.currentCall.callerName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {formatDuration(agent.currentCall.duration)}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={agent.monitorMode === "silent" ? "default" : "outline"}
                              className={agent.monitorMode === "silent" ? "bg-purple-500" : ""}
                              onClick={() => setMonitorMode(agent.id, agent.monitorMode === "silent" ? "none" : "silent")}
                              title="Silent Monitor"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={agent.monitorMode === "whisper" ? "default" : "outline"}
                              className={agent.monitorMode === "whisper" ? "bg-cyan-500" : ""}
                              onClick={() => setMonitorMode(agent.id, agent.monitorMode === "whisper" ? "none" : "whisper")}
                              title="Whisper to Agent"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={agent.monitorMode === "barge" ? "default" : "outline"}
                              className={agent.monitorMode === "barge" ? "bg-red-500" : ""}
                              onClick={() => setMonitorMode(agent.id, agent.monitorMode === "barge" ? "none" : "barge")}
                              title="Barge into Call"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Agent Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-500">Calls Today</p>
                        <p className="text-sm font-semibold text-[#1E3A5F] dark:text-white">{agent.stats.callsToday}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg Handle</p>
                        <p className="text-sm font-semibold text-[#1E3A5F] dark:text-white">{agent.stats.avgHandleTime}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg Hold</p>
                        <p className="text-sm font-semibold text-[#1E3A5F] dark:text-white">{agent.stats.avgHoldTime}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">CSAT</p>
                        <p className="text-sm font-semibold text-[#1E3A5F] dark:text-white">{agent.stats.satisfactionScore}/5</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredAgents.length === 0 && (
                  <div className="p-12 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No agents found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monitor Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              {selectedAgentData && selectedAgentData.monitorMode !== "none" && selectedAgentData.currentCall ? (
                <>
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      selectedAgentData.monitorMode === "silent" ? "bg-purple-100 dark:bg-purple-900/30" :
                      selectedAgentData.monitorMode === "whisper" ? "bg-cyan-100 dark:bg-cyan-900/30" :
                      "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      {selectedAgentData.monitorMode === "silent" && <Eye className="h-10 w-10 text-purple-600" />}
                      {selectedAgentData.monitorMode === "whisper" && <MessageSquare className="h-10 w-10 text-cyan-600" />}
                      {selectedAgentData.monitorMode === "barge" && <UserPlus className="h-10 w-10 text-red-600" />}
                    </div>
                    <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white capitalize">
                      {selectedAgentData.monitorMode} Mode
                    </h3>
                    <p className="text-sm text-gray-500">
                      Monitoring {selectedAgentData.name}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Caller</p>
                      <p className="font-medium text-[#1E3A5F] dark:text-white">
                        {selectedAgentData.currentCall.callerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedAgentData.currentCall.callerNumber}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-lg font-mono font-bold text-[#1E3A5F] dark:text-white">
                          {formatDuration(selectedAgentData.currentCall.duration)}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full animate-pulse ${
                        selectedAgentData.monitorMode === "silent" ? "bg-purple-500" :
                        selectedAgentData.monitorMode === "whisper" ? "bg-cyan-500" :
                        "bg-red-500"
                      }`} />
                    </div>
                  </div>

                  {selectedAgentData.monitorMode !== "silent" && (
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Button
                        variant="outline"
                        className={`w-14 h-14 rounded-full ${isMuted ? "bg-red-50 border-red-200" : ""}`}
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <MicOff className="h-6 w-6 text-red-500" /> : <Volume2 className="h-6 w-6" />}
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 text-center">
                      {selectedAgentData.monitorMode === "silent" && "You can hear the call. Neither party can hear you."}
                      {selectedAgentData.monitorMode === "whisper" && "Only the agent can hear you. Caller cannot."}
                      {selectedAgentData.monitorMode === "barge" && "Both the agent and caller can hear you."}
                    </p>
                  </div>

                  <Button
                    className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => stopMonitoring(selectedAgentData.id)}
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    Stop Monitoring
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <Ear className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-2">No Active Monitoring</p>
                  <p className="text-sm text-gray-400">
                    Click a monitoring button on an active call to start
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

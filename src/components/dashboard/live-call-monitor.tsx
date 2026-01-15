"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  Users,
  Clock,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  UserPlus,
  Mic,
  MicOff,
  BarChart2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LiveCall {
  id: string;
  callId: string;
  direction: "inbound" | "outbound";
  callerNumber: string;
  callerName: string;
  calledNumber: string;
  calledName: string;
  agent: string;
  agentExtension: string;
  status: "ringing" | "connected" | "on-hold" | "transferring";
  startTime: string;
  answerTime: string | null;
  queue: string | null;
  isRecording: boolean;
  isMuted: boolean;
  isMonitored: boolean;
}

// Mock live calls
const mockLiveCalls: LiveCall[] = [
  {
    id: "1",
    callId: "call_001",
    direction: "inbound",
    callerNumber: "+1 (555) 123-4567",
    callerName: "John Smith",
    calledNumber: "+1 (800) 555-0100",
    calledName: "Main Line",
    agent: "Sarah Johnson",
    agentExtension: "101",
    status: "connected",
    startTime: new Date(Date.now() - 245000).toISOString(),
    answerTime: new Date(Date.now() - 240000).toISOString(),
    queue: "Sales",
    isRecording: true,
    isMuted: false,
    isMonitored: false,
  },
  {
    id: "2",
    callId: "call_002",
    direction: "outbound",
    callerNumber: "+1 (800) 555-0100",
    callerName: "Mike Wilson",
    calledNumber: "+1 (555) 987-6543",
    calledName: "Customer - ABC Corp",
    agent: "Mike Wilson",
    agentExtension: "102",
    status: "connected",
    startTime: new Date(Date.now() - 120000).toISOString(),
    answerTime: new Date(Date.now() - 115000).toISOString(),
    queue: null,
    isRecording: true,
    isMuted: false,
    isMonitored: true,
  },
  {
    id: "3",
    callId: "call_003",
    direction: "inbound",
    callerNumber: "+1 (555) 456-7890",
    callerName: "Unknown",
    calledNumber: "+1 (800) 555-0100",
    calledName: "Support Line",
    agent: "Emily Chen",
    agentExtension: "103",
    status: "on-hold",
    startTime: new Date(Date.now() - 180000).toISOString(),
    answerTime: new Date(Date.now() - 170000).toISOString(),
    queue: "Support",
    isRecording: true,
    isMuted: true,
    isMonitored: false,
  },
  {
    id: "4",
    callId: "call_004",
    direction: "inbound",
    callerNumber: "+1 (555) 321-0987",
    callerName: "Jane Doe",
    calledNumber: "+1 (800) 555-0100",
    calledName: "Main Line",
    agent: "",
    agentExtension: "",
    status: "ringing",
    startTime: new Date(Date.now() - 15000).toISOString(),
    answerTime: null,
    queue: "Sales",
    isRecording: false,
    isMuted: false,
    isMonitored: false,
  },
];

export function LiveCallMonitor() {
  const [calls, setCalls] = useState<LiveCall[]>(mockLiveCalls);
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [, setCurrentTime] = useState(new Date());

  // Update time for duration calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (startTime: string, answerTime: string | null) => {
    const start = answerTime ? new Date(answerTime) : new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredCalls = calls.filter((call) => {
    if (filterStatus === "all") return true;
    return call.status === filterStatus;
  });

  const stats = {
    total: calls.length,
    connected: calls.filter((c) => c.status === "connected").length,
    ringing: calls.filter((c) => c.status === "ringing").length,
    onHold: calls.filter((c) => c.status === "on-hold").length,
    inbound: calls.filter((c) => c.direction === "inbound").length,
    outbound: calls.filter((c) => c.direction === "outbound").length,
  };

  const handleMonitor = (callId: string) => {
    setCalls(
      calls.map((c) =>
        c.id === callId ? { ...c, isMonitored: !c.isMonitored } : c
      )
    );
  };

  const handleMute = (callId: string) => {
    setCalls(
      calls.map((c) => (c.id === callId ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  const handleEndCall = (callId: string) => {
    setCalls(calls.filter((c) => c.id !== callId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "ringing":
        return "bg-yellow-500 animate-pulse";
      case "on-hold":
        return "bg-orange-500";
      case "transferring":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "ringing":
        return "Ringing";
      case "on-hold":
        return "On Hold";
      case "transferring":
        return "Transferring";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Call Monitor
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time view of all active calls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              "gap-2 dark:border-gray-700",
              autoRefresh && "text-green-600"
            )}
          >
            <RefreshCw
              className={cn("h-4 w-4", autoRefresh && "animate-spin")}
            />
            {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#1E3A5F]" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Active Calls
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.connected}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Connected
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.ringing}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ringing
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.onHold}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            On Hold
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <PhoneIncoming className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.inbound}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Inbound
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <PhoneOutgoing className="h-5 w-5 text-purple-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.outbound}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Outbound
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "connected", "ringing", "on-hold"].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(status)}
            className={cn(
              filterStatus === status && "bg-[#1E3A5F] hover:bg-[#2d4a6f]",
              "dark:border-gray-700"
            )}
          >
            {status === "all"
              ? "All Calls"
              : status === "on-hold"
                ? "On Hold"
                : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Calls List */}
      <div className="space-y-3">
        {filteredCalls.map((call) => (
          <div
            key={call.id}
            className={cn(
              "p-4 bg-white dark:bg-gray-800 rounded-xl border transition-all",
              selectedCall === call.id
                ? "border-[#1E3A5F] dark:border-[#C9A227] shadow-md"
                : "border-gray-200 dark:border-gray-700",
              call.status === "ringing" && "border-yellow-300"
            )}
            onClick={() =>
              setSelectedCall(selectedCall === call.id ? null : call.id)
            }
          >
            <div className="flex items-center justify-between">
              {/* Call Info */}
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    call.direction === "inbound"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-purple-100 dark:bg-purple-900/30"
                  )}
                >
                  {call.direction === "inbound" ? (
                    <PhoneIncoming className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <PhoneOutgoing className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {call.callerName !== "Unknown"
                        ? call.callerName
                        : call.callerNumber}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-full text-white",
                        getStatusColor(call.status)
                      )}
                    >
                      {getStatusLabel(call.status)}
                    </span>
                    {call.isRecording && (
                      <span className="flex items-center gap-1 text-xs text-red-500">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        REC
                      </span>
                    )}
                    {call.isMonitored && (
                      <Eye className="h-4 w-4 text-[#C9A227]" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>{call.callerNumber}</span>
                    <span>→</span>
                    <span>{call.calledName}</span>
                    {call.queue && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                        {call.queue} Queue
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Agent & Duration */}
              <div className="flex items-center gap-6">
                {call.agent && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {call.agent}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ext. {call.agentExtension}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-lg font-mono text-gray-900 dark:text-white">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {formatDuration(call.startTime, call.answerTime)}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMonitor(call.id);
                    }}
                    className={cn(
                      "h-8 w-8 p-0",
                      call.isMonitored && "text-[#C9A227]"
                    )}
                    title={call.isMonitored ? "Stop Monitor" : "Monitor Call"}
                  >
                    {call.isMonitored ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMute(call.id);
                    }}
                    className={cn("h-8 w-8 p-0", call.isMuted && "text-red-500")}
                    title={call.isMuted ? "Unmute" : "Mute"}
                  >
                    {call.isMuted ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEndCall(call.id);
                    }}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="End Call"
                  >
                    <PhoneOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedCall === call.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Call ID
                    </p>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">
                      {call.callId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Start Time
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(call.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Called Number
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {call.calledNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Direction
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white capitalize">
                      {call.direction}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Volume2 className="h-4 w-4" />
                    Whisper
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <UserPlus className="h-4 w-4" />
                    Barge In
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Users className="h-4 w-4" />
                    Transfer
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <BarChart2 className="h-4 w-4" />
                    Call Quality
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredCalls.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No active calls</p>
            <p className="text-sm mt-1">
              Calls will appear here when they&apos;re in progress
            </p>
          </div>
        )}
      </div>

      {/* Alert for long calls */}
      {calls.some(
        (c) =>
          c.answerTime &&
          Date.now() - new Date(c.answerTime).getTime() > 600000
      ) && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              Long Call Alert
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              One or more calls have exceeded 10 minutes
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

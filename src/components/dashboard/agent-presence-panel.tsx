"use client";

import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Clock,
  Circle,
  Search,
  RefreshCw,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  extension: string;
  status: "available" | "busy" | "away" | "dnd" | "offline";
  statusMessage: string | null;
  onCall: boolean;
  callDuration: number | null;
  lastActivity: string;
}

// Mock agents
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    extension: "101",
    status: "available",
    statusMessage: null,
    onCall: false,
    callDuration: null,
    lastActivity: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mike Wilson",
    extension: "102",
    status: "busy",
    statusMessage: "In a meeting",
    onCall: true,
    callDuration: 245,
    lastActivity: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Emily Chen",
    extension: "103",
    status: "away",
    statusMessage: "Back in 15 mins",
    onCall: false,
    callDuration: null,
    lastActivity: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "4",
    name: "David Brown",
    extension: "104",
    status: "dnd",
    statusMessage: "Focus time",
    onCall: false,
    callDuration: null,
    lastActivity: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "5",
    name: "Jessica Lee",
    extension: "105",
    status: "available",
    statusMessage: null,
    onCall: false,
    callDuration: null,
    lastActivity: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Chris Taylor",
    extension: "106",
    status: "offline",
    statusMessage: null,
    onCall: false,
    callDuration: null,
    lastActivity: new Date(Date.now() - 7200000).toISOString(),
  },
];

const statusConfig = {
  available: { color: "bg-green-500", label: "Available" },
  busy: { color: "bg-red-500", label: "Busy" },
  away: { color: "bg-yellow-500", label: "Away" },
  dnd: { color: "bg-purple-500", label: "Do Not Disturb" },
  offline: { color: "bg-gray-400", label: "Offline" },
};

export function AgentPresencePanel() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [, setCurrentTime] = useState(new Date());

  // Update timer for call durations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setAgents((prev) =>
        prev.map((agent) =>
          agent.onCall && agent.callDuration !== null
            ? { ...agent, callDuration: agent.callDuration + 1 }
            : agent
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatLastActivity = (timestamp: string) => {
    const diff = Math.floor(
      (Date.now() - new Date(timestamp).getTime()) / 1000
    );
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.extension.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: agents.length,
    available: agents.filter((a) => a.status === "available").length,
    busy: agents.filter((a) => a.status === "busy").length,
    onCall: agents.filter((a) => a.onCall).length,
  };

  const handleStatusChange = (agentId: string, newStatus: Agent["status"]) => {
    setAgents(
      agents.map((a) => (a.id === agentId ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Team Presence
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            See who&apos;s available and their current status
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 dark:border-gray-700">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.available}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.busy}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Busy</p>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.onCall}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">On Call</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or extension..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="away">Away</option>
          <option value="dnd">Do Not Disturb</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Agent List */}
      <div className="space-y-2">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {/* Avatar with status indicator */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800",
                    statusConfig[agent.status].color
                  )}
                />
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {agent.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Ext. {agent.extension}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      agent.status === "available" &&
                        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                      agent.status === "busy" &&
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                      agent.status === "away" &&
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                      agent.status === "dnd" &&
                        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                      agent.status === "offline" &&
                        "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                    )}
                  >
                    {statusConfig[agent.status].label}
                  </span>
                  {agent.statusMessage && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {agent.statusMessage}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Call status */}
              {agent.onCall && agent.callDuration !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="font-mono text-gray-900 dark:text-white">
                    {formatDuration(agent.callDuration)}
                  </span>
                </div>
              )}

              {/* Last activity */}
              {!agent.onCall && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  {formatLastActivity(agent.lastActivity)}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Button size="sm" variant="ghost" className="h-8 px-2 gap-1">
                    <Circle
                      className={cn(
                        "h-3 w-3",
                        statusConfig[agent.status].color.replace("bg-", "fill-").replace("-500", "-500 text-transparent")
                      )}
                    />
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAgents.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No agents found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

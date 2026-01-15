"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Phone,
  Clock,
  UserPlus,
  Settings,
  Trash2,
  Save,
  Loader2,
  Music,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QueueAgent {
  id: string;
  name: string;
  extension: string;
  status: "available" | "busy" | "offline";
  callsHandled: number;
}

interface CallQueue {
  id: string;
  name: string;
  description?: string;
  agents: QueueAgent[];
  settings: {
    ringStrategy: "round_robin" | "ring_all" | "least_recent" | "fewest_calls";
    ringTimeout: number;
    maxWaitTime: number;
    holdMusic: string;
    announcePosition: boolean;
    announceWaitTime: boolean;
  };
}

interface CallQueueProps {
  queue?: CallQueue;
  availableAgents?: QueueAgent[];
  onSave?: (queue: CallQueue) => Promise<void>;
  className?: string;
}

const defaultQueue: CallQueue = {
  id: "queue-1",
  name: "Support Queue",
  description: "Customer support calls",
  agents: [
    { id: "1", name: "Sarah Johnson", extension: "102", status: "available", callsHandled: 24 },
    { id: "2", name: "Mike Williams", extension: "103", status: "busy", callsHandled: 18 },
    { id: "3", name: "Emily Brown", extension: "104", status: "available", callsHandled: 31 },
  ],
  settings: {
    ringStrategy: "round_robin",
    ringTimeout: 20,
    maxWaitTime: 300,
    holdMusic: "default",
    announcePosition: true,
    announceWaitTime: false,
  },
};

const defaultAvailableAgents: QueueAgent[] = [
  { id: "4", name: "John Smith", extension: "105", status: "available", callsHandled: 0 },
  { id: "5", name: "Lisa Davis", extension: "106", status: "offline", callsHandled: 0 },
];

const ringStrategies = [
  { value: "round_robin", label: "Round Robin", description: "Distribute calls evenly" },
  { value: "ring_all", label: "Ring All", description: "Ring all agents simultaneously" },
  { value: "least_recent", label: "Least Recent", description: "Agent who hasn't taken a call longest" },
  { value: "fewest_calls", label: "Fewest Calls", description: "Agent with fewest calls today" },
];

const holdMusicOptions = [
  { value: "default", label: "Default Music" },
  { value: "classical", label: "Classical" },
  { value: "jazz", label: "Jazz" },
  { value: "ambient", label: "Ambient" },
  { value: "silence", label: "Silence" },
];

const statusColors = {
  available: "bg-green-500",
  busy: "bg-red-500",
  offline: "bg-gray-400",
};

export function CallQueueManager({
  queue: initialQueue = defaultQueue,
  availableAgents = defaultAvailableAgents,
  onSave,
  className,
}: CallQueueProps) {
  const [queue, setQueue] = useState<CallQueue>(initialQueue);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleUpdateSettings = (key: keyof CallQueue["settings"], value: string | number | boolean) => {
    setQueue((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
    setHasChanges(true);
  };

  const handleAddAgent = (agentId: string) => {
    const agent = availableAgents.find((a) => a.id === agentId);
    if (agent) {
      setQueue((prev) => ({
        ...prev,
        agents: [...prev.agents, agent],
      }));
      setHasChanges(true);
    }
  };

  const handleRemoveAgent = (agentId: string) => {
    setQueue((prev) => ({
      ...prev,
      agents: prev.agents.filter((a) => a.id !== agentId),
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(queue);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const unassignedAgents = availableAgents.filter(
    (a) => !queue.agents.find((qa) => qa.id === a.id)
  );

  const availableCount = queue.agents.filter((a) => a.status === "available").length;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
          <Users className="h-5 w-5" />
          Call Queue Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Queue Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Queue Name</label>
            <input
              type="text"
              value={queue.name}
              onChange={(e) => {
                setQueue((prev) => ({ ...prev, name: e.target.value }));
                setHasChanges(true);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={queue.description || ""}
              onChange={(e) => {
                setQueue((prev) => ({ ...prev, description: e.target.value }));
                setHasChanges(true);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all"
              placeholder="Optional description"
            />
          </div>
        </div>

        {/* Queue Status */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#2D5A8F] text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{queue.agents.length}</p>
              <p className="text-sm text-white/70">Total Agents</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{availableCount}</p>
              <p className="text-sm text-white/70">Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {queue.agents.reduce((sum, a) => sum + a.callsHandled, 0)}
              </p>
              <p className="text-sm text-white/70">Calls Today</p>
            </div>
          </div>
        </div>

        {/* Agents List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Queue Agents</label>
            {unassignedAgents.length > 0 && (
              <select
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddAgent(e.target.value);
                    e.target.value = "";
                  }
                }}
                defaultValue=""
              >
                <option value="">+ Add Agent</option>
                {unassignedAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} (Ext. {agent.extension})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            {queue.agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Status Indicator */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <div
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                      statusColors[agent.status]
                    )}
                  />
                </div>

                {/* Agent Info */}
                <div className="flex-1">
                  <p className="font-medium text-[#1E3A5F]">{agent.name}</p>
                  <p className="text-sm text-gray-500">
                    Ext. {agent.extension} • {agent.callsHandled} calls today
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    agent.status === "available" && "bg-green-100 text-green-700",
                    agent.status === "busy" && "bg-red-100 text-red-700",
                    agent.status === "offline" && "bg-gray-100 text-gray-600"
                  )}
                >
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </span>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveAgent(agent.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}

            {queue.agents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>No agents in this queue</p>
                <p className="text-sm">Add agents to start receiving calls</p>
              </div>
            )}
          </div>
        </div>

        {/* Queue Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-[#1E3A5F] flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Queue Settings
          </h4>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Ring Strategy */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ring Strategy</label>
              <select
                value={queue.settings.ringStrategy}
                onChange={(e) => handleUpdateSettings("ringStrategy", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
              >
                {ringStrategies.map((strategy) => (
                  <option key={strategy.value} value={strategy.value}>
                    {strategy.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ring Timeout */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ring Timeout</label>
              <select
                value={queue.settings.ringTimeout}
                onChange={(e) => handleUpdateSettings("ringTimeout", parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
              >
                {[10, 15, 20, 25, 30].map((t) => (
                  <option key={t} value={t}>
                    {t} seconds
                  </option>
                ))}
              </select>
            </div>

            {/* Max Wait Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Max Wait Time</label>
              <select
                value={queue.settings.maxWaitTime}
                onChange={(e) => handleUpdateSettings("maxWaitTime", parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
              >
                {[60, 120, 180, 300, 600].map((t) => (
                  <option key={t} value={t}>
                    {t / 60} minute{t > 60 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Hold Music */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Music className="h-4 w-4" />
                Hold Music
              </label>
              <select
                value={queue.settings.holdMusic}
                onChange={(e) => handleUpdateSettings("holdMusic", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
              >
                {holdMusicOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Announcements */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={queue.settings.announcePosition}
                onChange={(e) => handleUpdateSettings("announcePosition", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#C9A227] focus:ring-[#C9A227]"
              />
              <span className="text-sm text-gray-700">Announce queue position</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={queue.settings.announceWaitTime}
                onChange={(e) => handleUpdateSettings("announceWaitTime", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#C9A227] focus:ring-[#C9A227]"
              />
              <span className="text-sm text-gray-700">Announce estimated wait time</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          {hasChanges && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[#C9A227]"
            >
              Unsaved changes
            </motion.span>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="gap-2 bg-[#C9A227] hover:bg-[#B8911F] text-white"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Queue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CallQueueManager;

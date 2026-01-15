"use client";

import { useState } from "react";
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  Users,
  Clock,
  Settings,
  Phone,
  PhoneOff,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Repeat,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HuntGroupMember {
  id: string;
  name: string;
  extension: string;
  priority: number;
  maxCalls: number;
  currentCalls: number;
  totalCallsToday: number;
  isAvailable: boolean;
  skills: string[];
}

interface HuntGroup {
  id: string;
  name: string;
  extension: string;
  huntType: "linear" | "circular" | "uniform" | "weighted" | "skill-based";
  ringTime: number;
  maxCycles: number;
  wrapUpTime: number;
  noAnswerDestination: "voicemail" | "extension" | "queue" | "disconnect";
  noAnswerExtension?: string;
  members: HuntGroupMember[];
  isActive: boolean;
  statistics: {
    callsToday: number;
    avgWaitTime: number;
    abandonRate: number;
  };
  createdAt: string;
}

// Mock hunt groups
const mockHuntGroups: HuntGroup[] = [
  {
    id: "1",
    name: "Customer Service",
    extension: "500",
    huntType: "uniform",
    ringTime: 20,
    maxCycles: 3,
    wrapUpTime: 30,
    noAnswerDestination: "voicemail",
    members: [
      {
        id: "m1",
        name: "Alice Johnson",
        extension: "501",
        priority: 1,
        maxCalls: 3,
        currentCalls: 1,
        totalCallsToday: 15,
        isAvailable: true,
        skills: ["billing", "technical"],
      },
      {
        id: "m2",
        name: "Bob Williams",
        extension: "502",
        priority: 1,
        maxCalls: 3,
        currentCalls: 0,
        totalCallsToday: 12,
        isAvailable: true,
        skills: ["sales", "billing"],
      },
      {
        id: "m3",
        name: "Carol Davis",
        extension: "503",
        priority: 2,
        maxCalls: 2,
        currentCalls: 2,
        totalCallsToday: 18,
        isAvailable: false,
        skills: ["technical", "support"],
      },
    ],
    isActive: true,
    statistics: {
      callsToday: 45,
      avgWaitTime: 28,
      abandonRate: 3.2,
    },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Tech Support",
    extension: "600",
    huntType: "skill-based",
    ringTime: 25,
    maxCycles: 2,
    wrapUpTime: 60,
    noAnswerDestination: "queue",
    noAnswerExtension: "650",
    members: [
      {
        id: "m4",
        name: "Dan Miller",
        extension: "601",
        priority: 1,
        maxCalls: 2,
        currentCalls: 1,
        totalCallsToday: 8,
        isAvailable: true,
        skills: ["hardware", "networking"],
      },
      {
        id: "m5",
        name: "Eve Taylor",
        extension: "602",
        priority: 1,
        maxCalls: 2,
        currentCalls: 0,
        totalCallsToday: 10,
        isAvailable: true,
        skills: ["software", "cloud"],
      },
    ],
    isActive: true,
    statistics: {
      callsToday: 18,
      avgWaitTime: 42,
      abandonRate: 5.1,
    },
    createdAt: "2024-01-03T00:00:00Z",
  },
];

const huntTypeConfig = {
  linear: {
    label: "Linear",
    description: "Ring members in order, always starting from first",
    icon: ArrowRight,
  },
  circular: {
    label: "Circular",
    description: "Ring members in order, starting from where last call ended",
    icon: Repeat,
  },
  uniform: {
    label: "Uniform",
    description: "Ring the member with fewest calls",
    icon: Users,
  },
  weighted: {
    label: "Weighted",
    description: "Distribute calls based on priority weights",
    icon: Target,
  },
  "skill-based": {
    label: "Skill-Based",
    description: "Route to members with matching skills",
    icon: Settings,
  },
};

export function HuntGroups() {
  const [huntGroups, setHuntGroups] = useState<HuntGroup[]>(mockHuntGroups);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(
    mockHuntGroups[0]?.id || null
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    extension: "",
    huntType: "uniform" as HuntGroup["huntType"],
    ringTime: 20,
    maxCycles: 3,
    wrapUpTime: 30,
  });

  const handleToggleActive = (groupId: string) => {
    setHuntGroups(
      huntGroups.map((group) =>
        group.id === groupId ? { ...group, isActive: !group.isActive } : group
      )
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    setHuntGroups(huntGroups.filter((g) => g.id !== groupId));
  };

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.extension) return;

    const group: HuntGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      extension: newGroup.extension,
      huntType: newGroup.huntType,
      ringTime: newGroup.ringTime,
      maxCycles: newGroup.maxCycles,
      wrapUpTime: newGroup.wrapUpTime,
      noAnswerDestination: "voicemail",
      members: [],
      isActive: true,
      statistics: {
        callsToday: 0,
        avgWaitTime: 0,
        abandonRate: 0,
      },
      createdAt: new Date().toISOString(),
    };

    setHuntGroups([...huntGroups, group]);
    setShowCreateForm(false);
    setNewGroup({
      name: "",
      extension: "",
      huntType: "uniform",
      ringTime: 20,
      maxCycles: 3,
      wrapUpTime: 30,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Hunt Groups
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Advanced call distribution with load balancing and skills routing
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Hunt Group
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {huntGroups.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hunt Groups
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {huntGroups.reduce((sum, g) => sum + g.statistics.callsToday, 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Calls Today
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(
                  huntGroups.reduce(
                    (sum, g) => sum + g.statistics.avgWaitTime,
                    0
                  ) / huntGroups.length
                )}
                s
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg. Wait
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <PhoneOff className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(
                  huntGroups.reduce(
                    (sum, g) => sum + g.statistics.abandonRate,
                    0
                  ) / huntGroups.length
                ).toFixed(1)}
                %
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Abandon Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Create Hunt Group
            </h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Group Name
              </label>
              <Input
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                placeholder="Customer Service"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Extension
              </label>
              <Input
                value={newGroup.extension}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, extension: e.target.value })
                }
                placeholder="500"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hunt Type
              </label>
              <select
                value={newGroup.huntType}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    huntType: e.target.value as HuntGroup["huntType"],
                  })
                }
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(huntTypeConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ring Time (sec)
              </label>
              <Input
                type="number"
                value={newGroup.ringTime}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    ringTime: parseInt(e.target.value) || 20,
                  })
                }
                min={10}
                max={60}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Cycles
              </label>
              <Input
                type="number"
                value={newGroup.maxCycles}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    maxCycles: parseInt(e.target.value) || 3,
                  })
                }
                min={1}
                max={10}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wrap-up Time (sec)
              </label>
              <Input
                type="number"
                value={newGroup.wrapUpTime}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    wrapUpTime: parseInt(e.target.value) || 30,
                  })
                }
                min={0}
                max={300}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleCreateGroup} className="btn-primary">
              Create Group
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
              className="dark:border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Hunt Groups List */}
      <div className="space-y-4">
        {huntGroups.map((group) => {
          const huntTypeInfo = huntTypeConfig[group.huntType];
          const isExpanded = expandedGroup === group.id;
          const availableMembers = group.members.filter((m) => m.isAvailable);

          return (
            <div
              key={group.id}
              className={cn(
                "bg-white dark:bg-gray-800 rounded-xl border transition-all overflow-hidden",
                group.isActive
                  ? "border-blue-300 dark:border-blue-700"
                  : "border-gray-200 dark:border-gray-700"
              )}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        group.isActive
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      )}
                    >
                      <huntTypeInfo.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {group.name}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Ext. {group.extension}
                        </span>
                        {group.isActive && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{huntTypeInfo.label}</span>
                        <span>
                          {availableMembers.length}/{group.members.length}{" "}
                          agents
                        </span>
                        <span>{group.statistics.callsToday} calls today</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quick Stats */}
                    <div className="hidden md:flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {group.statistics.avgWaitTime}s
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Avg Wait
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {group.statistics.abandonRate}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Abandon
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(group.id);
                      }}
                      className={cn(
                        group.isActive
                          ? "text-blue-600 hover:text-blue-700"
                          : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      {group.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="pt-4 space-y-4">
                    {/* Members Table */}
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                        Agents ({group.members.length})
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                                Agent
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                                Extension
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                                Priority
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                                Calls
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                                Skills
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {group.members.map((member) => (
                              <tr key={member.id}>
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                  {member.name}
                                </td>
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                  {member.extension}
                                </td>
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                  {member.priority}
                                </td>
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                  {member.currentCalls}/{member.maxCalls} (
                                  {member.totalCallsToday} today)
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {member.skills.map((skill) => (
                                      <span
                                        key={skill}
                                        className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 text-xs font-medium rounded-full",
                                      member.isAvailable
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                    )}
                                  >
                                    {member.isAvailable
                                      ? "Available"
                                      : "Busy"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Ring Time
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {group.ringTime} seconds
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Max Cycles
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {group.maxCycles}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Wrap-up Time
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {group.wrapUpTime} seconds
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          No Answer
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {group.noAnswerDestination}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Hunt Type
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {huntTypeInfo.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {huntGroups.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No hunt groups configured</p>
            <p className="text-sm mt-1">
              Create your first hunt group for advanced call distribution
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

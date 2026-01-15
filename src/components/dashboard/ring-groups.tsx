"use client";

import { useState } from "react";
import {
  PhoneCall,
  Plus,
  Edit2,
  Trash2,
  Users,
  Clock,
  Settings,
  GripVertical,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RingGroupMember {
  id: string;
  name: string;
  extension: string;
  phoneNumber?: string;
  isAvailable: boolean;
}

interface RingGroup {
  id: string;
  name: string;
  extension: string;
  strategy: "simultaneous" | "sequential" | "random" | "least-recent";
  ringTimeout: number;
  noAnswerDestination: "voicemail" | "extension" | "queue" | "hangup";
  noAnswerExtension?: string;
  members: RingGroupMember[];
  isActive: boolean;
  callerId: string;
  createdAt: string;
}

// Mock ring groups
const mockRingGroups: RingGroup[] = [
  {
    id: "1",
    name: "Sales Team",
    extension: "800",
    strategy: "simultaneous",
    ringTimeout: 30,
    noAnswerDestination: "voicemail",
    members: [
      { id: "m1", name: "John Smith", extension: "101", isAvailable: true },
      { id: "m2", name: "Sarah Wilson", extension: "102", isAvailable: true },
      { id: "m3", name: "Mike Johnson", extension: "103", isAvailable: false },
    ],
    isActive: true,
    callerId: "Sales Team",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Support Team",
    extension: "900",
    strategy: "sequential",
    ringTimeout: 20,
    noAnswerDestination: "queue",
    noAnswerExtension: "950",
    members: [
      { id: "m4", name: "Emily Brown", extension: "201", isAvailable: true },
      { id: "m5", name: "David Lee", extension: "202", isAvailable: true },
    ],
    isActive: true,
    callerId: "Support",
    createdAt: "2024-01-05T00:00:00Z",
  },
];

const strategyConfig = {
  simultaneous: {
    label: "Ring All",
    description: "Ring all members at the same time",
    icon: Volume2,
  },
  sequential: {
    label: "Sequential",
    description: "Ring members one by one in order",
    icon: ChevronDown,
  },
  random: {
    label: "Random",
    description: "Ring members in random order",
    icon: Settings,
  },
  "least-recent": {
    label: "Least Recent",
    description: "Ring the member who hasn't taken a call recently",
    icon: Clock,
  },
};

export function RingGroups() {
  const [ringGroups, setRingGroups] = useState<RingGroup[]>(mockRingGroups);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(
    mockRingGroups[0]?.id || null
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    extension: "",
    strategy: "simultaneous" as RingGroup["strategy"],
    ringTimeout: 30,
  });

  const handleToggleActive = (groupId: string) => {
    setRingGroups(
      ringGroups.map((group) =>
        group.id === groupId ? { ...group, isActive: !group.isActive } : group
      )
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    setRingGroups(ringGroups.filter((g) => g.id !== groupId));
  };

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.extension) return;

    const group: RingGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      extension: newGroup.extension,
      strategy: newGroup.strategy,
      ringTimeout: newGroup.ringTimeout,
      noAnswerDestination: "voicemail",
      members: [],
      isActive: true,
      callerId: newGroup.name,
      createdAt: new Date().toISOString(),
    };

    setRingGroups([...ringGroups, group]);
    setShowCreateForm(false);
    setNewGroup({
      name: "",
      extension: "",
      strategy: "simultaneous",
      ringTimeout: 30,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ring Groups
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Group extensions to ring multiple phones for incoming calls
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Ring Group
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <PhoneCall className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ringGroups.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ring Groups
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ringGroups.reduce((sum, g) => sum + g.members.length, 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Members
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Check className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ringGroups.filter((g) => g.isActive).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Create Ring Group
            </h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Group Name
              </label>
              <Input
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                placeholder="Sales Team"
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
                placeholder="800"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ring Strategy
              </label>
              <select
                value={newGroup.strategy}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    strategy: e.target.value as RingGroup["strategy"],
                  })
                }
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(strategyConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ring Timeout (seconds)
              </label>
              <Input
                type="number"
                value={newGroup.ringTimeout}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    ringTimeout: parseInt(e.target.value) || 30,
                  })
                }
                min={10}
                max={120}
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

      {/* Ring Groups List */}
      <div className="space-y-4">
        {ringGroups.map((group) => {
          const strategyInfo = strategyConfig[group.strategy];
          const isExpanded = expandedGroup === group.id;
          const availableMembers = group.members.filter((m) => m.isAvailable);

          return (
            <div
              key={group.id}
              className={cn(
                "bg-white dark:bg-gray-800 rounded-xl border transition-all overflow-hidden",
                group.isActive
                  ? "border-green-300 dark:border-green-700"
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
                        "w-12 h-12 rounded-xl flex items-center justify-center font-bold",
                        group.isActive
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {group.extension}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {group.name}
                        </h4>
                        {group.isActive && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {availableMembers.length}/{group.members.length}{" "}
                          available
                        </span>
                        <span className="flex items-center gap-1">
                          <strategyInfo.icon className="h-4 w-4" />
                          {strategyInfo.label}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {group.ringTimeout}s
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(group.id);
                      }}
                      className={cn(
                        group.isActive
                          ? "text-green-600 hover:text-green-700"
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
                    {/* Members */}
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                        Members ({group.members.length})
                      </h5>
                      {group.members.length > 0 ? (
                        <div className="space-y-2">
                          {group.members.map((member, index) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                                <span className="w-6 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {index + 1}
                                </span>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {member.name}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Ext. {member.extension}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={cn(
                                  "px-2 py-0.5 text-xs font-medium rounded-full",
                                  member.isAvailable
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                )}
                              >
                                {member.isAvailable ? "Available" : "Unavailable"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No members added yet
                        </p>
                      )}
                    </div>

                    {/* Settings Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Strategy
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {strategyInfo.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Ring Timeout
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {group.ringTimeout} seconds
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
                          Caller ID
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {group.callerId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {ringGroups.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <PhoneCall className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No ring groups configured</p>
            <p className="text-sm mt-1">
              Create your first ring group to route calls to multiple extensions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Users,
  Phone,
  Volume2,
  Settings,
  Play,
  Square,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Mic,
  Radio,
} from "lucide-react";

type PageMode = "simultaneous" | "sequential";

type PagingGroup = {
  id: string;
  name: string;
  extension: string;
  description: string;
  mode: PageMode;
  members: {
    id: string;
    name: string;
    extension: string;
    type: "extension" | "group";
  }[];
  announcementFirst: boolean;
  announcementFile?: string;
  timeout: number;
  isActive: boolean;
  lastUsed?: string;
  usageCount: number;
};

const mockPagingGroups: PagingGroup[] = [
  {
    id: "page_1",
    name: "All Hands",
    extension: "800",
    description: "Company-wide announcement to all phones",
    mode: "simultaneous",
    members: [
      { id: "m1", name: "Sales Team", extension: "810", type: "group" },
      { id: "m2", name: "Support Team", extension: "820", type: "group" },
      { id: "m3", name: "Front Desk", extension: "100", type: "extension" },
      { id: "m4", name: "Management", extension: "830", type: "group" },
    ],
    announcementFirst: true,
    announcementFile: "attention_please.wav",
    timeout: 30,
    isActive: true,
    lastUsed: "2024-01-15T09:30:00Z",
    usageCount: 156,
  },
  {
    id: "page_2",
    name: "Sales Floor",
    extension: "810",
    description: "Sales department announcement",
    mode: "simultaneous",
    members: [
      { id: "m5", name: "Michael Chen", extension: "101", type: "extension" },
      { id: "m6", name: "Emily Davis", extension: "102", type: "extension" },
      { id: "m7", name: "David Wilson", extension: "103", type: "extension" },
    ],
    announcementFirst: false,
    timeout: 20,
    isActive: true,
    lastUsed: "2024-01-15T14:15:00Z",
    usageCount: 89,
  },
  {
    id: "page_3",
    name: "Warehouse",
    extension: "850",
    description: "Warehouse and shipping area",
    mode: "sequential",
    members: [
      { id: "m8", name: "Shipping Desk", extension: "501", type: "extension" },
      { id: "m9", name: "Warehouse 1", extension: "502", type: "extension" },
      { id: "m10", name: "Warehouse 2", extension: "503", type: "extension" },
      { id: "m11", name: "Loading Dock", extension: "504", type: "extension" },
    ],
    announcementFirst: true,
    announcementFile: "warehouse_alert.wav",
    timeout: 60,
    isActive: true,
    lastUsed: "2024-01-14T16:45:00Z",
    usageCount: 234,
  },
  {
    id: "page_4",
    name: "Emergency",
    extension: "911",
    description: "Emergency broadcast to all locations",
    mode: "simultaneous",
    members: [
      { id: "m12", name: "All Hands", extension: "800", type: "group" },
      { id: "m13", name: "Security", extension: "900", type: "extension" },
    ],
    announcementFirst: true,
    announcementFile: "emergency_tone.wav",
    timeout: 120,
    isActive: true,
    usageCount: 3,
  },
];

export function PagingGroups() {
  const [groups, setGroups] = useState(mockPagingGroups);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [isPaging, setIsPaging] = useState<string | null>(null);

  const selectedGroupData = groups.find((g) => g.id === selectedGroup);

  const stats = {
    total: groups.length,
    active: groups.filter((g) => g.isActive).length,
    totalMembers: groups.reduce((acc, g) => acc + g.members.length, 0),
    totalUsage: groups.reduce((acc, g) => acc + g.usageCount, 0),
  };

  const startPaging = (groupId: string) => {
    setIsPaging(groupId);
    // Simulate paging duration
    setTimeout(() => setIsPaging(null), 5000);
  };

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter((g) => g.id !== groupId));
    if (selectedGroup === groupId) {
      setSelectedGroup(null);
    }
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
                  <Megaphone className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Paging Groups</p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.active}</p>
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
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Members</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.totalMembers}</p>
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
                  <Volume2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Pages</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.totalUsage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white">Paging Groups</h3>
        <Button className="btn-primary gap-2" onClick={() => setShowAddGroup(true)}>
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {groups.map((group, i) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`transition-all ${
              isPaging === group.id ? "ring-2 ring-green-500 shadow-lg" : ""
            } ${!group.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isPaging === group.id
                        ? "bg-green-500 text-white animate-pulse"
                        : group.name === "Emergency"
                        ? "bg-red-500 text-white"
                        : "bg-[#1E3A5F]/10 dark:bg-white/10 text-[#1E3A5F] dark:text-white"
                    }`}>
                      <Megaphone className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[#1E3A5F] dark:text-white">
                          {group.name}
                        </h4>
                        {isPaging === group.id && (
                          <Badge className="bg-green-500 text-white animate-pulse">LIVE</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Ext. {group.extension}</p>
                    </div>
                  </div>
                  <Badge className={group.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {group.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-500 mb-4">{group.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {group.members.slice(0, 3).map((member) => (
                    <Badge key={member.id} variant="outline" className="text-xs">
                      {member.type === "group" ? <Users className="h-3 w-3 mr-1" /> : <Phone className="h-3 w-3 mr-1" />}
                      {member.name}
                    </Badge>
                  ))}
                  {group.members.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{group.members.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500">Mode</p>
                    <p className="text-sm font-medium text-[#1E3A5F] dark:text-white capitalize">{group.mode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Timeout</p>
                    <p className="text-sm font-medium text-[#1E3A5F] dark:text-white">{group.timeout}s</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Usage</p>
                    <p className="text-sm font-medium text-[#1E3A5F] dark:text-white">{group.usageCount} pages</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Announcement</p>
                    <p className="text-sm font-medium text-[#1E3A5F] dark:text-white">
                      {group.announcementFirst ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t dark:border-gray-700">
                  {isPaging === group.id ? (
                    <Button
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => setIsPaging(null)}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop Page
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => startPaging(group.id)}
                      disabled={!group.isActive}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Page Now
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGroup(group.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Group Dialog */}
      {showAddGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Create Paging Group
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Group Name</label>
                      <Input placeholder="e.g., Sales Floor" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Extension</label>
                      <Input placeholder="e.g., 850" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input placeholder="Description of this paging group" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Paging Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 border-2 border-[#1E3A5F] rounded-lg cursor-pointer bg-[#1E3A5F]/5">
                        <Radio className="h-5 w-5 mx-auto mb-2 text-[#1E3A5F]" />
                        <p className="text-sm font-medium text-center">Simultaneous</p>
                        <p className="text-xs text-gray-500 text-center">All phones ring at once</p>
                      </div>
                      <div className="p-4 border rounded-lg cursor-pointer hover:border-gray-400">
                        <Clock className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-medium text-center">Sequential</p>
                        <p className="text-xs text-gray-500 text-center">Phones ring one by one</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Page Timeout (seconds)</label>
                    <Input type="number" placeholder="30" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="announcement" className="rounded" />
                    <label htmlFor="announcement" className="text-sm">
                      Play announcement tone before paging
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowAddGroup(false)}>Cancel</Button>
                  <Button className="btn-primary">Create Group</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

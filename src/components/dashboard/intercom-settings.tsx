"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Radio,
  Phone,
  Users,
  User,
  Settings,
  Shield,
  Bell,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Unlock,
  MessageSquare,
  Building2,
} from "lucide-react";

type IntercomMode = "auto_answer" | "ring_first" | "announce";

type IntercomPermission = {
  id: string;
  name: string;
  extension: string;
  type: "user" | "group" | "department";
  canInitiate: boolean;
  canReceive: boolean;
  autoAnswer: boolean;
  announceTone: boolean;
};

type IntercomSettings = {
  enabled: boolean;
  defaultMode: IntercomMode;
  ringDuration: number;
  autoAnswerDelay: number;
  announceToneFile: string;
  allowOverride: boolean;
  requireConfirmation: boolean;
  muteOnConnect: boolean;
  maxDuration: number;
  blockDuringCalls: boolean;
};

const mockPermissions: IntercomPermission[] = [
  {
    id: "perm_1",
    name: "Michael Chen",
    extension: "101",
    type: "user",
    canInitiate: true,
    canReceive: true,
    autoAnswer: true,
    announceTone: true,
  },
  {
    id: "perm_2",
    name: "Emily Davis",
    extension: "102",
    type: "user",
    canInitiate: true,
    canReceive: true,
    autoAnswer: true,
    announceTone: false,
  },
  {
    id: "perm_3",
    name: "Sales Team",
    extension: "810",
    type: "group",
    canInitiate: true,
    canReceive: true,
    autoAnswer: false,
    announceTone: true,
  },
  {
    id: "perm_4",
    name: "Support Team",
    extension: "820",
    type: "group",
    canInitiate: true,
    canReceive: true,
    autoAnswer: true,
    announceTone: true,
  },
  {
    id: "perm_5",
    name: "Management",
    extension: "830",
    type: "department",
    canInitiate: true,
    canReceive: true,
    autoAnswer: false,
    announceTone: true,
  },
  {
    id: "perm_6",
    name: "Conference Room A",
    extension: "601",
    type: "user",
    canInitiate: false,
    canReceive: true,
    autoAnswer: true,
    announceTone: true,
  },
];

const defaultSettings: IntercomSettings = {
  enabled: true,
  defaultMode: "auto_answer",
  ringDuration: 3,
  autoAnswerDelay: 1,
  announceToneFile: "intercom_tone.wav",
  allowOverride: true,
  requireConfirmation: false,
  muteOnConnect: true,
  maxDuration: 120,
  blockDuringCalls: true,
};

export function IntercomSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [permissions, setPermissions] = useState(mockPermissions);
  const [activeTab, setActiveTab] = useState<"settings" | "permissions">("settings");

  const togglePermission = (id: string, field: keyof IntercomPermission) => {
    setPermissions((perms) =>
      perms.map((p) =>
        p.id === id ? { ...p, [field]: !p[field as keyof typeof p] } : p
      )
    );
  };

  const stats = {
    totalUsers: permissions.length,
    canInitiate: permissions.filter((p) => p.canInitiate).length,
    canReceive: permissions.filter((p) => p.canReceive).length,
    autoAnswer: permissions.filter((p) => p.autoAnswer).length,
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={settings.enabled ? "border-green-200 dark:border-green-800" : ""}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                settings.enabled
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}>
                <Radio className={`h-7 w-7 ${
                  settings.enabled ? "text-green-600" : "text-gray-400"
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white">
                  Intercom System
                </h3>
                <p className="text-sm text-gray-500">
                  {settings.enabled
                    ? "Intercom is enabled for quick internal communication"
                    : "Intercom is currently disabled"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={settings.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {settings.enabled ? "Enabled" : "Disabled"}
              </Badge>
              <Button
                variant={settings.enabled ? "destructive" : "default"}
                onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              >
                {settings.enabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Mic className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Can Initiate</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.canInitiate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Can Receive</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.canReceive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Auto-Answer</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.autoAnswer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "settings" ? "default" : "outline"}
          onClick={() => setActiveTab("settings")}
          className={activeTab === "settings" ? "btn-primary" : ""}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button
          variant={activeTab === "permissions" ? "default" : "outline"}
          onClick={() => setActiveTab("permissions")}
          className={activeTab === "permissions" ? "btn-primary" : ""}
        >
          <Shield className="h-4 w-4 mr-2" />
          Permissions
        </Button>
      </div>

      {activeTab === "settings" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-6">
              Intercom Configuration
            </h3>

            <div className="space-y-6">
              {/* Default Mode */}
              <div>
                <label className="block text-sm font-medium mb-3">Default Intercom Mode</label>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center ${
                      settings.defaultMode === "auto_answer"
                        ? "border-[#1E3A5F] bg-[#1E3A5F]/5"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSettings({ ...settings, defaultMode: "auto_answer" })}
                  >
                    <Phone className="h-6 w-6 mx-auto mb-2 text-[#1E3A5F]" />
                    <p className="font-medium text-sm">Auto-Answer</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Phone answers automatically with speaker
                    </p>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center ${
                      settings.defaultMode === "ring_first"
                        ? "border-[#1E3A5F] bg-[#1E3A5F]/5"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSettings({ ...settings, defaultMode: "ring_first" })}
                  >
                    <Bell className="h-6 w-6 mx-auto mb-2 text-[#1E3A5F]" />
                    <p className="font-medium text-sm">Ring First</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Phone rings briefly before auto-answer
                    </p>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center ${
                      settings.defaultMode === "announce"
                        ? "border-[#1E3A5F] bg-[#1E3A5F]/5"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSettings({ ...settings, defaultMode: "announce" })}
                  >
                    <MessageSquare className="h-6 w-6 mx-auto mb-2 text-[#1E3A5F]" />
                    <p className="font-medium text-sm">Announce</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Play tone, then one-way announcement
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ring Duration (seconds)</label>
                  <Input
                    type="number"
                    value={settings.ringDuration}
                    onChange={(e) => setSettings({ ...settings, ringDuration: Number(e.target.value) })}
                    min={1}
                    max={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How long to ring before auto-answering (1-10 sec)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Auto-Answer Delay (seconds)</label>
                  <Input
                    type="number"
                    value={settings.autoAnswerDelay}
                    onChange={(e) => setSettings({ ...settings, autoAnswerDelay: Number(e.target.value) })}
                    min={0}
                    max={5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Delay before auto-answering (0-5 sec)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Duration (seconds)</label>
                  <Input
                    type="number"
                    value={settings.maxDuration}
                    onChange={(e) => setSettings({ ...settings, maxDuration: Number(e.target.value) })}
                    min={30}
                    max={300}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum intercom call duration (30-300 sec)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Announcement Tone</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    value={settings.announceToneFile}
                    onChange={(e) => setSettings({ ...settings, announceToneFile: e.target.value })}
                  >
                    <option value="intercom_tone.wav">Default Tone</option>
                    <option value="chime.wav">Chime</option>
                    <option value="beep.wav">Beep</option>
                    <option value="none">No Tone</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-[#1E3A5F] dark:text-white">Behavior Options</h4>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.muteOnConnect}
                    onChange={(e) => setSettings({ ...settings, muteOnConnect: e.target.checked })}
                    className="rounded"
                  />
                  <div className="flex items-center gap-2">
                    <MicOff className="h-4 w-4 text-gray-400" />
                    <span>Mute recipient's microphone until they speak</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.blockDuringCalls}
                    onChange={(e) => setSettings({ ...settings, blockDuringCalls: e.target.checked })}
                    className="rounded"
                  />
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <span>Block intercom when user is on an active call</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowOverride}
                    onChange={(e) => setSettings({ ...settings, allowOverride: e.target.checked })}
                    className="rounded"
                  />
                  <div className="flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-gray-400" />
                    <span>Allow users to override their intercom settings</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireConfirmation}
                    onChange={(e) => setSettings({ ...settings, requireConfirmation: e.target.checked })}
                    className="rounded"
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                    <span>Require confirmation before connecting intercom</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t dark:border-gray-700">
              <Button variant="outline">Reset to Defaults</Button>
              <Button className="btn-primary">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "permissions" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white">
                Intercom Permissions
              </h3>
              <Button variant="outline" size="sm">
                Add User/Group
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User/Group</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Can Initiate</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Can Receive</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Auto-Answer</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Announce Tone</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm) => (
                    <tr key={perm.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            {perm.type === "user" && <User className="h-4 w-4" />}
                            {perm.type === "group" && <Users className="h-4 w-4" />}
                            {perm.type === "department" && <Building2 className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-[#1E3A5F] dark:text-white">{perm.name}</p>
                            <p className="text-xs text-gray-500">Ext. {perm.extension}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <Badge variant="outline" className="capitalize">{perm.type}</Badge>
                      </td>
                      <td className="text-center py-4 px-4">
                        <button
                          onClick={() => togglePermission(perm.id, "canInitiate")}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            perm.canInitiate ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {perm.canInitiate && <CheckCircle className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="text-center py-4 px-4">
                        <button
                          onClick={() => togglePermission(perm.id, "canReceive")}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            perm.canReceive ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {perm.canReceive && <CheckCircle className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="text-center py-4 px-4">
                        <button
                          onClick={() => togglePermission(perm.id, "autoAnswer")}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            perm.autoAnswer ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {perm.autoAnswer && <CheckCircle className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="text-center py-4 px-4">
                        <button
                          onClick={() => togglePermission(perm.id, "announceTone")}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            perm.announceTone ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {perm.announceTone && <CheckCircle className="h-4 w-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

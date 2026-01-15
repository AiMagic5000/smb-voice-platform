"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Mic,
  Volume2,
  Shield,
  Clock,
  Database,
  Download,
  Trash2,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Save,
  Play,
  Pause,
  Users,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  FileAudio,
  Lock,
  Globe,
} from "lucide-react";

type RecordingSettings = {
  enabled: boolean;
  recordInbound: boolean;
  recordOutbound: boolean;
  recordInternal: boolean;
  announceRecording: boolean;
  announcementType: "beep" | "message" | "both";
  customAnnouncement?: string;
  consentRequired: boolean;
  consentKey: string;
  storageLocation: "cloud" | "local";
  retentionDays: number;
  autoTranscribe: boolean;
  encryptRecordings: boolean;
  downloadEnabled: boolean;
  excludedExtensions: string[];
};

const defaultSettings: RecordingSettings = {
  enabled: true,
  recordInbound: true,
  recordOutbound: true,
  recordInternal: false,
  announceRecording: true,
  announcementType: "message",
  customAnnouncement: "This call may be recorded for quality and training purposes.",
  consentRequired: false,
  consentKey: "1",
  storageLocation: "cloud",
  retentionDays: 90,
  autoTranscribe: true,
  encryptRecordings: true,
  downloadEnabled: true,
  excludedExtensions: ["ext_100", "ext_hr"],
};

const complianceRegions = [
  { id: "us", name: "United States", laws: "One-party consent (varies by state)" },
  { id: "eu", name: "European Union", laws: "GDPR - Consent required" },
  { id: "uk", name: "United Kingdom", laws: "DPA 2018 - Notice required" },
  { id: "ca", name: "Canada", laws: "PIPEDA - One-party consent" },
  { id: "au", name: "Australia", laws: "Varies by state" },
];

export function CallRecordingSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState<"general" | "compliance" | "storage" | "advanced">("general");

  const updateSetting = <K extends keyof RecordingSettings>(key: K, value: RecordingSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  const stats = {
    totalRecordings: 1247,
    storageUsed: "12.4 GB",
    avgDuration: "4:32",
    transcribed: 892,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E3A5F] flex items-center justify-center">
            <Mic className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white">Call Recording</h2>
            <p className="text-sm text-gray-500">Configure recording policies and compliance settings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Recording</span>
            <button
              onClick={() => updateSetting("enabled", !settings.enabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.enabled ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                settings.enabled ? "left-7" : "left-1"
              }`} />
            </button>
          </div>
          <Button className="btn-primary gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <FileAudio className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Recordings</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.totalRecordings}</p>
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
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Storage Used</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.storageUsed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Duration</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.avgDuration}</p>
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
                  <FileAudio className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Transcribed</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.transcribed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "compliance", label: "Compliance", icon: Shield },
          { id: "storage", label: "Storage", icon: Database },
          { id: "advanced", label: "Advanced", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 shadow-sm font-medium"
                : "hover:bg-white/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "general" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Call Types to Record</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <PhoneIncoming className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-[#1E3A5F] dark:text-white">Inbound Calls</p>
                      <p className="text-sm text-gray-500">Calls received from external numbers</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.recordInbound}
                    onChange={(e) => updateSetting("recordInbound", e.target.checked)}
                    className="rounded w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <PhoneOutgoing className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-[#1E3A5F] dark:text-white">Outbound Calls</p>
                      <p className="text-sm text-gray-500">Calls made to external numbers</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.recordOutbound}
                    onChange={(e) => updateSetting("recordOutbound", e.target.checked)}
                    className="rounded w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-[#1E3A5F] dark:text-white">Internal Calls</p>
                      <p className="text-sm text-gray-500">Calls between team members</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.recordInternal}
                    onChange={(e) => updateSetting("recordInternal", e.target.checked)}
                    className="rounded w-5 h-5"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">AI Transcription</h3>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-[#1E3A5F] dark:text-white flex items-center gap-2">
                      Auto-Transcribe Recordings
                      <Badge className="bg-[#FDF8E8] text-[#C9A227]">AI Powered</Badge>
                    </p>
                    <p className="text-sm text-gray-500">Automatically generate searchable transcripts</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("autoTranscribe", !settings.autoTranscribe)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.autoTranscribe ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.autoTranscribe ? "left-7" : "left-1"
                  }`} />
                </button>
              </label>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "compliance" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Legal Notice</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Recording laws vary by jurisdiction. Consult legal counsel to ensure compliance
                    with applicable regulations in your area.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-[#1E3A5F]" />
                  <div>
                    <h3 className="font-bold text-[#1E3A5F] dark:text-white">Recording Announcement</h3>
                    <p className="text-sm text-gray-500">Notify callers that the call is being recorded</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("announceRecording", !settings.announceRecording)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.announceRecording ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.announceRecording ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
              {settings.announceRecording && (
                <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium mb-2">Announcement Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "beep", label: "Beep Only" },
                        { value: "message", label: "Voice Message" },
                        { value: "both", label: "Both" },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => updateSetting("announcementType", type.value as typeof settings.announcementType)}
                          className={`p-3 rounded-lg border transition-colors ${
                            settings.announcementType === type.value
                              ? "border-[#C9A227] bg-[#FDF8E8] dark:bg-[#C9A227]/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(settings.announcementType === "message" || settings.announcementType === "both") && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Custom Message</label>
                      <textarea
                        className="w-full h-20 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 resize-none"
                        value={settings.customAnnouncement}
                        onChange={(e) => updateSetting("customAnnouncement", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-[#1E3A5F] dark:text-white mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional Compliance Guide
              </h3>
              <div className="space-y-3">
                {complianceRegions.map((region) => (
                  <div key={region.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-medium text-[#1E3A5F] dark:text-white">{region.name}</p>
                    <p className="text-sm text-gray-500">{region.laws}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "storage" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Storage Location</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateSetting("storageLocation", "cloud")}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    settings.storageLocation === "cloud"
                      ? "border-[#C9A227] bg-[#FDF8E8] dark:bg-[#C9A227]/10"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Database className="h-6 w-6 text-[#1E3A5F] dark:text-white mb-2" />
                  <p className="font-medium text-[#1E3A5F] dark:text-white">Cloud Storage</p>
                  <p className="text-sm text-gray-500">Secure, redundant cloud storage</p>
                </button>
                <button
                  onClick={() => updateSetting("storageLocation", "local")}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    settings.storageLocation === "local"
                      ? "border-[#C9A227] bg-[#FDF8E8] dark:bg-[#C9A227]/10"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Database className="h-6 w-6 text-[#1E3A5F] dark:text-white mb-2" />
                  <p className="font-medium text-[#1E3A5F] dark:text-white">On-Premise</p>
                  <p className="text-sm text-gray-500">Store on your own servers</p>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-[#1E3A5F] dark:text-white mb-4">Retention Policy</h3>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Keep recordings for</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={settings.retentionDays}
                      onChange={(e) => updateSetting("retentionDays", parseInt(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-gray-500">days</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Recordings older than {settings.retentionDays} days will be automatically deleted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-[#1E3A5F]" />
                  <div>
                    <p className="font-medium text-[#1E3A5F] dark:text-white">Encrypt Recordings</p>
                    <p className="text-sm text-gray-500">AES-256 encryption at rest</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("encryptRecordings", !settings.encryptRecordings)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.encryptRecordings ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.encryptRecordings ? "left-7" : "left-1"
                  }`} />
                </button>
              </label>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "advanced" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-[#1E3A5F]" />
                  <div>
                    <p className="font-medium text-[#1E3A5F] dark:text-white">Allow Downloads</p>
                    <p className="text-sm text-gray-500">Users can download recordings</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("downloadEnabled", !settings.downloadEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.downloadEnabled ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.downloadEnabled ? "left-7" : "left-1"
                  }`} />
                </button>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-[#1E3A5F] dark:text-white mb-4">Excluded Extensions</h3>
              <p className="text-sm text-gray-500 mb-4">
                Extensions that should never be recorded (e.g., HR, Legal)
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {settings.excludedExtensions.map((ext) => (
                  <Badge key={ext} variant="outline" className="px-3 py-1">
                    {ext}
                    <button className="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Extension ID" className="w-40" />
                <Button variant="outline">Add</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

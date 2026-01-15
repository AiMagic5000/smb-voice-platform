"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Voicemail,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Bell,
  Clock,
  Shield,
  Volume2,
  Mic,
  Download,
  Trash2,
  Settings,
  CheckCircle,
  XCircle,
  Info,
  Save,
} from "lucide-react";

type VoicemailSettings = {
  enabled: boolean;
  greetingType: "default" | "custom" | "name";
  customGreeting?: string;
  maxLength: number;
  emailNotification: boolean;
  emailAddress: string;
  attachAudio: boolean;
  transcription: boolean;
  smsNotification: boolean;
  smsNumber: string;
  pinRequired: boolean;
  pin: string;
  autoDelete: boolean;
  autoDeleteDays: number;
  playEnvelope: boolean;
  allowSkip: boolean;
};

const defaultSettings: VoicemailSettings = {
  enabled: true,
  greetingType: "custom",
  customGreeting: "Hello, you've reached the voicemail of ACME Corporation. We're unable to take your call right now. Please leave a message after the tone, and we'll get back to you as soon as possible.",
  maxLength: 180,
  emailNotification: true,
  emailAddress: "notifications@company.com",
  attachAudio: true,
  transcription: true,
  smsNotification: true,
  smsNumber: "+1 (555) 123-4567",
  pinRequired: true,
  pin: "****",
  autoDelete: true,
  autoDeleteDays: 30,
  playEnvelope: true,
  allowSkip: true,
};

export function VoicemailSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState<"greeting" | "notifications" | "security" | "advanced">("greeting");

  const updateSetting = <K extends keyof VoicemailSettings>(key: K, value: VoicemailSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E3A5F] flex items-center justify-center">
            <Voicemail className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white">Voicemail Settings</h2>
            <p className="text-sm text-gray-500">Configure how voicemail works for your organization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Voicemail</span>
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

      {/* Status Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={settings.enabled ? "bg-green-50 dark:bg-green-900/10" : "bg-gray-50 dark:bg-gray-800"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {settings.enabled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-[#1E3A5F] dark:text-white">
                  {settings.enabled ? "Voicemail is Active" : "Voicemail is Disabled"}
                </p>
                <p className="text-sm text-gray-500">
                  {settings.enabled
                    ? "Callers can leave messages when calls are unanswered"
                    : "Callers will hear a busy signal or be disconnected"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: "greeting", label: "Greeting", icon: Volume2 },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "security", label: "Security", icon: Shield },
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
      {activeTab === "greeting" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Greeting Type</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { value: "default", label: "Default", desc: "Standard system greeting" },
                  { value: "name", label: "Name Only", desc: "Just your name or company" },
                  { value: "custom", label: "Custom", desc: "Your own recording or text" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateSetting("greetingType", type.value as typeof settings.greetingType)}
                    className={`p-4 rounded-xl border text-left transition-colors ${
                      settings.greetingType === type.value
                        ? "border-[#C9A227] bg-[#FDF8E8] dark:bg-[#C9A227]/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-medium text-[#1E3A5F] dark:text-white">{type.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {settings.greetingType === "custom" && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Custom Greeting</h3>
                <div className="space-y-4">
                  <textarea
                    className="w-full h-24 px-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 resize-none"
                    value={settings.customGreeting}
                    onChange={(e) => updateSetting("customGreeting", e.target.value)}
                    placeholder="Enter your greeting message..."
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {settings.customGreeting?.length || 0} characters
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Mic className="h-4 w-4 mr-2" />
                        Record Audio
                      </Button>
                      <Button variant="outline" size="sm">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Recording Length</h3>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={settings.maxLength}
                  onChange={(e) => updateSetting("maxLength", parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-gray-500">seconds (max 300)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "notifications" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#1E3A5F]" />
                  <div>
                    <h3 className="font-bold text-[#1E3A5F] dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive voicemail alerts via email</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("emailNotification", !settings.emailNotification)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotification ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.emailNotification ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
              {settings.emailNotification && (
                <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={settings.emailAddress}
                      onChange={(e) => updateSetting("emailAddress", e.target.value)}
                      placeholder="notifications@company.com"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.attachAudio}
                      onChange={(e) => updateSetting("attachAudio", e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Attach audio file to email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.transcription}
                      onChange={(e) => updateSetting("transcription", e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Include transcription in email</span>
                    <Badge className="bg-[#FDF8E8] text-[#C9A227]">AI Powered</Badge>
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-[#1E3A5F]" />
                  <div>
                    <h3 className="font-bold text-[#1E3A5F] dark:text-white">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Get text alerts for new voicemails</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("smsNotification", !settings.smsNotification)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.smsNotification ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.smsNotification ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
              {settings.smsNotification && (
                <div className="pt-4 border-t dark:border-gray-700">
                  <label className="block text-sm font-medium mb-2">Mobile Number</label>
                  <Input
                    type="tel"
                    value={settings.smsNumber}
                    onChange={(e) => updateSetting("smsNumber", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "security" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-[#1E3A5F]" />
                  <div>
                    <h3 className="font-bold text-[#1E3A5F] dark:text-white">PIN Protection</h3>
                    <p className="text-sm text-gray-500">Require PIN to access voicemail</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("pinRequired", !settings.pinRequired)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.pinRequired ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.pinRequired ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
              {settings.pinRequired && (
                <div className="pt-4 border-t dark:border-gray-700">
                  <label className="block text-sm font-medium mb-2">Voicemail PIN</label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={settings.pin}
                      onChange={(e) => updateSetting("pin", e.target.value)}
                      placeholder="Enter 4-6 digit PIN"
                      className="w-48"
                    />
                    <Button variant="outline">Change PIN</Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PIN is required to check voicemail from phone
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "advanced" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-[#1E3A5F]" />
                  <div>
                    <h3 className="font-bold text-[#1E3A5F] dark:text-white">Auto-Delete</h3>
                    <p className="text-sm text-gray-500">Automatically delete old voicemails</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("autoDelete", !settings.autoDelete)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.autoDelete ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.autoDelete ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
              {settings.autoDelete && (
                <div className="pt-4 border-t dark:border-gray-700">
                  <label className="block text-sm font-medium mb-2">Delete After</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={settings.autoDeleteDays}
                      onChange={(e) => updateSetting("autoDeleteDays", parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-gray-500">days</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-[#1E3A5F] dark:text-white mb-4">Playback Options</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.playEnvelope}
                    onChange={(e) => updateSetting("playEnvelope", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Play date/time before message</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowSkip}
                    onChange={(e) => updateSetting("allowSkip", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Allow callers to skip greeting with #</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  Lock,
  Globe,
  Database,
  Key,
  Mail,
  Server,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure platform settings</p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#C9A227] hover:bg-[#B8911F] text-white"
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                  <Input defaultValue="SMB Voice" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                  <Input defaultValue="support@startmybusiness.us" type="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Timezone</label>
                  <Input defaultValue="America/New_York" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <Input defaultValue="USD" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform URL</label>
                <Input defaultValue="https://voice.startmybusiness.us" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "New client signup notifications", key: "newClient" },
                { label: "Payment failure alerts", key: "paymentFailure" },
                { label: "System status updates", key: "systemStatus" },
                { label: "Weekly summary reports", key: "weeklyReport" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">{item.label}</span>
                  <Input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Email Configuration</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <Input defaultValue="smtp.hostinger.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <Input defaultValue="465" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                  <Input defaultValue="support@startmybusiness.us" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                  <Input type="password" defaultValue="••••••••" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                <Input defaultValue="SMB Voice" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                <Input defaultValue="noreply@startmybusiness.us" type="email" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Key className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SignalWire Project ID</label>
                <Input defaultValue="••••••••-••••-••••-••••-••••••••••••" type="password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SignalWire API Token</label>
                <Input defaultValue="••••••••••••••••••••••••••••••••" type="password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SignalWire Space URL</label>
                <Input defaultValue="yourspace.signalwire.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                <Input defaultValue="sk_live_••••••••••••••••••••••••" type="password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Webhook Secret</label>
                <Input defaultValue="whsec_••••••••••••••••••••••••" type="password" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Server className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
            </div>
            <div className="space-y-4">
              {[
                { name: "SignalWire", status: "connected", icon: "📞" },
                { name: "Stripe", status: "connected", icon: "💳" },
                { name: "Clerk", status: "connected", icon: "🔐" },
                { name: "Cognabase (Supabase)", status: "connected", icon: "🗄️" },
                { name: "Cloudflare", status: "connected", icon: "☁️" },
                { name: "SendGrid", status: "not configured", icon: "📧" },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{integration.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{integration.status}</p>
                    </div>
                  </div>
                  <Button variant={integration.status === "connected" ? "outline" : "default"} size="sm">
                    {integration.status === "connected" ? "Configure" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Require 2FA for admin accounts", key: "require2fa", checked: true },
                { label: "Session timeout after 30 minutes of inactivity", key: "sessionTimeout", checked: true },
                { label: "Log all API requests", key: "logApiRequests", checked: false },
                { label: "Allow password-based login", key: "passwordLogin", checked: true },
                { label: "Enforce strong passwords", key: "strongPasswords", checked: true },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">{item.label}</span>
                  <Input type="checkbox" className="w-5 h-5" defaultChecked={item.checked} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

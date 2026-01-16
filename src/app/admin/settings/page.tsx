"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Mail,
  Save,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowNewSignups: true,
    requireEmailVerification: true,
    maxPhoneNumbersPerClient: 10,
    defaultTrialDays: 14,
    smtpHost: "smtp.hostinger.com",
    smtpPort: "465",
    smtpUser: "support@startmybusiness.us",
    adminEmail: "admin@startmybusiness.us",
    webhookSecret: "whsec_***************",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Platform configuration and preferences</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#C9A227] hover:bg-[#B8921F] text-white"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Maintenance Mode Alert */}
      {settings.maintenanceMode && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div>
            <p className="text-yellow-400 font-medium">Maintenance Mode Active</p>
            <p className="text-yellow-400/80 text-sm">
              Users cannot access the platform while maintenance mode is enabled.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#C9A227]" />
              General Settings
            </CardTitle>
            <CardDescription className="text-slate-400">
              Core platform configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Maintenance Mode</Label>
                <p className="text-sm text-slate-400">
                  Temporarily disable platform access
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Allow New Signups</Label>
                <p className="text-sm text-slate-400">
                  Allow new users to register
                </p>
              </div>
              <Switch
                checked={settings.allowNewSignups}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowNewSignups: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Require Email Verification</Label>
                <p className="text-sm text-slate-400">
                  Users must verify email before access
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, requireEmailVerification: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Limits Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#C9A227]" />
              Limits & Quotas
            </CardTitle>
            <CardDescription className="text-slate-400">
              Default limits for new accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white">Max Phone Numbers Per Client</Label>
              <Input
                type="number"
                value={settings.maxPhoneNumbersPerClient}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxPhoneNumbersPerClient: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Default Trial Days</Label>
              <Input
                type="number"
                value={settings.defaultTrialDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultTrialDays: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#C9A227]" />
              Email Configuration
            </CardTitle>
            <CardDescription className="text-slate-400">
              SMTP and notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">SMTP Host</Label>
                <Input
                  value={settings.smtpHost}
                  onChange={(e) =>
                    setSettings({ ...settings, smtpHost: e.target.value })
                  }
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">SMTP Port</Label>
                <Input
                  value={settings.smtpPort}
                  onChange={(e) =>
                    setSettings({ ...settings, smtpPort: e.target.value })
                  }
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">SMTP Username</Label>
              <Input
                value={settings.smtpUser}
                onChange={(e) =>
                  setSettings({ ...settings, smtpUser: e.target.value })
                }
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Admin Email</Label>
              <Input
                value={settings.adminEmail}
                onChange={(e) =>
                  setSettings({ ...settings, adminEmail: e.target.value })
                }
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Webhook Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#C9A227]" />
              Webhooks & Integrations
            </CardTitle>
            <CardDescription className="text-slate-400">
              External service configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Gumroad Webhook Secret</Label>
              <Input
                type="password"
                value={settings.webhookSecret}
                onChange={(e) =>
                  setSettings({ ...settings, webhookSecret: e.target.value })
                }
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-500">
                Used to verify webhook signatures from Gumroad
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg space-y-2">
              <p className="text-sm text-white font-medium">Webhook URL</p>
              <code className="text-xs text-[#C9A227] break-all">
                https://voice.startmybusiness.us/api/webhooks/gumroad
              </code>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg space-y-2">
              <p className="text-sm text-white font-medium">SignalWire Callback URL</p>
              <code className="text-xs text-[#C9A227] break-all">
                https://voice.startmybusiness.us/api/webhooks/signalwire
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare, Phone, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationPreferences {
  missedCalls: { email: boolean; sms: boolean; push: boolean };
  voicemails: { email: boolean; sms: boolean; push: boolean };
  usageAlerts: { email: boolean; sms: boolean; push: boolean };
  billing: { email: boolean; sms: boolean; push: boolean };
  marketing: { email: boolean; sms: boolean; push: boolean };
}

interface NotificationSettingsProps {
  preferences?: NotificationPreferences;
  onSave?: (data: NotificationPreferences) => Promise<void>;
  className?: string;
}

const defaultPreferences: NotificationPreferences = {
  missedCalls: { email: true, sms: true, push: true },
  voicemails: { email: true, sms: false, push: true },
  usageAlerts: { email: true, sms: false, push: false },
  billing: { email: true, sms: false, push: false },
  marketing: { email: false, sms: false, push: false },
};

const notificationTypes = [
  {
    key: "missedCalls" as const,
    label: "Missed Calls",
    description: "Get notified when you miss an incoming call",
    icon: Phone,
  },
  {
    key: "voicemails" as const,
    label: "New Voicemails",
    description: "Get notified when you receive a voicemail",
    icon: MessageSquare,
  },
  {
    key: "usageAlerts" as const,
    label: "Usage Alerts",
    description: "Get notified when approaching your plan limits",
    icon: Bell,
  },
  {
    key: "billing" as const,
    label: "Billing Updates",
    description: "Payment confirmations and invoice notifications",
    icon: Mail,
  },
  {
    key: "marketing" as const,
    label: "Product Updates",
    description: "News about new features and improvements",
    icon: Bell,
  },
];

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors",
        enabled ? "bg-[#C9A227]" : "bg-gray-200"
      )}
    >
      <motion.div
        initial={false}
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

export function NotificationSettings({
  preferences: initialPreferences = defaultPreferences,
  onSave,
  className,
}: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (
    type: keyof NotificationPreferences,
    channel: "email" | "sms" | "push",
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: { ...prev[type], [channel]: value },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(preferences);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Channel Headers */}
        <div className="hidden sm:grid grid-cols-[1fr,auto,auto,auto] gap-4 px-4 text-sm font-medium text-gray-500">
          <span></span>
          <span className="w-16 text-center">Email</span>
          <span className="w-16 text-center">SMS</span>
          <span className="w-16 text-center">Push</span>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          {notificationTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex flex-col sm:grid sm:grid-cols-[1fr,auto,auto,auto] gap-4 items-start sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[#1E3A5F]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1E3A5F]">{type.label}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </div>

                  {/* Mobile Channel Labels */}
                  <div className="flex sm:hidden gap-6 ml-13 pl-13">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Email</span>
                      <Toggle
                        enabled={preferences[type.key].email}
                        onChange={(v) => handleToggle(type.key, "email", v)}
                        label={`${type.label} email notifications`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">SMS</span>
                      <Toggle
                        enabled={preferences[type.key].sms}
                        onChange={(v) => handleToggle(type.key, "sms", v)}
                        label={`${type.label} SMS notifications`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Push</span>
                      <Toggle
                        enabled={preferences[type.key].push}
                        onChange={(v) => handleToggle(type.key, "push", v)}
                        label={`${type.label} push notifications`}
                      />
                    </div>
                  </div>

                  {/* Desktop Toggles */}
                  <div className="hidden sm:flex w-16 justify-center">
                    <Toggle
                      enabled={preferences[type.key].email}
                      onChange={(v) => handleToggle(type.key, "email", v)}
                      label={`${type.label} email notifications`}
                    />
                  </div>
                  <div className="hidden sm:flex w-16 justify-center">
                    <Toggle
                      enabled={preferences[type.key].sms}
                      onChange={(v) => handleToggle(type.key, "sms", v)}
                      label={`${type.label} SMS notifications`}
                    />
                  </div>
                  <div className="hidden sm:flex w-16 justify-center">
                    <Toggle
                      enabled={preferences[type.key].push}
                      onChange={(v) => handleToggle(type.key, "push", v)}
                      label={`${type.label} push notifications`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
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
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default NotificationSettings;

"use client";

import React, { useState, useEffect } from "react";

// ============================================
// Types
// ============================================

export interface UserPreferences {
  // Notifications
  notifications: {
    email: {
      missedCalls: boolean;
      voicemails: boolean;
      newMessages: boolean;
      weeklyReport: boolean;
      billingAlerts: boolean;
    };
    push: {
      incomingCalls: boolean;
      missedCalls: boolean;
      voicemails: boolean;
      newMessages: boolean;
    };
    sms: {
      missedCalls: boolean;
      voicemails: boolean;
    };
  };
  // Display
  display: {
    theme: "light" | "dark" | "system";
    timezone: string;
    dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
    timeFormat: "12h" | "24h";
    language: string;
  };
  // Call Handling
  callHandling: {
    defaultCallerId: string;
    autoAnswer: boolean;
    autoAnswerDelay: number;
    ringDuration: number;
    holdMusic: string;
    recordCalls: boolean;
  };
  // Privacy
  privacy: {
    shareAnalytics: boolean;
    showOnlineStatus: boolean;
    allowCallRecordings: boolean;
  };
}

interface UserPreferencesProps {
  preferences: UserPreferences;
  availableCallerIds?: { id: string; number: string; name?: string }[];
  onSave?: (preferences: UserPreferences) => Promise<void>;
  onChange?: (preferences: UserPreferences) => void;
}

// ============================================
// Default Preferences
// ============================================

const defaultPreferences: UserPreferences = {
  notifications: {
    email: {
      missedCalls: true,
      voicemails: true,
      newMessages: false,
      weeklyReport: true,
      billingAlerts: true,
    },
    push: {
      incomingCalls: true,
      missedCalls: true,
      voicemails: true,
      newMessages: true,
    },
    sms: {
      missedCalls: false,
      voicemails: false,
    },
  },
  display: {
    theme: "system",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    language: "en",
  },
  callHandling: {
    defaultCallerId: "",
    autoAnswer: false,
    autoAnswerDelay: 3,
    ringDuration: 30,
    holdMusic: "default",
    recordCalls: true,
  },
  privacy: {
    shareAnalytics: true,
    showOnlineStatus: true,
    allowCallRecordings: true,
  },
};

// ============================================
// User Preferences Component
// ============================================

export function UserPreferences({
  preferences: initialPreferences,
  availableCallerIds = [],
  onSave,
  onChange,
}: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...defaultPreferences,
    ...initialPreferences,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<"notifications" | "display" | "calls" | "privacy">("notifications");

  useEffect(() => {
    onChange?.(preferences);
    setHasChanges(true);
  }, [preferences, onChange]);

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(preferences);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const updateNotifications = (
    channel: keyof UserPreferences["notifications"],
    key: string,
    value: boolean
  ) => {
    setPreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [channel]: {
          ...preferences.notifications[channel],
          [key]: value,
        },
      },
    });
  };

  const updateDisplay = (key: keyof UserPreferences["display"], value: string) => {
    setPreferences({
      ...preferences,
      display: { ...preferences.display, [key]: value },
    });
  };

  const updateCallHandling = (key: keyof UserPreferences["callHandling"], value: string | boolean | number) => {
    setPreferences({
      ...preferences,
      callHandling: { ...preferences.callHandling, [key]: value },
    });
  };

  const updatePrivacy = (key: keyof UserPreferences["privacy"], value: boolean) => {
    setPreferences({
      ...preferences,
      privacy: { ...preferences.privacy, [key]: value },
    });
  };

  const tabs = [
    { id: "notifications" as const, label: "Notifications", icon: BellIcon },
    { id: "display" as const, label: "Display", icon: SunIcon },
    { id: "calls" as const, label: "Call Handling", icon: PhoneIcon },
    { id: "privacy" as const, label: "Privacy", icon: ShieldIcon },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
          <p className="text-sm text-gray-500 mt-1">Customize your experience</p>
        </div>
        {onSave && (
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="px-4 py-2 bg-[#C9A227] text-white rounded-lg hover:bg-[#B8911F] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap
              ${activeTab === tab.id
                ? "text-[#C9A227] border-[#C9A227]"
                : "text-gray-500 border-transparent hover:text-gray-700"
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-8">
            {/* Email Notifications */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Notifications
              </h4>
              <div className="space-y-3">
                <ToggleRow
                  label="Missed Calls"
                  description="Get notified when you miss a call"
                  checked={preferences.notifications.email.missedCalls}
                  onChange={(v) => updateNotifications("email", "missedCalls", v)}
                />
                <ToggleRow
                  label="Voicemails"
                  description="New voicemail notifications"
                  checked={preferences.notifications.email.voicemails}
                  onChange={(v) => updateNotifications("email", "voicemails", v)}
                />
                <ToggleRow
                  label="New Messages"
                  description="SMS and text messages"
                  checked={preferences.notifications.email.newMessages}
                  onChange={(v) => updateNotifications("email", "newMessages", v)}
                />
                <ToggleRow
                  label="Weekly Report"
                  description="Summary of your weekly activity"
                  checked={preferences.notifications.email.weeklyReport}
                  onChange={(v) => updateNotifications("email", "weeklyReport", v)}
                />
                <ToggleRow
                  label="Billing Alerts"
                  description="Payment and subscription updates"
                  checked={preferences.notifications.email.billingAlerts}
                  onChange={(v) => updateNotifications("email", "billingAlerts", v)}
                />
              </div>
            </div>

            {/* Push Notifications */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Push Notifications
              </h4>
              <div className="space-y-3">
                <ToggleRow
                  label="Incoming Calls"
                  description="Real-time call alerts"
                  checked={preferences.notifications.push.incomingCalls}
                  onChange={(v) => updateNotifications("push", "incomingCalls", v)}
                />
                <ToggleRow
                  label="Missed Calls"
                  description="Instant missed call alerts"
                  checked={preferences.notifications.push.missedCalls}
                  onChange={(v) => updateNotifications("push", "missedCalls", v)}
                />
                <ToggleRow
                  label="Voicemails"
                  description="New voicemail alerts"
                  checked={preferences.notifications.push.voicemails}
                  onChange={(v) => updateNotifications("push", "voicemails", v)}
                />
                <ToggleRow
                  label="New Messages"
                  description="SMS/text message alerts"
                  checked={preferences.notifications.push.newMessages}
                  onChange={(v) => updateNotifications("push", "newMessages", v)}
                />
              </div>
            </div>

            {/* SMS Notifications */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                SMS Notifications
              </h4>
              <div className="space-y-3">
                <ToggleRow
                  label="Missed Calls"
                  description="Text alert for missed calls"
                  checked={preferences.notifications.sms.missedCalls}
                  onChange={(v) => updateNotifications("sms", "missedCalls", v)}
                />
                <ToggleRow
                  label="Voicemails"
                  description="Text alert for new voicemails"
                  checked={preferences.notifications.sms.voicemails}
                  onChange={(v) => updateNotifications("sms", "voicemails", v)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Display Tab */}
        {activeTab === "display" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {(["light", "dark", "system"] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateDisplay("theme", theme)}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-colors
                      ${preferences.display.theme === theme
                        ? "border-[#C9A227] bg-[#C9A227]/5"
                        : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="text-sm font-medium capitalize">{theme}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={preferences.display.timezone}
                  onChange={(e) => updateDisplay("timezone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  value={preferences.display.dateFormat}
                  onChange={(e) => updateDisplay("dateFormat", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                <select
                  value={preferences.display.timeFormat}
                  onChange={(e) => updateDisplay("timeFormat", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                >
                  <option value="12h">12-hour (AM/PM)</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={preferences.display.language}
                  onChange={(e) => updateDisplay("language", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Call Handling Tab */}
        {activeTab === "calls" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Caller ID</label>
              <select
                value={preferences.callHandling.defaultCallerId}
                onChange={(e) => updateCallHandling("defaultCallerId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
              >
                <option value="">Select a number...</option>
                {availableCallerIds.map((cid) => (
                  <option key={cid.id} value={cid.id}>
                    {cid.number} {cid.name && `(${cid.name})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ring Duration (seconds)</label>
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={preferences.callHandling.ringDuration}
                  onChange={(e) => updateCallHandling("ringDuration", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hold Music</label>
                <select
                  value={preferences.callHandling.holdMusic}
                  onChange={(e) => updateCallHandling("holdMusic", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                >
                  <option value="default">Default</option>
                  <option value="classical">Classical</option>
                  <option value="jazz">Jazz</option>
                  <option value="none">No Music</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <ToggleRow
                label="Auto Answer"
                description="Automatically answer incoming calls"
                checked={preferences.callHandling.autoAnswer}
                onChange={(v) => updateCallHandling("autoAnswer", v)}
              />
              {preferences.callHandling.autoAnswer && (
                <div className="ml-12">
                  <label className="block text-sm text-gray-600 mb-1">Delay (seconds)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={preferences.callHandling.autoAnswerDelay}
                    onChange={(e) => updateCallHandling("autoAnswerDelay", parseInt(e.target.value))}
                    className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}
              <ToggleRow
                label="Record Calls"
                description="Automatically record all calls"
                checked={preferences.callHandling.recordCalls}
                onChange={(v) => updateCallHandling("recordCalls", v)}
              />
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="space-y-4">
            <ToggleRow
              label="Share Analytics"
              description="Help improve SMB Voice by sharing anonymous usage data"
              checked={preferences.privacy.shareAnalytics}
              onChange={(v) => updatePrivacy("shareAnalytics", v)}
            />
            <ToggleRow
              label="Show Online Status"
              description="Let team members see when you're online"
              checked={preferences.privacy.showOnlineStatus}
              onChange={(v) => updatePrivacy("showOnlineStatus", v)}
            />
            <ToggleRow
              label="Allow Call Recordings"
              description="Allow calls to be recorded for quality purposes"
              checked={preferences.privacy.allowCallRecordings}
              onChange={(v) => updatePrivacy("allowCallRecordings", v)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Helper Components
// ============================================

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-colors
          ${checked ? "bg-[#C9A227]" : "bg-gray-300"}
        `}
      >
        <span
          className={`
            absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform
            ${checked ? "left-6" : "left-1"}
          `}
        />
      </button>
    </div>
  );
}

// Icons
function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

export default UserPreferences;

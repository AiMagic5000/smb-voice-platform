"use client";

import React, { useState, useMemo } from "react";

// ============================================
// Types
// ============================================

export type ActivityType =
  | "call_inbound"
  | "call_outbound"
  | "call_missed"
  | "voicemail"
  | "sms_sent"
  | "sms_received"
  | "contact_created"
  | "contact_updated"
  | "setting_changed"
  | "ai_conversation"
  | "extension_added"
  | "number_provisioned";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date | string;
  metadata?: {
    phoneNumber?: string;
    duration?: number;
    contactName?: string;
    status?: string;
    [key: string]: unknown;
  };
  read?: boolean;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  maxItems?: number;
  showFilters?: boolean;
  onActivityClick?: (activity: ActivityItem) => void;
  emptyMessage?: string;
}

// ============================================
// Activity Configuration
// ============================================

const activityConfig: Record<ActivityType, { icon: React.ReactNode; color: string; bgColor: string }> = {
  call_inbound: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  call_outbound: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  call_missed: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
      </svg>
    ),
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  voicemail: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  sms_sent: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  sms_received: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  contact_created: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  contact_updated: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  setting_changed: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  ai_conversation: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "text-[#C9A227]",
    bgColor: "bg-[#C9A227]/10",
  },
  extension_added: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  number_provisioned: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-[#1E3A5F]",
    bgColor: "bg-[#1E3A5F]/10",
  },
};

// ============================================
// Helper Functions
// ============================================

function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return then.toLocaleDateString();
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================================
// Activity Timeline Component
// ============================================

export function ActivityTimeline({
  activities,
  maxItems,
  showFilters = false,
  onActivityClick,
  emptyMessage = "No recent activity",
}: ActivityTimelineProps) {
  const [filter, setFilter] = useState<ActivityType | "all">("all");

  const filteredActivities = useMemo(() => {
    let result = activities;

    if (filter !== "all") {
      result = activities.filter((a) => a.type === filter);
    }

    // Sort by timestamp descending
    result = [...result].sort((a, b) => {
      const dateA = typeof a.timestamp === "string" ? new Date(a.timestamp) : a.timestamp;
      const dateB = typeof b.timestamp === "string" ? new Date(b.timestamp) : b.timestamp;
      return dateB.getTime() - dateA.getTime();
    });

    if (maxItems) {
      result = result.slice(0, maxItems);
    }

    return result;
  }, [activities, filter, maxItems]);

  const filterOptions: { value: ActivityType | "all"; label: string }[] = [
    { value: "all", label: "All Activity" },
    { value: "call_inbound", label: "Inbound Calls" },
    { value: "call_outbound", label: "Outbound Calls" },
    { value: "call_missed", label: "Missed Calls" },
    { value: "voicemail", label: "Voicemails" },
    { value: "sms_sent", label: "SMS Sent" },
    { value: "sms_received", label: "SMS Received" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Activity Timeline</h3>
        {showFilters && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ActivityType | "all")}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Timeline */}
      <div className="divide-y divide-gray-100">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              onClick={onActivityClick ? () => onActivityClick(activity) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// Activity Row Component
// ============================================

function ActivityRow({
  activity,
  onClick,
}: {
  activity: ActivityItem;
  onClick?: () => void;
}) {
  const config = activityConfig[activity.type];

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3
        ${onClick ? "cursor-pointer hover:bg-gray-50" : ""}
        ${!activity.read ? "bg-blue-50/30" : ""}
        transition-colors
      `}
      onClick={onClick}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 p-2 rounded-full ${config.bgColor} ${config.color}`}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            {activity.description && (
              <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
            )}
            {/* Metadata */}
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              {activity.metadata?.phoneNumber && (
                <span>{activity.metadata.phoneNumber}</span>
              )}
              {activity.metadata?.duration && (
                <span>{formatDuration(activity.metadata.duration)}</span>
              )}
              {activity.metadata?.status && (
                <span className={`
                  px-1.5 py-0.5 rounded text-xs font-medium
                  ${activity.metadata.status === "completed" ? "bg-green-100 text-green-700" : ""}
                  ${activity.metadata.status === "failed" ? "bg-red-100 text-red-700" : ""}
                  ${activity.metadata.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                `}>
                  {activity.metadata.status}
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
      </div>

      {/* Unread indicator */}
      {!activity.read && (
        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
      )}
    </div>
  );
}

// ============================================
// Compact Timeline (for sidebar/widgets)
// ============================================

export function CompactActivityTimeline({
  activities,
  maxItems = 5,
  onViewAll,
}: {
  activities: ActivityItem[];
  maxItems?: number;
  onViewAll?: () => void;
}) {
  const sortedActivities = useMemo(() => {
    return [...activities]
      .sort((a, b) => {
        const dateA = typeof a.timestamp === "string" ? new Date(a.timestamp) : a.timestamp;
        const dateB = typeof b.timestamp === "string" ? new Date(b.timestamp) : b.timestamp;
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, maxItems);
  }, [activities, maxItems]);

  return (
    <div className="space-y-3">
      {sortedActivities.map((activity) => {
        const config = activityConfig[activity.type];
        return (
          <div key={activity.id} className="flex items-center gap-3">
            <div className={`p-1.5 rounded-full ${config.bgColor} ${config.color}`}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{activity.title}</p>
              <p className="text-xs text-gray-400">{formatRelativeTime(activity.timestamp)}</p>
            </div>
          </div>
        );
      })}

      {onViewAll && activities.length > maxItems && (
        <button
          onClick={onViewAll}
          className="w-full text-sm text-[#C9A227] hover:text-[#B8911F] font-medium py-2"
        >
          View all activity
        </button>
      )}
    </div>
  );
}

export default ActivityTimeline;

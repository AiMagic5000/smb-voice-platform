"use client";

import { motion } from "framer-motion";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  UserPlus,
  Settings,
  CreditCard,
  Bot,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ActivityType =
  | "call_inbound"
  | "call_outbound"
  | "call_missed"
  | "voicemail"
  | "extension_added"
  | "settings_updated"
  | "payment"
  | "ai_config";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, string>;
}

interface ActivityFeedProps {
  activities?: Activity[];
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const sampleActivities: Activity[] = [
  {
    id: "1",
    type: "call_inbound",
    title: "Incoming call",
    description: "From (555) 123-4567",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    metadata: { duration: "3:24" },
  },
  {
    id: "2",
    type: "voicemail",
    title: "New voicemail",
    description: "From John Smith",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    metadata: { duration: "0:42" },
  },
  {
    id: "3",
    type: "call_outbound",
    title: "Outgoing call",
    description: "To (555) 987-6543",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    metadata: { duration: "5:12" },
  },
  {
    id: "4",
    type: "call_missed",
    title: "Missed call",
    description: "From (555) 456-7890",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "5",
    type: "extension_added",
    title: "New extension",
    description: "Extension 102 created for Sarah",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "6",
    type: "payment",
    title: "Payment processed",
    description: "$7.95 monthly subscription",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "7",
    type: "ai_config",
    title: "AI Receptionist updated",
    description: "Greeting message changed",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

const activityIcons: Record<ActivityType, typeof Phone> = {
  call_inbound: PhoneIncoming,
  call_outbound: PhoneOutgoing,
  call_missed: PhoneMissed,
  voicemail: Voicemail,
  extension_added: UserPlus,
  settings_updated: Settings,
  payment: CreditCard,
  ai_config: Bot,
};

const activityColors: Record<ActivityType, string> = {
  call_inbound: "bg-green-100 text-green-600",
  call_outbound: "bg-blue-100 text-blue-600",
  call_missed: "bg-red-100 text-red-600",
  voicemail: "bg-purple-100 text-purple-600",
  extension_added: "bg-cyan-100 text-cyan-600",
  settings_updated: "bg-gray-100 text-gray-600",
  payment: "bg-emerald-100 text-emerald-600",
  ai_config: "bg-[#FDF8E8] text-[#C9A227]",
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ActivityFeed({
  activities = sampleActivities,
  limit = 5,
  showViewAll = true,
  onViewAll,
  className,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, limit);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#1E3A5F]">
            Recent Activity
          </CardTitle>
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {displayedActivities.length > 0 ? (
          <>
            <div className="space-y-1">
              {displayedActivities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        activityColors[activity.type]
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-[#1E3A5F] text-sm truncate">
                          {activity.title}
                        </p>
                        {activity.metadata?.duration && (
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {activity.metadata.duration}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-gray-500 truncate">
                          {activity.description}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {showViewAll && activities.length > limit && (
              <div className="pt-2 border-t border-gray-100 mt-2">
                <Button
                  variant="ghost"
                  className="w-full text-sm text-[#1E3A5F] hover:bg-gray-50"
                  onClick={onViewAll}
                >
                  View All Activity
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-10 w-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No recent activity</p>
            <p className="text-xs text-gray-400 mt-1">
              Activity will appear here as you use the system
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ActivityFeed;

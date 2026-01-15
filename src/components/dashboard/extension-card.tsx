"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneOff,
  MoreVertical,
  Edit2,
  Trash2,
  UserCog,
  PhoneForwarded,
  Voicemail,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ExtensionStatus = "available" | "on_call" | "away" | "dnd" | "offline";

interface Extension {
  id: string;
  number: string;
  name: string;
  email?: string;
  department?: string;
  status: ExtensionStatus;
  forwardTo?: string;
  voicemailEnabled: boolean;
  callsToday: number;
  totalMinutesToday: number;
}

interface ExtensionCardProps {
  extension: Extension;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCall?: (number: string) => void;
  onStatusChange?: (id: string, status: ExtensionStatus) => void;
  className?: string;
}

const statusConfig: Record<ExtensionStatus, { label: string; color: string; bgColor: string; icon: typeof Phone }> = {
  available: { label: "Available", color: "text-green-600", bgColor: "bg-green-500", icon: Phone },
  on_call: { label: "On Call", color: "text-blue-600", bgColor: "bg-blue-500", icon: PhoneIncoming },
  away: { label: "Away", color: "text-yellow-600", bgColor: "bg-yellow-500", icon: Clock },
  dnd: { label: "Do Not Disturb", color: "text-red-600", bgColor: "bg-red-500", icon: PhoneOff },
  offline: { label: "Offline", color: "text-gray-500", bgColor: "bg-gray-400", icon: PhoneOff },
};

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ExtensionCard({
  extension,
  onEdit,
  onDelete,
  onCall,
  onStatusChange,
  className,
}: ExtensionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const config = statusConfig[extension.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2D5A8F] flex items-center justify-center text-white text-lg font-bold">
            {getInitials(extension.name)}
          </div>
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
              config.bgColor
            )}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-[#1E3A5F] truncate">{extension.name}</h4>
              <p className="text-sm text-gray-500">Ext. {extension.number}</p>
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-gray-400 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[160px]"
                    >
                      <button
                        onClick={() => {
                          onEdit?.(extension.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit Extension
                      </button>
                      <button
                        onClick={() => {
                          onCall?.(extension.number);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        Call Extension
                      </button>
                      <button
                        onClick={() => {
                          onDelete?.(extension.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Department & Email */}
          {(extension.department || extension.email) && (
            <div className="mt-1 text-sm text-gray-400 truncate">
              {extension.department}
              {extension.department && extension.email && " • "}
              {extension.email}
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              config.color,
              `bg-${config.bgColor.replace("bg-", "")}/10 hover:bg-${config.bgColor.replace("bg-", "")}/20`
            )}
            style={{
              backgroundColor: `${config.bgColor.replace("bg-", "").replace("-500", "")}10`,
            }}
          >
            <StatusIcon className="h-4 w-4" />
            {config.label}
          </button>

          <AnimatePresence>
            {showStatusMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-10"
                  onClick={() => setShowStatusMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[160px]"
                >
                  {Object.entries(statusConfig).map(([status, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={status}
                        onClick={() => {
                          onStatusChange?.(extension.id, status as ExtensionStatus);
                          setShowStatusMenu(false);
                        }}
                        className={cn(
                          "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors",
                          extension.status === status
                            ? "bg-gray-50 text-[#1E3A5F]"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", cfg.bgColor)} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Features */}
        <div className="flex items-center gap-2">
          {extension.forwardTo && (
            <span className="p-1.5 text-gray-400" title={`Forwarding to ${extension.forwardTo}`}>
              <PhoneForwarded className="h-4 w-4" />
            </span>
          )}
          {extension.voicemailEnabled && (
            <span className="p-1.5 text-gray-400" title="Voicemail enabled">
              <Voicemail className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Calls Today</p>
          <p className="font-semibold text-[#1E3A5F]">{extension.callsToday}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Talk Time</p>
          <p className="font-semibold text-[#1E3A5F]">
            {formatMinutes(extension.totalMinutesToday)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default ExtensionCard;

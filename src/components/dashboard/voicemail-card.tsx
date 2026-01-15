"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Trash2,
  Forward,
  Star,
  StarOff,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "./audio-player";

interface VoicemailCardProps {
  id: string;
  callerName?: string;
  callerNumber: string;
  timestamp: Date;
  duration: number; // in seconds
  transcription?: string;
  isStarred?: boolean;
  isNew?: boolean;
  audioSrc?: string;
  onDelete?: (id: string) => void;
  onForward?: (id: string) => void;
  onToggleStar?: (id: string) => void;
  className?: string;
}

function formatDate(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  if (isYesterday) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VoicemailCard({
  id,
  callerName,
  callerNumber,
  timestamp,
  duration,
  transcription,
  isStarred = false,
  isNew = false,
  audioSrc,
  onDelete,
  onForward,
  onToggleStar,
  className,
}: VoicemailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyTranscription = async () => {
    if (transcription) {
      await navigator.clipboard.writeText(transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-2xl border transition-all",
        isNew ? "border-[#C9A227] shadow-md" : "border-gray-200",
        isExpanded && "shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          {/* Avatar/Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isNew ? "bg-[#C9A227] text-white" : "bg-gray-100 text-gray-500"
            )}
          >
            <Phone className="h-5 w-5" />
          </div>

          {/* Caller Info */}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-[#1E3A5F]">
                {callerName || "Unknown Caller"}
              </h4>
              {isNew && (
                <span className="px-2 py-0.5 text-xs font-medium bg-[#C9A227] text-white rounded-full">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{callerNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Duration & Time */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(duration)}
            </div>
            <p className="text-xs text-gray-400">{formatDate(timestamp)}</p>
          </div>

          {/* Star Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.(id);
            }}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isStarred
                ? "text-[#C9A227] hover:bg-[#FDF8E8]"
                : "text-gray-400 hover:text-[#C9A227] hover:bg-gray-100"
            )}
          >
            {isStarred ? (
              <Star className="h-5 w-5 fill-current" />
            ) : (
              <StarOff className="h-5 w-5" />
            )}
          </button>

          {/* Expand/Collapse */}
          <button className="p-2 text-gray-400 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-lg transition-colors">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Audio Player */}
              <AudioPlayer
                src={audioSrc}
                duration={duration}
                title={`Voicemail from ${callerName || callerNumber}`}
                subtitle={formatDate(timestamp)}
              />

              {/* Transcription */}
              {transcription && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#1E3A5F]">
                      <FileText className="h-4 w-4" />
                      AI Transcription
                    </div>
                    <button
                      onClick={copyTranscription}
                      className="p-1.5 text-gray-400 hover:text-[#1E3A5F] hover:bg-white rounded-lg transition-colors"
                      title="Copy transcription"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {transcription}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-500 hover:text-[#1E3A5F]"
                  onClick={() => onForward?.(id)}
                >
                  <Forward className="h-4 w-4" />
                  Forward
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-500 hover:text-red-500"
                  onClick={() => onDelete?.(id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default VoicemailCard;

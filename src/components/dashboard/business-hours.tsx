"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Save, Loader2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DaySchedule {
  enabled: boolean;
  openTime: string;
  closeTime: string;
}

type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

type WeekSchedule = Record<DayOfWeek, DaySchedule>;

interface BusinessHoursProps {
  schedule?: WeekSchedule;
  timezone?: string;
  onSave?: (schedule: WeekSchedule, timezone: string) => Promise<void>;
  className?: string;
}

const defaultSchedule: WeekSchedule = {
  monday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
  tuesday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
  wednesday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
  thursday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
  friday: { enabled: true, openTime: "09:00", closeTime: "17:00" },
  saturday: { enabled: false, openTime: "10:00", closeTime: "14:00" },
  sunday: { enabled: false, openTime: "10:00", closeTime: "14:00" },
};

const days: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const time24 = `${hour.toString().padStart(2, "0")}:${minute}`;
  const period = hour < 12 ? "AM" : "PM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const time12 = `${hour12}:${minute} ${period}`;
  return { value: time24, label: time12 };
});

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
];

export function BusinessHours({
  schedule: initialSchedule = defaultSchedule,
  timezone: initialTimezone = "America/New_York",
  onSave,
  className,
}: BusinessHoursProps) {
  const [schedule, setSchedule] = useState<WeekSchedule>(initialSchedule);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleDay = (day: DayOfWeek) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
    setHasChanges(true);
  };

  const handleTimeChange = (
    day: DayOfWeek,
    field: "openTime" | "closeTime",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
    setHasChanges(true);
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    setHasChanges(true);
  };

  const handleCopyToAll = (sourceDay: DayOfWeek) => {
    const source = schedule[sourceDay];
    setSchedule((prev) => {
      const updated = { ...prev };
      days.forEach((day) => {
        if (day.key !== sourceDay && prev[day.key].enabled) {
          updated[day.key] = { ...source };
        }
      });
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(schedule, timezone);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const openDays = days.filter((d) => schedule[d.key].enabled);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
          <Clock className="h-5 w-5" />
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timezone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all bg-white"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Schedule Grid */}
        <div className="space-y-3">
          {days.map((day, index) => {
            const daySchedule = schedule[day.key];
            return (
              <motion.div
                key={day.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex flex-wrap items-center gap-3 p-4 rounded-xl border transition-all",
                  daySchedule.enabled
                    ? "border-gray-200 bg-white"
                    : "border-gray-100 bg-gray-50"
                )}
              >
                {/* Toggle */}
                <button
                  onClick={() => handleToggleDay(day.key)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
                    daySchedule.enabled ? "bg-[#C9A227]" : "bg-gray-200"
                  )}
                >
                  <motion.div
                    initial={false}
                    animate={{ x: daySchedule.enabled ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>

                {/* Day Label */}
                <span
                  className={cn(
                    "w-24 font-medium",
                    daySchedule.enabled ? "text-[#1E3A5F]" : "text-gray-400"
                  )}
                >
                  {day.label}
                </span>

                {/* Time Selectors */}
                {daySchedule.enabled ? (
                  <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                    <select
                      value={daySchedule.openTime}
                      onChange={(e) =>
                        handleTimeChange(day.key, "openTime", e.target.value)
                      }
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all bg-white"
                    >
                      {timeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-400">to</span>
                    <select
                      value={daySchedule.closeTime}
                      onChange={(e) =>
                        handleTimeChange(day.key, "closeTime", e.target.value)
                      }
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all bg-white"
                    >
                      {timeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleCopyToAll(day.key)}
                      className="p-2 text-gray-400 hover:text-[#C9A227] hover:bg-[#FDF8E8] rounded-lg transition-colors"
                      title="Copy to all enabled days"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Closed</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-[#FDF8E8] border border-[#C9A227]/20">
          <p className="text-sm text-gray-600">
            <strong className="text-[#1E3A5F]">Summary:</strong> Your business is
            open {openDays.length} day{openDays.length !== 1 ? "s" : ""} per week
            {openDays.length > 0 && (
              <>
                {" "}
                ({openDays.map((d) => d.short).join(", ")})
              </>
            )}
            . Calls outside business hours will be handled by your AI receptionist
            or go to voicemail.
          </p>
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

export default BusinessHours;

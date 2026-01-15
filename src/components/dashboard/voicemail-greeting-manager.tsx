"use client";

import { useState } from "react";
import {
  Voicemail,
  Play,
  Pause,
  Upload,
  Mic,
  Trash2,
  Check,
  Clock,
  Sun,
  Moon,
  Calendar,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Greeting {
  id: string;
  name: string;
  type: "default" | "business-hours" | "after-hours" | "holiday" | "custom";
  duration: number;
  audioUrl?: string;
  isActive: boolean;
  schedule?: {
    startDate?: string;
    endDate?: string;
    daysOfWeek?: number[];
    startTime?: string;
    endTime?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock greetings data
const mockGreetings: Greeting[] = [
  {
    id: "1",
    name: "Default Greeting",
    type: "default",
    duration: 15,
    audioUrl: "/greetings/default.mp3",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Business Hours",
    type: "business-hours",
    duration: 22,
    audioUrl: "/greetings/business.mp3",
    isActive: true,
    schedule: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "17:00",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    name: "After Hours",
    type: "after-hours",
    duration: 18,
    audioUrl: "/greetings/afterhours.mp3",
    isActive: true,
    schedule: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: "17:00",
      endTime: "09:00",
    },
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-12T09:15:00Z",
  },
  {
    id: "4",
    name: "Holiday Closure",
    type: "holiday",
    duration: 25,
    audioUrl: "/greetings/holiday.mp3",
    isActive: false,
    schedule: {
      startDate: "2024-12-24",
      endDate: "2024-12-26",
    },
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
];

const greetingTypeConfig = {
  default: {
    label: "Default",
    icon: Voicemail,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  "business-hours": {
    label: "Business Hours",
    icon: Sun,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  "after-hours": {
    label: "After Hours",
    icon: Moon,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  holiday: {
    label: "Holiday",
    icon: Calendar,
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  custom: {
    label: "Custom",
    icon: Settings,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
};

export function VoicemailGreetingManager() {
  const [greetings, setGreetings] = useState<Greeting[]>(mockGreetings);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showNewGreeting, setShowNewGreeting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [newGreeting, setNewGreeting] = useState({
    name: "",
    type: "custom" as Greeting["type"],
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      // Simulate audio playback ending
      const greeting = greetings.find((g) => g.id === id);
      if (greeting) {
        setTimeout(() => setPlayingId(null), greeting.duration * 1000);
      }
    }
  };

  const handleDelete = (id: string) => {
    setGreetings(greetings.filter((g) => g.id !== id));
  };

  const handleSetActive = (id: string) => {
    setGreetings(
      greetings.map((g) => ({
        ...g,
        isActive: g.id === id ? !g.isActive : g.isActive,
      }))
    );
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // In real implementation, would use MediaRecorder API
    setTimeout(() => {
      setIsRecording(false);
      // Add new greeting from recording
      const newId = Date.now().toString();
      setGreetings([
        ...greetings,
        {
          id: newId,
          name: newGreeting.name || "New Recording",
          type: newGreeting.type,
          duration: Math.floor(Math.random() * 20) + 10,
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      setShowNewGreeting(false);
      setNewGreeting({ name: "", type: "custom" });
    }, 3000);
  };

  const handleFileUpload = () => {
    // In real implementation, would handle file upload
    const newId = Date.now().toString();
    setGreetings([
      ...greetings,
      {
        id: newId,
        name: newGreeting.name || "Uploaded Greeting",
        type: newGreeting.type,
        duration: Math.floor(Math.random() * 30) + 15,
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    setShowNewGreeting(false);
    setNewGreeting({ name: "", type: "custom" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Voicemail Greetings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your voicemail greetings for different scenarios
          </p>
        </div>
        <Button
          onClick={() => setShowNewGreeting(true)}
          className="btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          New Greeting
        </Button>
      </div>

      {/* New Greeting Form */}
      {showNewGreeting && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Create New Greeting
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Greeting Name
              </label>
              <Input
                value={newGreeting.name}
                onChange={(e) =>
                  setNewGreeting({ ...newGreeting, name: e.target.value })
                }
                placeholder="Enter greeting name..."
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Greeting Type
              </label>
              <select
                value={newGreeting.type}
                onChange={(e) =>
                  setNewGreeting({
                    ...newGreeting,
                    type: e.target.value as Greeting["type"],
                  })
                }
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="default">Default</option>
                <option value="business-hours">Business Hours</option>
                <option value="after-hours">After Hours</option>
                <option value="holiday">Holiday</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleStartRecording}
              disabled={isRecording}
              className={cn(
                "gap-2",
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#1E3A5F] hover:bg-[#2d4a6f]"
              )}
            >
              <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
              {isRecording ? "Recording..." : "Record Greeting"}
            </Button>
            <Button
              variant="outline"
              onClick={handleFileUpload}
              disabled={isRecording}
              className="gap-2 dark:border-gray-600"
            >
              <Upload className="h-4 w-4" />
              Upload Audio
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowNewGreeting(false);
                setNewGreeting({ name: "", type: "custom" });
              }}
              disabled={isRecording}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Greetings List */}
      <div className="space-y-3">
        {greetings.map((greeting) => {
          const config = greetingTypeConfig[greeting.type];
          const TypeIcon = config.icon;

          return (
            <div
              key={greeting.id}
              className={cn(
                "p-4 bg-white dark:bg-gray-800 rounded-xl border transition-all",
                greeting.isActive
                  ? "border-[#C9A227] shadow-sm"
                  : "border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play Button */}
                  <button
                    onClick={() => handlePlay(greeting.id)}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                      playingId === greeting.id
                        ? "bg-[#C9A227] text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    {playingId === greeting.id ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </button>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {greeting.name}
                      </h3>
                      {greeting.isActive && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          config.color
                        )}
                      >
                        <TypeIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(greeting.duration)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetActive(greeting.id)}
                    className={cn(
                      "gap-1",
                      greeting.isActive
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "dark:border-gray-600"
                    )}
                  >
                    <Check className="h-4 w-4" />
                    {greeting.isActive ? "Active" : "Set Active"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(greeting.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Schedule Info */}
              {greeting.schedule && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {greeting.schedule.daysOfWeek && (
                      <span>
                        Days:{" "}
                        {greeting.schedule.daysOfWeek
                          .map(
                            (d) =>
                              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                                d
                              ]
                          )
                          .join(", ")}{" "}
                        • {greeting.schedule.startTime} -{" "}
                        {greeting.schedule.endTime}
                      </span>
                    )}
                    {greeting.schedule.startDate && (
                      <span>
                        {new Date(
                          greeting.schedule.startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          greeting.schedule.endDate!
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          Tips for Great Voicemail Greetings
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Keep greetings between 15-30 seconds</li>
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Include your business name and callback info</li>
          <li>• Update holiday greetings before scheduled closures</li>
        </ul>
      </div>
    </div>
  );
}

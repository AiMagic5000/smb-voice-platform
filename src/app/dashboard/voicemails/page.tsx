"use client";

import { useEffect, useState, useRef } from "react";
import {
  Voicemail,
  Play,
  Pause,
  Trash2,
  Download,
  Clock,
  Check,
  Circle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VoicemailItem {
  id: string;
  from: string;
  duration: number;
  transcription: string | null;
  audioUrl: string | null;
  isNew: boolean;
  createdAt: string;
}

export default function VoicemailsPage() {
  const [voicemails, setVoicemails] = useState<VoicemailItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchVoicemails();
  }, []);

  async function fetchVoicemails() {
    try {
      const response = await fetch("/api/voicemails");
      if (response.ok) {
        const data = await response.json();
        setVoicemails(data.voicemails || []);
      }
    } catch (error) {
      console.error("Failed to fetch voicemails:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays < 7) {
      return d.toLocaleDateString("en-US", { weekday: "long" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const togglePlay = (vm: VoicemailItem) => {
    if (playingId === vm.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (vm.audioUrl) {
        audioRef.current = new Audio(vm.audioUrl);
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingId(null);
        setPlayingId(vm.id);
      }
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/voicemails/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isNew: false }),
      });
      setVoicemails((prev) =>
        prev.map((vm) => (vm.id === id ? { ...vm, isNew: false } : vm))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteVoicemail = async (id: string) => {
    if (!confirm("Delete this voicemail?")) return;
    try {
      await fetch(`/api/voicemails/${id}`, { method: "DELETE" });
      setVoicemails((prev) => prev.filter((vm) => vm.id !== id));
    } catch (error) {
      console.error("Failed to delete voicemail:", error);
    }
  };

  const newCount = voicemails.filter((vm) => vm.isNew).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Voicemails</h1>
            {newCount > 0 && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full">
                {newCount} new
              </span>
            )}
          </div>
          <p className="text-slate-400 mt-1">Listen to and manage your voicemails</p>
        </div>
      </div>

      {/* Voicemails List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : voicemails.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Voicemail className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No voicemails</p>
              <p className="text-sm mt-1">
                When callers leave voicemails, they will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {voicemails.map((vm) => (
                <div
                  key={vm.id}
                  className={`p-4 hover:bg-slate-700/30 transition-colors ${
                    vm.isNew ? "bg-slate-700/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Button
                        size="icon"
                        onClick={() => togglePlay(vm)}
                        className={`w-12 h-12 rounded-full ${
                          playingId === vm.id
                            ? "bg-[#C9A227] hover:bg-[#B8921F]"
                            : "bg-slate-700 hover:bg-slate-600"
                        }`}
                      >
                        {playingId === vm.id ? (
                          <Pause className="h-5 w-5 text-white" />
                        ) : (
                          <Play className="h-5 w-5 text-white ml-0.5" />
                        )}
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {vm.isNew && (
                            <Circle className="h-2 w-2 fill-[#C9A227] text-[#C9A227]" />
                          )}
                          <p className="text-white font-medium">
                            {formatPhoneNumber(vm.from)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(vm.duration)}
                          </span>
                          <span>•</span>
                          <span>{formatDate(vm.createdAt)}</span>
                        </div>

                        {vm.transcription && (
                          <p className="text-slate-300 text-sm mt-2 line-clamp-2">
                            {vm.transcription}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {vm.isNew && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => markAsRead(vm.id)}
                          className="text-slate-400 hover:text-white"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {vm.audioUrl && (
                        <Button
                          size="icon"
                          variant="ghost"
                          asChild
                          className="text-slate-400 hover:text-white"
                          title="Download"
                        >
                          <a href={vm.audioUrl} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteVoicemail(vm.id)}
                        className="text-slate-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Voicemail className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Voicemail Transcription</p>
              <p className="text-sm text-slate-300 mt-1">
                All voicemails are automatically transcribed using AI. Transcriptions
                are available within seconds of receiving a voicemail.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

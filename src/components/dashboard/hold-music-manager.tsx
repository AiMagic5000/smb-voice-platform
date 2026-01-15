"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Music,
  Upload,
  Play,
  Pause,
  Trash2,
  Volume2,
  Check,
  Clock,
  FileAudio,
  Radio,
  MoreVertical,
  Plus,
  RefreshCw,
} from "lucide-react";

type HoldMusic = {
  id: string;
  name: string;
  fileName: string;
  duration: number; // seconds
  fileSize: number; // bytes
  fileType: string;
  isDefault: boolean;
  isActive: boolean;
  uploadedAt: string;
  playCount: number;
};

const mockHoldMusic: HoldMusic[] = [
  {
    id: "1",
    name: "Classic Hold Music",
    fileName: "classic_hold.mp3",
    duration: 180,
    fileSize: 2850000,
    fileType: "audio/mpeg",
    isDefault: true,
    isActive: true,
    uploadedAt: new Date(Date.now() - 2592000000).toISOString(),
    playCount: 1245,
  },
  {
    id: "2",
    name: "Jazz Lounge",
    fileName: "jazz_lounge.mp3",
    duration: 240,
    fileSize: 3800000,
    fileType: "audio/mpeg",
    isDefault: false,
    isActive: true,
    uploadedAt: new Date(Date.now() - 1296000000).toISOString(),
    playCount: 567,
  },
  {
    id: "3",
    name: "Corporate Ambient",
    fileName: "corporate_ambient.mp3",
    duration: 300,
    fileSize: 4500000,
    fileType: "audio/mpeg",
    isDefault: false,
    isActive: false,
    uploadedAt: new Date(Date.now() - 604800000).toISOString(),
    playCount: 89,
  },
];

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function HoldMusicManager() {
  const [music, setMusic] = useState(mockHoldMusic);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const setAsDefault = (id: string) => {
    setMusic(
      music.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
  };

  const toggleActive = (id: string) => {
    setMusic(
      music.map((m) =>
        m.id === id ? { ...m, isActive: !m.isActive } : m
      )
    );
  };

  const deleteMusic = (id: string) => {
    setMusic(music.filter((m) => m.id !== id));
  };

  const activeMusic = music.filter((m) => m.isActive);
  const defaultMusic = music.find((m) => m.isDefault);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <Music className="h-6 w-6 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Tracks</p>
                  <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                    {music.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Radio className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                    {activeMusic.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Default Track</p>
                  <p className="text-lg font-semibold text-[#1E3A5F] dark:text-white truncate">
                    {defaultMusic?.name || "None"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1E3A5F] dark:text-white">
          Music Library
        </h2>
        <Button
          className="btn-primary gap-2"
          onClick={() => setShowUpload(true)}
        >
          <Upload className="h-4 w-4" />
          Upload Music
        </Button>
      </div>

      {/* Music List */}
      <div className="space-y-3">
        {music.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Music className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No hold music uploaded yet
              </p>
              <Button
                className="btn-primary gap-2"
                onClick={() => setShowUpload(true)}
              >
                <Upload className="h-4 w-4" />
                Upload Your First Track
              </Button>
            </CardContent>
          </Card>
        ) : (
          music.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={`transition-all ${
                  track.isDefault ? "ring-2 ring-[#C9A227]" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Play Button */}
                    <button
                      onClick={() => togglePlay(track.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        playingId === track.id
                          ? "bg-[#C9A227] text-white"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-[#C9A227] hover:text-white"
                      }`}
                    >
                      {playingId === track.id ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </button>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#1E3A5F] dark:text-white">
                          {track.name}
                        </span>
                        {track.isDefault && (
                          <Badge className="bg-[#FDF8E8] text-[#9E7E1E] dark:bg-[#C9A227]/20 dark:text-[#C9A227]">
                            Default
                          </Badge>
                        )}
                        {!track.isActive && (
                          <Badge variant="outline" className="text-gray-500">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(track.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileAudio className="h-3 w-3" />
                          {formatFileSize(track.fileSize)}
                        </span>
                        <span className="flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />
                          {track.playCount} plays
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!track.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAsDefault(track.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant={track.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleActive(track.id)}
                        className={track.isActive ? "" : "btn-primary"}
                      >
                        {track.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMusic(track.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar (when playing) */}
                  <AnimatePresence>
                    {playingId === track.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <Volume2 className="h-4 w-4 text-gray-400" />
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[#C9A227]"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: track.duration,
                                ease: "linear",
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-12 text-right">
                            {formatDuration(track.duration)}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Upload Dialog */}
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="w-full max-w-lg mx-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                    Upload Hold Music
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Track Name
                      </label>
                      <Input placeholder="e.g., Relaxing Jazz" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Audio File
                      </label>
                      <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-[#C9A227] transition-colors cursor-pointer dark:border-gray-700">
                        <Music className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Drop MP3, WAV, or M4A here
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Max file size: 10MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="setDefault" className="rounded" />
                      <label
                        htmlFor="setDefault"
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        Set as default hold music
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setShowUpload(false)}>
                      Cancel
                    </Button>
                    <Button className="btn-primary gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  src?: string;
  title?: string;
  subtitle?: string;
  duration?: number; // Duration in seconds for demo mode
  className?: string;
  onEnded?: () => void;
}

export function AudioPlayer({
  src,
  title,
  subtitle,
  duration: demoDuration = 180,
  className,
  onEnded,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(demoDuration);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Demo mode interval for when no actual audio source is provided
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clean up demo interval on unmount
    return () => {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(() => {
    if (src && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // Demo mode
      if (isPlaying) {
        if (demoIntervalRef.current) {
          clearInterval(demoIntervalRef.current);
        }
      } else {
        demoIntervalRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              if (demoIntervalRef.current) {
                clearInterval(demoIntervalRef.current);
              }
              setIsPlaying(false);
              onEnded?.();
              return 0;
            }
            return prev + 1;
          });
        }, 1000 / playbackRate);
      }
      setIsPlaying(!isPlaying);
    }
  }, [src, isPlaying, duration, playbackRate, onEnded]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;

      if (src && audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
      setCurrentTime(newTime);
    },
    [src, duration]
  );

  const skip = useCallback(
    (seconds: number) => {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      if (src && audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
      setCurrentTime(newTime);
    },
    [src, duration, currentTime]
  );

  const toggleMute = useCallback(() => {
    if (src && audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  }, [src, isMuted]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      if (src && audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    },
    [src]
  );

  const cyclePlaybackRate = useCallback(() => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];

    if (src && audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
    setPlaybackRate(nextRate);
  }, [src, playbackRate]);

  const restart = useCallback(() => {
    if (src && audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  }, [src]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("bg-white rounded-2xl border border-gray-200 p-4", className)}>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={() =>
            audioRef.current && setCurrentTime(audioRef.current.currentTime)
          }
          onLoadedMetadata={() =>
            audioRef.current && setDuration(audioRef.current.duration)
          }
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
        />
      )}

      {/* Title */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h4 className="font-semibold text-[#1E3A5F] truncate">{title}</h4>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 truncate">{subtitle}</p>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div
        className="relative h-2 bg-gray-100 rounded-full cursor-pointer mb-4 group"
        onClick={handleSeek}
      >
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#1E3A5F] to-[#2D5A8F] rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#C9A227] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>

      {/* Time Display */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Playback Rate */}
          <button
            onClick={cyclePlaybackRate}
            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Playback speed"
          >
            {playbackRate}x
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Restart */}
          <button
            onClick={restart}
            className="p-2 text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-xl transition-colors"
            title="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Skip Back */}
          <button
            onClick={() => skip(-10)}
            className="p-2 text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-xl transition-colors"
            title="Back 10 seconds"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          {/* Play/Pause */}
          <motion.button
            onClick={togglePlay}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-[#C9A227] text-white rounded-xl hover:bg-[#B8911F] transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </motion.button>

          {/* Skip Forward */}
          <button
            onClick={() => skip(10)}
            className="p-2 text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-xl transition-colors"
            title="Forward 10 seconds"
          >
            <SkipForward className="h-5 w-5" />
          </button>

          {/* Volume */}
          <div className="relative group">
            <button
              onClick={toggleMute}
              className="p-2 text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-xl transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 accent-[#C9A227]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Download */}
          {src && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-gray-500 hover:text-[#1E3A5F]"
              asChild
            >
              <a href={src} download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;

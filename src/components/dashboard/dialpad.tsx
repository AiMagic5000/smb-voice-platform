"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Delete, X, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DialpadProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCall?: (number: string) => void;
  className?: string;
}

const dialpadKeys = [
  { digit: "1", letters: "" },
  { digit: "2", letters: "ABC" },
  { digit: "3", letters: "DEF" },
  { digit: "4", letters: "GHI" },
  { digit: "5", letters: "JKL" },
  { digit: "6", letters: "MNO" },
  { digit: "7", letters: "PQRS" },
  { digit: "8", letters: "TUV" },
  { digit: "9", letters: "WXYZ" },
  { digit: "*", letters: "" },
  { digit: "0", letters: "+" },
  { digit: "#", letters: "" },
];

export function Dialpad({
  isOpen = true,
  onClose,
  onCall,
  className,
}: DialpadProps) {
  const [number, setNumber] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const handleDigitPress = useCallback((digit: string) => {
    if (isCallActive) {
      // DTMF tone during call - would send tone via SignalWire
      console.log("DTMF:", digit);
    } else {
      setNumber((prev) => prev + digit);
    }
  }, [isCallActive]);

  const handleDelete = useCallback(() => {
    setNumber((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setNumber("");
  }, []);

  const handleCall = useCallback(() => {
    if (number.length > 0) {
      setIsCallActive(true);
      onCall?.(number);
      // Simulate call duration counter
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      // Store interval ID for cleanup
      return () => clearInterval(interval);
    }
  }, [number, onCall]);

  const handleEndCall = useCallback(() => {
    setIsCallActive(false);
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeaker(false);
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPhoneNumber = (num: string): string => {
    const cleaned = num.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn(
            "bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#1E3A5F]">
              {isCallActive ? "In Call" : "Make a Call"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Number Display */}
          <div className="p-6 text-center">
            <div className="min-h-[60px] flex items-center justify-center">
              {isCallActive ? (
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-[#1E3A5F]">
                    {formatPhoneNumber(number) || "Unknown"}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    {formatDuration(callDuration)}
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-[#1E3A5F] tracking-wider">
                  {formatPhoneNumber(number) || (
                    <span className="text-gray-300">Enter number</span>
                  )}
                </p>
              )}
            </div>

            {/* Delete Button */}
            {!isCallActive && number.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleDelete}
                onDoubleClick={handleClear}
                className="mt-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete (double-click to clear)"
              >
                <Delete className="h-5 w-5" />
              </motion.button>
            )}
          </div>

          {/* Dialpad Grid */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {dialpadKeys.map((key) => (
                <motion.button
                  key={key.digit}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDigitPress(key.digit)}
                  className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <span className="text-2xl font-semibold text-[#1E3A5F]">
                    {key.digit}
                  </span>
                  {key.letters && (
                    <span className="text-[10px] text-gray-400 tracking-wider">
                      {key.letters}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Call Controls */}
          <div className="px-6 pb-6">
            {isCallActive ? (
              <div className="space-y-4">
                {/* In-call controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={cn(
                      "p-4 rounded-2xl transition-colors",
                      isMuted
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {isMuted ? (
                      <MicOff className="h-6 w-6" />
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsSpeaker(!isSpeaker)}
                    className={cn(
                      "p-4 rounded-2xl transition-colors",
                      isSpeaker
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {isSpeaker ? (
                      <Volume2 className="h-6 w-6" />
                    ) : (
                      <VolumeX className="h-6 w-6" />
                    )}
                  </button>
                </div>

                {/* End Call Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEndCall}
                  className="w-full py-4 rounded-2xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                >
                  <Phone className="h-5 w-5 rotate-[135deg]" />
                  End Call
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCall}
                disabled={number.length === 0}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors",
                  number.length > 0
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                <Phone className="h-5 w-5" />
                Call
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Dialpad;

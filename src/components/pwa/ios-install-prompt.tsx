"use client";

import { useState, useEffect } from "react";
import { Share, Plus, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(iOS);

    // Check if already installed as PWA (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem("smb-voice-ios-install-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissed =
      (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt if:
    // - Device is iOS
    // - Not already installed
    // - Not dismissed in the last 7 days
    if (iOS && !isStandalone && daysSinceDismissed > 7) {
      // Delay showing prompt for better UX
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(
      "smb-voice-ios-install-dismissed",
      Date.now().toString()
    );
    setShowPrompt(false);
  };

  const handleNeverShow = () => {
    // Set far future date to effectively never show again
    localStorage.setItem(
      "smb-voice-ios-install-dismissed",
      (Date.now() + 365 * 24 * 60 * 60 * 1000).toString()
    );
    setShowPrompt(false);
  };

  if (!isIOS || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
      >
        <div className="mx-4 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  Install SMB Voice
                </h3>
                <p className="text-white/70 text-xs">
                  Add to your home screen
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5 text-white/70" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-600 text-sm mb-4">
              Install our app for the best experience. Access your business
              phone directly from your home screen.
            </p>

            {/* Instructions */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#1E3A5F]">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Tap the{" "}
                    <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded">
                      <Share className="h-4 w-4 text-[#007AFF]" />
                    </span>{" "}
                    Share button below
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#1E3A5F]">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Scroll down and tap{" "}
                    <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded">
                      <Plus className="h-4 w-4 text-gray-700 mr-1" />
                      <span className="text-xs">Add to Home Screen</span>
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#C9A227]">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Tap <span className="font-semibold">Add</span> to install
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNeverShow}
                className="flex-1 text-gray-500"
              >
                Don&apos;t show again
              </Button>
              <Button
                size="sm"
                onClick={handleDismiss}
                className="flex-1 bg-[#C9A227] hover:bg-[#B8911F] text-white"
              >
                Got it
              </Button>
            </div>
          </div>

          {/* Arrow pointing to share button */}
          <div className="flex justify-center pb-2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-200" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import {
  Smartphone,
  Apple,
  Download,
  QrCode,
  Check,
  Phone,
  MessageSquare,
  Video,
  Bell,
  Shield,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: AppFeature[] = [
  {
    icon: Phone,
    title: "Make & Receive Calls",
    description: "Use your business number from anywhere in the world",
  },
  {
    icon: MessageSquare,
    title: "SMS Messaging",
    description: "Send and receive text messages with your business number",
  },
  {
    icon: Video,
    title: "Video Meetings",
    description: "Join video conferences directly from the app",
  },
  {
    icon: Bell,
    title: "Push Notifications",
    description: "Get notified instantly for calls, messages, and voicemails",
  },
  {
    icon: Shield,
    title: "Secure Communications",
    description: "End-to-end encryption for all calls and messages",
  },
  {
    icon: RefreshCw,
    title: "Real-time Sync",
    description: "Contacts, call history, and settings sync across devices",
  },
];

export function MobileApps() {
  const [selectedPlatform, setSelectedPlatform] = useState<"ios" | "android">(
    "ios"
  );
  const [showQRCode, setShowQRCode] = useState(false);

  const appStoreUrl = "https://apps.apple.com/app/smb-voice";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.smbvoice";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          SMB Voice Mobile App
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Take your business phone with you. Make calls, send messages, and
          manage your phone system from anywhere.
        </p>
      </div>

      {/* Platform Selection */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setSelectedPlatform("ios")}
          className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all",
            selectedPlatform === "ios"
              ? "border-[#1E3A5F] bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          )}
        >
          <Apple className="h-8 w-8 text-gray-900 dark:text-white" />
          <div className="text-left">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Download on the
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              App Store
            </p>
          </div>
        </button>
        <button
          onClick={() => setSelectedPlatform("android")}
          className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all",
            selectedPlatform === "android"
              ? "border-[#1E3A5F] bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          )}
        >
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.523 2.043a.5.5 0 0 0-.454-.02L3.2 9.3a1.5 1.5 0 0 0 0 2.4l13.87 7.28a.5.5 0 0 0 .73-.44V2.46a.5.5 0 0 0-.277-.417zm-14.3 8.457l10.1-5.3v10.6l-10.1-5.3z" />
          </svg>
          <div className="text-left">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Get it on
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              Google Play
            </p>
          </div>
        </button>
      </div>

      {/* Download Card */}
      <div className="max-w-lg mx-auto">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#C9A227] flex items-center justify-center">
                <Phone className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  SMB Voice
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start My Business Inc.
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-[#C9A227]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                4.8 • 2.5K ratings
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 btn-primary gap-2"
              onClick={() =>
                window.open(
                  selectedPlatform === "ios" ? appStoreUrl : playStoreUrl,
                  "_blank"
                )
              }
            >
              <Download className="h-4 w-4" />
              Download Free
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowQRCode(!showQRCode)}
              className="gap-2 dark:border-gray-600"
            >
              <QrCode className="h-4 w-4" />
              QR Code
            </Button>
          </div>

          {/* QR Code */}
          {showQRCode && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
              <div className="w-40 h-40 mx-auto bg-white rounded-lg flex items-center justify-center mb-3">
                {/* Placeholder QR code */}
                <div className="grid grid-cols-6 gap-1 p-3">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-4 h-4 rounded-sm",
                        Math.random() > 0.5 ? "bg-gray-900" : "bg-white"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Scan with your phone camera to download
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Requires {selectedPlatform === "ios" ? "iOS 15.0" : "Android 8.0"}{" "}
              or later • Free • In-app purchases
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-6">
          Everything You Need on the Go
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#1E3A5F]/10 dark:bg-[#1E3A5F]/30 rounded-lg flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-[#1E3A5F] dark:text-[#C9A227]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Compatibility */}
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Device Compatibility
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Apple className="h-4 w-4" />
              iOS
            </h5>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                iPhone 8 and newer
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                iPad (6th gen) and newer
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                iOS 15.0 or later
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Android
            </h5>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Most Android phones
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Android tablets
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Android 8.0 or later
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* iOS PWA Instructions */}
      {selectedPlatform === "ios" && (
        <div className="max-w-lg mx-auto p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <Apple className="h-5 w-5" />
            Install as App on iPhone/iPad
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              Open voice.startmybusiness.us in Safari
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              Tap the Share button (box with arrow)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              Scroll down and tap &quot;Add to Home Screen&quot;
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              Tap &quot;Add&quot; to install the app
            </li>
          </ol>
          <p className="text-xs text-blue-600 dark:text-blue-300 mt-4">
            The app will appear on your home screen like a native app with full-screen experience.
          </p>
        </div>
      )}

      {/* Desktop Apps */}
      <div className="text-center">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Desktop Applications
        </h4>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Download SMB Voice for your computer
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/downloads/SMB-Voice-Windows-Portable.zip"
            download
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3A5F] hover:bg-[#2d4a6f] text-white rounded-xl font-medium transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
            </svg>
            Windows (103 MB)
            <Download className="h-4 w-4" />
          </a>
          <Button variant="outline" className="gap-2 dark:border-gray-700" disabled>
            <Apple className="h-4 w-4" />
            macOS (Coming Soon)
          </Button>
          <Button variant="outline" className="gap-2 dark:border-gray-700" disabled>
            <ExternalLink className="h-4 w-4" />
            Linux (Coming Soon)
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Windows: Extract the zip file and run SMB Voice.exe
        </p>
      </div>
    </div>
  );
}

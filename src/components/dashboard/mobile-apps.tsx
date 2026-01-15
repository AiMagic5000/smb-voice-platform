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

      {/* Desktop Apps */}
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Also available for desktop
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="gap-2 dark:border-gray-700">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
            </svg>
            Windows
          </Button>
          <Button variant="outline" className="gap-2 dark:border-gray-700">
            <Apple className="h-4 w-4" />
            macOS
          </Button>
          <Button variant="outline" className="gap-2 dark:border-gray-700">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.482-.04 1.053-.208 1.486a.81.81 0 01-.036.095c.21.087.426.092.651.092.571 0 1.212-.138 1.832-.138.268 0 .532.026.803.063.274.065.525.2.76.467h.003c.13.149.26.336.26.467v.061c-.01.026-.034.044-.04.067-.085.135-.155.199-.241.268-.16.135-.338.2-.534.265-.412.135-.824.2-1.25.2-.431 0-.874-.2-1.283-.465-.6-.4-1.145-.867-1.769-1.133a4.612 4.612 0 00-.874-.268c-.36-.064-.75-.115-1.195-.006-.005-.02-.009-.038-.018-.064-.057-.175-.083-.332-.083-.465a.27.27 0 00.003-.082c-.235.335-.544.601-.883.735a1.727 1.727 0 01-.631.103c-.465.003-.919-.135-1.337-.403-.261-.134-.511-.333-.745-.533v.003c-.027.028-.055.053-.08.067-.087.07-.192.131-.29.2-.187.136-.41.264-.602.398h-.003c-.26.2-.531.336-.795.4-.143.002-.286-.002-.426-.067h-.003c-.139-.067-.297-.136-.428-.336-.069-.135-.101-.4-.16-.599v-.068c-.106-.133-.21-.265-.336-.336-.156-.135-.312-.269-.489-.336a2.014 2.014 0 00-.312-.136c-.312-.135-.703-.266-1.063-.465a.955.955 0 01-.448-.6v-.067a.166.166 0 01.053-.135.66.66 0 01.343-.202c.168-.068.358-.135.523-.202h.003c.194-.067.364-.2.556-.267.05-.015.1-.022.15-.028-.23.003-.42.03-.62.033-.198.002-.378-.003-.52-.068h-.006c-.136-.068-.233-.2-.313-.336-.08-.2-.103-.467-.05-.733.055-.268.155-.533.268-.733.12-.2.198-.333.333-.467.26-.333.536-.6.77-.866.27-.27.51-.532.71-.798.202-.267.383-.532.485-.865.019-.07.04-.131.063-.198v-.004c.2.06.41.058.626 0-.033-.133-.1-.268-.145-.4a8.52 8.52 0 01-.165-.667c-.134-.533-.203-1.135-.14-1.735.066-.6.2-1.2.467-1.733.27-.533.6-1.032.997-1.466a8.543 8.543 0 011.367-1.133c.45-.335.931-.6 1.4-.866.458-.267.903-.468 1.355-.6a4.467 4.467 0 011.255-.203c.354.006.69.065 1.005.198a.865.865 0 01.39.197c-.18-.067-.378-.135-.609-.135h-.018c-.318.002-.639.033-.955.133-.641.2-1.275.6-1.86 1.068-.585.468-1.123 1.003-1.565 1.602a8.11 8.11 0 00-.997 1.798c-.068.2-.133.4-.183.6-.049.2-.08.4-.093.6a2.75 2.75 0 00.031.466c.01.14.023.28.043.4.012.066.02.131.032.2h.003z" />
            </svg>
            Linux
          </Button>
        </div>
      </div>
    </div>
  );
}

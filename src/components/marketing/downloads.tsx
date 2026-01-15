"use client";

import { useState, useEffect } from "react";
import {
  Smartphone,
  Apple,
  Monitor,
  Download,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function Downloads() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<
    "android" | "ios" | "windows" | "mac" | "linux" | "unknown"
  >("unknown");

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    } else if (/win/.test(userAgent)) {
      setPlatform("windows");
    } else if (/mac/.test(userAgent)) {
      setPlatform("mac");
    } else if (/linux/.test(userAgent)) {
      setPlatform("linux");
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const platforms = [
    {
      id: "ios",
      name: "iPhone & iPad",
      icon: Apple,
      description: "iOS 15.0+",
      action: "Install via Safari",
    },
    {
      id: "android",
      name: "Android",
      icon: Smartphone,
      description: "Android 8.0+",
      action: deferredPrompt ? "Install Now" : "Install via Chrome",
    },
    {
      id: "windows",
      name: "Windows",
      icon: Monitor,
      description: "Windows 10+",
      action: deferredPrompt ? "Install Now" : "Install via Edge/Chrome",
    },
    {
      id: "mac",
      name: "macOS",
      icon: Apple,
      description: "macOS 11+",
      action: deferredPrompt ? "Install Now" : "Install via Chrome",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm mb-4">
            <Download className="h-4 w-4" />
            Available on All Platforms
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Download SMB Voice
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Get the full experience on any device. Install our app for faster
            access, push notifications, and offline features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {platforms.map((p) => {
            const isCurrentPlatform = platform === p.id;
            const Icon = p.icon;

            return (
              <div
                key={p.id}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  isCurrentPlatform
                    ? "bg-white border-white"
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}
              >
                {isCurrentPlatform && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-[#C9A227] text-white text-xs font-semibold rounded-full">
                      Your Device
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                      isCurrentPlatform
                        ? "bg-[#1E3A5F]"
                        : "bg-white/20"
                    }`}
                  >
                    <Icon
                      className={`h-7 w-7 ${
                        isCurrentPlatform ? "text-white" : "text-white"
                      }`}
                    />
                  </div>

                  <h3
                    className={`font-semibold mb-1 ${
                      isCurrentPlatform ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {p.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${
                      isCurrentPlatform ? "text-gray-500" : "text-white/60"
                    }`}
                  >
                    {p.description}
                  </p>

                  {isInstalled && isCurrentPlatform ? (
                    <Button
                      disabled
                      className="w-full bg-green-500 hover:bg-green-500 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Installed
                    </Button>
                  ) : (
                    <Button
                      onClick={
                        deferredPrompt && (p.id === "android" || p.id === "windows" || p.id === "mac")
                          ? handleInstall
                          : undefined
                      }
                      className={`w-full ${
                        isCurrentPlatform
                          ? "btn-primary"
                          : "bg-white/20 hover:bg-white/30 text-white border-0"
                      }`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {p.action}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Install Instructions for iOS */}
        {platform === "ios" && !isInstalled && (
          <div className="mt-8 max-w-md mx-auto p-4 bg-white/10 rounded-xl text-white text-center">
            <p className="text-sm mb-2 font-medium">iOS Installation:</p>
            <p className="text-sm text-white/70">
              Tap the share button{" "}
              <span className="inline-block px-1 bg-white/20 rounded">
                ⎙
              </span>{" "}
              in Safari, then select &quot;Add to Home Screen&quot;
            </p>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            "Push Notifications",
            "Offline Access",
            "Faster Load Times",
            "Native Feel",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-white/80">
              <Check className="h-4 w-4 text-[#C9A227]" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

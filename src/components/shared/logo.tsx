"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({
  variant = "default",
  size = "md",
  showText = true,
  className,
}: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const colorClasses = {
    default: {
      bg: "bg-gradient-to-br from-[#C9A227] to-[#DEB44A]",
      text: "text-[#1E3A5F]",
      accent: "text-[#C9A227]",
    },
    light: {
      bg: "bg-white",
      text: "text-white",
      accent: "text-white",
    },
    dark: {
      bg: "bg-gradient-to-br from-[#C9A227] to-[#DEB44A]",
      text: "text-[#1E3A5F]",
      accent: "text-[#C9A227]",
    },
  };

  const colors = colorClasses[variant];

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 group", className)}
      aria-label="SMB Voice Home"
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-xl shadow-md transition-transform group-hover:scale-105",
          sizeClasses[size],
          colors.bg
        )}
      >
        <Phone className={cn(iconSizeClasses[size], "text-white")} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold tracking-tight leading-none",
              textSizeClasses[size],
              colors.text
            )}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            SMB Voice
          </span>
          <span
            className={cn(
              "text-xs font-medium opacity-70",
              variant === "light" ? "text-white/70" : "text-gray-500"
            )}
          >
            Business Phone
          </span>
        </div>
      )}
    </Link>
  );
}

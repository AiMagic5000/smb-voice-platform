"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export function Logo({
  variant = "default",
  size = "md",
  showText = false,
  className,
}: LogoProps) {
  const sizeClasses = {
    sm: { width: 60, height: 20 },
    md: { width: 80, height: 27 },
    lg: { width: 100, height: 34 },
    xl: { width: 140, height: 47 },
  };

  const dimensions = sizeClasses[size];

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 group transition-opacity hover:opacity-90",
        className
      )}
      aria-label="Start My Business Home"
    >
      <Image
        src="/logo.png"
        alt="Start My Business"
        width={dimensions.width}
        height={dimensions.height}
        className={cn(
          "object-contain",
          variant === "light" && "brightness-0 invert",
        )}
        priority
      />
    </Link>
  );
}

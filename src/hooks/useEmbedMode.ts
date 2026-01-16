"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useEmbedMode() {
  const searchParams = useSearchParams();

  const isEmbedded = useMemo(() => {
    // Check for embed query param
    if (searchParams.get("embed") === "true") return true;

    // Check if we're in an iframe (client-side only)
    if (typeof window !== "undefined") {
      try {
        return window.self !== window.top;
      } catch {
        // Cross-origin iframe - assume embedded
        return true;
      }
    }

    return false;
  }, [searchParams]);

  return { isEmbedded };
}

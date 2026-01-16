"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

function MarketingContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isEmbedded = searchParams.get("embed") === "true";

  // Also detect if we're in an iframe
  const isInIframe =
    typeof window !== "undefined" &&
    (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

  const showChrome = !isEmbedded && !isInIframe;

  return (
    <div className={isEmbedded || isInIframe ? "embed-mode" : ""}>
      {showChrome && <Navbar />}
      <main className={showChrome ? "" : "embed-main"}>{children}</main>
      {showChrome && <Footer />}
    </div>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A227]" />
        </div>
      }
    >
      <MarketingContent>{children}</MarketingContent>
    </Suspense>
  );
}

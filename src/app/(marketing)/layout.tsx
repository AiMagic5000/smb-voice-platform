"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

function MarketingContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isEmbedParam = searchParams.get("embed") === "true";

  // Use state for iframe detection to handle mobile properly
  const [isInIframe, setIsInIframe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if we're in an iframe after mount
    try {
      const inIframe = window.self !== window.top;
      setIsInIframe(inIframe);
    } catch {
      // Cross-origin iframe - assume embedded
      setIsInIframe(true);
    }
  }, []);

  const isEmbedded = isEmbedParam || isInIframe;
  const showChrome = mounted ? !isEmbedded : true;

  return (
    <div className={mounted && isEmbedded ? "embed-mode" : ""}>
      {showChrome && <Navbar />}
      <main className={!showChrome ? "embed-main" : ""}>{children}</main>
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

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Phone } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-8"
            >
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </motion.div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-4">
              Something Went Wrong
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-4">
              We encountered an unexpected error. Our team has been notified and
              is working to fix it.
            </p>

            {/* Error ID */}
            {error.digest && (
              <p className="text-sm text-gray-400 mb-8 font-mono">
                Error ID: {error.digest}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={reset} className="btn-primary gap-2 w-full sm:w-auto">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="gap-2 w-full sm:w-auto">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 text-gray-500"
            >
              Need immediate help?{" "}
              <a
                href="tel:888-534-4145"
                className="text-[#C9A227] hover:underline font-medium inline-flex items-center gap-1"
              >
                <Phone className="h-4 w-4" />
                Call 888-534-4145
              </a>
            </motion.p>
          </motion.div>
        </div>
      </body>
    </html>
  );
}

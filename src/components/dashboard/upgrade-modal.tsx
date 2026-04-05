"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Crown, CheckCircle2, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UPGRADE_CONFIG } from "@/lib/upgrade-config"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  featureName?: string
}

export function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
  const handleUpgrade = () => {
    if (UPGRADE_CONFIG.checkoutUrl) {
      window.open(UPGRADE_CONFIG.checkoutUrl, "_blank")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2D5A8F] p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A227] flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Upgrade to Pro</h2>
                    <p className="text-white/70 text-sm">{UPGRADE_CONFIG.price}</p>
                  </div>
                </div>
                {featureName && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm">
                    <Sparkles className="h-4 w-4 text-[#C9A227]" />
                    <span><strong>{featureName}</strong> is a Pro feature</span>
                  </div>
                )}
              </div>

              {/* Features list */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Unlock the full power of your business phone system:
                </p>
                <div className="space-y-3 mb-6">
                  {UPGRADE_CONFIG.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleUpgrade}
                  className="w-full h-12 bg-gradient-to-r from-[#C9A227] to-[#DEB44A] hover:from-[#B8922A] hover:to-[#CDA33D] text-white font-semibold text-base gap-2 group"
                >
                  Upgrade Now - {UPGRADE_CONFIG.price}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Cancel anytime. 30-day money-back guarantee.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

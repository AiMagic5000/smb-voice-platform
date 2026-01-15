"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Phone,
  Bot,
  Smartphone,
  Shield,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C9A227]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl" />

        {/* Floating shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-[#C9A227]/30 rounded-2xl rotate-12"
          animate={{
            y: [0, -20, 0],
            rotate: [12, 20, 12],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/5 w-16 h-16 bg-white/10 rounded-full"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container-wide relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6"
            >
              <Sparkles className="h-4 w-4 text-[#C9A227]" />
              <span className="text-sm font-medium">AI-Powered Business Phone</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6">
              Your Business Phone.
              <br />
              <span className="text-gradient-gold">Just $7.95/month.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Get a professional business phone number, AI receptionist, and mobile
              apps. Set up in 5 minutes. No tech skills needed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                asChild
                size="lg"
                className="btn-primary text-lg h-14 px-8 gap-2 group"
              >
                <Link href="/sign-up">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 border-white/30 text-white hover:bg-white/10 gap-2"
              >
                <Link href="#demo">
                  <Play className="h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>24/7 support</span>
              </div>
            </div>
          </motion.div>

          {/* Right content - Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Phone mockup */}
            <div className="relative mx-auto w-[320px]">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#C9A227]/30 rounded-[50px] blur-3xl scale-90" />

              {/* Phone frame */}
              <div className="phone-mockup relative">
                <div className="phone-screen bg-gray-50">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 py-3 bg-white">
                    <span className="text-xs font-medium text-gray-500">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-gray-300 rounded-sm" />
                      <div className="w-6 h-3 bg-green-500 rounded-sm" />
                    </div>
                  </div>

                  {/* App header */}
                  <div className="px-4 py-3 bg-white border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <Image
                        src="/logo.png"
                        alt="Start My Business"
                        width={120}
                        height={40}
                        className="object-contain"
                      />
                      <span className="text-xs text-green-500 font-medium">Online</span>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: Phone, label: "Call", color: "bg-green-500" },
                        { icon: Bot, label: "AI", color: "bg-purple-500" },
                        { icon: Smartphone, label: "Apps", color: "bg-blue-500" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm"
                        >
                          <div
                            className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}
                          >
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {item.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recent calls */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Recent Calls
                      </p>
                      {[
                        { name: "John Smith", time: "2 min ago", type: "incoming" },
                        { name: "Sarah Davis", time: "1 hour ago", type: "outgoing" },
                        { name: "AI Answered", time: "3 hours ago", type: "ai" },
                      ].map((call, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              call.type === "ai"
                                ? "bg-purple-100"
                                : call.type === "incoming"
                                ? "bg-green-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {call.type === "ai" ? (
                              <Bot className="h-4 w-4 text-purple-600" />
                            ) : (
                              <Phone className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {call.name}
                            </p>
                            <p className="text-xs text-gray-500">{call.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating feature cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-16 top-1/4 bg-white rounded-xl p-3 shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Secure</p>
                  <p className="text-xs text-gray-500">Encrypted calls</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -right-8 bottom-1/3 bg-white rounded-xl p-3 shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">AI Ready</p>
                  <p className="text-xs text-gray-500">24/7 answering</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}

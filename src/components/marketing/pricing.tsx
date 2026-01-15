"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  "Business phone number (local or 800)",
  "AI receptionist (24/7)",
  "5 team extensions",
  "Voicemail to email",
  "Call forwarding",
  "Mobile & desktop apps",
  "500 minutes included",
  "Unlimited US & Canada calls",
  "Call recording",
  "24/7 support",
];

export function Pricing() {
  return (
    <section className="section bg-gray-50" id="pricing">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#FDF8E8] text-[#9E7E1E] text-sm font-semibold mb-4">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-6">
            One Plan. One Price.
            <br />
            <span className="text-gradient-gold">Everything Included.</span>
          </h2>
          <p className="text-lg text-gray-600">
            No confusing tiers. No hidden fees. No contracts. Just $7.95/month
            for everything you need.
          </p>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#C9A227] to-[#DEB44A] py-2 text-center">
              <div className="flex items-center justify-center gap-2 text-white text-sm font-semibold">
                <Star className="h-4 w-4 fill-current" />
                Most Popular Choice
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>

            <div className="pt-16 p-8 lg:p-10">
              {/* Plan name */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">
                  SMB Voice Basic
                </h3>
                <p className="text-gray-500">Everything you need to get started</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-end justify-center gap-1">
                  <span className="text-2xl font-medium text-gray-500">$</span>
                  <span className="text-6xl lg:text-7xl font-extrabold text-[#1E3A5F]">
                    7
                  </span>
                  <span className="text-4xl lg:text-5xl font-bold text-[#1E3A5F]">
                    .95
                  </span>
                  <span className="text-xl text-gray-500 mb-2">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Billed monthly. Cancel anytime.
                </p>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-8">
                {features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                className="w-full btn-primary text-lg h-14 gap-2 group"
              >
                <Link href="/sign-up">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  No credit card
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>

          {/* Comparison note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              <Sparkles className="inline h-4 w-4 text-[#C9A227] mr-1" />
              Compare to other services at{" "}
              <span className="line-through">$50-100/month</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Enterprise note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-[#C9A227]" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E3A5F]">Need more?</p>
              <p className="text-sm text-gray-500">
                Call us at 888-534-4145 for custom plans
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

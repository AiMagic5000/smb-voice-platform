"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Sparkles, ArrowRight, Zap, Building2, Crown } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "Perfect for solopreneurs",
    price: 7.95,
    icon: Zap,
    features: [
      "1 business phone number",
      "500 SMS messages/month",
      "Basic AI receptionist",
      "Unlimited US & Canada calling",
      "Voicemail transcription",
      "Mobile & desktop apps",
      "Business hours routing",
    ],
    gumroadUrl: "https://coreypearson.gumroad.com/l/izcdvd",
    featured: false,
  },
  {
    id: "professional",
    name: "Professional",
    subtitle: "Best for growing businesses",
    price: 19.95,
    icon: Building2,
    features: [
      "3 business phone numbers",
      "1,500 SMS messages/month",
      "Advanced AI receptionist",
      "Unlimited US & Canada calling",
      "Call recording & analytics",
      "Team extensions (up to 10)",
      "Custom greetings & IVR",
      "Priority support",
    ],
    gumroadUrl: "https://coreypearson.gumroad.com/l/ojjjt",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For established businesses",
    price: 49.95,
    icon: Crown,
    features: [
      "10 business phone numbers",
      "Unlimited SMS messages",
      "Premium AI receptionist",
      "Unlimited US & Canada calling",
      "Full API access",
      "Unlimited team extensions",
      "CRM integrations",
      "Dedicated account manager",
    ],
    gumroadUrl: "https://coreypearson.gumroad.com/l/ouowmw",
    featured: false,
  },
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
            Choose Your Plan.
            <br />
            <span className="text-gradient-gold">No Hidden Fees.</span>
          </h2>
          <p className="text-lg text-gray-600">
            No contracts. No setup fees. Cancel anytime. Start with what you need and upgrade as you grow.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className={`relative ${plan.featured ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              <div
                className={`relative bg-white rounded-3xl overflow-hidden h-full flex flex-col ${
                  plan.featured
                    ? 'shadow-2xl ring-2 ring-[#C9A227]'
                    : 'shadow-lg border border-gray-100'
                }`}
              >
                {/* Featured badge */}
                {plan.featured && (
                  <div className="bg-gradient-to-r from-[#C9A227] to-[#DEB44A] py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2 text-white text-sm font-semibold">
                      <Star className="h-4 w-4 fill-current" />
                      Most Popular
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                )}

                <div className={`p-6 lg:p-8 flex flex-col flex-1 ${plan.featured ? '' : 'pt-8'}`}>
                  {/* Plan icon and name */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                        plan.featured
                          ? 'bg-gradient-to-r from-[#C9A227] to-[#DEB44A] text-white'
                          : 'bg-[#1E3A5F]/10 text-[#1E3A5F]'
                      }`}
                    >
                      <plan.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1E3A5F]">{plan.name}</h3>
                    <p className="text-gray-500 text-sm">{plan.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-end justify-center gap-0.5">
                      <span className="text-xl font-medium text-gray-500">$</span>
                      <span className="text-5xl font-extrabold text-[#1E3A5F]">
                        {Math.floor(plan.price)}
                      </span>
                      <span className="text-2xl font-bold text-[#1E3A5F]">
                        .{String(plan.price).split('.')[1] || '00'}
                      </span>
                      <span className="text-gray-500 mb-1">/mo</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.featured
                              ? 'bg-[#C9A227]/20 text-[#C9A227]'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    asChild
                    size="lg"
                    className={`w-full gap-2 group ${
                      plan.featured
                        ? 'bg-gradient-to-r from-[#C9A227] to-[#DEB44A] hover:from-[#B8921F] hover:to-[#CDA23A] text-white'
                        : 'bg-[#1E3A5F] hover:bg-[#2D4A6F] text-white'
                    }`}
                  >
                    <a href={plan.gumroadUrl} target="_blank" rel="noopener noreferrer">
                      Get {plan.name}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
        >
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            No credit card required to start
          </span>
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            Cancel anytime
          </span>
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            24/7 support included
          </span>
        </motion.div>

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

        {/* Custom plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-[#C9A227]" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E3A5F]">Need more numbers or custom features?</p>
              <p className="text-sm text-gray-500">
                Call us at <a href="tel:888-534-4145" className="text-[#C9A227] hover:underline">888-534-4145</a> for custom plans
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

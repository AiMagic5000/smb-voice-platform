"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Check,
  Phone,
  MessageSquare,
  Bot,
  Users,
  Shield,
  Smartphone,
  Clock,
  Headphones,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$7.95",
    period: "/month",
    description: "Perfect for solopreneurs and small businesses just getting started",
    popular: false,
    features: [
      "1 Local or Toll-Free Number",
      "Unlimited Calling (US & Canada)",
      "500 SMS Messages",
      "Basic AI Receptionist",
      "Mobile App Access",
      "Business Hours Routing",
      "Voicemail Transcription",
      "Email Notifications",
    ],
    cta: "Start Free Trial",
    href: "/sign-up",
  },
  {
    name: "Professional",
    price: "$19.95",
    period: "/month",
    popular: true,
    description: "For growing businesses that need advanced features",
    features: [
      "3 Phone Numbers",
      "Unlimited Calling (US & Canada)",
      "2,000 SMS Messages",
      "Advanced AI Receptionist",
      "Call Recording",
      "CRM Integrations",
      "Custom Hold Music",
      "Priority Support",
      "Team Extensions (3 users)",
      "Call Analytics Dashboard",
    ],
    cta: "Start Free Trial",
    href: "/sign-up",
  },
  {
    name: "Enterprise",
    price: "$49.95",
    period: "/month",
    description: "For teams that need the full power of SMB Voice",
    popular: false,
    features: [
      "10 Phone Numbers",
      "Unlimited Calling (US & Canada)",
      "Unlimited SMS",
      "Premium AI Receptionist",
      "Advanced Call Routing",
      "API Access",
      "SLA Guarantee",
      "Dedicated Support",
      "Unlimited Team Members",
      "Custom Integrations",
      "White-label Options",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

const features = [
  {
    icon: Phone,
    title: "Crystal Clear Calls",
    description: "HD voice quality on every call with 99.99% uptime guarantee",
  },
  {
    icon: Bot,
    title: "AI Receptionist",
    description: "Never miss a call with intelligent AI-powered answering",
  },
  {
    icon: MessageSquare,
    title: "Business SMS",
    description: "Send and receive texts from your business number",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "iOS and Android apps for calls on the go",
  },
  {
    icon: Users,
    title: "Team Features",
    description: "Extensions, transfers, and team voicemail",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption for all communications",
  },
];

const faqs = [
  {
    q: "Can I keep my existing phone number?",
    a: "Yes! We offer free number porting for all plans. Most numbers can be transferred within 5-10 business days.",
  },
  {
    q: "Is there a contract or setup fee?",
    a: "No contracts, no setup fees, no hidden charges. Pay month-to-month and cancel anytime.",
  },
  {
    q: "What's included in the free trial?",
    a: "You get full access to all features for 14 days. No credit card required to start.",
  },
  {
    q: "How does the AI Receptionist work?",
    a: "Our AI answers calls, takes messages, schedules appointments, and routes calls based on your preferences - all customizable through our dashboard.",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Absolutely! Change your plan anytime from your dashboard. Changes take effect immediately.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] text-white">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-4">
              Simple, Transparent Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              One Price. Everything Included.
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              No hidden fees, no surprises. Start with our 14-day free trial and see why thousands of businesses trust SMB Voice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section bg-white -mt-16">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white rounded-2xl p-8 shadow-xl border-2 ${
                  plan.popular
                    ? "border-[#C9A227] scale-105 z-10"
                    : "border-gray-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-[#C9A227] text-white text-sm font-bold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold text-[#1E3A5F]">
                      {plan.price}
                    </span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full h-12 ${
                    plan.popular ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="section bg-gray-50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-4">
              Every Plan Includes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Core features that come standard with every SMB Voice subscription
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FDF8E8] flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#C9A227]" />
                </div>
                <h3 className="font-bold text-[#1E3A5F] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="font-bold text-[#1E3A5F] mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] text-white">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using SMB Voice. Start your free trial today - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-primary h-14 px-8 text-lg">
                <Link href="/sign-up">Start Free Trial</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10"
              >
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

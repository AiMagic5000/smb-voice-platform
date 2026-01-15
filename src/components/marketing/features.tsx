"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Bot,
  Smartphone,
  DollarSign,
  Clock,
  Shield,
  Headphones,
  Voicemail,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "Your Own Business Number",
    description:
      "Get a local or toll-free number instantly. Keep your personal number private.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    icon: Bot,
    title: "AI Answers Your Calls",
    description:
      "Never miss a call, even at 3 AM. Our AI takes messages and answers questions.",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    description:
      "iPhone, Android, or computer - your choice. Free apps are included with your plan.",
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    icon: Clock,
    title: "Set Up in 5 Minutes",
    description:
      "Sign up, pick your number, download the app. That's it. No tech skills needed.",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    icon: DollarSign,
    title: "Simple Pricing",
    description:
      "Just $7.95 per month. No hidden fees. No contracts. Cancel anytime.",
    color: "bg-[#C9A227]",
    lightColor: "bg-[#FDF8E8]",
    textColor: "text-[#9E7E1E]",
  },
  {
    icon: Headphones,
    title: "Real Human Support",
    description:
      "Questions? Call us at 888-534-4145. Real people answer, not robots.",
    color: "bg-pink-500",
    lightColor: "bg-pink-50",
    textColor: "text-pink-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <section className="section bg-white" id="features">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#FDF8E8] text-[#9E7E1E] text-sm font-semibold mb-4">
            Why Choose SMB Voice?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-6">
            Everything You Need.
            <br />
            <span className="text-gradient-gold">Nothing You Don&apos;t.</span>
          </h2>
          <p className="text-lg text-gray-600">
            A professional business phone system without the complexity or cost.
            Simple enough for anyone to use.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl ${feature.lightColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`h-7 w-7 ${feature.textColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover arrow */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-5 w-5 text-[#C9A227]" />
              </div>

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 ${feature.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] rounded-3xl p-8 lg:p-12"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Voicemail, text: "Voicemail to Email" },
              { icon: Shield, text: "Encrypted Calls" },
              { icon: Phone, text: "Call Forwarding" },
              { icon: Clock, text: "24/7 AI Answering" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-[#C9A227]" />
                </div>
                <span className="text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

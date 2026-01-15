"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Heart,
  Target,
  Users,
  Zap,
  Award,
  Globe,
  Shield,
  Clock,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every decision we make starts with one question: How does this help our customers succeed?",
  },
  {
    icon: Target,
    title: "Simplicity",
    description:
      "We believe powerful technology should be simple to use. No manuals required.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We're constantly improving our platform with cutting-edge AI and cloud technology.",
  },
  {
    icon: Shield,
    title: "Trust",
    description:
      "Your business communications are secure with enterprise-grade encryption and privacy.",
  },
];

const stats = [
  { value: "50K+", label: "Businesses Served" },
  { value: "99.99%", label: "Uptime Guarantee" },
  { value: "24/7", label: "Live Support" },
  { value: "4.9/5", label: "Customer Rating" },
];

const timeline = [
  {
    year: "2019",
    title: "The Beginning",
    description:
      "Founded with a mission to give small businesses the same phone system capabilities as Fortune 500 companies.",
  },
  {
    year: "2020",
    title: "AI Revolution",
    description:
      "Launched our first AI receptionist, helping businesses never miss another call during the pandemic.",
  },
  {
    year: "2022",
    title: "Rapid Growth",
    description:
      "Crossed 25,000 business customers and expanded to serve businesses across North America.",
  },
  {
    year: "2024",
    title: "Next Generation",
    description:
      "Introduced advanced AI features including natural language processing and sentiment analysis.",
  },
  {
    year: "2025",
    title: "Today",
    description:
      "Continuing to innovate with the most affordable, feature-rich business phone platform available.",
  },
];

export default function AboutPage() {
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
              About SMB Voice
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Empowering Small Businesses
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We believe every business deserves a professional phone system
              without the enterprise price tag. That&apos;s why we built SMB Voice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white -mt-8 relative z-10">
        <div className="container-wide">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-[#C9A227] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At Start My Business Inc., we&apos;re on a mission to level the playing
                field for small businesses. We saw how enterprise phone systems
                were too expensive and complicated for the businesses that needed
                them most.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                So we built something different. A phone system that&apos;s powerful
                enough for any business, simple enough for anyone to use, and
                priced fairly at just $7.95/month.
              </p>
              <p className="text-lg text-gray-600">
                Today, over 50,000 businesses trust SMB Voice to handle their
                communications. From solo entrepreneurs to growing teams, we&apos;re
                proud to be their partner in success.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] rounded-2xl p-8 text-white"
            >
              <Globe className="h-12 w-12 text-[#C9A227] mb-6" />
              <h3 className="text-2xl font-bold mb-4">Based in the USA</h3>
              <p className="text-white/80 mb-6">
                We&apos;re proudly American-owned and operated, with support teams
                based in the United States. When you call us, you&apos;ll talk to a
                real person who understands your business.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#C9A227]" />
                  <span>24/7 US-based support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-[#C9A227]" />
                  <span>Data stored securely in the USA</span>
                </li>
                <li className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#C9A227]" />
                  <span>Trusted by 50K+ American businesses</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-gray-50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at SMB Voice
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FDF8E8] flex items-center justify-center mb-4">
                  <value.icon className="h-7 w-7 text-[#C9A227]" />
                </div>
                <h3 className="font-bold text-[#1E3A5F] mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-4">
              Our Journey
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-20 h-20 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 relative z-10">
                    {item.year}
                  </div>
                  <div className="pt-4">
                    <h3 className="font-bold text-[#1E3A5F] text-xl mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="section bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] text-white">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="h-16 w-16 text-[#C9A227] mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Join Our Team
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for passionate people who want to help small
              businesses succeed. Check out our open positions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="btn-primary h-14 px-8 text-lg"
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

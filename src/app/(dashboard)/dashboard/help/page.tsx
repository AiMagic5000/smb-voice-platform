"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  BookOpen,
  Video,
  Search,
  ChevronRight,
} from "lucide-react";

const helpCategories = [
  {
    icon: Phone,
    title: "Phone Numbers",
    description: "Setting up and managing your business numbers",
    articles: 12,
  },
  {
    icon: MessageCircle,
    title: "AI Receptionist",
    description: "Configuring your virtual assistant",
    articles: 8,
  },
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Quick start guides and tutorials",
    articles: 15,
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch step-by-step guides",
    articles: 6,
  },
];

const popularArticles = [
  "How to set up call forwarding",
  "Adding team members to your account",
  "Configuring your AI receptionist greeting",
  "Understanding your bill",
  "Porting your existing phone number",
];

export default function HelpPage() {
  return (
    <>
      <Header
        title="Help & Support"
        description="Get help with SMB Voice"
      />

      <div className="p-8 space-y-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F]">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                How can we help you?
              </h2>
              <p className="text-white/70 mb-6">
                Search our help center or browse topics below
              </p>
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for help..."
                  className="pl-12 h-14 text-lg bg-white"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-6"
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-[#1E3A5F] mb-2">Call Us</h3>
              <p className="text-sm text-gray-500 mb-4">
                Talk to a real person 24/7
              </p>
              <a
                href="tel:888-534-4145"
                className="text-[#C9A227] font-semibold hover:underline"
              >
                888-534-4145
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-[#1E3A5F] mb-2">Email Us</h3>
              <p className="text-sm text-gray-500 mb-4">
                We reply within 24 hours
              </p>
              <a
                href="mailto:support@startmybusiness.us"
                className="text-[#C9A227] font-semibold hover:underline"
              >
                Send Email
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-[#1E3A5F] mb-2">Live Chat</h3>
              <p className="text-sm text-gray-500 mb-4">
                Chat with our support team
              </p>
              <Button className="btn-primary">Start Chat</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-[#1E3A5F] mb-6">
            Browse by Topic
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, i) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FDF8E8] flex items-center justify-center mb-4">
                      <category.icon className="h-6 w-6 text-[#C9A227]" />
                    </div>
                    <h3 className="font-semibold text-[#1E3A5F] mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {category.description}
                    </p>
                    <p className="text-xs text-[#C9A227] font-medium">
                      {category.articles} articles
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#1E3A5F] mb-6">
                Popular Articles
              </h2>
              <div className="space-y-2">
                {popularArticles.map((article, i) => (
                  <motion.a
                    key={article}
                    href="#"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-gray-400" />
                      <span className="text-[#1E3A5F] group-hover:text-[#C9A227] transition-colors">
                        {article}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#C9A227] transition-colors" />
                  </motion.a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

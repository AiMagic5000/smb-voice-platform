"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  MessageSquare,
  Settings,
  Sparkles,
  Volume2,
  Save,
  RefreshCw,
} from "lucide-react";

const stats = [
  { label: "Calls Answered", value: "156", period: "This Month" },
  { label: "Messages Taken", value: "89", period: "This Month" },
  { label: "Questions Answered", value: "234", period: "This Month" },
  { label: "Avg. Call Duration", value: "2:34", period: "This Month" },
];

export default function AIReceptionistPage() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [businessName, setBusinessName] = useState("Start My Business");
  const [greeting, setGreeting] = useState(
    "Thank you for calling Start My Business. How can I help you today?"
  );

  return (
    <>
      <Header
        title="AI Receptionist"
        description="Configure your virtual receptionist"
      />

      <div className="p-8 space-y-8">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Bot className="h-8 w-8 text-[#C9A227]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">AI Receptionist</h2>
                      <Badge
                        className={
                          isEnabled
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }
                      >
                        {isEnabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-white/70">
                      Your AI answers calls when you&apos;re busy or unavailable
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                    className="data-[state=checked]:bg-[#C9A227]"
                  />
                  <span className="text-sm text-white/70">
                    {isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-[#1E3A5F] mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.period}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Configuration */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Greeting Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                  <MessageSquare className="h-5 w-5" />
                  Greeting Script
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business name"
                  />
                  <p className="text-xs text-gray-500">
                    The AI will use this name when answering calls
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greeting">Custom Greeting</Label>
                  <Textarea
                    id="greeting"
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    placeholder="How the AI greets callers"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    This is what callers hear when the AI answers
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <Volume2 className="h-4 w-4" />
                    Preview Voice
                  </Button>
                  <Button className="btn-primary gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Behavior Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                  <Settings className="h-5 w-5" />
                  Behavior Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-medium text-[#1E3A5F]">Take Messages</p>
                    <p className="text-sm text-gray-500">
                      AI will take messages and email them to you
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-medium text-[#1E3A5F]">
                      Answer Questions
                    </p>
                    <p className="text-sm text-gray-500">
                      AI can answer basic questions about your business
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-medium text-[#1E3A5F]">
                      Transfer Calls
                    </p>
                    <p className="text-sm text-gray-500">
                      AI can transfer urgent calls to your phone
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-medium text-[#1E3A5F]">
                      After Hours Only
                    </p>
                    <p className="text-sm text-gray-500">
                      Only use AI outside business hours
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Training Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                <Sparkles className="h-5 w-5 text-[#C9A227]" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Help your AI answer questions by providing information about
                your business. The more details you add, the better your AI can
                help callers.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hours">Business Hours</Label>
                  <Textarea
                    id="hours"
                    placeholder="e.g., Monday-Friday 9am-5pm, Saturday 10am-2pm, Closed Sunday"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="services">Services Offered</Label>
                  <Textarea
                    id="services"
                    placeholder="e.g., We offer plumbing services including repairs, installations, and emergency calls"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location & Service Area</Label>
                  <Textarea
                    id="location"
                    placeholder="e.g., Located in Austin, Texas. We serve the greater Austin metro area."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faq">Common Questions</Label>
                  <Textarea
                    id="faq"
                    placeholder="e.g., Q: Do you offer free estimates? A: Yes, we provide free estimates for all projects."
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Button className="btn-primary gap-2">
                  <Save className="h-4 w-4" />
                  Save Information
                </Button>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

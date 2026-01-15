"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  Clock,
  Bot,
  ArrowUpRight,
  Play,
  Users,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Settings,
  Plus,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Total Calls Today",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Phone,
    color: "bg-blue-500",
  },
  {
    label: "Incoming Calls",
    value: "18",
    change: "+8%",
    trend: "up",
    icon: PhoneIncoming,
    color: "bg-green-500",
  },
  {
    label: "Missed Calls",
    value: "2",
    change: "-50%",
    trend: "down",
    icon: PhoneMissed,
    color: "bg-red-500",
  },
  {
    label: "Voicemails",
    value: "5",
    change: "+2",
    trend: "up",
    icon: Voicemail,
    color: "bg-purple-500",
  },
];

const recentCalls = [
  {
    name: "John Smith",
    number: "+1 (555) 123-4567",
    type: "incoming",
    duration: "4:32",
    time: "2 min ago",
  },
  {
    name: "Sarah Johnson",
    number: "+1 (555) 987-6543",
    type: "outgoing",
    duration: "2:15",
    time: "15 min ago",
  },
  {
    name: "Unknown Caller",
    number: "+1 (555) 456-7890",
    type: "missed",
    duration: "-",
    time: "32 min ago",
  },
  {
    name: "Mike Chen",
    number: "+1 (555) 321-0987",
    type: "incoming",
    duration: "8:45",
    time: "1 hr ago",
  },
];

const recentVoicemails = [
  {
    from: "Lisa Rodriguez",
    number: "+1 (555) 111-2222",
    duration: "0:45",
    time: "10 min ago",
    preview: "Hi, I'm calling about the quote you sent...",
  },
  {
    from: "Unknown",
    number: "+1 (555) 333-4444",
    duration: "0:23",
    time: "45 min ago",
    preview: "This is regarding your service inquiry...",
  },
];

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        description="Welcome back! Here's what's happening with your business phone."
      />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-[#1E3A5F] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Calls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#1E3A5F]">Recent Calls</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#C9A227]">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCalls.map((call, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          call.type === "incoming"
                            ? "bg-green-100"
                            : call.type === "outgoing"
                            ? "bg-blue-100"
                            : "bg-red-100"
                        }`}
                      >
                        {call.type === "incoming" ? (
                          <PhoneIncoming
                            className={`h-5 w-5 ${
                              call.type === "incoming"
                                ? "text-green-600"
                                : "text-blue-600"
                            }`}
                          />
                        ) : call.type === "outgoing" ? (
                          <PhoneOutgoing className="h-5 w-5 text-blue-600" />
                        ) : (
                          <PhoneMissed className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1E3A5F] truncate">
                          {call.name}
                        </p>
                        <p className="text-sm text-gray-500">{call.number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">
                          {call.duration}
                        </p>
                        <p className="text-xs text-gray-400">{call.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Voicemails */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#1E3A5F]">Voicemails</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#C9A227]">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVoicemails.map((vm, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-[#1E3A5F]">{vm.from}</p>
                        <span className="text-xs text-gray-400">{vm.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{vm.number}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        &ldquo;{vm.preview}&rdquo;
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {vm.duration}
                        </span>
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                          <Play className="h-3 w-3" />
                          Play
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Receptionist Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Bot className="h-8 w-8 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">AI Receptionist</h3>
                    <p className="text-white/70">
                      Your AI has answered 12 calls today
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/ai-receptionist">
                  <Button
                    size="lg"
                    className="bg-[#C9A227] hover:bg-[#B8922A] text-white"
                  >
                    Configure AI
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Widgets Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Business Hours Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-[#1E3A5F]">
                    Business Hours
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-600">Open</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Closes in 4 hours 32 minutes
                  </div>
                  <Link href="/dashboard/hours">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Hours
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Queue Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-[#1E3A5F]">
                    Call Queue
                  </CardTitle>
                  <Link href="/dashboard/queues" className="text-[#C9A227] hover:text-[#B8911F]">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Agents Online</span>
                    </div>
                    <span className="font-semibold text-[#1E3A5F]">3/4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Waiting</span>
                    </div>
                    <span className="font-semibold text-[#1E3A5F]">0</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1 h-1 rounded-full bg-green-500" />
                    <div className="flex-1 h-1 rounded-full bg-green-500" />
                    <div className="flex-1 h-1 rounded-full bg-green-500" />
                    <div className="flex-1 h-1 rounded-full bg-gray-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-[#1E3A5F]">
                    System Status
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {[
                    { label: "Voice Calls", status: "operational" },
                    { label: "SMS Messaging", status: "operational" },
                    { label: "AI Receptionist", status: "operational" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-green-600 text-xs font-medium">
                        Operational
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1E3A5F]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/phone-numbers">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:border-[#C9A227] hover:bg-[#FDF8E8]"
                  >
                    <Plus className="h-5 w-5 text-[#C9A227]" />
                    <span>Add Phone Number</span>
                  </Button>
                </Link>
                <Link href="/dashboard/extensions">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:border-[#C9A227] hover:bg-[#FDF8E8]"
                  >
                    <Users className="h-5 w-5 text-[#C9A227]" />
                    <span>Manage Extensions</span>
                  </Button>
                </Link>
                <Link href="/dashboard/messaging">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:border-[#C9A227] hover:bg-[#FDF8E8]"
                  >
                    <MessageSquare className="h-5 w-5 text-[#C9A227]" />
                    <span>Send SMS</span>
                  </Button>
                </Link>
                <Link href="/dashboard/ivr">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:border-[#C9A227] hover:bg-[#FDF8E8]"
                  >
                    <Settings className="h-5 w-5 text-[#C9A227]" />
                    <span>Edit Phone Menu</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

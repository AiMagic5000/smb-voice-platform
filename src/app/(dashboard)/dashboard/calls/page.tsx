"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  Download,
  Filter,
  Play,
  Calendar,
} from "lucide-react";

const calls = [
  {
    id: "1",
    caller: "John Smith",
    number: "+1 (555) 123-4567",
    type: "incoming",
    duration: "4:32",
    date: "Today",
    time: "2:34 PM",
    recording: true,
  },
  {
    id: "2",
    caller: "Sarah Johnson",
    number: "+1 (555) 987-6543",
    type: "outgoing",
    duration: "2:15",
    date: "Today",
    time: "1:15 PM",
    recording: true,
  },
  {
    id: "3",
    caller: "Unknown",
    number: "+1 (555) 456-7890",
    type: "missed",
    duration: "-",
    date: "Today",
    time: "11:45 AM",
    recording: false,
  },
  {
    id: "4",
    caller: "Mike Chen",
    number: "+1 (555) 321-0987",
    type: "incoming",
    duration: "8:45",
    date: "Today",
    time: "10:20 AM",
    recording: true,
  },
  {
    id: "5",
    caller: "Lisa Rodriguez",
    number: "+1 (555) 654-3210",
    type: "outgoing",
    duration: "3:22",
    date: "Yesterday",
    time: "4:55 PM",
    recording: true,
  },
  {
    id: "6",
    caller: "David Williams",
    number: "+1 (555) 789-0123",
    type: "incoming",
    duration: "1:08",
    date: "Yesterday",
    time: "2:30 PM",
    recording: false,
  },
];

const getCallIcon = (type: string) => {
  switch (type) {
    case "incoming":
      return PhoneIncoming;
    case "outgoing":
      return PhoneOutgoing;
    case "missed":
      return PhoneMissed;
    default:
      return Phone;
  }
};

const getCallColor = (type: string) => {
  switch (type) {
    case "incoming":
      return "bg-green-100 text-green-600";
    case "outgoing":
      return "bg-blue-100 text-blue-600";
    case "missed":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function CallsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCalls = calls.filter(
    (call) =>
      call.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.number.includes(searchQuery)
  );

  return (
    <>
      <Header
        title="Call History"
        description="View and manage your call records"
      />

      <div className="p-8 space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E3A5F]">
                  {calls.length}
                </p>
                <p className="text-sm text-gray-500">Total Calls</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <PhoneIncoming className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E3A5F]">
                  {calls.filter((c) => c.type === "incoming").length}
                </p>
                <p className="text-sm text-gray-500">Incoming</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <PhoneOutgoing className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E3A5F]">
                  {calls.filter((c) => c.type === "outgoing").length}
                </p>
                <p className="text-sm text-gray-500">Outgoing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <PhoneMissed className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E3A5F]">
                  {calls.filter((c) => c.type === "missed").length}
                </p>
                <p className="text-sm text-gray-500">Missed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calls List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredCalls.map((call, i) => {
                const CallIcon = getCallIcon(call.type);
                return (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCallColor(
                          call.type
                        )}`}
                      >
                        <CallIcon className="h-5 w-5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-[#1E3A5F]">
                            {call.caller}
                          </p>
                          {call.recording && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-50"
                            >
                              Recorded
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{call.number}</p>
                      </div>

                      {/* Duration */}
                      <div className="text-right hidden sm:block">
                        <p className="font-medium text-[#1E3A5F]">
                          {call.duration}
                        </p>
                        <p className="text-sm text-gray-500">Duration</p>
                      </div>

                      {/* Date/Time */}
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">
                          {call.date}
                        </p>
                        <p className="text-sm text-gray-400">{call.time}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {call.recording && (
                          <Button variant="ghost" size="icon">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

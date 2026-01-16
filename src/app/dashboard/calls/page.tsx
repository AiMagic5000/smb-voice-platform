"use client";

import { useEffect, useState } from "react";
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  Filter,
  Download,
  Play,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Call {
  id: string;
  direction: "inbound" | "outbound";
  from: string;
  to: string;
  duration: number;
  status: string;
  recordingUrl: string | null;
  createdAt: string;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDirection, setFilterDirection] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchCalls();
  }, []);

  async function fetchCalls() {
    try {
      const response = await fetch("/api/calls?limit=50");
      if (response.ok) {
        const data = await response.json();
        setCalls(data.calls || []);
      }
    } catch (error) {
      console.error("Failed to fetch calls:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.from.includes(searchTerm) ||
      call.to.includes(searchTerm);
    const matchesDirection =
      filterDirection === "all" || call.direction === filterDirection;
    const matchesStatus =
      filterStatus === "all" || call.status === filterStatus;
    return matchesSearch && matchesDirection && matchesStatus;
  });

  const getDirectionIcon = (direction: string, status: string) => {
    if (status === "missed" || status === "no-answer") {
      return <PhoneMissed className="h-5 w-5 text-red-400" />;
    }
    if (direction === "inbound") {
      return <PhoneIncoming className="h-5 w-5 text-green-400" />;
    }
    return <PhoneOutgoing className="h-5 w-5 text-purple-400" />;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-500/20 text-green-400",
      missed: "bg-red-500/20 text-red-400",
      "no-answer": "bg-red-500/20 text-red-400",
      busy: "bg-yellow-500/20 text-yellow-400",
      failed: "bg-red-500/20 text-red-400",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          styles[status] || "bg-slate-500/20 text-slate-400"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Call History</h1>
          <p className="text-slate-400 mt-1">View and manage your call logs</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <Select value={filterDirection} onValueChange={setFilterDirection}>
          <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Calls</SelectItem>
            <SelectItem value="inbound">Inbound</SelectItem>
            <SelectItem value="outbound">Outbound</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="no-answer">No Answer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calls List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <PhoneCall className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No calls found</p>
              <p className="text-sm mt-1">Your call history will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {filteredCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        call.status === "missed" || call.status === "no-answer"
                          ? "bg-red-500/20"
                          : call.direction === "inbound"
                          ? "bg-green-500/20"
                          : "bg-purple-500/20"
                      }`}
                    >
                      {getDirectionIcon(call.direction, call.status)}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {formatPhoneNumber(
                          call.direction === "inbound" ? call.from : call.to
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{call.direction === "inbound" ? "From" : "To"}</span>
                        <span>•</span>
                        <span>{formatDate(call.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="h-4 w-4 text-slate-500" />
                        {formatDuration(call.duration)}
                      </div>
                      <div className="mt-1">{getStatusBadge(call.status)}</div>
                    </div>

                    {call.recordingUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#C9A227]"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

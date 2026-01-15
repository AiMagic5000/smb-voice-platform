"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  PhoneForwarded,
  Users,
  MessageSquare,
  FileText,
  Clock,
  Star,
  AlertCircle,
  ChevronRight,
  Volume2,
  VolumeX,
  Hash,
  User,
  Building,
  Mail,
  History,
  Tag,
  Plus,
  Send,
  Clipboard,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface CallData {
  id: string;
  callerId: string;
  callerName: string;
  callerCompany?: string;
  callerEmail?: string;
  direction: "inbound" | "outbound";
  status: "ringing" | "active" | "hold" | "ended";
  duration: number;
  queue?: string;
  waitTime?: number;
  sentiment?: "positive" | "neutral" | "negative";
  priority?: "normal" | "high" | "vip";
  previousCalls?: number;
  tags?: string[];
}

interface QuickAction {
  id: string;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

const mockCallData: CallData = {
  id: "call-001",
  callerId: "+1 (555) 123-4567",
  callerName: "John Smith",
  callerCompany: "Acme Corporation",
  callerEmail: "john.smith@acme.com",
  direction: "inbound",
  status: "active",
  duration: 0,
  queue: "Sales",
  waitTime: 45,
  sentiment: "neutral",
  priority: "vip",
  previousCalls: 3,
  tags: ["returning-customer", "enterprise"],
};

const quickActions: QuickAction[] = [
  { id: "1", label: "Transfer", shortcut: "T", icon: <PhoneForwarded className="h-4 w-4" /> },
  { id: "2", label: "Conference", shortcut: "C", icon: <Users className="h-4 w-4" /> },
  { id: "3", label: "Notes", shortcut: "N", icon: <FileText className="h-4 w-4" /> },
  { id: "4", label: "Scripts", shortcut: "S", icon: <BookOpen className="h-4 w-4" /> },
];

const callHistory = [
  { date: "2 days ago", duration: "5:23", outcome: "Resolved", agent: "Sarah M." },
  { date: "1 week ago", duration: "12:45", outcome: "Follow-up", agent: "Mike T." },
  { date: "2 weeks ago", duration: "3:12", outcome: "Transferred", agent: "You" },
];

const suggestedResponses = [
  "I understand your concern. Let me help you with that.",
  "Thank you for your patience. I'm looking into this now.",
  "I can definitely help you with that request.",
  "Let me transfer you to a specialist who can better assist.",
];

export function ActiveCallInterface() {
  const [call, setCall] = useState<CallData>(mockCallData);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [showDialpad, setShowDialpad] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(call.tags || []);

  // Timer for call duration
  useEffect(() => {
    if (call.status === "active" && !isOnHold) {
      const timer = setInterval(() => {
        setCall((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [call.status, isOnHold]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setCall((prev) => ({ ...prev, status: "ended" }));
  };

  const handleHold = () => {
    setIsOnHold(!isOnHold);
    setCall((prev) => ({ ...prev, status: isOnHold ? "active" : "hold" }));
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const dialpadKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  return (
    <div className="space-y-4">
      {/* Main Call Card */}
      <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            {/* Caller Info */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {call.callerName.split(" ").map((n) => n[0]).join("")}
                </div>
                {call.priority === "vip" && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="h-3 w-3 text-yellow-800" />
                  </div>
                )}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Phone className="h-3 w-3 text-white" />
                </motion.div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {call.callerName}
                  </h2>
                  {call.priority === "vip" && (
                    <Badge className="bg-yellow-500">VIP</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {call.callerId}
                  </span>
                  {call.callerCompany && (
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {call.callerCompany}
                    </span>
                  )}
                </div>
                {call.callerEmail && (
                  <span className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Mail className="h-3 w-3" />
                    {call.callerEmail}
                  </span>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Call Stats */}
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <Badge
                  variant={call.direction === "inbound" ? "default" : "secondary"}
                >
                  {call.direction === "inbound" ? "Incoming" : "Outgoing"}
                </Badge>
                {call.queue && (
                  <Badge variant="outline">{call.queue} Queue</Badge>
                )}
              </div>
              <div className="mt-2 text-3xl font-mono font-bold text-gray-900 dark:text-white">
                {formatDuration(call.duration)}
              </div>
              {call.waitTime && (
                <p className="text-sm text-gray-500 mt-1">
                  Wait time: {call.waitTime}s
                </p>
              )}
              {call.previousCalls && call.previousCalls > 0 && (
                <p className="text-sm text-blue-600 mt-1 flex items-center justify-end gap-1">
                  <History className="h-3 w-3" />
                  {call.previousCalls} previous calls
                </p>
              )}
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="lg"
              onClick={() => setIsMuted(!isMuted)}
              className="w-14 h-14 rounded-full"
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            <Button
              variant={isOnHold ? "secondary" : "outline"}
              size="lg"
              onClick={handleHold}
              className="w-14 h-14 rounded-full"
            >
              {isOnHold ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndCall}
              className="w-20 h-20 rounded-full"
            >
              <PhoneOff className="h-8 w-8" />
            </Button>
            <Button
              variant={speakerOn ? "default" : "outline"}
              size="lg"
              onClick={() => setSpeakerOn(!speakerOn)}
              className="w-14 h-14 rounded-full"
            >
              {speakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </Button>
            <Button
              variant={showDialpad ? "secondary" : "outline"}
              size="lg"
              onClick={() => setShowDialpad(!showDialpad)}
              className="w-14 h-14 rounded-full"
            >
              <Hash className="h-6 w-6" />
            </Button>
          </div>

          {/* Dialpad */}
          <AnimatePresence>
            {showDialpad && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex justify-center"
              >
                <div className="grid grid-cols-3 gap-2 w-48">
                  {dialpadKeys.flat().map((key) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="h-12 text-lg font-semibold"
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {quickActions.map((action) => (
              <Button key={action.id} variant="outline" size="sm">
                {action.icon}
                <span className="ml-2">{action.label}</span>
                <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                  {action.shortcut}
                </kbd>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Assist */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-medium ${getSentimentColor(call.sentiment)}`}>
                Sentiment: {call.sentiment}
              </span>
            </div>
            <div className="space-y-2">
              {suggestedResponses.map((response, i) => (
                <button
                  key={i}
                  className="w-full text-left text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-600 dark:text-gray-400">{response}</span>
                  <Clipboard className="h-3 w-3 inline ml-2 text-gray-400" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4 text-blue-500" />
              Recent Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {callHistory.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.date}</p>
                    <p className="text-xs text-gray-500">
                      {item.duration} • {item.agent}
                    </p>
                  </div>
                  <Badge variant="outline">{item.outcome}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call Notes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-500" />
              Call Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type call notes here..."
              className="w-full h-32 p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-2">
              <Button size="sm">
                <Send className="h-4 w-4 mr-1" />
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Bar */}
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Connected
              </span>
              <span className="text-gray-500">Quality: Excellent</span>
              <span className="text-gray-500">Latency: 23ms</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">Recording: Active</span>
              <span className="text-gray-500">
                Compliance: <span className="text-green-500">Passed</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

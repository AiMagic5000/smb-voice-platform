"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  PhoneOff,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOutgoing,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Users,
  User,
  Clock,
  Search,
  Grid3X3,
  MoreVertical,
  MessageSquare,
  Voicemail,
  ParkingSquare,
  ArrowRightLeft,
  UserPlus,
  CircleDot,
} from "lucide-react";

type CallStatus = "ringing" | "active" | "hold" | "parked" | "transferring";

type ActiveCall = {
  id: string;
  callerId: string;
  callerName: string;
  callerNumber: string;
  direction: "inbound" | "outbound";
  status: CallStatus;
  duration: number;
  lineNumber: number;
  destination?: string;
  notes?: string;
};

type DirectoryEntry = {
  id: string;
  name: string;
  extension: string;
  department: string;
  status: "available" | "busy" | "away" | "dnd";
  voicemail?: boolean;
};

const mockActiveCalls: ActiveCall[] = [
  {
    id: "call_1",
    callerId: "caller_1",
    callerName: "John Smith",
    callerNumber: "+1 (555) 123-4567",
    direction: "inbound",
    status: "active",
    duration: 145,
    lineNumber: 1,
  },
  {
    id: "call_2",
    callerId: "caller_2",
    callerName: "Sarah Johnson",
    callerNumber: "+1 (555) 234-5678",
    direction: "inbound",
    status: "hold",
    duration: 87,
    lineNumber: 2,
    notes: "Waiting for billing department",
  },
  {
    id: "call_3",
    callerId: "caller_3",
    callerName: "Unknown",
    callerNumber: "+1 (555) 345-6789",
    direction: "inbound",
    status: "ringing",
    duration: 12,
    lineNumber: 3,
  },
];

const mockDirectory: DirectoryEntry[] = [
  { id: "ext_1", name: "Michael Chen", extension: "101", department: "Sales", status: "available" },
  { id: "ext_2", name: "Emily Davis", extension: "102", department: "Sales", status: "busy" },
  { id: "ext_3", name: "David Wilson", extension: "103", department: "Support", status: "available" },
  { id: "ext_4", name: "Lisa Brown", extension: "104", department: "Support", status: "away" },
  { id: "ext_5", name: "Robert Taylor", extension: "105", department: "Billing", status: "available" },
  { id: "ext_6", name: "Jennifer Martinez", extension: "106", department: "Billing", status: "dnd", voicemail: true },
  { id: "ext_7", name: "James Anderson", extension: "107", department: "Management", status: "busy" },
  { id: "ext_8", name: "Amanda Thomas", extension: "108", department: "HR", status: "available" },
];

const getStatusColor = (status: CallStatus) => {
  switch (status) {
    case "ringing":
      return "bg-yellow-500";
    case "active":
      return "bg-green-500";
    case "hold":
      return "bg-orange-500";
    case "parked":
      return "bg-blue-500";
    case "transferring":
      return "bg-purple-500";
  }
};

const getDirectoryStatusColor = (status: DirectoryEntry["status"]) => {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "busy":
      return "bg-red-500";
    case "away":
      return "bg-yellow-500";
    case "dnd":
      return "bg-gray-500";
  }
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function ReceptionistConsole() {
  const [activeCalls, setActiveCalls] = useState(mockActiveCalls);
  const [selectedCall, setSelectedCall] = useState<string | null>("call_1");
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialpadNumber, setDialpadNumber] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);

  // Simulate call duration updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalls((calls) =>
        calls.map((call) => ({
          ...call,
          duration: call.status !== "ringing" ? call.duration + 1 : call.duration,
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (callId: string) => {
    setActiveCalls((calls) =>
      calls.map((call) =>
        call.id === callId ? { ...call, status: "active" } : call
      )
    );
    setSelectedCall(callId);
  };

  const handleHold = (callId: string) => {
    setActiveCalls((calls) =>
      calls.map((call) =>
        call.id === callId
          ? { ...call, status: call.status === "hold" ? "active" : "hold" }
          : call
      )
    );
  };

  const handleHangup = (callId: string) => {
    setActiveCalls((calls) => calls.filter((call) => call.id !== callId));
    if (selectedCall === callId) {
      setSelectedCall(null);
    }
  };

  const handlePark = (callId: string) => {
    setActiveCalls((calls) =>
      calls.map((call) =>
        call.id === callId ? { ...call, status: "parked" } : call
      )
    );
  };

  const filteredDirectory = mockDirectory.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.extension.includes(searchQuery) ||
      entry.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCallData = activeCalls.find((c) => c.id === selectedCall);
  const stats = {
    activeCalls: activeCalls.filter((c) => c.status === "active").length,
    onHold: activeCalls.filter((c) => c.status === "hold").length,
    parked: activeCalls.filter((c) => c.status === "parked").length,
    waiting: activeCalls.filter((c) => c.status === "ringing").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-green-600 dark:text-green-400">Active</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.activeCalls}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
              <Pause className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400">On Hold</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.onHold}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <ParkingSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Parked</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.parked}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white">
              <PhoneIncoming className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Waiting</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.waiting}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Lines Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-[#1E3A5F] dark:text-white mb-4">Active Lines</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {activeCalls.map((call) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => setSelectedCall(call.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCall === call.id
                          ? "bg-[#1E3A5F] text-white"
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(call.status)} ${
                            call.status === "ringing" ? "animate-pulse" : ""
                          }`} />
                          <span className="text-sm font-medium">Line {call.lineNumber}</span>
                        </div>
                        <Badge variant="outline" className={selectedCall === call.id ? "border-white/30 text-white" : ""}>
                          {call.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{call.callerName}</p>
                          <p className={`text-xs ${selectedCall === call.id ? "text-white/70" : "text-gray-500"}`}>
                            {call.callerNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-mono">{formatDuration(call.duration)}</span>
                        </div>
                      </div>
                      {call.status === "ringing" && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAnswer(call.id);
                            }}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Answer
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHangup(call.id);
                            }}
                          >
                            <Voicemail className="h-4 w-4 mr-1" />
                            VM
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {activeCalls.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active calls</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dialpad */}
          <Card>
            <CardContent className="p-4">
              <Input
                value={dialpadNumber}
                onChange={(e) => setDialpadNumber(e.target.value)}
                placeholder="Enter number..."
                className="text-center text-lg font-mono mb-3"
              />
              <div className="grid grid-cols-3 gap-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="h-12 text-lg font-medium"
                    onClick={() => setDialpadNumber((n) => n + key)}
                  >
                    {key}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                  <PhoneOutgoing className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" onClick={() => setDialpadNumber("")}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Call Control Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6">
              {selectedCallData ? (
                <div className="h-full flex flex-col">
                  {/* Call Info */}
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      selectedCallData.status === "active" ? "bg-green-100 dark:bg-green-900/30" :
                      selectedCallData.status === "hold" ? "bg-orange-100 dark:bg-orange-900/30" :
                      "bg-blue-100 dark:bg-blue-900/30"
                    }`}>
                      <User className={`h-10 w-10 ${
                        selectedCallData.status === "active" ? "text-green-600" :
                        selectedCallData.status === "hold" ? "text-orange-600" :
                        "text-blue-600"
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                      {selectedCallData.callerName}
                    </h3>
                    <p className="text-gray-500">{selectedCallData.callerNumber}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedCallData.status)}`} />
                      <span className="text-sm capitalize">{selectedCallData.status}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm font-mono">{formatDuration(selectedCallData.duration)}</span>
                    </div>
                  </div>

                  {/* Call Controls */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <Button
                      variant="outline"
                      className={`h-16 flex-col gap-1 ${isMuted ? "bg-red-50 border-red-200" : ""}`}
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
                      <span className="text-xs">{isMuted ? "Unmute" : "Mute"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      className={`h-16 flex-col gap-1 ${selectedCallData.status === "hold" ? "bg-orange-50 border-orange-200" : ""}`}
                      onClick={() => handleHold(selectedCallData.id)}
                    >
                      {selectedCallData.status === "hold" ? (
                        <Play className="h-5 w-5 text-orange-500" />
                      ) : (
                        <Pause className="h-5 w-5" />
                      )}
                      <span className="text-xs">{selectedCallData.status === "hold" ? "Resume" : "Hold"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 flex-col gap-1"
                      onClick={() => setShowTransfer(!showTransfer)}
                    >
                      <PhoneForwarded className="h-5 w-5" />
                      <span className="text-xs">Transfer</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 flex-col gap-1"
                      onClick={() => handlePark(selectedCallData.id)}
                    >
                      <ParkingSquare className="h-5 w-5" />
                      <span className="text-xs">Park</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-1">
                      <UserPlus className="h-5 w-5" />
                      <span className="text-xs">Conference</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-1">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-xs">Notes</span>
                    </Button>
                  </div>

                  {/* Hang Up Button */}
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white h-14 text-lg mt-auto"
                    onClick={() => handleHangup(selectedCallData.id)}
                  >
                    <PhoneOff className="h-5 w-5 mr-2" />
                    End Call
                  </Button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4 flex items-center justify-center">
                      <Phone className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Select a call to manage</p>
                    <p className="text-sm text-gray-400 mt-1">Or dial a number to make a new call</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Directory Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search extensions..."
                    className="pl-9"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-[#1E3A5F] dark:text-white mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Company Directory
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredDirectory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[#1E3A5F]/10 dark:bg-white/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-[#1E3A5F] dark:text-white" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getDirectoryStatusColor(entry.status)}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#1E3A5F] dark:text-white">{entry.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Ext. {entry.extension}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{entry.department}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.voicemail && (
                        <Voicemail className="h-4 w-4 text-gray-400" />
                      )}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Phone className="h-4 w-4" />
                      </Button>
                      {showTransfer && selectedCallData && (
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <ArrowRightLeft className="h-3 w-3 mr-1" />
                          Transfer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  ParkingCircle,
  Phone,
  PhoneOff,
  Clock,
  User,
  RefreshCw,
  AlertTriangle,
  Volume2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ParkedCall {
  id: string;
  slot: number;
  callerNumber: string;
  callerName?: string;
  parkedBy: string;
  parkedAt: string;
  duration: number; // seconds since parked
  originalExtension: string;
  status: "parked" | "ringing" | "expired";
}

// Mock parked calls
const mockParkedCalls: ParkedCall[] = [
  {
    id: "1",
    slot: 1,
    callerNumber: "+1 (555) 123-4567",
    callerName: "John Smith",
    parkedBy: "Sarah Wilson",
    parkedAt: new Date(Date.now() - 45000).toISOString(),
    duration: 45,
    originalExtension: "101",
    status: "parked",
  },
  {
    id: "2",
    slot: 3,
    callerNumber: "+1 (555) 987-6543",
    callerName: "Acme Corp",
    parkedBy: "Mike Johnson",
    parkedAt: new Date(Date.now() - 120000).toISOString(),
    duration: 120,
    originalExtension: "102",
    status: "parked",
  },
];

const MAX_PARK_SLOTS = 10;
const PARK_TIMEOUT_SECONDS = 180; // 3 minutes

export function CallPark() {
  const [parkedCalls, setParkedCalls] = useState<ParkedCall[]>(mockParkedCalls);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update durations every second
  useEffect(() => {
    const interval = setInterval(() => {
      setParkedCalls((calls) =>
        calls.map((call) => ({
          ...call,
          duration: Math.floor(
            (Date.now() - new Date(call.parkedAt).getTime()) / 1000
          ),
          status:
            Math.floor(
              (Date.now() - new Date(call.parkedAt).getTime()) / 1000
            ) > PARK_TIMEOUT_SECONDS
              ? "expired"
              : call.status,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePickup = (callId: string) => {
    // In real implementation, would connect to the parked call
    console.log("Picking up call:", callId);
    setParkedCalls(parkedCalls.filter((c) => c.id !== callId));
  };

  const handleTransfer = (callId: string) => {
    // In real implementation, would initiate transfer
    console.log("Transferring call:", callId);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getSlotStatus = (slot: number): "empty" | "occupied" | "warning" | "expired" => {
    const call = parkedCalls.find((c) => c.slot === slot);
    if (!call) return "empty";
    if (call.status === "expired") return "expired";
    if (call.duration > PARK_TIMEOUT_SECONDS * 0.8) return "warning";
    return "occupied";
  };

  const getProgressPercentage = (duration: number) => {
    return Math.min((duration / PARK_TIMEOUT_SECONDS) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Call Park
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Park and retrieve calls from shared parking slots
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 dark:border-gray-700"
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ParkingCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {parkedCalls.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Parked Calls
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {MAX_PARK_SLOTS - parkedCalls.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available Slots
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {PARK_TIMEOUT_SECONDS / 60}min
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Park Timeout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Park Slots Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: MAX_PARK_SLOTS }, (_, i) => {
          const slot = i + 1;
          const call = parkedCalls.find((c) => c.slot === slot);
          const status = getSlotStatus(slot);

          return (
            <div
              key={slot}
              className={cn(
                "p-4 rounded-xl border-2 transition-all relative overflow-hidden",
                status === "empty" &&
                  "border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50",
                status === "occupied" &&
                  "border-green-400 dark:border-green-600 bg-white dark:bg-gray-800",
                status === "warning" &&
                  "border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20",
                status === "expired" &&
                  "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
              )}
            >
              {/* Slot Number */}
              <div
                className={cn(
                  "absolute top-2 left-2 w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center",
                  status === "empty"
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    : "bg-[#1E3A5F] text-white"
                )}
              >
                {slot}
              </div>

              {call ? (
                <>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                    <div
                      className={cn(
                        "h-full transition-all",
                        status === "expired"
                          ? "bg-red-500"
                          : status === "warning"
                          ? "bg-amber-500"
                          : "bg-green-500"
                      )}
                      style={{ width: `${100 - getProgressPercentage(call.duration)}%` }}
                    />
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      {status === "expired" ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-green-500 animate-pulse" />
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {call.callerName || "Unknown"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {call.callerNumber}
                    </p>
                    <div
                      className={cn(
                        "text-lg font-mono font-bold",
                        status === "expired"
                          ? "text-red-600 dark:text-red-400"
                          : status === "warning"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-gray-900 dark:text-white"
                      )}
                    >
                      {formatDuration(call.duration)}
                    </div>
                    <div className="flex gap-1 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handlePickup(call.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTransfer(call.id)}
                        className="flex-1 text-xs h-7 dark:border-gray-600"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 text-center">
                  <ParkingCircle className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Empty
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Parked Calls List */}
      {parkedCalls.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Parked Call Details
          </h3>
          {parkedCalls.map((call) => {
            const status = getSlotStatus(call.slot);

            return (
              <div
                key={call.id}
                className={cn(
                  "p-4 bg-white dark:bg-gray-800 rounded-xl border transition-colors",
                  status === "expired"
                    ? "border-red-300 dark:border-red-700"
                    : status === "warning"
                    ? "border-amber-300 dark:border-amber-700"
                    : "border-gray-200 dark:border-gray-700"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg",
                        status === "expired"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : status === "warning"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                          : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      )}
                    >
                      {call.slot}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {call.callerName || "Unknown Caller"}
                        </h4>
                        {status === "expired" && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Expired
                          </span>
                        )}
                        {status === "warning" && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Expiring Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {call.callerNumber} • Parked by {call.parkedBy}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Originally on Ext. {call.originalExtension}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-2xl font-mono font-bold",
                          status === "expired"
                            ? "text-red-600 dark:text-red-400"
                            : status === "warning"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-gray-900 dark:text-white"
                        )}
                      >
                        {formatDuration(call.duration)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        parked
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handlePickup(call.id)}
                        className="bg-green-500 hover:bg-green-600 text-white gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Pickup
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleTransfer(call.id)}
                        className="gap-2 dark:border-gray-600"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Transfer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          How to Use Call Park
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>
            • <strong>Park a call:</strong> Dial *70 + slot number (e.g., *701
            for slot 1)
          </li>
          <li>
            • <strong>Retrieve a call:</strong> Dial *71 + slot number from any
            extension
          </li>
          <li>
            • Parked calls will ring back after {PARK_TIMEOUT_SECONDS / 60}{" "}
            minutes if not retrieved
          </li>
          <li>
            • Anyone in the organization can pick up a parked call from any
            extension
          </li>
        </ul>
      </div>
    </div>
  );
}

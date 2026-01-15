"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  Activity,
  Server,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Loader2,
  Globe,
  ArrowUpDown,
  Gauge,
  BarChart3,
} from "lucide-react";

type TestStatus = "idle" | "running" | "passed" | "warning" | "failed";

type DiagnosticTest = {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  result?: string;
  value?: number;
  unit?: string;
  threshold?: { good: number; warning: number };
};

const initialTests: DiagnosticTest[] = [
  {
    id: "latency",
    name: "Network Latency",
    description: "Measure round-trip time to VoIP servers",
    status: "idle",
    unit: "ms",
    threshold: { good: 100, warning: 200 },
  },
  {
    id: "jitter",
    name: "Jitter",
    description: "Measure packet timing variation",
    status: "idle",
    unit: "ms",
    threshold: { good: 30, warning: 50 },
  },
  {
    id: "packet_loss",
    name: "Packet Loss",
    description: "Check for dropped packets",
    status: "idle",
    unit: "%",
    threshold: { good: 1, warning: 3 },
  },
  {
    id: "bandwidth_down",
    name: "Download Speed",
    description: "Test download bandwidth",
    status: "idle",
    unit: "Mbps",
    threshold: { good: 10, warning: 5 },
  },
  {
    id: "bandwidth_up",
    name: "Upload Speed",
    description: "Test upload bandwidth",
    status: "idle",
    unit: "Mbps",
    threshold: { good: 5, warning: 2 },
  },
  {
    id: "dns",
    name: "DNS Resolution",
    description: "Test DNS lookup speed",
    status: "idle",
    unit: "ms",
    threshold: { good: 50, warning: 100 },
  },
  {
    id: "sip_server",
    name: "SIP Server",
    description: "Test connection to SIP server",
    status: "idle",
  },
  {
    id: "media_server",
    name: "Media Server",
    description: "Test connection to media server",
    status: "idle",
  },
  {
    id: "codec",
    name: "Codec Support",
    description: "Check supported audio codecs",
    status: "idle",
  },
  {
    id: "firewall",
    name: "Firewall Ports",
    description: "Check if VoIP ports are open",
    status: "idle",
  },
];

const getStatusIcon = (status: TestStatus) => {
  switch (status) {
    case "passed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "failed":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "running":
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    default:
      return <Clock className="h-5 w-5 text-gray-400" />;
  }
};

const getStatusBadge = (status: TestStatus) => {
  switch (status) {
    case "passed":
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Passed</Badge>;
    case "warning":
      return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Warning</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>;
    case "running":
      return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Running</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
};

export function NetworkDiagnostics() {
  const [tests, setTests] = useState(initialTests);
  const [isRunning, setIsRunning] = useState(false);
  const [mosScore, setMosScore] = useState<number | null>(null);

  const runAllTests = async () => {
    setIsRunning(true);
    setMosScore(null);

    // Simulate running each test
    for (let i = 0; i < tests.length; i++) {
      // Set test to running
      setTests((prev) =>
        prev.map((t, idx) =>
          idx === i ? { ...t, status: "running" as TestStatus } : t
        )
      );

      // Simulate test duration
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

      // Generate mock result
      const test = tests[i];
      let result: DiagnosticTest;

      if (test.threshold) {
        let value: number;
        if (test.id === "latency") value = 45 + Math.random() * 60;
        else if (test.id === "jitter") value = 10 + Math.random() * 25;
        else if (test.id === "packet_loss") value = Math.random() * 2;
        else if (test.id === "bandwidth_down") value = 50 + Math.random() * 100;
        else if (test.id === "bandwidth_up") value = 20 + Math.random() * 50;
        else if (test.id === "dns") value = 20 + Math.random() * 40;
        else value = Math.random() * 100;

        let status: TestStatus;
        if (test.id === "bandwidth_down" || test.id === "bandwidth_up") {
          // Higher is better for bandwidth
          status = value >= test.threshold.good ? "passed" : value >= test.threshold.warning ? "warning" : "failed";
        } else {
          // Lower is better for latency, jitter, etc.
          status = value <= test.threshold.good ? "passed" : value <= test.threshold.warning ? "warning" : "failed";
        }

        result = {
          ...test,
          status,
          value: Math.round(value * 10) / 10,
          result: `${Math.round(value * 10) / 10} ${test.unit}`,
        };
      } else {
        // Boolean tests
        const passed = Math.random() > 0.15;
        result = {
          ...test,
          status: passed ? "passed" : "failed",
          result: passed ? "Connected" : "Failed",
        };
      }

      setTests((prev) =>
        prev.map((t, idx) => (idx === i ? result : t))
      );
    }

    // Calculate MOS score
    setMosScore(3.8 + Math.random() * 1.0);
    setIsRunning(false);
  };

  const resetTests = () => {
    setTests(initialTests);
    setMosScore(null);
  };

  const passedCount = tests.filter((t) => t.status === "passed").length;
  const warningCount = tests.filter((t) => t.status === "warning").length;
  const failedCount = tests.filter((t) => t.status === "failed").length;
  const completedCount = passedCount + warningCount + failedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E3A5F] flex items-center justify-center">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white">Network Diagnostics</h2>
            <p className="text-sm text-gray-500">Test your network for VoIP quality</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetTests} disabled={isRunning}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button className="btn-primary gap-2" onClick={runAllTests} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats and MOS Score */}
      <div className="grid grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Tests</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{tests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Passed</p>
                  <p className="text-xl font-bold text-green-600">{passedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Warnings</p>
                  <p className="text-xl font-bold text-yellow-600">{warningCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Failed</p>
                  <p className="text-xl font-bold text-red-600">{failedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className={mosScore ? (mosScore >= 4 ? "bg-green-50 dark:bg-green-900/10" : mosScore >= 3.5 ? "bg-yellow-50 dark:bg-yellow-900/10" : "bg-red-50 dark:bg-red-900/10") : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  mosScore ? (mosScore >= 4 ? "bg-green-100" : mosScore >= 3.5 ? "bg-yellow-100" : "bg-red-100") : "bg-gray-100 dark:bg-gray-800"
                }`}>
                  <Gauge className={`h-5 w-5 ${
                    mosScore ? (mosScore >= 4 ? "text-green-600" : mosScore >= 3.5 ? "text-yellow-600" : "text-red-600") : "text-gray-600"
                  }`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">MOS Score</p>
                  <p className={`text-xl font-bold ${
                    mosScore ? (mosScore >= 4 ? "text-green-600" : mosScore >= 3.5 ? "text-yellow-600" : "text-red-600") : "text-gray-400"
                  }`}>
                    {mosScore ? mosScore.toFixed(1) : "--"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#C9A227]"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / tests.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Test Results */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-gray-800">
            {tests.map((test, i) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    test.status === "passed" ? "bg-green-100 dark:bg-green-900/30" :
                    test.status === "warning" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                    test.status === "failed" ? "bg-red-100 dark:bg-red-900/30" :
                    test.status === "running" ? "bg-blue-100 dark:bg-blue-900/30" :
                    "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    {getStatusIcon(test.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1E3A5F] dark:text-white">{test.name}</p>
                    <p className="text-sm text-gray-500">{test.description}</p>
                  </div>

                  <div className="text-right">
                    {test.result && (
                      <p className={`font-mono text-lg font-bold ${
                        test.status === "passed" ? "text-green-600" :
                        test.status === "warning" ? "text-yellow-600" :
                        test.status === "failed" ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {test.result}
                      </p>
                    )}
                  </div>

                  {getStatusBadge(test.status)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {completedCount > 0 && failedCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-yellow-200 dark:border-yellow-900">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Recommendations
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  Check your router and network configuration for optimal VoIP performance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  Ensure QoS (Quality of Service) is enabled and prioritizing voice traffic
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  Contact your ISP if packet loss or jitter issues persist
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

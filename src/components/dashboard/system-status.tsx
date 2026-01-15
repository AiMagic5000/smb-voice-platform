"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Server,
  Phone,
  MessageSquare,
  Bot,
  Globe,
  Database,
  Shield,
  RefreshCw,
  Clock,
} from "lucide-react";

type ServiceStatus = {
  name: string;
  status: "operational" | "degraded" | "outage";
  latency?: number;
  uptime: number;
  lastIncident?: string;
  icon: React.ElementType;
};

const services: ServiceStatus[] = [
  { name: "Voice Calls", status: "operational", latency: 45, uptime: 99.99, icon: Phone },
  { name: "SMS Messaging", status: "operational", latency: 120, uptime: 99.98, icon: MessageSquare },
  { name: "AI Receptionist", status: "operational", latency: 280, uptime: 99.95, icon: Bot },
  { name: "API Services", status: "operational", latency: 89, uptime: 99.99, icon: Globe },
  { name: "Database", status: "operational", latency: 12, uptime: 99.99, icon: Database },
  { name: "Authentication", status: "operational", latency: 95, uptime: 99.99, icon: Shield },
  { name: "Web Dashboard", status: "operational", latency: 150, uptime: 99.97, icon: Server },
  { name: "Webhooks", status: "degraded", latency: 450, uptime: 99.85, lastIncident: "Elevated response times", icon: Activity },
];

const incidents = [
  {
    id: "1",
    title: "Webhook Delivery Delays",
    status: "investigating",
    service: "Webhooks",
    startedAt: new Date(Date.now() - 1800000).toISOString(),
    updates: [
      { time: new Date(Date.now() - 900000).toISOString(), message: "We are investigating elevated webhook delivery times." },
      { time: new Date(Date.now() - 1800000).toISOString(), message: "Issue detected - some webhook deliveries are experiencing delays." },
    ],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "operational":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "degraded":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "outage":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Activity className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "operational":
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Operational</Badge>;
    case "degraded":
      return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Degraded</Badge>;
    case "outage":
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Outage</Badge>;
    default:
      return null;
  }
};

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 60) return `${minutes}m ago`;
  return `${hours}h ago`;
};

export function SystemStatus() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const allOperational = services.every((s) => s.status === "operational");
  const degradedCount = services.filter((s) => s.status === "degraded").length;
  const outageCount = services.filter((s) => s.status === "outage").length;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={`${allOperational ? "bg-green-50 dark:bg-green-900/10" : degradedCount > 0 ? "bg-yellow-50 dark:bg-yellow-900/10" : "bg-red-50 dark:bg-red-900/10"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {allOperational ? (
                  <CheckCircle className="h-10 w-10 text-green-500" />
                ) : degradedCount > 0 ? (
                  <AlertTriangle className="h-10 w-10 text-yellow-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-500" />
                )}
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                    {allOperational ? "All Systems Operational" : degradedCount > 0 ? "Partial Service Degradation" : "Service Outage"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {allOperational
                      ? "All services are running normally"
                      : `${degradedCount} service(s) experiencing issues`}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Last updated
                </div>
                <div>{lastUpdated.toLocaleTimeString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Incidents */}
      {incidents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-yellow-200 dark:border-yellow-900">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Active Incidents
              </h3>
              {incidents.map((incident) => (
                <div key={incident.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#1E3A5F] dark:text-white">{incident.title}</span>
                      <Badge variant="outline" className="ml-2 capitalize">{incident.status}</Badge>
                    </div>
                    <span className="text-sm text-gray-500">{formatTimeAgo(incident.startedAt)}</span>
                  </div>
                  <div className="border-l-2 border-yellow-300 pl-4 space-y-2">
                    {incident.updates.map((update, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-gray-500">{formatTimeAgo(update.time)}</span>
                        <span className="text-gray-600 dark:text-gray-300 ml-2">{update.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Services Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">
              Service Status
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service, i) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.03 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center">
                      <service.icon className="h-5 w-5 text-[#1E3A5F] dark:text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-[#1E3A5F] dark:text-white">{service.name}</div>
                      <div className="text-xs text-gray-500">
                        {service.latency}ms latency · {service.uptime}% uptime
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {service.lastIncident && (
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 max-w-[120px] truncate">
                        {service.lastIncident}
                      </span>
                    )}
                    {getStatusIcon(service.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Uptime History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">
              90-Day Uptime History
            </h3>
            <div className="flex gap-0.5">
              {Array.from({ length: 90 }).map((_, i) => {
                const isToday = i === 89;
                const hasIssue = Math.random() > 0.95;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-8 rounded-sm ${
                      isToday
                        ? "bg-yellow-400"
                        : hasIssue
                        ? "bg-yellow-300"
                        : "bg-green-400"
                    }`}
                    title={`Day ${i + 1}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

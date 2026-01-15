"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Server,
  Database,
  Wifi,
  Phone,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
} from "lucide-react";

interface ServiceStatus {
  id: string;
  name: string;
  status: "operational" | "degraded" | "outage";
  latency?: number;
  uptime: number;
  lastChecked: Date;
  description?: string;
}

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "good" | "warning" | "critical";
}

interface Incident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  createdAt: Date;
  updatedAt: Date;
  affectedServices: string[];
}

const services: ServiceStatus[] = [
  {
    id: "1",
    name: "Voice Gateway",
    status: "operational",
    latency: 23,
    uptime: 99.99,
    lastChecked: new Date(),
    description: "Primary SIP trunk and call routing",
  },
  {
    id: "2",
    name: "SMS Gateway",
    status: "operational",
    latency: 45,
    uptime: 99.95,
    lastChecked: new Date(),
    description: "Text messaging services",
  },
  {
    id: "3",
    name: "API Services",
    status: "operational",
    latency: 12,
    uptime: 99.99,
    lastChecked: new Date(),
    description: "REST API and webhooks",
  },
  {
    id: "4",
    name: "Database Cluster",
    status: "operational",
    latency: 5,
    uptime: 99.999,
    lastChecked: new Date(),
    description: "Primary and replica databases",
  },
  {
    id: "5",
    name: "AI Services",
    status: "degraded",
    latency: 150,
    uptime: 99.5,
    lastChecked: new Date(),
    description: "AI receptionist and transcription",
  },
  {
    id: "6",
    name: "WebRTC",
    status: "operational",
    latency: 35,
    uptime: 99.9,
    lastChecked: new Date(),
    description: "Browser-based calling",
  },
  {
    id: "7",
    name: "Authentication",
    status: "operational",
    latency: 18,
    uptime: 99.99,
    lastChecked: new Date(),
    description: "User authentication and SSO",
  },
  {
    id: "8",
    name: "CDN",
    status: "operational",
    latency: 8,
    uptime: 99.999,
    lastChecked: new Date(),
    description: "Static assets and media delivery",
  },
];

const systemMetrics: SystemMetric[] = [
  { name: "CPU Usage", value: 42, max: 100, unit: "%", trend: "stable", status: "good" },
  { name: "Memory", value: 68, max: 100, unit: "%", trend: "up", status: "warning" },
  { name: "Disk I/O", value: 23, max: 100, unit: "%", trend: "down", status: "good" },
  { name: "Network", value: 156, max: 1000, unit: "Mbps", trend: "stable", status: "good" },
  { name: "Active Calls", value: 847, max: 2000, unit: "", trend: "up", status: "good" },
  { name: "Queue Depth", value: 12, max: 100, unit: "", trend: "stable", status: "good" },
];

const recentIncidents: Incident[] = [
  {
    id: "1",
    title: "Elevated AI Service Latency",
    status: "monitoring",
    severity: "minor",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    affectedServices: ["AI Services"],
  },
  {
    id: "2",
    title: "SMS Delivery Delays",
    status: "resolved",
    severity: "major",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    affectedServices: ["SMS Gateway"],
  },
];

export function SystemHealth() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "outage":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const operationalCount = services.filter((s) => s.status === "operational").length;
  const overallStatus =
    services.every((s) => s.status === "operational")
      ? "All Systems Operational"
      : services.some((s) => s.status === "outage")
      ? "Service Outage"
      : "Partial Degradation";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Health
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time infrastructure and service monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <Card
        className={`${
          overallStatus === "All Systems Operational"
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : overallStatus === "Service Outage"
            ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
            : "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {overallStatus === "All Systems Operational" ? (
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              ) : overallStatus === "Service Outage" ? (
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{overallStatus}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {operationalCount} of {services.length} services operational
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                99.95%
              </p>
              <p className="text-sm text-gray-500">30-day uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {systemMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{metric.name}</span>
                <span className={getMetricColor(metric.status)}>
                  {getTrendIcon(metric.trend)}
                </span>
              </div>
              <p className="text-2xl font-bold">
                {metric.value}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {metric.unit}
                </span>
              </p>
              <div className="mt-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                    className={`h-full ${getProgressColor(metric.status)}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Services Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Service Status
          </CardTitle>
          <CardDescription>
            Real-time status of all platform services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      service.status === "operational"
                        ? "text-green-600 border-green-300"
                        : service.status === "degraded"
                        ? "text-yellow-600 border-yellow-300"
                        : "text-red-600 border-red-300"
                    }`}
                  >
                    {service.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2">{service.description}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>Latency: {service.latency}ms</span>
                  <span>Uptime: {service.uptime}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Incidents & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Incidents
            </CardTitle>
            <CardDescription>
              Active and recently resolved incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentIncidents.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                <p className="text-gray-600">No recent incidents</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{incident.title}</h3>
                          <Badge
                            variant={
                              incident.status === "resolved"
                                ? "outline"
                                : incident.severity === "critical"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {incident.affectedServices.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          incident.severity === "critical"
                            ? "text-red-600 border-red-300"
                            : incident.severity === "major"
                            ? "text-orange-600 border-orange-300"
                            : "text-yellow-600 border-yellow-300"
                        }`}
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created: {incident.createdAt.toLocaleString()}
                      </span>
                      <span>
                        Updated: {incident.updatedAt.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">API Response Time</span>
                  <span className="text-sm text-green-500">12ms avg</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-green-500 rounded-full" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Target: &lt;100ms</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Call Setup Time</span>
                  <span className="text-sm text-green-500">1.2s avg</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[24%] bg-green-500 rounded-full" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Target: &lt;5s</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Message Delivery Rate</span>
                  <span className="text-sm text-green-500">99.8%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[99.8%] bg-green-500 rounded-full" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Target: &gt;99%</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Error Rate</span>
                  <span className="text-sm text-green-500">0.02%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[0.5%] bg-green-500 rounded-full" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Target: &lt;1%</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Public Status Page
              </Button>
              <Button variant="ghost" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Security Status
              </Button>
              <Button variant="ghost" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Performance Reports
              </Button>
            </div>
            <span className="text-sm text-gray-500">
              Status updates every 30 seconds
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

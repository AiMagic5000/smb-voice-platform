"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Server,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Phone,
  PhoneOutgoing,
  PhoneIncoming,
  Shield,
  Settings,
  Trash2,
  Edit2,
  RefreshCw,
  Globe,
  Lock,
  Zap,
  MoreVertical,
} from "lucide-react";

type TrunkStatus = "active" | "inactive" | "error";
type TrunkType = "primary" | "failover" | "outbound-only";

type SipTrunk = {
  id: string;
  name: string;
  provider: string;
  host: string;
  port: number;
  username: string;
  status: TrunkStatus;
  type: TrunkType;
  maxChannels: number;
  activeChannels: number;
  encryption: boolean;
  lastActive?: string;
  inboundEnabled: boolean;
  outboundEnabled: boolean;
};

const mockTrunks: SipTrunk[] = [
  {
    id: "trunk_1",
    name: "Primary SignalWire",
    provider: "SignalWire",
    host: "sip.signalwire.com",
    port: 5060,
    username: "acme-corp",
    status: "active",
    type: "primary",
    maxChannels: 50,
    activeChannels: 12,
    encryption: true,
    lastActive: new Date(Date.now() - 60000).toISOString(),
    inboundEnabled: true,
    outboundEnabled: true,
  },
  {
    id: "trunk_2",
    name: "Failover Twilio",
    provider: "Twilio",
    host: "sip.twilio.com",
    port: 5060,
    username: "acme-backup",
    status: "active",
    type: "failover",
    maxChannels: 25,
    activeChannels: 0,
    encryption: true,
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    inboundEnabled: true,
    outboundEnabled: true,
  },
  {
    id: "trunk_3",
    name: "Outbound Dialer",
    provider: "Bandwidth",
    host: "sip.bandwidth.com",
    port: 5060,
    username: "acme-dialer",
    status: "active",
    type: "outbound-only",
    maxChannels: 100,
    activeChannels: 8,
    encryption: true,
    inboundEnabled: false,
    outboundEnabled: true,
  },
  {
    id: "trunk_4",
    name: "Legacy System",
    provider: "VoIP.ms",
    host: "chicago.voip.ms",
    port: 5060,
    username: "legacy-acme",
    status: "inactive",
    type: "primary",
    maxChannels: 10,
    activeChannels: 0,
    encryption: false,
    inboundEnabled: true,
    outboundEnabled: true,
  },
];

const getStatusIcon = (status: TrunkStatus) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "inactive":
      return <XCircle className="h-5 w-5 text-gray-400" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
  }
};

const getStatusBadge = (status: TrunkStatus) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>;
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Inactive</Badge>;
    case "error":
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Error</Badge>;
  }
};

const getTypeBadge = (type: TrunkType) => {
  const colors: Record<TrunkType, string> = {
    primary: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    failover: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "outbound-only": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };
  const labels: Record<TrunkType, string> = {
    primary: "Primary",
    failover: "Failover",
    "outbound-only": "Outbound Only",
  };
  return <Badge className={colors[type]}>{labels[type]}</Badge>;
};

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export function SipTrunkConfig() {
  const [trunks, setTrunks] = useState(mockTrunks);
  const [showAddTrunk, setShowAddTrunk] = useState(false);
  const [selectedTrunk, setSelectedTrunk] = useState<string | null>(null);

  const activeTrunks = trunks.filter((t) => t.status === "active");
  const totalChannels = trunks.reduce((acc, t) => acc + t.maxChannels, 0);
  const activeChannels = trunks.reduce((acc, t) => acc + t.activeChannels, 0);

  const toggleTrunk = (id: string) => {
    setTrunks(trunks.map((t) =>
      t.id === id ? { ...t, status: t.status === "active" ? "inactive" : "active" } : t
    ));
  };

  const deleteTrunk = (id: string) => {
    setTrunks(trunks.filter((t) => t.id !== id));
    setSelectedTrunk(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <Server className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Trunks</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{trunks.length}</p>
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
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{activeTrunks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Channels</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{totalChannels}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Calls</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{activeChannels}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white">SIP Trunks</h3>
        <Button className="btn-primary gap-2" onClick={() => setShowAddTrunk(true)}>
          <Plus className="h-4 w-4" />
          Add Trunk
        </Button>
      </div>

      {/* Trunk List */}
      <div className="grid gap-4">
        {trunks.map((trunk, i) => (
          <motion.div
            key={trunk.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={!trunk.status || trunk.status === "inactive" ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    trunk.status === "active"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : trunk.status === "error"
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    {getStatusIcon(trunk.status)}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-[#1E3A5F] dark:text-white">
                        {trunk.name}
                      </h4>
                      {getTypeBadge(trunk.type)}
                      {getStatusBadge(trunk.status)}
                      {trunk.encryption && (
                        <Badge variant="outline" className="text-green-600">
                          <Lock className="h-3 w-3 mr-1" />
                          TLS
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Provider</p>
                        <p className="font-medium text-[#1E3A5F] dark:text-white">{trunk.provider}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Host</p>
                        <p className="font-medium text-[#1E3A5F] dark:text-white font-mono text-xs">
                          {trunk.host}:{trunk.port}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Channels</p>
                        <p className="font-medium text-[#1E3A5F] dark:text-white">
                          {trunk.activeChannels} / {trunk.maxChannels}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Directions</p>
                        <div className="flex items-center gap-2">
                          {trunk.inboundEnabled && (
                            <span className="flex items-center gap-1 text-green-600">
                              <PhoneIncoming className="h-3.5 w-3.5" />
                              In
                            </span>
                          )}
                          {trunk.outboundEnabled && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <PhoneOutgoing className="h-3.5 w-3.5" />
                              Out
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {trunk.lastActive && trunk.status === "active" && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last activity: {formatTimeAgo(trunk.lastActive)}
                      </p>
                    )}

                    {/* Channel Usage Bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (trunk.activeChannels / trunk.maxChannels) > 0.8
                              ? "bg-red-500"
                              : (trunk.activeChannels / trunk.maxChannels) > 0.5
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${(trunk.activeChannels / trunk.maxChannels) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTrunk(trunk.id)}
                    >
                      {trunk.status === "active" ? "Disable" : "Enable"}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTrunk(selectedTrunk === trunk.id ? null : trunk.id)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      {selectedTrunk === trunk.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-10">
                          <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            <RefreshCw className="h-3.5 w-3.5" />
                            Test Connection
                          </button>
                          <button
                            onClick={() => deleteTrunk(trunk.id)}
                            className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Trunk Dialog */}
      {showAddTrunk && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Add SIP Trunk
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Trunk Name</label>
                    <Input placeholder="e.g., Primary Trunk" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Provider</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["SignalWire", "Twilio", "Bandwidth", "Other"].map((p) => (
                        <button
                          key={p}
                          className="p-2 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-sm"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">SIP Host</label>
                      <Input placeholder="sip.provider.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Port</label>
                      <Input type="number" defaultValue={5060} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Username</label>
                      <Input placeholder="SIP username" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <Input type="password" placeholder="SIP password" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Trunk Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "primary", label: "Primary" },
                        { value: "failover", label: "Failover" },
                        { value: "outbound-only", label: "Outbound" },
                      ].map((t) => (
                        <button
                          key={t.value}
                          className="p-2 rounded-lg border dark:border-gray-700 hover:border-[#C9A227] hover:bg-[#FDF8E8] dark:hover:bg-[#C9A227]/10 transition-colors text-sm"
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Channels</label>
                    <Input type="number" defaultValue={50} />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Enable TLS Encryption</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Inbound Calls</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Outbound Calls</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowAddTrunk(false)}>Cancel</Button>
                  <Button className="btn-primary">Add Trunk</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

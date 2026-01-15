"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Smartphone,
  Monitor,
  Plus,
  Search,
  Filter,
  Settings,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
  Edit2,
  Download,
  QrCode,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Phone,
  MapPin,
  Link2,
} from "lucide-react";

type DeviceStatus = "online" | "offline" | "provisioning" | "error";
type DeviceType = "desk_phone" | "conference_phone" | "softphone" | "mobile_app";

type Device = {
  id: string;
  name: string;
  type: DeviceType;
  model: string;
  macAddress: string;
  ipAddress?: string;
  firmwareVersion: string;
  status: DeviceStatus;
  assignedTo?: {
    userId: string;
    userName: string;
    extension: string;
  };
  location?: string;
  lastSeen?: string;
  provisionedAt?: string;
  autoProvisioned: boolean;
};

const mockDevices: Device[] = [
  {
    id: "dev_1",
    name: "Lobby Phone",
    type: "desk_phone",
    model: "Poly VVX 450",
    macAddress: "00:04:F2:12:34:56",
    ipAddress: "192.168.1.101",
    firmwareVersion: "6.4.0",
    status: "online",
    assignedTo: { userId: "user_1", userName: "Front Desk", extension: "100" },
    location: "Headquarters",
    lastSeen: "2024-01-15T14:30:00Z",
    provisionedAt: "2024-01-01T09:00:00Z",
    autoProvisioned: true,
  },
  {
    id: "dev_2",
    name: "Michael's Phone",
    type: "desk_phone",
    model: "Yealink T54W",
    macAddress: "00:15:65:AB:CD:EF",
    ipAddress: "192.168.1.102",
    firmwareVersion: "96.86.0.100",
    status: "online",
    assignedTo: { userId: "user_2", userName: "Michael Chen", extension: "101" },
    location: "Sales Floor",
    lastSeen: "2024-01-15T14:35:00Z",
    provisionedAt: "2023-11-15T10:30:00Z",
    autoProvisioned: true,
  },
  {
    id: "dev_3",
    name: "Conference Room A",
    type: "conference_phone",
    model: "Poly Trio 8500",
    macAddress: "64:16:7F:01:23:45",
    ipAddress: "192.168.1.201",
    firmwareVersion: "7.2.1",
    status: "online",
    location: "Headquarters",
    lastSeen: "2024-01-15T14:20:00Z",
    provisionedAt: "2023-10-01T08:00:00Z",
    autoProvisioned: false,
  },
  {
    id: "dev_4",
    name: "Emily's Softphone",
    type: "softphone",
    model: "Zoiper Desktop",
    macAddress: "N/A",
    firmwareVersion: "5.6.2",
    status: "online",
    assignedTo: { userId: "user_3", userName: "Emily Davis", extension: "102" },
    lastSeen: "2024-01-15T14:32:00Z",
    provisionedAt: "2024-01-10T11:00:00Z",
    autoProvisioned: true,
  },
  {
    id: "dev_5",
    name: "David's Mobile",
    type: "mobile_app",
    model: "iOS App v2.3.1",
    macAddress: "N/A",
    firmwareVersion: "2.3.1",
    status: "offline",
    assignedTo: { userId: "user_4", userName: "David Wilson", extension: "103" },
    lastSeen: "2024-01-15T12:45:00Z",
    provisionedAt: "2024-01-05T14:00:00Z",
    autoProvisioned: true,
  },
  {
    id: "dev_6",
    name: "New Phone (Provisioning)",
    type: "desk_phone",
    model: "Grandstream GRP2614",
    macAddress: "00:0B:82:67:89:AB",
    firmwareVersion: "1.0.5.55",
    status: "provisioning",
    location: "West Coast Office",
    autoProvisioned: true,
  },
  {
    id: "dev_7",
    name: "Warehouse Phone",
    type: "desk_phone",
    model: "Poly VVX 250",
    macAddress: "00:04:F2:98:76:54",
    firmwareVersion: "6.4.0",
    status: "error",
    location: "Warehouse",
    lastSeen: "2024-01-14T16:00:00Z",
    autoProvisioned: true,
  },
];

const getStatusIcon = (status: DeviceStatus) => {
  switch (status) {
    case "online":
      return <Wifi className="h-4 w-4 text-green-500" />;
    case "offline":
      return <WifiOff className="h-4 w-4 text-gray-400" />;
    case "provisioning":
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
};

const getStatusBadge = (status: DeviceStatus) => {
  const styles: Record<DeviceStatus, string> = {
    online: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    offline: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    provisioning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
};

const getDeviceIcon = (type: DeviceType) => {
  switch (type) {
    case "desk_phone":
      return <Phone className="h-6 w-6" />;
    case "conference_phone":
      return <Monitor className="h-6 w-6" />;
    case "softphone":
      return <Monitor className="h-6 w-6" />;
    case "mobile_app":
      return <Smartphone className="h-6 w-6" />;
  }
};

export function DeviceProvisioning() {
  const [devices, setDevices] = useState(mockDevices);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<DeviceStatus | "all">("all");
  const [showAddDevice, setShowAddDevice] = useState(false);

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.macAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || device.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: devices.length,
    online: devices.filter((d) => d.status === "online").length,
    offline: devices.filter((d) => d.status === "offline").length,
    errors: devices.filter((d) => d.status === "error").length,
  };

  const rebootDevice = (deviceId: string) => {
    setDevices((devs) =>
      devs.map((d) =>
        d.id === deviceId ? { ...d, status: "provisioning" as DeviceStatus } : d
      )
    );
    setTimeout(() => {
      setDevices((devs) =>
        devs.map((d) =>
          d.id === deviceId ? { ...d, status: "online" as DeviceStatus } : d
        )
      );
    }, 3000);
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
                  <Phone className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Devices</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.total}</p>
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
                  <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.online}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <WifiOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Offline</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.offline}</p>
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
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Errors</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.errors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search devices..."
              className="pl-9"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as DeviceStatus | "all")}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="provisioning">Provisioning</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="btn-primary gap-2" onClick={() => setShowAddDevice(true)}>
            <Plus className="h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device, i) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={device.status === "error" ? "border-red-200 dark:border-red-800" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      device.status === "online"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                        : device.status === "error"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                    }`}>
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E3A5F] dark:text-white">{device.name}</h4>
                      <p className="text-sm text-gray-500">{device.model}</p>
                    </div>
                  </div>
                  {getStatusBadge(device.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">MAC Address</span>
                    <span className="font-mono text-xs">{device.macAddress}</span>
                  </div>
                  {device.ipAddress && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">IP Address</span>
                      <span className="font-mono text-xs">{device.ipAddress}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Firmware</span>
                    <span className="text-xs">{device.firmwareVersion}</span>
                  </div>
                </div>

                {device.assignedTo && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{device.assignedTo.userName}</span>
                      <Badge variant="outline" className="text-xs">Ext. {device.assignedTo.extension}</Badge>
                    </div>
                  </div>
                )}

                {device.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{device.location}</span>
                  </div>
                )}

                {device.lastSeen && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <Clock className="h-3 w-3" />
                    <span>Last seen: {new Date(device.lastSeen).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t dark:border-gray-700">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rebootDevice(device.id)}
                    disabled={device.status === "provisioning"}
                  >
                    <RefreshCw className={`h-4 w-4 ${device.status === "provisioning" ? "animate-spin" : ""}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Device Dialog */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Add New Device
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Device Type</label>
                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <option value="desk_phone">Desk Phone</option>
                      <option value="conference_phone">Conference Phone</option>
                      <option value="softphone">Softphone</option>
                      <option value="mobile_app">Mobile App</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Device Name</label>
                    <Input placeholder="e.g., Marketing Phone" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">MAC Address</label>
                    <Input placeholder="00:00:00:00:00:00" className="font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <optgroup label="Poly">
                        <option>Poly VVX 250</option>
                        <option>Poly VVX 450</option>
                        <option>Poly Trio 8500</option>
                      </optgroup>
                      <optgroup label="Yealink">
                        <option>Yealink T54W</option>
                        <option>Yealink T46U</option>
                        <option>Yealink CP965</option>
                      </optgroup>
                      <optgroup label="Grandstream">
                        <option>Grandstream GRP2614</option>
                        <option>Grandstream GXP2170</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Assign To (Optional)</label>
                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <option value="">Unassigned</option>
                      <option>Michael Chen - Ext. 101</option>
                      <option>Emily Davis - Ext. 102</option>
                      <option>David Wilson - Ext. 103</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <option>Headquarters</option>
                      <option>West Coast Office</option>
                      <option>Warehouse</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="auto-provision" className="rounded" defaultChecked />
                    <label htmlFor="auto-provision" className="text-sm">
                      Enable auto-provisioning (recommended)
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowAddDevice(false)}>Cancel</Button>
                  <Button className="btn-primary">Add Device</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

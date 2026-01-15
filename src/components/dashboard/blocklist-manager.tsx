"use client";

import { useState } from "react";
import {
  Ban,
  Plus,
  Trash2,
  Search,
  Phone,
  Clock,
  Shield,
  AlertTriangle,
  Filter,
  Download,
  Upload,
  User,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BlockedNumber {
  id: string;
  phoneNumber: string;
  reason: string;
  type: "manual" | "auto" | "spam";
  callerName?: string;
  blockedAt: string;
  callsBlocked: number;
  lastAttempt?: string;
}

// Mock blocklist data
const mockBlocklist: BlockedNumber[] = [
  {
    id: "1",
    phoneNumber: "+1 (555) 123-4567",
    reason: "Spam calls",
    type: "spam",
    callerName: "Unknown Caller",
    blockedAt: "2024-01-15T10:30:00Z",
    callsBlocked: 15,
    lastAttempt: "2024-01-20T14:22:00Z",
  },
  {
    id: "2",
    phoneNumber: "+1 (555) 987-6543",
    reason: "Telemarketing",
    type: "manual",
    callerName: "Sales Call",
    blockedAt: "2024-01-10T09:15:00Z",
    callsBlocked: 8,
    lastAttempt: "2024-01-19T11:45:00Z",
  },
  {
    id: "3",
    phoneNumber: "+1 (555) 456-7890",
    reason: "Robocalls detected",
    type: "auto",
    blockedAt: "2024-01-18T16:20:00Z",
    callsBlocked: 3,
    lastAttempt: "2024-01-20T08:30:00Z",
  },
  {
    id: "4",
    phoneNumber: "+1 (555) 321-9876",
    reason: "Harassment",
    type: "manual",
    callerName: "Blocked Contact",
    blockedAt: "2024-01-05T12:00:00Z",
    callsBlocked: 22,
    lastAttempt: "2024-01-20T16:10:00Z",
  },
];

const typeConfig = {
  manual: {
    label: "Manual Block",
    icon: User,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  auto: {
    label: "Auto-Blocked",
    icon: Shield,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  spam: {
    label: "Spam Detected",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export function BlocklistManager() {
  const [blocklist, setBlocklist] = useState<BlockedNumber[]>(mockBlocklist);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBlock, setNewBlock] = useState({
    phoneNumber: "",
    reason: "",
  });

  const filteredBlocklist = blocklist.filter((item) => {
    const matchesSearch =
      item.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.callerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
  };

  const handleAddBlock = () => {
    if (!newBlock.phoneNumber) return;

    const newEntry: BlockedNumber = {
      id: Date.now().toString(),
      phoneNumber: newBlock.phoneNumber,
      reason: newBlock.reason || "Manually blocked",
      type: "manual",
      blockedAt: new Date().toISOString(),
      callsBlocked: 0,
    };

    setBlocklist([newEntry, ...blocklist]);
    setShowAddModal(false);
    setNewBlock({ phoneNumber: "", reason: "" });
  };

  const handleRemoveBlock = (id: string) => {
    setBlocklist(blocklist.filter((item) => item.id !== id));
  };

  const totalBlocked = blocklist.reduce(
    (sum, item) => sum + item.callsBlocked,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Blocked Numbers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage blocked callers and spam protection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 dark:border-gray-700">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="gap-2 dark:border-gray-700">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            Block Number
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {blocklist.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Blocked Numbers
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalBlocked}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Calls Blocked
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {blocklist.filter((b) => b.type === "spam").length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Spam Detected
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {blocklist.filter((b) => b.type === "auto").length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Auto-Blocked
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by number, name, or reason..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedType === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(null)}
            className={cn(
              selectedType === null && "bg-[#1E3A5F] hover:bg-[#2d4a6f]",
              "dark:border-gray-700"
            )}
          >
            All
          </Button>
          {Object.entries(typeConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={selectedType === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(key)}
              className={cn(
                "gap-1",
                selectedType === key && "bg-[#1E3A5F] hover:bg-[#2d4a6f]",
                "dark:border-gray-700"
              )}
            >
              <config.icon className="h-3 w-3" />
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Block a Phone Number
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <Input
                value={newBlock.phoneNumber}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, phoneNumber: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason (optional)
              </label>
              <Input
                value={newBlock.reason}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, reason: e.target.value })
                }
                placeholder="Spam, harassment, etc."
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleAddBlock} className="btn-primary gap-2">
              <Ban className="h-4 w-4" />
              Block Number
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setNewBlock({ phoneNumber: "", reason: "" });
              }}
              className="dark:border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Blocklist */}
      <div className="space-y-3">
        {filteredBlocklist.map((item) => {
          const config = typeConfig[item.type];
          const TypeIcon = config.icon;

          return (
            <div
              key={item.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.phoneNumber}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          config.color
                        )}
                      >
                        <TypeIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    {item.callerName && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.callerName}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.callsBlocked} calls blocked
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.lastAttempt && (
                        <>Last attempt: {formatRelativeTime(item.lastAttempt)}</>
                      )}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Blocked on
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(item.blockedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBlock(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredBlocklist.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No blocked numbers</p>
            <p className="text-sm mt-1">
              {searchQuery || selectedType
                ? "Try adjusting your filters"
                : "Your blocklist is empty"}
            </p>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Auto-Block Settings
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Block known spam numbers
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically block calls from known spam databases
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Block robocalls
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use AI to detect and block automated robocalls
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Block anonymous callers
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Block calls with hidden or unavailable caller ID
              </p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

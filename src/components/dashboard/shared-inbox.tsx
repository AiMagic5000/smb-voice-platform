"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Inbox,
  Phone,
  MessageSquare,
  Voicemail,
  Mail,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle,
  ArrowRight,
  MoreVertical,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
} from "lucide-react";

type InboxItem = {
  id: string;
  type: "call" | "sms" | "voicemail" | "email";
  direction?: "inbound" | "outbound";
  status: "new" | "open" | "pending" | "resolved";
  contact: {
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
  };
  subject?: string;
  preview: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
};

const mockInboxItems: InboxItem[] = [
  {
    id: "1",
    type: "call",
    direction: "inbound",
    status: "new",
    contact: {
      name: "John Smith",
      phone: "+1 (555) 123-4567",
    },
    preview: "Missed call - 2 minutes",
    createdAt: new Date(Date.now() - 300000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "2",
    type: "sms",
    direction: "inbound",
    status: "open",
    contact: {
      name: "Sarah Johnson",
      phone: "+1 (555) 234-5678",
    },
    preview: "Hi, I need help with my order #12345. Can someone call me back?",
    assignedTo: {
      id: "agent1",
      name: "Mike Chen",
    },
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "3",
    type: "voicemail",
    status: "pending",
    contact: {
      name: "David Wilson",
      phone: "+1 (555) 345-6789",
    },
    preview: "45 second voicemail - requesting callback about invoice",
    assignedTo: {
      id: "agent2",
      name: "Lisa Rodriguez",
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "4",
    type: "call",
    direction: "inbound",
    status: "resolved",
    contact: {
      name: "Emily Brown",
      phone: "+1 (555) 456-7890",
    },
    preview: "Completed call - 8 minutes",
    assignedTo: {
      id: "agent1",
      name: "Mike Chen",
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 6900000).toISOString(),
  },
];

const getTypeIcon = (type: string, direction?: string) => {
  switch (type) {
    case "call":
      if (direction === "inbound")
        return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      if (direction === "outbound")
        return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      return <PhoneMissed className="h-4 w-4 text-red-500" />;
    case "sms":
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case "voicemail":
      return <Voicemail className="h-4 w-4 text-orange-500" />;
    case "email":
      return <Mail className="h-4 w-4 text-blue-500" />;
    default:
      return <Inbox className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          New
        </Badge>
      );
    case "open":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Open
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          Pending
        </Badge>
      );
    case "resolved":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Resolved
        </Badge>
      );
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
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

type SharedInboxProps = {
  showFilters?: boolean;
  maxItems?: number;
};

export function SharedInbox({ showFilters = true, maxItems }: SharedInboxProps) {
  const [filter, setFilter] = useState<"all" | "new" | "open" | "pending" | "resolved">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "call" | "sms" | "voicemail" | "email">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredItems = mockInboxItems.filter((item) => {
    if (filter !== "all" && item.status !== filter) return false;
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.contact.name.toLowerCase().includes(query) ||
        item.contact.phone.includes(query) ||
        item.preview.toLowerCase().includes(query)
      );
    }
    return true;
  }).slice(0, maxItems);

  const stats = {
    new: mockInboxItems.filter((i) => i.status === "new").length,
    open: mockInboxItems.filter((i) => i.status === "open").length,
    pending: mockInboxItems.filter((i) => i.status === "pending").length,
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <>
          {/* Stats Bar */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-[#1E3A5F] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("new")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                filter === "new"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              New
              {stats.new > 0 && (
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {stats.new}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter("open")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                filter === "open"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Open
              {stats.open > 0 && (
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {stats.open}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Pending
              {stats.pending > 0 && (
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {stats.pending}
                </span>
              )}
            </button>
          </div>

          {/* Search and Type Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inbox..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {(["all", "call", "sms", "voicemail"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`p-2 rounded-md transition-colors ${
                    typeFilter === type
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                  }`}
                  title={type === "all" ? "All types" : type}
                >
                  {type === "all" ? (
                    <Inbox className="h-4 w-4" />
                  ) : type === "call" ? (
                    <Phone className="h-4 w-4" />
                  ) : type === "sms" ? (
                    <MessageSquare className="h-4 w-4" />
                  ) : (
                    <Voicemail className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Inbox Items */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Inbox className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No items in inbox</p>
            </motion.div>
          ) : (
            filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedItem === item.id
                      ? "ring-2 ring-[#C9A227]"
                      : ""
                  } ${item.status === "new" ? "border-l-4 border-l-red-500" : ""}`}
                  onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(item.type, item.direction)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#1E3A5F] dark:text-white truncate">
                            {item.contact.name}
                          </span>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {item.contact.phone}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {item.preview}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(item.createdAt)}
                        </span>
                        {item.assignedTo && (
                          <div className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={item.assignedTo.avatar} />
                              <AvatarFallback className="text-[8px] bg-[#1E3A5F] text-white">
                                {item.assignedTo.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.assignedTo.name.split(" ")[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Actions */}
                    <AnimatePresence>
                      {selectedItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t dark:border-gray-700 flex items-center gap-2"
                        >
                          <Button size="sm" className="btn-primary gap-1">
                            <Phone className="h-3 w-3" />
                            Call Back
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Send SMS
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <User className="h-3 w-3" />
                            Assign
                          </Button>
                          {item.status !== "resolved" && (
                            <Button size="sm" variant="outline" className="gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Resolve
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="ml-auto">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

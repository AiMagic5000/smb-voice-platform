"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Phone,
  MoreVertical,
  Trash2,
  Archive,
  Star,
  StarOff,
  Paperclip,
  Image,
  Smile,
  Check,
  CheckCheck,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOutbound: boolean;
  status: MessageStatus;
}

interface Conversation {
  id: string;
  contactName: string;
  contactPhone: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isStarred: boolean;
  messages: Message[];
}

interface SMSMessagingProps {
  conversations?: Conversation[];
  onSendMessage?: (conversationId: string, message: string) => Promise<void>;
  onNewConversation?: (phone: string, message: string) => Promise<void>;
  onDeleteConversation?: (id: string) => void;
  onToggleStar?: (id: string) => void;
  className?: string;
}

const sampleConversations: Conversation[] = [
  {
    id: "1",
    contactName: "John Smith",
    contactPhone: "(555) 123-4567",
    lastMessage: "Thanks for the update! I'll review the proposal today.",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 0,
    isStarred: true,
    messages: [
      {
        id: "m1",
        content: "Hi John, just wanted to follow up on our call yesterday.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOutbound: true,
        status: "read",
      },
      {
        id: "m2",
        content: "Hey! Yes, I was just thinking about that. Do you have the proposal ready?",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isOutbound: false,
        status: "read",
      },
      {
        id: "m3",
        content: "Absolutely! I just sent it to your email. Let me know if you have any questions.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isOutbound: true,
        status: "read",
      },
      {
        id: "m4",
        content: "Thanks for the update! I'll review the proposal today.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isOutbound: false,
        status: "read",
      },
    ],
  },
  {
    id: "2",
    contactName: "Sarah Johnson",
    contactPhone: "(555) 234-5678",
    lastMessage: "Can we reschedule our meeting to 3pm?",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 2,
    isStarred: false,
    messages: [
      {
        id: "m5",
        content: "Hi Sarah, confirming our 2pm meeting tomorrow.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOutbound: true,
        status: "delivered",
      },
      {
        id: "m6",
        content: "Can we reschedule our meeting to 3pm?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isOutbound: false,
        status: "read",
      },
    ],
  },
  {
    id: "3",
    contactName: "Mike Williams",
    contactPhone: "(555) 345-6789",
    lastMessage: "The invoice has been sent to your email.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    isStarred: false,
    messages: [
      {
        id: "m7",
        content: "Hi Mike, could you send over the invoice for last month's services?",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isOutbound: true,
        status: "read",
      },
      {
        id: "m8",
        content: "The invoice has been sent to your email.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOutbound: false,
        status: "read",
      },
    ],
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatMessageTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function MessageStatusIcon({ status }: { status: MessageStatus }) {
  switch (status) {
    case "sending":
      return <Clock className="h-3 w-3 text-gray-400" />;
    case "sent":
      return <Check className="h-3 w-3 text-gray-400" />;
    case "delivered":
      return <CheckCheck className="h-3 w-3 text-gray-400" />;
    case "read":
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    case "failed":
      return <span className="text-xs text-red-500">Failed</span>;
    default:
      return null;
  }
}

export function SMSMessaging({
  conversations: initialConversations = sampleConversations,
  onSendMessage,
  onNewConversation,
  onDeleteConversation,
  onToggleStar,
  className,
}: SMSMessagingProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.contactName.toLowerCase().includes(query) ||
      conv.contactPhone.includes(query) ||
      conv.lastMessage.toLowerCase().includes(query)
    );
  });

  // Sort: starred first, then by last message time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isStarred !== b.isStarred) return a.isStarred ? -1 : 1;
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedId) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      timestamp: new Date(),
      isOutbound: true,
      status: "sending",
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
            }
          : conv
      )
    );
    setNewMessage("");

    try {
      await onSendMessage?.(selectedId, message.content);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedId
            ? {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.id === message.id ? { ...m, status: "delivered" as MessageStatus } : m
                ),
              }
            : conv
        )
      );
    } catch {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedId
            ? {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.id === message.id ? { ...m, status: "failed" as MessageStatus } : m
                ),
              }
            : conv
        )
      );
    }
  };

  const handleNewConversation = async () => {
    if (!newPhone.trim() || !newMessage.trim()) return;

    const newConv: Conversation = {
      id: Date.now().toString(),
      contactName: newPhone,
      contactPhone: newPhone,
      lastMessage: newMessage,
      lastMessageTime: new Date(),
      unreadCount: 0,
      isStarred: false,
      messages: [
        {
          id: Date.now().toString(),
          content: newMessage,
          timestamp: new Date(),
          isOutbound: true,
          status: "sending",
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setSelectedId(newConv.id);
    setShowNewConversation(false);
    setNewPhone("");
    setNewMessage("");

    await onNewConversation?.(newPhone, newMessage);
  };

  const handleDelete = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) {
      setSelectedId(conversations[0]?.id || null);
    }
    onDeleteConversation?.(id);
    setShowMenu(null);
  };

  const handleToggleStar = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isStarred: !c.isStarred } : c))
    );
    onToggleStar?.(id);
  };

  return (
    <Card className={cn("overflow-hidden h-[600px]", className)}>
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#1E3A5F] flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </h2>
              <Button
                size="sm"
                className="gap-1 bg-[#C9A227] hover:bg-[#B8911F] text-white"
                onClick={() => setShowNewConversation(true)}
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {sortedConversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "relative p-4 cursor-pointer transition-colors border-b border-gray-50",
                  selectedId === conv.id
                    ? "bg-[#FDF8E8]"
                    : "hover:bg-gray-50"
                )}
                onClick={() => setSelectedId(conv.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2D5A8F] flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(conv.contactName)}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A227] rounded-full flex items-center justify-center text-xs text-white font-medium">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-[#1E3A5F] truncate flex items-center gap-1">
                        {conv.contactName}
                        {conv.isStarred && (
                          <Star className="h-3 w-3 text-[#C9A227] fill-current" />
                        )}
                      </h4>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatMessageTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                {/* Menu Button */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(showMenu === conv.id ? null : conv.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 hover:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {showMenu === conv.id && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-10"
                          onClick={() => setShowMenu(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[140px]"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStar(conv.id);
                              setShowMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {conv.isStarred ? (
                              <>
                                <StarOff className="h-4 w-4" />
                                Unstar
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4" />
                                Star
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(conv.id);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}

            {sortedConversations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>No conversations</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2D5A8F] flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(selectedConversation.contactName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1E3A5F]">
                      {selectedConversation.contactName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.contactPhone}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      msg.isOutbound ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2.5",
                        msg.isOutbound
                          ? "bg-[#1E3A5F] text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div
                        className={cn(
                          "flex items-center gap-1 mt-1",
                          msg.isOutbound ? "justify-end" : "justify-start"
                        )}
                      >
                        <span
                          className={cn(
                            "text-xs",
                            msg.isOutbound ? "text-white/60" : "text-gray-400"
                          )}
                        >
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.isOutbound && <MessageStatusIcon status={msg.status} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 pr-24 rounded-2xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all resize-none"
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                        <Image className="h-5 w-5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                        <Smile className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="gap-1 bg-[#C9A227] hover:bg-[#B8911F] text-white h-12 px-4"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-200" />
                <p className="text-lg">Select a conversation</p>
                <p className="text-sm">or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      <AnimatePresence>
        {showNewConversation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowNewConversation(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">
                New Message
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowNewConversation(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 gap-1 bg-[#C9A227] hover:bg-[#B8911F] text-white"
                    onClick={handleNewConversation}
                    disabled={!newPhone.trim() || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default SMSMessaging;

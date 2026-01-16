"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Conversation {
  id: string;
  participantPhone: string;
  participantName: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: string;
  direction: "inbound" | "outbound";
  body: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      const response = await fetch("/api/sms");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMessages(convoId: string) {
    try {
      const response = await fetch(`/api/sms?conversationId=${convoId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }

  async function sendMessage() {
    if (!selectedConvo || !newMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedConvo.participantPhone,
          message: newMessage,
          fromNumberId: "default", // Would use actual number ID
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(selectedConvo.id);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }

  const selectConversation = (convo: Conversation) => {
    setSelectedConvo(convo);
    fetchMessages(convo.id);
  };

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex h-full gap-4">
        {/* Conversations List */}
        <div
          className={`w-full md:w-80 flex-shrink-0 ${
            selectedConvo ? "hidden md:block" : ""
          }`}
        >
          <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">Messages</h2>
                <Button size="icon" variant="ghost" className="text-[#C9A227]">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 text-slate-400 px-4">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => selectConversation(convo)}
                    className={`w-full p-4 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 ${
                      selectedConvo?.id === convo.id ? "bg-slate-700/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">
                        {convo.participantName || formatPhoneNumber(convo.participantPhone)}
                      </p>
                      {convo.unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-[#C9A227] text-white text-xs rounded-full">
                          {convo.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 truncate mt-1">
                      {convo.lastMessage}
                    </p>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <Card className={`flex-1 bg-slate-800 border-slate-700 flex flex-col ${
          !selectedConvo ? "hidden md:flex" : ""
        }`}>
          {selectedConvo ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-400"
                  onClick={() => setSelectedConvo(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {selectedConvo.participantName ||
                      formatPhoneNumber(selectedConvo.participantPhone)}
                  </p>
                  <p className="text-sm text-slate-400">
                    {formatPhoneNumber(selectedConvo.participantPhone)}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.direction === "outbound" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        msg.direction === "outbound"
                          ? "bg-[#C9A227] text-white"
                          : "bg-slate-700 text-white"
                      }`}
                    >
                      <p>{msg.body}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.direction === "outbound"
                            ? "text-white/70"
                            : "text-slate-400"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-slate-900 border-slate-700 text-white resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isSending || !newMessage.trim()}
                    className="bg-[#C9A227] hover:bg-[#B8921F] text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a conversation</p>
                <p className="text-sm mt-1">Or start a new message</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

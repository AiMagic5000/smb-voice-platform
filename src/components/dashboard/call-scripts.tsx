"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  ChevronRight,
  CheckCircle,
  Clock,
  Users,
  Tag,
  MoreVertical,
  Play,
  Pause,
  BookOpen,
} from "lucide-react";

type CallScript = {
  id: string;
  name: string;
  description: string;
  category: "sales" | "support" | "general" | "onboarding";
  steps: {
    id: string;
    title: string;
    content: string;
    type: "greeting" | "question" | "response" | "action" | "closing";
  }[];
  tags: string[];
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const mockScripts: CallScript[] = [
  {
    id: "1",
    name: "New Customer Welcome",
    description: "Standard greeting script for new customers calling in",
    category: "onboarding",
    steps: [
      {
        id: "s1",
        title: "Greeting",
        content: "Thank you for calling [Company Name]. My name is [Agent Name]. How can I help you today?",
        type: "greeting",
      },
      {
        id: "s2",
        title: "Verify Identity",
        content: "For security purposes, may I have your account number or the phone number associated with your account?",
        type: "question",
      },
      {
        id: "s3",
        title: "Understand Need",
        content: "I understand you're calling about [issue]. Let me help you with that.",
        type: "response",
      },
      {
        id: "s4",
        title: "Closing",
        content: "Is there anything else I can help you with today? Thank you for choosing [Company Name]!",
        type: "closing",
      },
    ],
    tags: ["welcome", "new-customer"],
    usageCount: 245,
    isActive: true,
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    name: "Technical Support",
    description: "Script for handling technical support inquiries",
    category: "support",
    steps: [
      {
        id: "s1",
        title: "Greeting",
        content: "Hello, this is [Agent Name] from Technical Support. I see you're having an issue. Can you describe what's happening?",
        type: "greeting",
      },
      {
        id: "s2",
        title: "Troubleshooting",
        content: "Let's try a few things. First, have you tried restarting [device/service]?",
        type: "question",
      },
      {
        id: "s3",
        title: "Escalation Check",
        content: "If the issue persists, I'll need to escalate this to our specialist team. They'll contact you within 24 hours.",
        type: "action",
      },
    ],
    tags: ["technical", "troubleshooting"],
    usageCount: 189,
    isActive: true,
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "3",
    name: "Sales Pitch",
    description: "Outbound sales call script for lead conversion",
    category: "sales",
    steps: [
      {
        id: "s1",
        title: "Introduction",
        content: "Hi [Contact Name], this is [Agent Name] from [Company]. I'm calling because I noticed you showed interest in our [product/service].",
        type: "greeting",
      },
      {
        id: "s2",
        title: "Pain Point",
        content: "Many businesses like yours struggle with [common problem]. Have you experienced this?",
        type: "question",
      },
      {
        id: "s3",
        title: "Value Proposition",
        content: "Our solution helps by [key benefit]. Companies have seen [specific result] after implementing it.",
        type: "response",
      },
      {
        id: "s4",
        title: "Close",
        content: "Would you be interested in a quick demo? I can schedule a 15-minute call with our specialist this week.",
        type: "closing",
      },
    ],
    tags: ["sales", "outbound", "lead"],
    usageCount: 78,
    isActive: true,
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "sales":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "support":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "onboarding":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "general":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStepTypeColor = (type: string) => {
  switch (type) {
    case "greeting":
      return "bg-blue-500";
    case "question":
      return "bg-yellow-500";
    case "response":
      return "bg-green-500";
    case "action":
      return "bg-purple-500";
    case "closing":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export function CallScripts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const filteredScripts = mockScripts.filter((script) => {
    if (categoryFilter !== "all" && script.category !== categoryFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        script.name.toLowerCase().includes(query) ||
        script.description.toLowerCase().includes(query) ||
        script.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search scripts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["all", "sales", "support", "onboarding", "general"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  categoryFilter === cat
                    ? "bg-white dark:bg-gray-700 shadow-sm font-medium"
                    : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <Button className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            New Script
          </Button>
        </div>
      </div>

      {/* Scripts List */}
      <div className="space-y-4">
        {filteredScripts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No scripts found</p>
            </CardContent>
          </Card>
        ) : (
          filteredScripts.map((script, i) => (
            <motion.div
              key={script.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Script Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={() =>
                      setExpandedScript(expandedScript === script.id ? null : script.id)
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-[#C9A227]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-[#1E3A5F] dark:text-white">
                            {script.name}
                          </h3>
                          <Badge className={getCategoryColor(script.category)}>
                            {script.category}
                          </Badge>
                          {script.isActive && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {script.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {script.steps.length} steps
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Used {script.usageCount} times
                          </span>
                          <div className="flex items-center gap-1">
                            {script.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <motion.div animate={{ rotate: expandedScript === script.id ? 90 : 0 }}>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Script Steps */}
                  <AnimatePresence>
                    {expandedScript === script.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t dark:border-gray-800 overflow-hidden"
                      >
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/30">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-[#1E3A5F] dark:text-white">
                              Script Steps
                            </h4>
                            <Button size="sm" className="gap-2">
                              <Play className="h-3 w-3" />
                              Start Script
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {script.steps.map((step, index) => (
                              <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-700 cursor-pointer transition-all ${
                                  activeStep === step.id
                                    ? "ring-2 ring-[#C9A227] shadow-lg"
                                    : "hover:shadow-md"
                                }`}
                                onClick={() =>
                                  setActiveStep(activeStep === step.id ? null : step.id)
                                }
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getStepTypeColor(
                                      step.type
                                    )}`}
                                  >
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-[#1E3A5F] dark:text-white">
                                        {step.title}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs capitalize"
                                      >
                                        {step.type}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      {step.content}
                                    </p>
                                  </div>
                                  {activeStep === step.id && (
                                    <Button size="sm" variant="ghost" className="text-green-600">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

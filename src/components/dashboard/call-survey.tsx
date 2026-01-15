"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Star,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Play,
  Pause,
  BarChart3,
  MessageSquare,
  Filter,
  Download,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mic,
  Hash,
  ToggleLeft,
  ToggleRight,
  Eye,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SurveyType = "csat" | "nps" | "custom" | "ivr";
type QuestionType = "rating" | "yes_no" | "multiple_choice" | "open_text" | "nps_scale";

interface SurveyTemplate {
  id: string;
  name: string;
  type: SurveyType;
  questions: SurveyQuestion[];
  isActive: boolean;
  triggerType: "after_call" | "scheduled" | "manual";
  responseRate: number;
  totalResponses: number;
  avgScore: number;
  createdAt: string;
}

interface SurveyQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  order: number;
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  surveyName: string;
  callerNumber: string;
  callerName: string;
  agentName: string;
  callDate: string;
  responseDate: string;
  score: number;
  answers: { questionId: string; answer: string | number }[];
  sentiment: "positive" | "neutral" | "negative";
  feedback: string | null;
}

const mockSurveyTemplates: SurveyTemplate[] = [
  {
    id: "1",
    name: "Post-Call CSAT Survey",
    type: "csat",
    questions: [
      {
        id: "q1",
        text: "How satisfied were you with our service today?",
        type: "rating",
        required: true,
        order: 1,
      },
      {
        id: "q2",
        text: "Was your issue resolved?",
        type: "yes_no",
        required: true,
        order: 2,
      },
      {
        id: "q3",
        text: "Any additional comments?",
        type: "open_text",
        required: false,
        order: 3,
      },
    ],
    isActive: true,
    triggerType: "after_call",
    responseRate: 34.5,
    totalResponses: 1248,
    avgScore: 4.2,
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    name: "NPS Survey",
    type: "nps",
    questions: [
      {
        id: "q1",
        text: "How likely are you to recommend us to a friend or colleague?",
        type: "nps_scale",
        required: true,
        order: 1,
      },
      {
        id: "q2",
        text: "What's the primary reason for your score?",
        type: "open_text",
        required: false,
        order: 2,
      },
    ],
    isActive: true,
    triggerType: "scheduled",
    responseRate: 28.3,
    totalResponses: 856,
    avgScore: 7.8,
    createdAt: "2023-11-01",
  },
  {
    id: "3",
    name: "Agent Quality Survey",
    type: "custom",
    questions: [
      {
        id: "q1",
        text: "How would you rate the agent's knowledge?",
        type: "rating",
        required: true,
        order: 1,
      },
      {
        id: "q2",
        text: "How would you rate the agent's communication?",
        type: "rating",
        required: true,
        order: 2,
      },
      {
        id: "q3",
        text: "Was the agent professional and courteous?",
        type: "yes_no",
        required: true,
        order: 3,
      },
    ],
    isActive: false,
    triggerType: "after_call",
    responseRate: 22.1,
    totalResponses: 423,
    avgScore: 4.5,
    createdAt: "2023-12-01",
  },
  {
    id: "4",
    name: "IVR Feedback Survey",
    type: "ivr",
    questions: [
      {
        id: "q1",
        text: "Press 1 if your issue was resolved, press 2 if not",
        type: "yes_no",
        required: true,
        order: 1,
      },
      {
        id: "q2",
        text: "On a scale of 1-5, rate your experience",
        type: "rating",
        required: true,
        order: 2,
      },
    ],
    isActive: true,
    triggerType: "after_call",
    responseRate: 41.2,
    totalResponses: 2134,
    avgScore: 3.9,
    createdAt: "2023-09-01",
  },
];

const mockResponses: SurveyResponse[] = [
  {
    id: "1",
    surveyId: "1",
    surveyName: "Post-Call CSAT Survey",
    callerNumber: "+1 (555) 123-4567",
    callerName: "John Smith",
    agentName: "Sarah Johnson",
    callDate: "2024-01-15T10:30:00Z",
    responseDate: "2024-01-15T10:35:00Z",
    score: 5,
    answers: [
      { questionId: "q1", answer: 5 },
      { questionId: "q2", answer: "yes" },
      { questionId: "q3", answer: "Great service, very helpful!" },
    ],
    sentiment: "positive",
    feedback: "Great service, very helpful!",
  },
  {
    id: "2",
    surveyId: "1",
    surveyName: "Post-Call CSAT Survey",
    callerNumber: "+1 (555) 234-5678",
    callerName: "Jane Doe",
    agentName: "Mike Wilson",
    callDate: "2024-01-15T11:00:00Z",
    responseDate: "2024-01-15T11:05:00Z",
    score: 3,
    answers: [
      { questionId: "q1", answer: 3 },
      { questionId: "q2", answer: "no" },
      { questionId: "q3", answer: "Issue not fully resolved, need to call back." },
    ],
    sentiment: "neutral",
    feedback: "Issue not fully resolved, need to call back.",
  },
  {
    id: "3",
    surveyId: "2",
    surveyName: "NPS Survey",
    callerNumber: "+1 (555) 345-6789",
    callerName: "Bob Wilson",
    agentName: "N/A",
    callDate: "2024-01-14T15:00:00Z",
    responseDate: "2024-01-14T18:00:00Z",
    score: 9,
    answers: [
      { questionId: "q1", answer: 9 },
      { questionId: "q2", answer: "Always reliable and professional." },
    ],
    sentiment: "positive",
    feedback: "Always reliable and professional.",
  },
  {
    id: "4",
    surveyId: "1",
    surveyName: "Post-Call CSAT Survey",
    callerNumber: "+1 (555) 456-7890",
    callerName: "Alice Brown",
    agentName: "Tom Davis",
    callDate: "2024-01-15T09:15:00Z",
    responseDate: "2024-01-15T09:20:00Z",
    score: 2,
    answers: [
      { questionId: "q1", answer: 2 },
      { questionId: "q2", answer: "no" },
      { questionId: "q3", answer: "Long wait time, agent was unhelpful." },
    ],
    sentiment: "negative",
    feedback: "Long wait time, agent was unhelpful.",
  },
];

export function CallSurvey() {
  const [activeTab, setActiveTab] = useState<"templates" | "responses" | "analytics">("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { id: "templates", label: "Survey Templates", icon: ClipboardList },
    { id: "responses", label: "Responses", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ] as const;

  const getSurveyTypeLabel = (type: SurveyType) => {
    switch (type) {
      case "csat":
        return "CSAT";
      case "nps":
        return "NPS";
      case "custom":
        return "Custom";
      case "ivr":
        return "IVR";
    }
  };

  const getSurveyTypeBadge = (type: SurveyType) => {
    switch (type) {
      case "csat":
        return "bg-blue-100 text-blue-700";
      case "nps":
        return "bg-purple-100 text-purple-700";
      case "custom":
        return "bg-gray-100 text-gray-700";
      case "ivr":
        return "bg-orange-100 text-orange-700";
    }
  };

  const getSentimentIcon = (sentiment: SurveyResponse["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case "neutral":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-600" />;
    }
  };

  const totalResponses = mockSurveyTemplates.reduce((sum, t) => sum + t.totalResponses, 0);
  const avgResponseRate =
    mockSurveyTemplates.reduce((sum, t) => sum + t.responseRate, 0) / mockSurveyTemplates.length;
  const overallAvgScore =
    mockSurveyTemplates.reduce((sum, t) => sum + t.avgScore * t.totalResponses, 0) / totalResponses;

  // Calculate NPS
  const npsResponses = mockResponses.filter((r) => r.surveyId === "2");
  const promoters = npsResponses.filter((r) => r.score >= 9).length;
  const detractors = npsResponses.filter((r) => r.score <= 6).length;
  const npsScore =
    npsResponses.length > 0
      ? Math.round(((promoters - detractors) / npsResponses.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="h-4 w-4" />
              +12%
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Responses</p>
          <p className="text-3xl font-bold text-gray-900">{totalResponses.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Star className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Avg CSAT Score</p>
          <p className="text-3xl font-bold text-gray-900">{overallAvgScore.toFixed(1)}/5</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                npsScore >= 50
                  ? "bg-green-100 text-green-700"
                  : npsScore >= 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
              )}
            >
              {npsScore >= 50 ? "Excellent" : npsScore >= 0 ? "Good" : "Needs Work"}
            </span>
          </div>
          <p className="text-sm text-gray-500">NPS Score</p>
          <p className="text-3xl font-bold text-gray-900">{npsScore}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Response Rate</p>
          <p className="text-3xl font-bold text-gray-900">{avgResponseRate.toFixed(1)}%</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-2 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-[#1E3A5F] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "templates" && (
              <motion.div
                key="templates"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Create Survey
                  </button>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockSurveyTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-200 rounded-xl p-5 hover:border-[#1E3A5F]/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                getSurveyTypeBadge(template.type)
                              )}
                            >
                              {getSurveyTypeLabel(template.type)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {template.questions.length} questions &bull; {template.triggerType.replace("_", " ")}
                          </p>
                        </div>
                        <button
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            template.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          )}
                        >
                          {template.isActive ? (
                            <ToggleRight className="h-5 w-5" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Responses</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {template.totalResponses.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Response Rate</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {template.responseRate}%
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Avg Score</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {template.avgScore.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          Created {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit2 className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Copy className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "responses" && (
              <motion.div
                key="responses"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search responses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>

                {/* Responses Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Survey
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Agent
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Score
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Sentiment
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Date
                        </th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockResponses.map((response) => (
                        <tr key={response.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{response.callerName}</p>
                              <p className="text-sm text-gray-500">{response.callerNumber}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700">{response.surveyName}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700">{response.agentName}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn(
                                    "h-4 w-4",
                                    star <= response.score
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-gray-200"
                                  )}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getSentimentIcon(response.sentiment)}
                              <span
                                className={cn(
                                  "text-sm font-medium capitalize",
                                  response.sentiment === "positive"
                                    ? "text-green-600"
                                    : response.sentiment === "negative"
                                      ? "text-red-600"
                                      : "text-amber-600"
                                )}
                              >
                                {response.sentiment}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-500">
                              {new Date(response.responseDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="h-4 w-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent Feedback */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
                  <div className="space-y-3">
                    {mockResponses
                      .filter((r) => r.feedback)
                      .map((response) => (
                        <div
                          key={response.id}
                          className={cn(
                            "p-4 rounded-xl border-l-4",
                            response.sentiment === "positive"
                              ? "bg-green-50 border-green-500"
                              : response.sentiment === "negative"
                                ? "bg-red-50 border-red-500"
                                : "bg-amber-50 border-amber-500"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {getSentimentIcon(response.sentiment)}
                                <span className="font-medium text-gray-900">
                                  {response.callerName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  via {response.surveyName}
                                </span>
                              </div>
                              <p className="text-gray-700">&ldquo;{response.feedback}&rdquo;</p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(response.responseDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Score Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      CSAT Score Distribution
                    </h3>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((score) => {
                        const count =
                          score === 5
                            ? 45
                            : score === 4
                              ? 30
                              : score === 3
                                ? 15
                                : score === 2
                                  ? 7
                                  : 3;
                        const percentage = count;
                        return (
                          <div key={score} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-20">
                              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-medium text-gray-700">{score}</span>
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div
                                className={cn(
                                  "h-3 rounded-full",
                                  score >= 4
                                    ? "bg-green-500"
                                    : score === 3
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                )}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 w-12 text-right">
                              {percentage}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">NPS Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-sm text-gray-700">Promoters (9-10)</span>
                        </div>
                        <span className="font-semibold text-gray-900">45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <span className="text-sm text-gray-700">Passives (7-8)</span>
                        </div>
                        <span className="font-semibold text-gray-900">35%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="text-sm text-gray-700">Detractors (0-6)</span>
                        </div>
                        <span className="font-semibold text-gray-900">20%</span>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">NPS Score</span>
                          <span className="text-2xl font-bold text-green-600">+25</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Performance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Agent Survey Performance
                  </h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Agent
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Surveys
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Avg CSAT
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Positive
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Negative
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Trend
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          {
                            name: "Sarah Johnson",
                            surveys: 156,
                            csat: 4.8,
                            positive: 92,
                            negative: 2,
                            trend: "up",
                          },
                          {
                            name: "Mike Wilson",
                            surveys: 142,
                            csat: 4.2,
                            positive: 78,
                            negative: 8,
                            trend: "stable",
                          },
                          {
                            name: "Tom Davis",
                            surveys: 128,
                            csat: 3.8,
                            positive: 65,
                            negative: 15,
                            trend: "down",
                          },
                        ].map((agent) => (
                          <tr key={agent.name} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-[#1E3A5F]" />
                                </div>
                                <span className="font-medium text-gray-900">{agent.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{agent.surveys}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                <span className="font-medium text-gray-900">{agent.csat}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-green-600 font-medium">{agent.positive}%</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-red-600 font-medium">{agent.negative}%</span>
                            </td>
                            <td className="px-4 py-3">
                              {agent.trend === "up" ? (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                              ) : agent.trend === "down" ? (
                                <TrendingDown className="h-5 w-5 text-red-600" />
                              ) : (
                                <div className="h-5 w-5 flex items-center justify-center">
                                  <div className="w-4 h-0.5 bg-gray-400" />
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Response Trends */}
                <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Response Trends - Last 30 Days</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Total Surveys Sent</p>
                      <p className="text-2xl font-bold">3,847</p>
                      <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                        <TrendingUp className="h-4 w-4" />
                        +8.3%
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Responses Received</p>
                      <p className="text-2xl font-bold">1,248</p>
                      <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                        <TrendingUp className="h-4 w-4" />
                        +12.1%
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Avg Response Time</p>
                      <p className="text-2xl font-bold">4.2 min</p>
                      <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                        <TrendingDown className="h-4 w-4" />
                        -15%
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Completion Rate</p>
                      <p className="text-2xl font-bold">87%</p>
                      <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                        <TrendingUp className="h-4 w-4" />
                        +3.2%
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

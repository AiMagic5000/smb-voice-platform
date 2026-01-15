"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  Plus,
  Edit2,
  Trash2,
  Play,
  Search,
  Filter,
  Download,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Target,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ScorecardStatus = "draft" | "active" | "archived";
type EvaluationStatus = "pending" | "in_progress" | "completed" | "disputed";

interface QACategory {
  id: string;
  name: string;
  weight: number;
  criteria: QACriterion[];
}

interface QACriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  isCritical: boolean;
}

interface Scorecard {
  id: string;
  name: string;
  description: string;
  status: ScorecardStatus;
  categories: QACategory[];
  totalWeight: number;
  maxScore: number;
  passingScore: number;
  createdAt: string;
  evaluationsCount: number;
  avgScore: number;
}

interface Evaluation {
  id: string;
  scorecardId: string;
  scorecardName: string;
  callId: string;
  agentName: string;
  evaluatorName: string;
  status: EvaluationStatus;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  callDate: string;
  evaluatedAt: string;
  feedback: string | null;
  categoryScores: { categoryId: string; score: number; maxScore: number }[];
}

const mockScorecards: Scorecard[] = [
  {
    id: "1",
    name: "Standard Call Quality",
    description: "Default scorecard for evaluating customer service calls",
    status: "active",
    categories: [
      {
        id: "c1",
        name: "Opening",
        weight: 20,
        criteria: [
          {
            id: "cr1",
            name: "Professional Greeting",
            description: "Agent used company greeting script",
            maxScore: 10,
            isCritical: false,
          },
          {
            id: "cr2",
            name: "Caller Identification",
            description: "Properly verified caller identity",
            maxScore: 10,
            isCritical: true,
          },
        ],
      },
      {
        id: "c2",
        name: "Communication",
        weight: 30,
        criteria: [
          {
            id: "cr3",
            name: "Active Listening",
            description: "Demonstrated understanding of customer needs",
            maxScore: 15,
            isCritical: false,
          },
          {
            id: "cr4",
            name: "Clear Explanation",
            description: "Provided clear and accurate information",
            maxScore: 15,
            isCritical: false,
          },
        ],
      },
      {
        id: "c3",
        name: "Resolution",
        weight: 35,
        criteria: [
          {
            id: "cr5",
            name: "Issue Resolution",
            description: "Successfully resolved customer issue",
            maxScore: 20,
            isCritical: true,
          },
          {
            id: "cr6",
            name: "First Call Resolution",
            description: "Resolved without need for callback",
            maxScore: 15,
            isCritical: false,
          },
        ],
      },
      {
        id: "c4",
        name: "Closing",
        weight: 15,
        criteria: [
          {
            id: "cr7",
            name: "Summary",
            description: "Summarized actions taken and next steps",
            maxScore: 8,
            isCritical: false,
          },
          {
            id: "cr8",
            name: "Professional Close",
            description: "Ended call professionally",
            maxScore: 7,
            isCritical: false,
          },
        ],
      },
    ],
    totalWeight: 100,
    maxScore: 100,
    passingScore: 70,
    createdAt: "2024-01-01T10:00:00Z",
    evaluationsCount: 456,
    avgScore: 82.5,
  },
  {
    id: "2",
    name: "Sales Call Evaluation",
    description: "Scorecard for evaluating sales and upsell calls",
    status: "active",
    categories: [
      {
        id: "c1",
        name: "Needs Discovery",
        weight: 25,
        criteria: [
          {
            id: "cr1",
            name: "Questioning Technique",
            description: "Asked probing questions",
            maxScore: 15,
            isCritical: false,
          },
          {
            id: "cr2",
            name: "Pain Point Identification",
            description: "Identified customer pain points",
            maxScore: 10,
            isCritical: false,
          },
        ],
      },
      {
        id: "c2",
        name: "Product Presentation",
        weight: 30,
        criteria: [
          {
            id: "cr3",
            name: "Feature Benefits",
            description: "Explained features as benefits",
            maxScore: 15,
            isCritical: false,
          },
          {
            id: "cr4",
            name: "Pricing Discussion",
            description: "Handled pricing professionally",
            maxScore: 15,
            isCritical: false,
          },
        ],
      },
      {
        id: "c3",
        name: "Objection Handling",
        weight: 25,
        criteria: [
          {
            id: "cr5",
            name: "Objection Response",
            description: "Addressed objections effectively",
            maxScore: 25,
            isCritical: false,
          },
        ],
      },
      {
        id: "c4",
        name: "Closing",
        weight: 20,
        criteria: [
          {
            id: "cr6",
            name: "Call to Action",
            description: "Clear next steps provided",
            maxScore: 10,
            isCritical: false,
          },
          {
            id: "cr7",
            name: "Follow-up Scheduled",
            description: "Scheduled follow-up if needed",
            maxScore: 10,
            isCritical: false,
          },
        ],
      },
    ],
    totalWeight: 100,
    maxScore: 100,
    passingScore: 75,
    createdAt: "2024-01-05T10:00:00Z",
    evaluationsCount: 234,
    avgScore: 78.3,
  },
  {
    id: "3",
    name: "Technical Support Scorecard",
    description: "For evaluating technical support interactions",
    status: "draft",
    categories: [
      {
        id: "c1",
        name: "Technical Knowledge",
        weight: 40,
        criteria: [
          {
            id: "cr1",
            name: "Problem Diagnosis",
            description: "Correctly diagnosed technical issue",
            maxScore: 20,
            isCritical: true,
          },
          {
            id: "cr2",
            name: "Solution Accuracy",
            description: "Provided correct solution",
            maxScore: 20,
            isCritical: true,
          },
        ],
      },
      {
        id: "c2",
        name: "Communication",
        weight: 30,
        criteria: [
          {
            id: "cr3",
            name: "Technical Clarity",
            description: "Explained technical concepts clearly",
            maxScore: 30,
            isCritical: false,
          },
        ],
      },
      {
        id: "c3",
        name: "Documentation",
        weight: 30,
        criteria: [
          {
            id: "cr4",
            name: "Ticket Notes",
            description: "Complete documentation in ticket",
            maxScore: 30,
            isCritical: false,
          },
        ],
      },
    ],
    totalWeight: 100,
    maxScore: 100,
    passingScore: 80,
    createdAt: "2024-01-10T10:00:00Z",
    evaluationsCount: 0,
    avgScore: 0,
  },
];

const mockEvaluations: Evaluation[] = [
  {
    id: "1",
    scorecardId: "1",
    scorecardName: "Standard Call Quality",
    callId: "call_123",
    agentName: "Sarah Johnson",
    evaluatorName: "Mike Wilson",
    status: "completed",
    score: 88,
    maxScore: 100,
    percentage: 88,
    passed: true,
    callDate: "2024-01-15T10:30:00Z",
    evaluatedAt: "2024-01-15T14:00:00Z",
    feedback: "Excellent customer interaction. Consider improving call closing.",
    categoryScores: [
      { categoryId: "c1", score: 18, maxScore: 20 },
      { categoryId: "c2", score: 28, maxScore: 30 },
      { categoryId: "c3", score: 30, maxScore: 35 },
      { categoryId: "c4", score: 12, maxScore: 15 },
    ],
  },
  {
    id: "2",
    scorecardId: "1",
    scorecardName: "Standard Call Quality",
    callId: "call_124",
    agentName: "Tom Davis",
    evaluatorName: "Mike Wilson",
    status: "completed",
    score: 65,
    maxScore: 100,
    percentage: 65,
    passed: false,
    callDate: "2024-01-15T11:00:00Z",
    evaluatedAt: "2024-01-15T15:30:00Z",
    feedback: "Needs improvement in active listening and issue resolution.",
    categoryScores: [
      { categoryId: "c1", score: 15, maxScore: 20 },
      { categoryId: "c2", score: 20, maxScore: 30 },
      { categoryId: "c3", score: 20, maxScore: 35 },
      { categoryId: "c4", score: 10, maxScore: 15 },
    ],
  },
  {
    id: "3",
    scorecardId: "2",
    scorecardName: "Sales Call Evaluation",
    callId: "call_125",
    agentName: "Emily Chen",
    evaluatorName: "Lisa Taylor",
    status: "completed",
    score: 92,
    maxScore: 100,
    percentage: 92,
    passed: true,
    callDate: "2024-01-14T14:00:00Z",
    evaluatedAt: "2024-01-15T09:00:00Z",
    feedback: "Outstanding sales technique. Great objection handling.",
    categoryScores: [
      { categoryId: "c1", score: 23, maxScore: 25 },
      { categoryId: "c2", score: 28, maxScore: 30 },
      { categoryId: "c3", score: 23, maxScore: 25 },
      { categoryId: "c4", score: 18, maxScore: 20 },
    ],
  },
  {
    id: "4",
    scorecardId: "1",
    scorecardName: "Standard Call Quality",
    callId: "call_126",
    agentName: "James Brown",
    evaluatorName: "Mike Wilson",
    status: "in_progress",
    score: 45,
    maxScore: 100,
    percentage: 45,
    passed: false,
    callDate: "2024-01-15T09:00:00Z",
    evaluatedAt: "2024-01-15T16:00:00Z",
    feedback: null,
    categoryScores: [
      { categoryId: "c1", score: 10, maxScore: 20 },
      { categoryId: "c2", score: 15, maxScore: 30 },
      { categoryId: "c3", score: 15, maxScore: 35 },
      { categoryId: "c4", score: 5, maxScore: 15 },
    ],
  },
];

export function QAScorecards() {
  const [activeTab, setActiveTab] = useState<"scorecards" | "evaluations" | "reports">(
    "scorecards"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedScorecard, setExpandedScorecard] = useState<string | null>(null);
  const [expandedEvaluation, setExpandedEvaluation] = useState<string | null>(null);

  const tabs = [
    { id: "scorecards", label: "Scorecards", icon: ClipboardCheck },
    { id: "evaluations", label: "Evaluations", icon: FileText },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ] as const;

  const getStatusBadge = (status: ScorecardStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "archived":
        return "bg-red-100 text-red-700";
    }
  };

  const getEvalStatusBadge = (status: EvaluationStatus) => {
    switch (status) {
      case "completed":
        return { color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "in_progress":
        return { color: "bg-blue-100 text-blue-700", icon: Clock };
      case "pending":
        return { color: "bg-gray-100 text-gray-700", icon: Clock };
      case "disputed":
        return { color: "bg-red-100 text-red-700", icon: AlertCircle };
    }
  };

  const totalEvaluations = mockEvaluations.length;
  const completedEvaluations = mockEvaluations.filter((e) => e.status === "completed").length;
  const avgScore =
    mockEvaluations
      .filter((e) => e.status === "completed")
      .reduce((sum, e) => sum + e.percentage, 0) / completedEvaluations || 0;
  const passRate =
    (mockEvaluations.filter((e) => e.status === "completed" && e.passed).length /
      completedEvaluations) *
      100 || 0;

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
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Active Scorecards</p>
          <p className="text-3xl font-bold text-gray-900">
            {mockScorecards.filter((s) => s.status === "active").length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="h-4 w-4" />
              +15%
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Evaluations</p>
          <p className="text-3xl font-bold text-gray-900">{totalEvaluations}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Average Score</p>
          <p className="text-3xl font-bold text-gray-900">{avgScore.toFixed(1)}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Pass Rate</p>
          <p className="text-3xl font-bold text-gray-900">{passRate.toFixed(1)}%</p>
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
            {activeTab === "scorecards" && (
              <motion.div
                key="scorecards"
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
                        placeholder="Search scorecards..."
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
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Create Scorecard
                  </button>
                </div>

                {/* Scorecards List */}
                <div className="space-y-4">
                  {mockScorecards.map((scorecard) => {
                    const isExpanded = expandedScorecard === scorecard.id;
                    return (
                      <div
                        key={scorecard.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() =>
                            setExpandedScorecard(isExpanded ? null : scorecard.id)
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{scorecard.name}</h3>
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                    getStatusBadge(scorecard.status)
                                  )}
                                >
                                  {scorecard.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mb-3">{scorecard.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{scorecard.categories.length} categories</span>
                                <span>Passing: {scorecard.passingScore}%</span>
                                <span>{scorecard.evaluationsCount} evaluations</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {scorecard.avgScore > 0 && (
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">Avg Score</p>
                                  <p
                                    className={cn(
                                      "text-lg font-semibold",
                                      scorecard.avgScore >= scorecard.passingScore
                                        ? "text-green-600"
                                        : "text-red-600"
                                    )}
                                  >
                                    {scorecard.avgScore}%
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Copy className="h-4 w-4 text-gray-400" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Edit2 className="h-4 w-4 text-gray-400" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Trash2 className="h-4 w-4 text-gray-400" />
                                </button>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-gray-200 bg-gray-50"
                            >
                              <div className="p-5">
                                <h4 className="font-medium text-gray-900 mb-4">
                                  Categories & Criteria
                                </h4>
                                <div className="space-y-4">
                                  {scorecard.categories.map((category) => (
                                    <div
                                      key={category.id}
                                      className="bg-white rounded-lg border border-gray-200 p-4"
                                    >
                                      <div className="flex items-center justify-between mb-3">
                                        <h5 className="font-medium text-gray-900">
                                          {category.name}
                                        </h5>
                                        <span className="text-sm text-gray-500">
                                          Weight: {category.weight}%
                                        </span>
                                      </div>
                                      <div className="space-y-2">
                                        {category.criteria.map((criterion) => (
                                          <div
                                            key={criterion.id}
                                            className="flex items-center justify-between py-2 border-t border-gray-100"
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm text-gray-700">
                                                {criterion.name}
                                              </span>
                                              {criterion.isCritical && (
                                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                                                  Critical
                                                </span>
                                              )}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                              Max: {criterion.maxScore} pts
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "evaluations" && (
              <motion.div
                key="evaluations"
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
                        placeholder="Search evaluations..."
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
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors">
                      <Plus className="h-4 w-4" />
                      New Evaluation
                    </button>
                  </div>
                </div>

                {/* Evaluations List */}
                <div className="space-y-3">
                  {mockEvaluations.map((evaluation) => {
                    const statusBadge = getEvalStatusBadge(evaluation.status);
                    const StatusIcon = statusBadge.icon;
                    const isExpanded = expandedEvaluation === evaluation.id;
                    return (
                      <div
                        key={evaluation.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() =>
                            setExpandedEvaluation(isExpanded ? null : evaluation.id)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center",
                                  evaluation.passed ? "bg-green-100" : "bg-red-100"
                                )}
                              >
                                {evaluation.passed ? (
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                ) : (
                                  <XCircle className="h-6 w-6 text-red-600" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">
                                    {evaluation.agentName}
                                  </span>
                                  <span
                                    className={cn(
                                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                      statusBadge.color
                                    )}
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {evaluation.status.replace("_", " ")}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {evaluation.scorecardName} • Evaluated by {evaluation.evaluatorName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Score</p>
                                <p
                                  className={cn(
                                    "text-xl font-bold",
                                    evaluation.passed ? "text-green-600" : "text-red-600"
                                  )}
                                >
                                  {evaluation.percentage}%
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Call Date</p>
                                <p className="text-sm text-gray-700">
                                  {new Date(evaluation.callDate).toLocaleDateString()}
                                </p>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-gray-200 bg-gray-50"
                            >
                              <div className="p-4 space-y-4">
                                {/* Category Breakdown */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                                    Category Scores
                                  </h4>
                                  <div className="space-y-2">
                                    {evaluation.categoryScores.map((cs) => {
                                      const category = mockScorecards
                                        .find((s) => s.id === evaluation.scorecardId)
                                        ?.categories.find((c) => c.id === cs.categoryId);
                                      const percentage = (cs.score / cs.maxScore) * 100;
                                      return (
                                        <div key={cs.categoryId} className="flex items-center gap-3">
                                          <span className="text-sm text-gray-600 w-32">
                                            {category?.name}
                                          </span>
                                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                              className={cn(
                                                "h-2 rounded-full",
                                                percentage >= 70
                                                  ? "bg-green-500"
                                                  : percentage >= 50
                                                    ? "bg-amber-500"
                                                    : "bg-red-500"
                                              )}
                                              style={{ width: `${percentage}%` }}
                                            />
                                          </div>
                                          <span className="text-sm font-medium text-gray-900 w-20 text-right">
                                            {cs.score}/{cs.maxScore}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Feedback */}
                                {evaluation.feedback && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                      Evaluator Feedback
                                    </h4>
                                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                                      {evaluation.feedback}
                                    </p>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-2">
                                  <button className="flex items-center gap-2 text-sm text-[#1E3A5F] hover:underline">
                                    <Play className="h-4 w-4" />
                                    Listen to Call
                                  </button>
                                  <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors">
                                      Dispute
                                    </button>
                                    <button className="px-3 py-1.5 text-sm bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors">
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "reports" && (
              <motion.div
                key="reports"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Agent Performance Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Agent QA Performance
                  </h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Agent
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Evaluations
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Avg Score
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Pass Rate
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
                            evals: 15,
                            avg: 88,
                            pass: 93,
                            trend: "up",
                          },
                          {
                            name: "Emily Chen",
                            evals: 12,
                            avg: 92,
                            pass: 100,
                            trend: "up",
                          },
                          {
                            name: "Tom Davis",
                            evals: 10,
                            avg: 72,
                            pass: 60,
                            trend: "down",
                          },
                          {
                            name: "James Brown",
                            evals: 8,
                            avg: 68,
                            pass: 50,
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
                            <td className="px-4 py-3 text-sm text-gray-700">{agent.evals}</td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "font-semibold",
                                  agent.avg >= 80
                                    ? "text-green-600"
                                    : agent.avg >= 70
                                      ? "text-amber-600"
                                      : "text-red-600"
                                )}
                              >
                                {agent.avg}%
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "font-semibold",
                                  agent.pass >= 80
                                    ? "text-green-600"
                                    : agent.pass >= 60
                                      ? "text-amber-600"
                                      : "text-red-600"
                                )}
                              >
                                {agent.pass}%
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {agent.trend === "up" ? (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                              ) : (
                                <TrendingDown className="h-5 w-5 text-red-600" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Category Performance */}
                <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Category Performance Insights</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Best Category</p>
                      <p className="text-xl font-bold">Communication</p>
                      <p className="text-sm text-white/70">Avg: 87%</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Needs Improvement</p>
                      <p className="text-xl font-bold">Resolution</p>
                      <p className="text-sm text-white/70">Avg: 68%</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Critical Failures</p>
                      <p className="text-xl font-bold">12</p>
                      <p className="text-sm text-white/70">This month</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">Coaching Sessions</p>
                      <p className="text-xl font-bold">8</p>
                      <p className="text-sm text-white/70">Scheduled</p>
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

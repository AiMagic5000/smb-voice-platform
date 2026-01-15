"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  User,
  Phone,
  Clock,
  ThumbsUp,
  Target,
  Award,
  BarChart3,
  Calendar,
  Search,
  Filter,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type TimePeriod = "today" | "week" | "month" | "quarter";

type AgentMetrics = {
  id: string;
  name: string;
  extension: string;
  avatar?: string;
  rank: number;
  previousRank: number;
  metrics: {
    callsHandled: number;
    avgHandleTime: number;
    firstCallResolution: number;
    customerSatisfaction: number;
    adherence: number;
    qualityScore: number;
    salesConversion?: number;
    upsellRate?: number;
  };
  goals: {
    callsGoal: number;
    fcfGoal: number;
    csatGoal: number;
    qualityGoal: number;
  };
  badges: string[];
  streak: number;
};

const mockAgents: AgentMetrics[] = [
  {
    id: "agent_1",
    name: "Michael Chen",
    extension: "101",
    rank: 1,
    previousRank: 2,
    metrics: {
      callsHandled: 156,
      avgHandleTime: 4.2,
      firstCallResolution: 92,
      customerSatisfaction: 4.8,
      adherence: 98,
      qualityScore: 95,
      salesConversion: 32,
      upsellRate: 18,
    },
    goals: { callsGoal: 140, fcfGoal: 85, csatGoal: 4.5, qualityGoal: 90 },
    badges: ["top_performer", "customer_hero", "100_club"],
    streak: 15,
  },
  {
    id: "agent_2",
    name: "Emily Davis",
    extension: "102",
    rank: 2,
    previousRank: 1,
    metrics: {
      callsHandled: 148,
      avgHandleTime: 3.8,
      firstCallResolution: 89,
      customerSatisfaction: 4.9,
      adherence: 97,
      qualityScore: 93,
      salesConversion: 28,
      upsellRate: 22,
    },
    goals: { callsGoal: 140, fcfGoal: 85, csatGoal: 4.5, qualityGoal: 90 },
    badges: ["customer_hero", "speed_demon"],
    streak: 12,
  },
  {
    id: "agent_3",
    name: "David Wilson",
    extension: "103",
    rank: 3,
    previousRank: 4,
    metrics: {
      callsHandled: 142,
      avgHandleTime: 4.5,
      firstCallResolution: 94,
      customerSatisfaction: 4.7,
      adherence: 95,
      qualityScore: 91,
    },
    goals: { callsGoal: 140, fcfGoal: 85, csatGoal: 4.5, qualityGoal: 90 },
    badges: ["problem_solver", "team_player"],
    streak: 8,
  },
  {
    id: "agent_4",
    name: "Lisa Brown",
    extension: "104",
    rank: 4,
    previousRank: 3,
    metrics: {
      callsHandled: 135,
      avgHandleTime: 5.1,
      firstCallResolution: 88,
      customerSatisfaction: 4.6,
      adherence: 99,
      qualityScore: 89,
    },
    goals: { callsGoal: 140, fcfGoal: 85, csatGoal: 4.5, qualityGoal: 90 },
    badges: ["perfect_attendance"],
    streak: 5,
  },
  {
    id: "agent_5",
    name: "Robert Taylor",
    extension: "105",
    rank: 5,
    previousRank: 5,
    metrics: {
      callsHandled: 128,
      avgHandleTime: 4.0,
      firstCallResolution: 86,
      customerSatisfaction: 4.5,
      adherence: 94,
      qualityScore: 87,
      salesConversion: 35,
      upsellRate: 25,
    },
    goals: { callsGoal: 140, fcfGoal: 85, csatGoal: 4.5, qualityGoal: 90 },
    badges: ["sales_star"],
    streak: 3,
  },
];

const badgeInfo: Record<string, { name: string; icon: React.ReactNode; color: string }> = {
  top_performer: { name: "Top Performer", icon: <Trophy className="h-3 w-3" />, color: "bg-yellow-100 text-yellow-700" },
  customer_hero: { name: "Customer Hero", icon: <ThumbsUp className="h-3 w-3" />, color: "bg-blue-100 text-blue-700" },
  "100_club": { name: "100 Club", icon: <Target className="h-3 w-3" />, color: "bg-purple-100 text-purple-700" },
  speed_demon: { name: "Speed Demon", icon: <Clock className="h-3 w-3" />, color: "bg-green-100 text-green-700" },
  problem_solver: { name: "Problem Solver", icon: <Star className="h-3 w-3" />, color: "bg-orange-100 text-orange-700" },
  team_player: { name: "Team Player", icon: <User className="h-3 w-3" />, color: "bg-cyan-100 text-cyan-700" },
  perfect_attendance: { name: "Perfect Attendance", icon: <Calendar className="h-3 w-3" />, color: "bg-pink-100 text-pink-700" },
  sales_star: { name: "Sales Star", icon: <TrendingUp className="h-3 w-3" />, color: "bg-emerald-100 text-emerald-700" },
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  }
};

const getRankChange = (current: number, previous: number) => {
  const diff = previous - current;
  if (diff > 0) {
    return (
      <div className="flex items-center text-green-500 text-xs">
        <ArrowUp className="h-3 w-3" />
        <span>{diff}</span>
      </div>
    );
  } else if (diff < 0) {
    return (
      <div className="flex items-center text-red-500 text-xs">
        <ArrowDown className="h-3 w-3" />
        <span>{Math.abs(diff)}</span>
      </div>
    );
  }
  return <Minus className="h-3 w-3 text-gray-400" />;
};

export function AgentScorecard() {
  const [agents] = useState(mockAgents);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedAgentData = agents.find((a) => a.id === selectedAgent);

  const teamAverages = {
    calls: Math.round(agents.reduce((acc, a) => acc + a.metrics.callsHandled, 0) / agents.length),
    fcr: Math.round(agents.reduce((acc, a) => acc + a.metrics.firstCallResolution, 0) / agents.length),
    csat: (agents.reduce((acc, a) => acc + a.metrics.customerSatisfaction, 0) / agents.length).toFixed(1),
    quality: Math.round(agents.reduce((acc, a) => acc + a.metrics.qualityScore, 0) / agents.length),
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Calls</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{teamAverages.calls}</p>
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
                  <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg FCR</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{teamAverages.fcr}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg CSAT</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{teamAverages.csat}</p>
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
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Quality</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{teamAverages.quality}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["today", "week", "month", "quarter"] as TimePeriod[]).map((period) => (
            <Button
              key={period}
              variant={timePeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod(period)}
              className={timePeriod === period ? "btn-primary" : ""}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Leaderboard
              </h3>

              <div className="space-y-3">
                {agents.map((agent, i) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedAgent === agent.id
                        ? "bg-[#1E3A5F] text-white"
                        : agent.rank <= 3
                        ? "bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10 hover:from-yellow-100 dark:hover:from-yellow-900/20"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-16">
                        {getRankIcon(agent.rank)}
                        {getRankChange(agent.rank, agent.previousRank)}
                      </div>

                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{agent.name}</h4>
                          {agent.streak >= 5 && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">
                              {agent.streak} day streak
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${selectedAgent === agent.id ? "text-white/70" : "text-gray-500"}`}>
                          Ext. {agent.extension}
                        </p>
                      </div>

                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className={selectedAgent === agent.id ? "text-white/70" : "text-gray-500"}>Calls</p>
                          <p className="font-bold">{agent.metrics.callsHandled}</p>
                        </div>
                        <div className="text-center">
                          <p className={selectedAgent === agent.id ? "text-white/70" : "text-gray-500"}>FCR</p>
                          <p className="font-bold">{agent.metrics.firstCallResolution}%</p>
                        </div>
                        <div className="text-center">
                          <p className={selectedAgent === agent.id ? "text-white/70" : "text-gray-500"}>CSAT</p>
                          <p className="font-bold">{agent.metrics.customerSatisfaction}</p>
                        </div>
                        <div className="text-center">
                          <p className={selectedAgent === agent.id ? "text-white/70" : "text-gray-500"}>Quality</p>
                          <p className="font-bold">{agent.metrics.qualityScore}%</p>
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 opacity-50" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Detail */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              {selectedAgentData ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#1E3A5F]/10 dark:bg-white/10 mx-auto mb-4 flex items-center justify-center">
                      <User className="h-10 w-10 text-[#1E3A5F] dark:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1E3A5F] dark:text-white">{selectedAgentData.name}</h3>
                    <p className="text-gray-500">Ext. {selectedAgentData.extension}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {getRankIcon(selectedAgentData.rank)}
                      <span className="text-sm text-gray-500">Rank #{selectedAgentData.rank}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Badges Earned</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgentData.badges.map((badge) => (
                        <Badge key={badge} className={`${badgeInfo[badge].color} flex items-center gap-1`}>
                          {badgeInfo[badge].icon}
                          {badgeInfo[badge].name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-500">Performance Metrics</h4>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Calls Handled</span>
                          <span className="font-medium">{selectedAgentData.metrics.callsHandled}/{selectedAgentData.goals.callsGoal}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min((selectedAgentData.metrics.callsHandled / selectedAgentData.goals.callsGoal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>First Call Resolution</span>
                          <span className="font-medium">{selectedAgentData.metrics.firstCallResolution}%/{selectedAgentData.goals.fcfGoal}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min((selectedAgentData.metrics.firstCallResolution / selectedAgentData.goals.fcfGoal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Customer Satisfaction</span>
                          <span className="font-medium">{selectedAgentData.metrics.customerSatisfaction}/{selectedAgentData.goals.csatGoal}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${Math.min((selectedAgentData.metrics.customerSatisfaction / selectedAgentData.goals.csatGoal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quality Score</span>
                          <span className="font-medium">{selectedAgentData.metrics.qualityScore}%/{selectedAgentData.goals.qualityGoal}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.min((selectedAgentData.metrics.qualityScore / selectedAgentData.goals.qualityGoal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full btn-primary mt-6">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Full Report
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Select an agent to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

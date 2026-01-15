"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Users,
  User,
  Settings,
  Search,
  Star,
  TrendingUp,
  Languages,
  Headphones,
  Phone,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Layers,
} from "lucide-react";

type SkillLevel = 1 | 2 | 3 | 4 | 5;

type Skill = {
  id: string;
  name: string;
  category: "language" | "product" | "technical" | "soft_skill";
  description: string;
  agentsWithSkill: number;
  avgProficiency: number;
  isActive: boolean;
};

type AgentSkill = {
  skillId: string;
  skillName: string;
  proficiency: SkillLevel;
  certified: boolean;
  lastAssessed?: string;
};

type Agent = {
  id: string;
  name: string;
  extension: string;
  skills: AgentSkill[];
  totalSkills: number;
  avgProficiency: number;
};

type RoutingRule = {
  id: string;
  name: string;
  queue: string;
  requiredSkills: { skillId: string; skillName: string; minProficiency: SkillLevel }[];
  preferredSkills: { skillId: string; skillName: string }[];
  priority: number;
  matchingAgents: number;
  isActive: boolean;
};

const mockSkills: Skill[] = [
  { id: "skill_1", name: "English", category: "language", description: "English language proficiency", agentsWithSkill: 25, avgProficiency: 4.2, isActive: true },
  { id: "skill_2", name: "Spanish", category: "language", description: "Spanish language proficiency", agentsWithSkill: 12, avgProficiency: 3.8, isActive: true },
  { id: "skill_3", name: "French", category: "language", description: "French language proficiency", agentsWithSkill: 5, avgProficiency: 4.0, isActive: true },
  { id: "skill_4", name: "Enterprise Support", category: "product", description: "Enterprise product expertise", agentsWithSkill: 8, avgProficiency: 4.5, isActive: true },
  { id: "skill_5", name: "Basic Support", category: "product", description: "Basic product support", agentsWithSkill: 20, avgProficiency: 4.1, isActive: true },
  { id: "skill_6", name: "Billing", category: "technical", description: "Billing and invoicing expertise", agentsWithSkill: 10, avgProficiency: 4.3, isActive: true },
  { id: "skill_7", name: "Technical Troubleshooting", category: "technical", description: "Advanced technical support", agentsWithSkill: 15, avgProficiency: 3.9, isActive: true },
  { id: "skill_8", name: "Sales Closing", category: "soft_skill", description: "Sales closing techniques", agentsWithSkill: 6, avgProficiency: 4.7, isActive: true },
];

const mockRules: RoutingRule[] = [
  {
    id: "rule_1",
    name: "Enterprise Support Queue",
    queue: "Enterprise",
    requiredSkills: [
      { skillId: "skill_4", skillName: "Enterprise Support", minProficiency: 4 },
      { skillId: "skill_1", skillName: "English", minProficiency: 3 },
    ],
    preferredSkills: [
      { skillId: "skill_6", skillName: "Billing" },
    ],
    priority: 1,
    matchingAgents: 5,
    isActive: true,
  },
  {
    id: "rule_2",
    name: "Spanish Support",
    queue: "General Support",
    requiredSkills: [
      { skillId: "skill_2", skillName: "Spanish", minProficiency: 4 },
      { skillId: "skill_5", skillName: "Basic Support", minProficiency: 3 },
    ],
    preferredSkills: [],
    priority: 2,
    matchingAgents: 8,
    isActive: true,
  },
  {
    id: "rule_3",
    name: "Sales Inquiries",
    queue: "Sales",
    requiredSkills: [
      { skillId: "skill_8", skillName: "Sales Closing", minProficiency: 3 },
    ],
    preferredSkills: [
      { skillId: "skill_4", skillName: "Enterprise Support" },
    ],
    priority: 3,
    matchingAgents: 6,
    isActive: true,
  },
];

const getCategoryIcon = (category: Skill["category"]) => {
  switch (category) {
    case "language":
      return <Languages className="h-4 w-4" />;
    case "product":
      return <Layers className="h-4 w-4" />;
    case "technical":
      return <Settings className="h-4 w-4" />;
    case "soft_skill":
      return <Headphones className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: Skill["category"]) => {
  switch (category) {
    case "language":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "product":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "technical":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    case "soft_skill":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  }
};

const renderProficiencyStars = (level: SkillLevel, size: "sm" | "md" = "sm") => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} ${
            star <= level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export function SkillsRouting() {
  const [skills, setSkills] = useState(mockSkills);
  const [rules, setRules] = useState(mockRules);
  const [activeTab, setActiveTab] = useState<"skills" | "rules">("skills");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalSkills: skills.length,
    activeSkills: skills.filter((s) => s.isActive).length,
    totalRules: rules.length,
    activeRules: rules.filter((r) => r.isActive).length,
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
                  <Award className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Skills</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.totalSkills}</p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Skills</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.activeSkills}</p>
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
                  <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Routing Rules</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.totalRules}</p>
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
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Rules</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.activeRules}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "skills" ? "default" : "outline"}
            onClick={() => setActiveTab("skills")}
            className={activeTab === "skills" ? "btn-primary" : ""}
          >
            <Award className="h-4 w-4 mr-2" />
            Skills Library
          </Button>
          <Button
            variant={activeTab === "rules" ? "default" : "outline"}
            onClick={() => setActiveTab("rules")}
            className={activeTab === "rules" ? "btn-primary" : ""}
          >
            <Layers className="h-4 w-4 mr-2" />
            Routing Rules
          </Button>
        </div>
        <Button className="btn-primary gap-2" onClick={() => activeTab === "skills" ? setShowAddSkill(true) : setShowAddRule(true)}>
          <Plus className="h-4 w-4" />
          {activeTab === "skills" ? "Add Skill" : "Add Rule"}
        </Button>
      </div>

      {/* Search */}
      {activeTab === "skills" && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="pl-9"
          />
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === "skills" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={!skill.isActive ? "opacity-60" : ""}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryColor(skill.category)}`}>
                        {getCategoryIcon(skill.category)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1E3A5F] dark:text-white">{skill.name}</h4>
                        <Badge variant="outline" className="text-xs capitalize mt-1">
                          {skill.category.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={skill.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                      {skill.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">{skill.description}</p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500">Agents</p>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-semibold text-[#1E3A5F] dark:text-white">
                          {skill.agentsWithSkill}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg Level</p>
                      <div className="flex items-center gap-1">
                        {renderProficiencyStars(Math.round(skill.avgProficiency) as SkillLevel)}
                        <span className="text-xs text-gray-500 ml-1">({skill.avgProficiency.toFixed(1)})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
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
      )}

      {/* Rules Tab */}
      {activeTab === "rules" && (
        <div className="space-y-4">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={!rule.isActive ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[#1E3A5F] dark:text-white">{rule.name}</h4>
                        <Badge variant="outline">Priority {rule.priority}</Badge>
                        <Badge className={rule.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {rule.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">Queue: {rule.queue}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-[#1E3A5F] dark:text-white mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Required Skills
                      </h5>
                      <div className="space-y-2">
                        {rule.requiredSkills.map((skill) => (
                          <div key={skill.skillId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-sm">{skill.skillName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Min:</span>
                              {renderProficiencyStars(skill.minProficiency)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-[#1E3A5F] dark:text-white mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Preferred Skills (Bonus)
                      </h5>
                      <div className="space-y-2">
                        {rule.preferredSkills.length > 0 ? (
                          rule.preferredSkills.map((skill) => (
                            <div key={skill.skillId} className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="text-sm">{skill.skillName}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400">No preferred skills configured</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-gray-500">{rule.matchingAgents} agents match this rule</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Matching Agents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Skill Dialog */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Add New Skill
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Skill Name</label>
                    <Input placeholder="e.g., Portuguese" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <option value="language">Language</option>
                      <option value="product">Product</option>
                      <option value="technical">Technical</option>
                      <option value="soft_skill">Soft Skill</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input placeholder="Brief description of this skill" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowAddSkill(false)}>Cancel</Button>
                  <Button className="btn-primary">Add Skill</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

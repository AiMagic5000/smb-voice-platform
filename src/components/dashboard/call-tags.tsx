"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  GripVertical,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Phone,
  TrendingUp,
  BarChart3,
  Palette,
  Hash,
  Settings,
  Copy,
  Archive,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CallTag {
  id: string;
  name: string;
  color: string;
  category: string;
  description: string;
  isSystem: boolean;
  usageCount: number;
  lastUsed: string;
  createdAt: string;
  shortcut?: string;
}

interface TagCategory {
  id: string;
  name: string;
  description: string;
  tags: CallTag[];
  isExpanded: boolean;
}

const colorOptions = [
  { name: "Red", value: "#EF4444", bg: "bg-red-500" },
  { name: "Orange", value: "#F97316", bg: "bg-orange-500" },
  { name: "Amber", value: "#F59E0B", bg: "bg-amber-500" },
  { name: "Yellow", value: "#EAB308", bg: "bg-yellow-500" },
  { name: "Lime", value: "#84CC16", bg: "bg-lime-500" },
  { name: "Green", value: "#22C55E", bg: "bg-green-500" },
  { name: "Emerald", value: "#10B981", bg: "bg-emerald-500" },
  { name: "Teal", value: "#14B8A6", bg: "bg-teal-500" },
  { name: "Cyan", value: "#06B6D4", bg: "bg-cyan-500" },
  { name: "Sky", value: "#0EA5E9", bg: "bg-sky-500" },
  { name: "Blue", value: "#3B82F6", bg: "bg-blue-500" },
  { name: "Indigo", value: "#6366F1", bg: "bg-indigo-500" },
  { name: "Violet", value: "#8B5CF6", bg: "bg-violet-500" },
  { name: "Purple", value: "#A855F7", bg: "bg-purple-500" },
  { name: "Fuchsia", value: "#D946EF", bg: "bg-fuchsia-500" },
  { name: "Pink", value: "#EC4899", bg: "bg-pink-500" },
  { name: "Rose", value: "#F43F5E", bg: "bg-rose-500" },
  { name: "Gray", value: "#6B7280", bg: "bg-gray-500" },
];

const mockTags: CallTag[] = [
  // Call Outcome
  {
    id: "1",
    name: "Sale Completed",
    color: "#22C55E",
    category: "Call Outcome",
    description: "Customer made a purchase during the call",
    isSystem: false,
    usageCount: 1456,
    lastUsed: "2024-01-15T14:30:00Z",
    createdAt: "2023-06-01T10:00:00Z",
    shortcut: "S",
  },
  {
    id: "2",
    name: "Appointment Set",
    color: "#3B82F6",
    category: "Call Outcome",
    description: "Scheduled a follow-up appointment",
    isSystem: false,
    usageCount: 892,
    lastUsed: "2024-01-15T13:45:00Z",
    createdAt: "2023-06-01T10:00:00Z",
    shortcut: "A",
  },
  {
    id: "3",
    name: "Not Interested",
    color: "#EF4444",
    category: "Call Outcome",
    description: "Customer declined the offer",
    isSystem: false,
    usageCount: 2134,
    lastUsed: "2024-01-15T14:15:00Z",
    createdAt: "2023-06-01T10:00:00Z",
    shortcut: "N",
  },
  {
    id: "4",
    name: "Callback Requested",
    color: "#F59E0B",
    category: "Call Outcome",
    description: "Customer requested a callback",
    isSystem: false,
    usageCount: 567,
    lastUsed: "2024-01-15T12:00:00Z",
    createdAt: "2023-06-01T10:00:00Z",
    shortcut: "C",
  },
  // Customer Type
  {
    id: "5",
    name: "VIP Customer",
    color: "#A855F7",
    category: "Customer Type",
    description: "High-value or priority customer",
    isSystem: true,
    usageCount: 234,
    lastUsed: "2024-01-15T11:30:00Z",
    createdAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "6",
    name: "New Customer",
    color: "#06B6D4",
    category: "Customer Type",
    description: "First-time caller or new account",
    isSystem: true,
    usageCount: 1890,
    lastUsed: "2024-01-15T14:00:00Z",
    createdAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "7",
    name: "Existing Customer",
    color: "#6366F1",
    category: "Customer Type",
    description: "Returning customer with history",
    isSystem: true,
    usageCount: 4567,
    lastUsed: "2024-01-15T14:25:00Z",
    createdAt: "2023-01-01T10:00:00Z",
  },
  // Issue Type
  {
    id: "8",
    name: "Billing Issue",
    color: "#F97316",
    category: "Issue Type",
    description: "Payment or invoice related",
    isSystem: false,
    usageCount: 789,
    lastUsed: "2024-01-15T10:30:00Z",
    createdAt: "2023-07-15T10:00:00Z",
  },
  {
    id: "9",
    name: "Technical Support",
    color: "#0EA5E9",
    category: "Issue Type",
    description: "Technical or product issues",
    isSystem: false,
    usageCount: 1234,
    lastUsed: "2024-01-15T13:00:00Z",
    createdAt: "2023-07-15T10:00:00Z",
  },
  {
    id: "10",
    name: "Complaint",
    color: "#EF4444",
    category: "Issue Type",
    description: "Customer complaint or escalation",
    isSystem: false,
    usageCount: 456,
    lastUsed: "2024-01-15T09:45:00Z",
    createdAt: "2023-07-15T10:00:00Z",
  },
  // Sentiment
  {
    id: "11",
    name: "Positive",
    color: "#22C55E",
    category: "Sentiment",
    description: "Customer had positive experience",
    isSystem: true,
    usageCount: 3456,
    lastUsed: "2024-01-15T14:20:00Z",
    createdAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "12",
    name: "Neutral",
    color: "#6B7280",
    category: "Sentiment",
    description: "Customer experience was neutral",
    isSystem: true,
    usageCount: 2345,
    lastUsed: "2024-01-15T14:10:00Z",
    createdAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "13",
    name: "Negative",
    color: "#EF4444",
    category: "Sentiment",
    description: "Customer had negative experience",
    isSystem: true,
    usageCount: 567,
    lastUsed: "2024-01-15T11:00:00Z",
    createdAt: "2023-01-01T10:00:00Z",
  },
  // Priority
  {
    id: "14",
    name: "Urgent",
    color: "#EF4444",
    category: "Priority",
    description: "Requires immediate attention",
    isSystem: true,
    usageCount: 234,
    lastUsed: "2024-01-15T10:00:00Z",
    createdAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "15",
    name: "High Priority",
    color: "#F97316",
    category: "Priority",
    description: "Should be addressed soon",
    isSystem: true,
    usageCount: 456,
    lastUsed: "2024-01-15T12:30:00Z",
    createdAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "16",
    name: "Normal",
    color: "#3B82F6",
    category: "Priority",
    description: "Standard priority level",
    isSystem: true,
    usageCount: 5678,
    lastUsed: "2024-01-15T14:30:00Z",
    createdAt: "2023-01-01T10:00:00Z",
  },
];

export function CallTags() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Call Outcome": true,
    "Customer Type": true,
    "Issue Type": true,
    Sentiment: false,
    Priority: false,
  });
  const [newTag, setNewTag] = useState({
    name: "",
    color: "#3B82F6",
    category: "Call Outcome",
    description: "",
    shortcut: "",
  });

  const categories = [...new Set(mockTags.map((t) => t.category))];

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredTags = mockTags.filter(
    (tag) =>
      searchQuery === "" ||
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tagsByCategory = categories.map((category) => ({
    name: category,
    tags: filteredTags.filter((t) => t.category === category),
  }));

  const totalTags = mockTags.length;
  const totalUsage = mockTags.reduce((sum, t) => sum + t.usageCount, 0);
  const systemTags = mockTags.filter((t) => t.isSystem).length;
  const customTags = mockTags.filter((t) => !t.isSystem).length;

  const getColorStyle = (color: string) => ({
    backgroundColor: color,
  });

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
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Tags</p>
          <p className="text-3xl font-bold text-gray-900">{totalTags}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="h-4 w-4" />
              +15%
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Usage</p>
          <p className="text-3xl font-bold text-gray-900">{totalUsage.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Settings className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Custom Tags</p>
          <p className="text-3xl font-bold text-gray-900">
            {customTags}
            <span className="text-sm text-gray-500 font-normal ml-1">
              ({systemTags} system)
            </span>
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-200">
        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tags..."
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
              Create Tag
            </button>
          </div>
        </div>

        {/* Tags by Category */}
        <div className="p-6">
          <div className="space-y-4">
            {tagsByCategory.map((category) => (
              <div
                key={category.name}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs">
                      {category.tags.length} tags
                    </span>
                  </div>
                  {expandedCategories[category.name] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedCategories[category.name] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-4 space-y-2">
                        {category.tags.map((tag) => (
                          <div
                            key={tag.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="cursor-grab p-1 hover:bg-gray-200 rounded">
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={getColorStyle(tag.color)}
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">{tag.name}</span>
                                  {tag.isSystem && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                      System
                                    </span>
                                  )}
                                  {tag.shortcut && (
                                    <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded font-mono">
                                      ⌘{tag.shortcut}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{tag.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Usage</p>
                                <p className="font-semibold text-gray-900">
                                  {tag.usageCount.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                  <Edit2 className="h-4 w-4 text-gray-400" />
                                </button>
                                {!tag.isSystem && (
                                  <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                    <Trash2 className="h-4 w-4 text-gray-400" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Used Tags */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Tags</h3>
        <div className="flex flex-wrap gap-3">
          {[...mockTags]
            .sort((a, b) => b.usageCount - a.usageCount)
            .slice(0, 10)
            .map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={getColorStyle(tag.color)}
                />
                <span className="font-medium text-gray-900">{tag.name}</span>
                <span className="text-sm text-gray-500">
                  {tag.usageCount.toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Create Tag Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Tag</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tag Name *
                  </label>
                  <input
                    type="text"
                    value={newTag.name}
                    onChange={(e) => setNewTag((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Follow-up Required"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTag.category}
                    onChange={(e) => setNewTag((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="new">+ Create new category</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewTag((prev) => ({ ...prev, color: color.value }))}
                        className={cn(
                          "w-8 h-8 rounded-lg transition-all",
                          color.bg,
                          newTag.color === color.value && "ring-2 ring-offset-2 ring-gray-400"
                        )}
                        title={color.name}
                      >
                        {newTag.color === color.value && (
                          <Check className="h-4 w-4 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTag.description}
                    onChange={(e) =>
                      setNewTag((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe when this tag should be used..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keyboard Shortcut (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">⌘</span>
                    <input
                      type="text"
                      value={newTag.shortcut}
                      onChange={(e) =>
                        setNewTag((prev) => ({
                          ...prev,
                          shortcut: e.target.value.toUpperCase().slice(0, 1),
                        }))
                      }
                      placeholder="e.g., S"
                      maxLength={1}
                      className="w-16 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] text-center font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTag({
                      name: "",
                      color: "#3B82F6",
                      category: "Call Outcome",
                      description: "",
                      shortcut: "",
                    });
                  }}
                  className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors"
                >
                  Create Tag
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

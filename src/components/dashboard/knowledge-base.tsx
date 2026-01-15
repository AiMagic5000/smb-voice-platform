"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Folder,
  FileText,
  Star,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Filter,
  Tag,
  Users,
  TrendingUp,
  BookMarked,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ArticleStatus = "published" | "draft" | "archived";
type ArticleCategory = "troubleshooting" | "product" | "policy" | "sales" | "technical" | "general";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
  color: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: ArticleCategory;
  tags: string[];
  status: ArticleStatus;
  author: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  isFeatured: boolean;
  relatedArticles: string[];
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    icon: "🔧",
    articleCount: 24,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "2",
    name: "Product Knowledge",
    description: "Features and capabilities",
    icon: "📦",
    articleCount: 18,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "3",
    name: "Company Policies",
    description: "Procedures and guidelines",
    icon: "📋",
    articleCount: 12,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "4",
    name: "Sales Scripts",
    description: "Talking points and responses",
    icon: "💬",
    articleCount: 15,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "5",
    name: "Technical Docs",
    description: "System and API documentation",
    icon: "⚙️",
    articleCount: 32,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "6",
    name: "General Info",
    description: "FAQs and general information",
    icon: "ℹ️",
    articleCount: 20,
    color: "bg-gray-100 text-gray-700",
  },
];

const mockArticles: Article[] = [
  {
    id: "1",
    title: "How to Reset Customer Password",
    slug: "reset-customer-password",
    content: `# Password Reset Process

## Overview
Follow these steps to help customers reset their passwords safely and securely.

## Steps
1. Verify customer identity using security questions
2. Navigate to Customer Account > Security
3. Click "Initiate Password Reset"
4. Have customer check email for reset link
5. Confirm reset was successful

## Important Notes
- Reset links expire after 24 hours
- Customers can only request 3 resets per day
- Document all reset requests in the ticket`,
    summary: "Step-by-step guide for helping customers reset their account passwords",
    category: "troubleshooting",
    tags: ["password", "security", "account"],
    status: "published",
    author: "Admin",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-10T14:00:00Z",
    viewCount: 1456,
    helpfulCount: 89,
    notHelpfulCount: 3,
    isFeatured: true,
    relatedArticles: ["2", "5"],
  },
  {
    id: "2",
    title: "Billing Dispute Resolution Process",
    slug: "billing-dispute-process",
    content: `# Billing Disputes

## When to Use
Use this process when customers dispute charges on their account.

## Steps
1. Listen to customer concern completely
2. Pull up billing history for last 6 months
3. Identify the disputed charges
4. Check for any system errors or duplicate charges
5. Follow resolution matrix below

## Resolution Matrix
- Duplicate charge: Immediate refund
- Service not received: Investigate, refund if confirmed
- Wrong amount: Adjust to correct amount
- General dispute: Escalate to billing team`,
    summary: "Process for handling and resolving customer billing disputes",
    category: "policy",
    tags: ["billing", "dispute", "refund"],
    status: "published",
    author: "Finance Team",
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
    viewCount: 892,
    helpfulCount: 67,
    notHelpfulCount: 5,
    isFeatured: true,
    relatedArticles: ["1"],
  },
  {
    id: "3",
    title: "Enterprise Plan Features Overview",
    slug: "enterprise-plan-features",
    content: `# Enterprise Plan

## Included Features
- Unlimited users
- 24/7 priority support
- Custom integrations
- Dedicated account manager
- Advanced analytics
- SSO authentication
- Custom SLA

## Pricing
Starting at $499/month (annual commitment required)

## Upsell Opportunities
- Additional storage
- Premium support package
- Professional services`,
    summary: "Complete overview of Enterprise plan features and benefits",
    category: "product",
    tags: ["enterprise", "features", "pricing"],
    status: "published",
    author: "Sales Team",
    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-01-08T10:00:00Z",
    viewCount: 567,
    helpfulCount: 45,
    notHelpfulCount: 2,
    isFeatured: false,
    relatedArticles: [],
  },
  {
    id: "4",
    title: "Handling Angry Customers",
    slug: "angry-customer-handling",
    content: `# De-escalation Techniques

## Key Principles
1. Stay calm and professional
2. Listen actively without interrupting
3. Acknowledge their frustration
4. Focus on solutions, not blame
5. Follow up to ensure resolution

## Phrases to Use
- "I understand your frustration"
- "Let me help you resolve this"
- "I apologize for the inconvenience"
- "Here's what I can do..."

## When to Escalate
- Customer uses abusive language
- Requests supervisor specifically
- Issue requires manager approval`,
    summary: "Techniques for de-escalating situations with upset customers",
    category: "sales",
    tags: ["customer-service", "de-escalation", "soft-skills"],
    status: "published",
    author: "Training Team",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    viewCount: 2134,
    helpfulCount: 156,
    notHelpfulCount: 8,
    isFeatured: true,
    relatedArticles: ["2"],
  },
  {
    id: "5",
    title: "API Rate Limits and Error Codes",
    slug: "api-rate-limits",
    content: `# API Reference

## Rate Limits
- Standard: 100 requests/minute
- Premium: 500 requests/minute
- Enterprise: 2000 requests/minute

## Common Error Codes
| Code | Meaning | Solution |
|------|---------|----------|
| 429 | Rate limited | Wait and retry |
| 401 | Unauthorized | Check API key |
| 500 | Server error | Contact support |`,
    summary: "Technical documentation for API rate limits and error handling",
    category: "technical",
    tags: ["api", "technical", "errors"],
    status: "published",
    author: "Dev Team",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
    viewCount: 345,
    helpfulCount: 28,
    notHelpfulCount: 1,
    isFeatured: false,
    relatedArticles: [],
  },
];

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "featured" | "recent">("browse");

  const getCategoryBadge = (category: ArticleCategory) => {
    switch (category) {
      case "troubleshooting":
        return "bg-red-100 text-red-700";
      case "product":
        return "bg-blue-100 text-blue-700";
      case "policy":
        return "bg-purple-100 text-purple-700";
      case "sales":
        return "bg-green-100 text-green-700";
      case "technical":
        return "bg-orange-100 text-orange-700";
      case "general":
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      !selectedCategory ||
      article.category ===
        mockCategories.find((c) => c.id === selectedCategory)?.name.toLowerCase().replace(" ", "_");
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = mockArticles.filter((a) => a.isFeatured);
  const recentArticles = [...mockArticles].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const totalViews = mockArticles.reduce((sum, a) => sum + a.viewCount, 0);
  const totalArticles = mockArticles.length;
  const avgHelpfulness =
    mockArticles.reduce((sum, a) => sum + a.helpfulCount / (a.helpfulCount + a.notHelpfulCount || 1), 0) /
    totalArticles *
    100;

  if (selectedArticle) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Knowledge Base
        </button>

        {/* Article Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                    getCategoryBadge(selectedArticle.category)
                  )}
                >
                  {selectedArticle.category}
                </span>
                {selectedArticle.isFeatured && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedArticle.title}</h1>
              <p className="text-gray-500 mt-2">{selectedArticle.summary}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Copy className="h-5 w-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit2 className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {selectedArticle.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Updated {new Date(selectedArticle.updatedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {selectedArticle.viewCount.toLocaleString()} views
            </span>
          </div>

          {/* Article body */}
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">{selectedArticle.content}</div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-200">
            <Tag className="h-4 w-4 text-gray-400" />
            {selectedArticle.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Feedback */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Was this article helpful?</p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">Yes ({selectedArticle.helpfulCount})</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors">
                <ThumbsDown className="h-4 w-4 text-red-600" />
                <span className="text-sm">No ({selectedArticle.notHelpfulCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Articles</p>
          <p className="text-3xl font-bold text-gray-900">{totalArticles}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="h-4 w-4" />
              +12%
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Featured Articles</p>
          <p className="text-3xl font-bold text-gray-900">{featuredArticles.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <ThumbsUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Helpfulness Rate</p>
          <p className="text-3xl font-bold text-gray-900">{avgHelpfulness.toFixed(0)}%</p>
        </motion.div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, tags, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
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
            New Article
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "browse", label: "Browse", icon: Folder },
            { id: "featured", label: "Featured", icon: Star },
            { id: "recent", label: "Recently Updated", icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "browse" | "featured" | "recent")}
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

        {activeTab === "browse" && (
          <>
            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {mockCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category.id ? null : category.id)
                  }
                  className={cn(
                    "p-4 rounded-xl border transition-all text-left",
                    selectedCategory === category.id
                      ? "border-[#1E3A5F] ring-2 ring-[#1E3A5F]/20"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.articleCount} articles</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Articles List */}
        <div className="space-y-3">
          {(activeTab === "featured"
            ? featuredArticles
            : activeTab === "recent"
              ? recentArticles
              : filteredArticles
          ).map((article) => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="w-full p-4 border border-gray-200 rounded-xl hover:border-[#1E3A5F]/30 transition-colors text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                        getCategoryBadge(article.category)
                      )}
                    >
                      {article.category}
                    </span>
                    {article.isFeatured && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.viewCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {article.helpfulCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
              </div>
            </button>
          ))}

          {filteredArticles.length === 0 && activeTab === "browse" && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No articles found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

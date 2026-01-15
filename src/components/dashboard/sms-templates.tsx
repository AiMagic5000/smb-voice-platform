"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Search,
  Tag,
  Clock,
  Zap,
  FileText,
  Calendar,
  Phone,
  User,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  category: "appointment" | "follow-up" | "greeting" | "reminder" | "custom";
  variables: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// Mock templates
const mockTemplates: SMSTemplate[] = [
  {
    id: "1",
    name: "Appointment Reminder",
    content:
      "Hi {{first_name}}, this is a reminder about your appointment at {{business_name}} on {{appointment_date}} at {{appointment_time}}. Reply CONFIRM to confirm or call us at {{phone_number}} to reschedule.",
    category: "reminder",
    variables: [
      "first_name",
      "business_name",
      "appointment_date",
      "appointment_time",
      "phone_number",
    ],
    usageCount: 342,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Missed Call Follow-up",
    content:
      "Hi {{first_name}}, we missed your call at {{business_name}}. How can we help you today? Reply to this message or call us back at {{phone_number}}.",
    category: "follow-up",
    variables: ["first_name", "business_name", "phone_number"],
    usageCount: 156,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-12T09:15:00Z",
  },
  {
    id: "3",
    name: "New Customer Welcome",
    content:
      "Welcome to {{business_name}}, {{first_name}}! We're excited to have you. Save this number to reach us anytime. Reply HELP for assistance.",
    category: "greeting",
    variables: ["first_name", "business_name"],
    usageCount: 89,
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "4",
    name: "Appointment Confirmation",
    content:
      "Your appointment at {{business_name}} is confirmed for {{appointment_date}} at {{appointment_time}}. See you then! - {{agent_name}}",
    category: "appointment",
    variables: [
      "business_name",
      "appointment_date",
      "appointment_time",
      "agent_name",
    ],
    usageCount: 234,
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-14T11:45:00Z",
  },
  {
    id: "5",
    name: "Thank You Message",
    content:
      "Thank you for choosing {{business_name}}, {{first_name}}! We appreciate your business. Have a great day!",
    category: "follow-up",
    variables: ["first_name", "business_name"],
    usageCount: 178,
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-13T16:30:00Z",
  },
];

const categoryConfig = {
  appointment: {
    label: "Appointment",
    icon: Calendar,
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  "follow-up": {
    label: "Follow-up",
    icon: Phone,
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  greeting: {
    label: "Greeting",
    icon: User,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  reminder: {
    label: "Reminder",
    icon: Clock,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  custom: {
    label: "Custom",
    icon: FileText,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
};

const availableVariables = [
  { name: "first_name", description: "Contact's first name", icon: User },
  { name: "last_name", description: "Contact's last name", icon: User },
  { name: "business_name", description: "Your business name", icon: Building },
  { name: "phone_number", description: "Your phone number", icon: Phone },
  { name: "appointment_date", description: "Appointment date", icon: Calendar },
  { name: "appointment_time", description: "Appointment time", icon: Clock },
  { name: "agent_name", description: "Agent's name", icon: User },
];

export function SMSTemplates() {
  const [templates, setTemplates] = useState<SMSTemplate[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(
    null
  );
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    content: "",
    category: "custom" as SMSTemplate["category"],
  });

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (template: SMSTemplate) => {
    navigator.clipboard.writeText(template.content);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) return;

    const newId = Date.now().toString();
    setTemplates([
      ...templates,
      {
        id: newId,
        name: newTemplate.name,
        content: newTemplate.content,
        category: newTemplate.category,
        variables: extractVariables(newTemplate.content),
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    setShowNewTemplate(false);
    setNewTemplate({ name: "", content: "", category: "custom" });
  };

  const handleInsertVariable = (variableName: string) => {
    const variable = `{{${variableName}}}`;
    setNewTemplate({
      ...newTemplate,
      content: newTemplate.content + variable,
    });
  };

  const charCount = newTemplate.content.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            SMS Templates
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create and manage reusable message templates
          </p>
        </div>
        <Button
          onClick={() => setShowNewTemplate(true)}
          className="btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={cn(
              selectedCategory === null && "bg-[#1E3A5F] hover:bg-[#2d4a6f]"
            )}
          >
            All
          </Button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className={cn(
                "gap-1",
                selectedCategory === key && "bg-[#1E3A5F] hover:bg-[#2d4a6f]",
                "dark:border-gray-700"
              )}
            >
              <config.icon className="h-3 w-3" />
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* New Template Form */}
      {showNewTemplate && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Create New Template
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Name
              </label>
              <Input
                value={newTemplate.name}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, name: e.target.value })
                }
                placeholder="Enter template name..."
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={newTemplate.category}
                onChange={(e) =>
                  setNewTemplate({
                    ...newTemplate,
                    category: e.target.value as SMSTemplate["category"],
                  })
                }
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="appointment">Appointment</option>
                <option value="follow-up">Follow-up</option>
                <option value="greeting">Greeting</option>
                <option value="reminder">Reminder</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message Content
            </label>
            <textarea
              value={newTemplate.content}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, content: e.target.value })
              }
              placeholder="Type your message... Use {{variable_name}} for dynamic content"
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {charCount} characters • {smsSegments} SMS segment
                {smsSegments !== 1 ? "s" : ""}
              </span>
              <span className={charCount > 160 ? "text-amber-500" : ""}>
                {charCount > 160 && "Multiple segments will be sent"}
              </span>
            </div>
          </div>

          {/* Variable Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Insert Variable
            </label>
            <div className="flex flex-wrap gap-2">
              {availableVariables.map((variable) => (
                <button
                  key={variable.name}
                  onClick={() => handleInsertVariable(variable.name)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title={variable.description}
                >
                  <variable.icon className="h-3 w-3" />
                  {`{{${variable.name}}}`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleSaveTemplate} className="btn-primary">
              Save Template
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewTemplate(false);
                setNewTemplate({ name: "", content: "", category: "custom" });
              }}
              className="dark:border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="space-y-3">
        {filteredTemplates.map((template) => {
          const config = categoryConfig[template.category];
          const CategoryIcon = config.icon;

          return (
            <div
              key={template.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                        config.color
                      )}
                    >
                      <CategoryIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {template.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {template.usageCount} uses
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {template.variables.length} variables
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(template)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {copiedId === template.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No templates found</p>
            <p className="text-sm mt-1">
              {searchQuery || selectedCategory
                ? "Try adjusting your filters"
                : "Create your first template to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {templates.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Templates
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {templates.reduce((sum, t) => sum + t.usageCount, 0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Uses</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(
              templates.reduce((sum, t) => sum + t.usageCount, 0) /
                templates.length
            )}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Avg. Uses/Template
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Object.keys(categoryConfig).length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
        </div>
      </div>
    </div>
  );
}

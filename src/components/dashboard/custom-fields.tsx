"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  List,
  Mail,
  Phone,
  Link,
  FileText,
  CheckSquare,
  User,
  Briefcase,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "multi_select"
  | "email"
  | "phone"
  | "url"
  | "textarea"
  | "currency";

type EntityType = "contact" | "call" | "lead" | "organization";

interface CustomField {
  id: string;
  name: string;
  key: string;
  type: FieldType;
  entityType: EntityType;
  description: string;
  required: boolean;
  visible: boolean;
  searchable: boolean;
  options?: string[];
  defaultValue?: string;
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  order: number;
  createdAt: string;
  usageCount: number;
}

const fieldTypeOptions: { value: FieldType; label: string; icon: React.ElementType }[] = [
  { value: "text", label: "Text", icon: Type },
  { value: "number", label: "Number", icon: Hash },
  { value: "date", label: "Date", icon: Calendar },
  { value: "boolean", label: "Yes/No", icon: ToggleLeft },
  { value: "select", label: "Dropdown", icon: List },
  { value: "multi_select", label: "Multi-Select", icon: CheckSquare },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "url", label: "URL", icon: Link },
  { value: "textarea", label: "Long Text", icon: FileText },
  { value: "currency", label: "Currency", icon: Hash },
];

const entityTypeOptions: { value: EntityType; label: string; icon: React.ElementType }[] = [
  { value: "contact", label: "Contacts", icon: User },
  { value: "call", label: "Calls", icon: Phone },
  { value: "lead", label: "Leads", icon: Briefcase },
  { value: "organization", label: "Organizations", icon: Briefcase },
];

const mockCustomFields: CustomField[] = [
  {
    id: "1",
    name: "Customer ID",
    key: "customer_id",
    type: "text",
    entityType: "contact",
    description: "Unique customer identifier from CRM",
    required: false,
    visible: true,
    searchable: true,
    placeholder: "Enter customer ID",
    order: 1,
    createdAt: "2024-01-01T10:00:00Z",
    usageCount: 1247,
  },
  {
    id: "2",
    name: "Account Type",
    key: "account_type",
    type: "select",
    entityType: "contact",
    description: "Customer account classification",
    required: true,
    visible: true,
    searchable: true,
    options: ["Standard", "Premium", "Enterprise", "VIP"],
    defaultValue: "Standard",
    order: 2,
    createdAt: "2024-01-02T10:00:00Z",
    usageCount: 1156,
  },
  {
    id: "3",
    name: "Contract Value",
    key: "contract_value",
    type: "currency",
    entityType: "contact",
    description: "Total contract value in USD",
    required: false,
    visible: true,
    searchable: false,
    validation: { min: 0 },
    order: 3,
    createdAt: "2024-01-03T10:00:00Z",
    usageCount: 892,
  },
  {
    id: "4",
    name: "Renewal Date",
    key: "renewal_date",
    type: "date",
    entityType: "contact",
    description: "Contract renewal date",
    required: false,
    visible: true,
    searchable: true,
    order: 4,
    createdAt: "2024-01-04T10:00:00Z",
    usageCount: 756,
  },
  {
    id: "5",
    name: "Call Reason",
    key: "call_reason",
    type: "select",
    entityType: "call",
    description: "Primary reason for the call",
    required: true,
    visible: true,
    searchable: true,
    options: ["Support", "Sales", "Billing", "Technical", "General Inquiry", "Complaint"],
    order: 1,
    createdAt: "2024-01-05T10:00:00Z",
    usageCount: 3456,
  },
  {
    id: "6",
    name: "Issue Resolved",
    key: "issue_resolved",
    type: "boolean",
    entityType: "call",
    description: "Was the caller's issue resolved?",
    required: true,
    visible: true,
    searchable: true,
    order: 2,
    createdAt: "2024-01-06T10:00:00Z",
    usageCount: 3421,
  },
  {
    id: "7",
    name: "Follow-up Required",
    key: "follow_up_required",
    type: "boolean",
    entityType: "call",
    description: "Does this call need follow-up?",
    required: false,
    visible: true,
    searchable: true,
    order: 3,
    createdAt: "2024-01-07T10:00:00Z",
    usageCount: 1234,
  },
  {
    id: "8",
    name: "Notes",
    key: "call_notes",
    type: "textarea",
    entityType: "call",
    description: "Additional notes about the call",
    required: false,
    visible: true,
    searchable: true,
    placeholder: "Enter call notes...",
    validation: { maxLength: 2000 },
    order: 4,
    createdAt: "2024-01-08T10:00:00Z",
    usageCount: 2890,
  },
  {
    id: "9",
    name: "Lead Source",
    key: "lead_source",
    type: "select",
    entityType: "lead",
    description: "Where the lead came from",
    required: true,
    visible: true,
    searchable: true,
    options: ["Website", "Referral", "Cold Call", "Trade Show", "Social Media", "Advertisement"],
    order: 1,
    createdAt: "2024-01-09T10:00:00Z",
    usageCount: 567,
  },
  {
    id: "10",
    name: "Industry",
    key: "industry",
    type: "select",
    entityType: "organization",
    description: "Company industry classification",
    required: false,
    visible: true,
    searchable: true,
    options: [
      "Technology",
      "Healthcare",
      "Finance",
      "Retail",
      "Manufacturing",
      "Education",
      "Other",
    ],
    order: 1,
    createdAt: "2024-01-10T10:00:00Z",
    usageCount: 234,
  },
];

export function CustomFields() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedField, setExpandedField] = useState<string | null>(null);

  // New field form state
  const [newField, setNewField] = useState({
    name: "",
    key: "",
    type: "text" as FieldType,
    entityType: "contact" as EntityType,
    description: "",
    required: false,
    visible: true,
    searchable: true,
    options: [] as string[],
    defaultValue: "",
    placeholder: "",
  });
  const [newOption, setNewOption] = useState("");

  const getFieldTypeIcon = (type: FieldType) => {
    const option = fieldTypeOptions.find((o) => o.value === type);
    return option?.icon || Type;
  };

  const getEntityBadge = (entity: EntityType) => {
    switch (entity) {
      case "contact":
        return "bg-blue-100 text-blue-700";
      case "call":
        return "bg-green-100 text-green-700";
      case "lead":
        return "bg-purple-100 text-purple-700";
      case "organization":
        return "bg-orange-100 text-orange-700";
    }
  };

  const filteredFields = mockCustomFields.filter((field) => {
    const matchesEntity = selectedEntity === "all" || field.entityType === selectedEntity;
    const matchesSearch =
      searchQuery === "" ||
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEntity && matchesSearch;
  });

  const fieldsByEntity = entityTypeOptions.map((entity) => ({
    ...entity,
    count: mockCustomFields.filter((f) => f.entityType === entity.value).length,
  }));

  const addOption = () => {
    if (newOption.trim()) {
      setNewField((prev) => ({
        ...prev,
        options: [...prev.options, newOption.trim()],
      }));
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    setNewField((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setSelectedEntity("all")}
          className={cn(
            "bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer transition-all",
            selectedEntity === "all" && "ring-2 ring-[#1E3A5F] border-[#1E3A5F]"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Database className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">All Fields</p>
          <p className="text-3xl font-bold text-gray-900">{mockCustomFields.length}</p>
        </motion.div>

        {fieldsByEntity.map((entity, index) => {
          const EntityIcon = entity.icon;
          return (
            <motion.div
              key={entity.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 1) * 0.1 }}
              onClick={() => setSelectedEntity(entity.value)}
              className={cn(
                "bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer transition-all",
                selectedEntity === entity.value && "ring-2 ring-[#1E3A5F] border-[#1E3A5F]"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    getEntityBadge(entity.value)
                  )}
                >
                  <EntityIcon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-gray-500">{entity.label}</p>
              <p className="text-3xl font-bold text-gray-900">{entity.count}</p>
            </motion.div>
          );
        })}
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
                  placeholder="Search fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Field
            </button>
          </div>
        </div>

        {/* Fields List */}
        <div className="p-6">
          <div className="space-y-3">
            {filteredFields.map((field) => {
              const FieldIcon = getFieldTypeIcon(field.type);
              const isExpanded = expandedField === field.id;
              return (
                <div
                  key={field.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedField(isExpanded ? null : field.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="cursor-grab p-1 hover:bg-gray-100 rounded">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FieldIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{field.name}</h3>
                            {field.required && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                                Required
                              </span>
                            )}
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                getEntityBadge(field.entityType)
                              )}
                            >
                              {field.entityType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {field.key}
                            </code>
                            <span className="text-xs text-gray-400">
                              {fieldTypeOptions.find((o) => o.value === field.type)?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {field.searchable && (
                            <span title="Searchable">
                              <Search className="h-4 w-4" />
                            </span>
                          )}
                          {field.visible ? (
                            <span title="Visible">
                              <Eye className="h-4 w-4" />
                            </span>
                          ) : (
                            <span title="Hidden">
                              <EyeOff className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Usage</p>
                          <p className="font-semibold text-gray-900">
                            {field.usageCount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
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
                        <div className="p-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                            <p className="text-sm text-gray-600">
                              {field.description || "No description provided"}
                            </p>
                          </div>
                          {field.options && field.options.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Options</p>
                              <div className="flex flex-wrap gap-1">
                                {field.options.map((option, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                                  >
                                    {option}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {field.defaultValue && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Default Value
                              </p>
                              <p className="text-sm text-gray-600">{field.defaultValue}</p>
                            </div>
                          )}
                          {field.placeholder && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Placeholder</p>
                              <p className="text-sm text-gray-600">{field.placeholder}</p>
                            </div>
                          )}
                          {field.validation && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Validation</p>
                              <div className="text-sm text-gray-600">
                                {field.validation.minLength && (
                                  <span>Min length: {field.validation.minLength} </span>
                                )}
                                {field.validation.maxLength && (
                                  <span>Max length: {field.validation.maxLength} </span>
                                )}
                                {field.validation.min !== undefined && (
                                  <span>Min: {field.validation.min} </span>
                                )}
                                {field.validation.max !== undefined && (
                                  <span>Max: {field.validation.max}</span>
                                )}
                              </div>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Created</p>
                            <p className="text-sm text-gray-600">
                              {new Date(field.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredFields.length === 0 && (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No custom fields found</p>
                <p className="text-sm text-gray-400">
                  Create a new field to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Field Modal */}
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
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Custom Field</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) =>
                      setNewField((prev) => ({
                        ...prev,
                        name: e.target.value,
                        key: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                      }))
                    }
                    placeholder="e.g., Customer ID"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Key</label>
                  <input
                    type="text"
                    value={newField.key}
                    onChange={(e) => setNewField((prev) => ({ ...prev, key: e.target.value }))}
                    placeholder="customer_id"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used in API and exports. Cannot be changed later.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entity Type *
                    </label>
                    <select
                      value={newField.entityType}
                      onChange={(e) =>
                        setNewField((prev) => ({
                          ...prev,
                          entityType: e.target.value as EntityType,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                    >
                      {entityTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Type *
                    </label>
                    <select
                      value={newField.type}
                      onChange={(e) =>
                        setNewField((prev) => ({ ...prev, type: e.target.value as FieldType }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                    >
                      {fieldTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newField.description}
                    onChange={(e) =>
                      setNewField((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe what this field is for..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] resize-none"
                  />
                </div>

                {(newField.type === "select" || newField.type === "multi_select") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add option..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                        onKeyPress={(e) => e.key === "Enter" && addOption()}
                      />
                      <button
                        onClick={addOption}
                        className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newField.options.map((option, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                        >
                          {option}
                          <button
                            onClick={() => removeOption(i)}
                            className="hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) =>
                        setNewField((prev) => ({ ...prev, required: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                    />
                    <span className="text-sm text-gray-700">Required</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newField.searchable}
                      onChange={(e) =>
                        setNewField((prev) => ({ ...prev, searchable: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                    />
                    <span className="text-sm text-gray-700">Searchable</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newField.visible}
                      onChange={(e) =>
                        setNewField((prev) => ({ ...prev, visible: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                    />
                    <span className="text-sm text-gray-700">Visible</span>
                  </label>
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
                    // Reset form
                    setNewField({
                      name: "",
                      key: "",
                      type: "text",
                      entityType: "contact",
                      description: "",
                      required: false,
                      visible: true,
                      searchable: true,
                      options: [],
                      defaultValue: "",
                      placeholder: "",
                    });
                  }}
                  className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] transition-colors"
                >
                  Create Field
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

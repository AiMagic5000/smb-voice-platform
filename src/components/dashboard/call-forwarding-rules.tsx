"use client";

import React, { useState, useEffect } from "react";

// ============================================
// Types
// ============================================

export type ForwardingType = "always" | "busy" | "no_answer" | "unreachable" | "schedule";

export interface ForwardingRule {
  id: string;
  name: string;
  type: ForwardingType;
  enabled: boolean;
  priority: number;
  destination: {
    type: "phone" | "extension" | "voicemail" | "queue";
    value: string;
    label?: string;
  };
  conditions?: {
    schedule?: {
      startTime?: string;
      endTime?: string;
      days?: string[];
    };
    ringTimeout?: number;
    callerIds?: string[];
  };
}

interface CallForwardingRulesProps {
  rules: ForwardingRule[];
  extensions?: { id: string; number: string; name: string }[];
  queues?: { id: string; name: string }[];
  onSave?: (rules: ForwardingRule[]) => void;
  onChange?: (rules: ForwardingRule[]) => void;
}

// ============================================
// Call Forwarding Rules Component
// ============================================

export function CallForwardingRules({
  rules: initialRules,
  extensions = [],
  queues = [],
  onSave,
  onChange,
}: CallForwardingRulesProps) {
  const [rules, setRules] = useState<ForwardingRule[]>(initialRules);
  const [editingRule, setEditingRule] = useState<ForwardingRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    onChange?.(rules);
  }, [rules, onChange]);

  const handleToggleRule = (id: string) => {
    setRules(rules.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleSaveRule = (rule: ForwardingRule) => {
    if (isCreating) {
      setRules([...rules, { ...rule, id: `rule-${Date.now()}` }]);
    } else {
      setRules(rules.map((r) => (r.id === rule.id ? rule : r)));
    }
    setEditingRule(null);
    setIsCreating(false);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSave?.(rules);
    } finally {
      setIsSaving(false);
    }
  };

  const typeLabels: Record<ForwardingType, { label: string; description: string }> = {
    always: { label: "Always Forward", description: "Forward all incoming calls" },
    busy: { label: "When Busy", description: "Forward when line is busy" },
    no_answer: { label: "No Answer", description: "Forward after ring timeout" },
    unreachable: { label: "Unreachable", description: "Forward when offline" },
    schedule: { label: "On Schedule", description: "Forward during specific hours" },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Call Forwarding Rules</h3>
          <p className="text-sm text-gray-500 mt-1">Configure how calls are routed</p>
        </div>
        <div className="flex items-center gap-3">
          {onSave && (
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-2 bg-[#C9A227] text-white rounded-lg hover:bg-[#B8911F] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              Save Changes
            </button>
          )}
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingRule({
                id: "",
                name: "",
                type: "always",
                enabled: true,
                priority: rules.length + 1,
                destination: { type: "phone", value: "" },
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Rule
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div className="divide-y divide-gray-100">
        {rules.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <p className="font-medium">No forwarding rules</p>
            <p className="text-sm mt-1">Add a rule to start forwarding calls</p>
          </div>
        ) : (
          rules
            .sort((a, b) => a.priority - b.priority)
            .map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                typeLabels={typeLabels}
                onToggle={() => handleToggleRule(rule.id)}
                onEdit={() => setEditingRule(rule)}
                onDelete={() => handleDeleteRule(rule.id)}
              />
            ))
        )}
      </div>

      {/* Edit Modal */}
      {editingRule && (
        <RuleEditor
          rule={editingRule}
          isNew={isCreating}
          typeLabels={typeLabels}
          extensions={extensions}
          queues={queues}
          onSave={handleSaveRule}
          onCancel={() => {
            setEditingRule(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// Rule Row Component
// ============================================

function RuleRow({
  rule,
  typeLabels,
  onToggle,
  onEdit,
  onDelete,
}: {
  rule: ForwardingRule;
  typeLabels: Record<ForwardingType, { label: string; description: string }>;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const destinationIcons: Record<string, React.ReactNode> = {
    phone: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    extension: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    voicemail: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    queue: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-center gap-4 px-6 py-4 ${!rule.enabled ? "opacity-50" : ""}`}>
      {/* Priority */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
        {rule.priority}
      </div>

      {/* Rule Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{rule.name || typeLabels[rule.type].label}</span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            rule.type === "always" ? "bg-blue-100 text-blue-700" :
            rule.type === "busy" ? "bg-yellow-100 text-yellow-700" :
            rule.type === "no_answer" ? "bg-orange-100 text-orange-700" :
            rule.type === "unreachable" ? "bg-red-100 text-red-700" :
            "bg-purple-100 text-purple-700"
          }`}>
            {typeLabels[rule.type].label}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
          {destinationIcons[rule.destination.type]}
          <span>
            {rule.destination.label || rule.destination.value || "Voicemail"}
          </span>
          {rule.conditions?.ringTimeout && (
            <span className="text-gray-400">after {rule.conditions.ringTimeout}s</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`
            relative w-11 h-6 rounded-full transition-colors
            ${rule.enabled ? "bg-[#C9A227]" : "bg-gray-300"}
          `}
        >
          <span
            className={`
              absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform
              ${rule.enabled ? "left-6" : "left-1"}
            `}
          />
        </button>

        {/* Edit */}
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============================================
// Rule Editor Modal
// ============================================

function RuleEditor({
  rule,
  isNew,
  typeLabels,
  extensions,
  queues,
  onSave,
  onCancel,
}: {
  rule: ForwardingRule;
  isNew: boolean;
  typeLabels: Record<ForwardingType, { label: string; description: string }>;
  extensions: { id: string; number: string; name: string }[];
  queues: { id: string; name: string }[];
  onSave: (rule: ForwardingRule) => void;
  onCancel: () => void;
}) {
  const [editedRule, setEditedRule] = useState(rule);

  const handleSave = () => {
    onSave(editedRule);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onCancel} />

      {/* Modal */}
      <div className="fixed inset-x-0 top-[10%] mx-auto max-w-lg z-50 px-4">
        <div className="bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">
              {isNew ? "Add Forwarding Rule" : "Edit Forwarding Rule"}
            </h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Rule Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
              <input
                type="text"
                value={editedRule.name}
                onChange={(e) => setEditedRule({ ...editedRule, name: e.target.value })}
                placeholder="e.g., After hours forwarding"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
              />
            </div>

            {/* Rule Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forward When</label>
              <select
                value={editedRule.type}
                onChange={(e) => setEditedRule({ ...editedRule, type: e.target.value as ForwardingType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
              >
                {Object.entries(typeLabels).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">{typeLabels[editedRule.type].description}</p>
            </div>

            {/* Ring Timeout (for no_answer) */}
            {editedRule.type === "no_answer" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ring Timeout (seconds)</label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={editedRule.conditions?.ringTimeout || 20}
                  onChange={(e) => setEditedRule({
                    ...editedRule,
                    conditions: { ...editedRule.conditions, ringTimeout: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                />
              </div>
            )}

            {/* Destination Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forward To</label>
              <select
                value={editedRule.destination.type}
                onChange={(e) => setEditedRule({
                  ...editedRule,
                  destination: { ...editedRule.destination, type: e.target.value as "phone" | "extension" | "voicemail" | "queue", value: "" }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
              >
                <option value="phone">External Phone Number</option>
                <option value="extension">Extension</option>
                <option value="voicemail">Voicemail</option>
                <option value="queue">Call Queue</option>
              </select>
            </div>

            {/* Destination Value */}
            {editedRule.destination.type === "phone" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editedRule.destination.value}
                  onChange={(e) => setEditedRule({
                    ...editedRule,
                    destination: { ...editedRule.destination, value: e.target.value }
                  })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                />
              </div>
            )}

            {editedRule.destination.type === "extension" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extension</label>
                <select
                  value={editedRule.destination.value}
                  onChange={(e) => {
                    const ext = extensions.find((x) => x.id === e.target.value);
                    setEditedRule({
                      ...editedRule,
                      destination: {
                        ...editedRule.destination,
                        value: e.target.value,
                        label: ext ? `${ext.name} (${ext.number})` : undefined,
                      }
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                >
                  <option value="">Select extension...</option>
                  {extensions.map((ext) => (
                    <option key={ext.id} value={ext.id}>
                      {ext.name} ({ext.number})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {editedRule.destination.type === "queue" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Queue</label>
                <select
                  value={editedRule.destination.value}
                  onChange={(e) => {
                    const q = queues.find((x) => x.id === e.target.value);
                    setEditedRule({
                      ...editedRule,
                      destination: {
                        ...editedRule.destination,
                        value: e.target.value,
                        label: q?.name,
                      }
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                >
                  <option value="">Select queue...</option>
                  {queues.map((q) => (
                    <option key={q.id} value={q.id}>{q.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#C9A227] text-white rounded-lg hover:bg-[#B8911F] transition-colors"
            >
              {isNew ? "Add Rule" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CallForwardingRules;

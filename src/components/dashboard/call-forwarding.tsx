"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PhoneForwarded,
  Phone,
  Clock,
  Plus,
  Trash2,
  Save,
  Loader2,
  ArrowRight,
  GripVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ForwardingRule {
  id: string;
  phoneNumber: string;
  label: string;
  ringDuration: number; // seconds before forwarding to next
  enabled: boolean;
}

interface CallForwardingProps {
  rules?: ForwardingRule[];
  isEnabled?: boolean;
  onSave?: (rules: ForwardingRule[], enabled: boolean) => Promise<void>;
  className?: string;
}

const defaultRules: ForwardingRule[] = [
  { id: "1", phoneNumber: "(555) 123-4567", label: "Office", ringDuration: 20, enabled: true },
  { id: "2", phoneNumber: "(555) 987-6543", label: "Mobile", ringDuration: 15, enabled: true },
];

export function CallForwarding({
  rules: initialRules = defaultRules,
  isEnabled: initialEnabled = true,
  onSave,
  className,
}: CallForwardingProps) {
  const [rules, setRules] = useState<ForwardingRule[]>(initialRules);
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleEnabled = () => {
    setIsEnabled(!isEnabled);
    setHasChanges(true);
  };

  const handleRuleChange = (id: string, field: keyof ForwardingRule, value: string | number | boolean) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
    setHasChanges(true);
  };

  const handleAddRule = () => {
    const newRule: ForwardingRule = {
      id: Date.now().toString(),
      phoneNumber: "",
      label: `Forward ${rules.length + 1}`,
      ringDuration: 15,
      enabled: true,
    };
    setRules((prev) => [...prev, newRule]);
    setHasChanges(true);
  };

  const handleRemoveRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(rules, isEnabled);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const totalRingTime = rules
    .filter((r) => r.enabled)
    .reduce((sum, r) => sum + r.ringDuration, 0);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
            <PhoneForwarded className="h-5 w-5" />
            Call Forwarding
          </CardTitle>
          <button
            onClick={handleToggleEnabled}
            className={cn(
              "relative w-12 h-6 rounded-full transition-colors",
              isEnabled ? "bg-[#C9A227]" : "bg-gray-200"
            )}
          >
            <motion.div
              initial={false}
              animate={{ x: isEnabled ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <p className="text-sm text-gray-500">
          Forward incoming calls to other numbers in sequence if the primary line
          is busy or unanswered.
        </p>

        {/* Visual Flow */}
        {isEnabled && rules.length > 0 && (
          <div className="flex items-center gap-2 p-4 bg-[#FDF8E8] rounded-xl overflow-x-auto">
            <div className="flex items-center gap-2 text-sm flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-white flex items-center justify-center">
                <Phone className="h-4 w-4" />
              </div>
              <span className="text-[#1E3A5F] font-medium">Incoming</span>
            </div>
            {rules.filter((r) => r.enabled).map((rule, index) => (
              <div key={rule.id} className="flex items-center gap-2 flex-shrink-0">
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-[#1E3A5F]">
                    {rule.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {rule.ringDuration}s
                  </span>
                </div>
              </div>
            ))}
            <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200 flex-shrink-0">
              <span className="text-sm font-medium text-red-600">Voicemail</span>
            </div>
          </div>
        )}

        {/* Rules List */}
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-4 rounded-xl border transition-all",
                rule.enabled && isEnabled
                  ? "border-gray-200 bg-white"
                  : "border-gray-100 bg-gray-50 opacity-60"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 text-gray-400 cursor-move">
                  <GripVertical className="h-5 w-5" />
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>

                <div className="flex-1 grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Label
                    </label>
                    <input
                      type="text"
                      value={rule.label}
                      onChange={(e) => handleRuleChange(rule.id, "label", e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all"
                      placeholder="e.g., Office"
                      disabled={!isEnabled}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={rule.phoneNumber}
                        onChange={(e) => handleRuleChange(rule.id, "phoneNumber", e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all"
                        placeholder="(555) 123-4567"
                        disabled={!isEnabled}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Ring Duration
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={rule.ringDuration}
                        onChange={(e) =>
                          handleRuleChange(rule.id, "ringDuration", parseInt(e.target.value))
                        }
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all appearance-none bg-white"
                        disabled={!isEnabled}
                      >
                        <option value={10}>10 seconds</option>
                        <option value={15}>15 seconds</option>
                        <option value={20}>20 seconds</option>
                        <option value={25}>25 seconds</option>
                        <option value={30}>30 seconds</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRuleChange(rule.id, "enabled", !rule.enabled)}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors",
                      rule.enabled ? "bg-[#C9A227]" : "bg-gray-200"
                    )}
                    disabled={!isEnabled}
                  >
                    <motion.div
                      initial={false}
                      animate={{ x: rule.enabled ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                  <button
                    onClick={() => handleRemoveRule(rule.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={!isEnabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Rule */}
        {isEnabled && (
          <Button
            variant="outline"
            className="w-full gap-2 border-dashed"
            onClick={handleAddRule}
          >
            <Plus className="h-4 w-4" />
            Add Forwarding Number
          </Button>
        )}

        {/* Summary */}
        {isEnabled && rules.filter((r) => r.enabled).length > 0 && (
          <div className="p-3 rounded-xl bg-gray-50 text-sm text-gray-600">
            <strong className="text-[#1E3A5F]">Summary:</strong> Calls will ring
            for {totalRingTime} seconds total before going to voicemail.
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          {hasChanges && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[#C9A227]"
            >
              Unsaved changes
            </motion.span>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="gap-2 bg-[#C9A227] hover:bg-[#B8911F] text-white"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CallForwarding;

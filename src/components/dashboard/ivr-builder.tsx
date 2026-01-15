"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Phone,
  PhoneForwarded,
  Voicemail,
  Users,
  MessageSquare,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Loader2,
  Play,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MenuAction =
  | "extension"
  | "department"
  | "voicemail"
  | "external"
  | "submenu"
  | "repeat";

interface MenuOption {
  id: string;
  digit: string;
  label: string;
  action: MenuAction;
  target?: string;
  submenuOptions?: MenuOption[];
}

interface IVRMenu {
  greeting: string;
  options: MenuOption[];
  timeout: number;
  timeoutAction: MenuAction;
  timeoutTarget?: string;
}

interface IVRBuilderProps {
  menu?: IVRMenu;
  extensions?: { id: string; name: string; number: string }[];
  onSave?: (menu: IVRMenu) => Promise<void>;
  className?: string;
}

const defaultMenu: IVRMenu = {
  greeting: "Thank you for calling. Press 1 for Sales, 2 for Support, or 0 to speak with an operator.",
  options: [
    { id: "1", digit: "1", label: "Sales", action: "department", target: "sales" },
    { id: "2", digit: "2", label: "Support", action: "department", target: "support" },
    { id: "3", digit: "0", label: "Operator", action: "extension", target: "101" },
  ],
  timeout: 10,
  timeoutAction: "repeat",
};

const defaultExtensions = [
  { id: "101", name: "Main Office", number: "101" },
  { id: "102", name: "Sarah Johnson", number: "102" },
  { id: "103", name: "Mike Williams", number: "103" },
];

const actionIcons: Record<MenuAction, typeof Phone> = {
  extension: Phone,
  department: Users,
  voicemail: Voicemail,
  external: PhoneForwarded,
  submenu: Menu,
  repeat: MessageSquare,
};

const actionLabels: Record<MenuAction, string> = {
  extension: "Transfer to Extension",
  department: "Transfer to Department",
  voicemail: "Go to Voicemail",
  external: "Transfer to External Number",
  submenu: "Open Submenu",
  repeat: "Repeat Menu",
};

const availableDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "#"];

export function IVRBuilder({
  menu: initialMenu = defaultMenu,
  extensions = defaultExtensions,
  onSave,
  className,
}: IVRBuilderProps) {
  const [menu, setMenu] = useState<IVRMenu>(initialMenu);
  const [expandedOptions, setExpandedOptions] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const usedDigits = menu.options.map((o) => o.digit);
  const availableForNew = availableDigits.filter((d) => !usedDigits.includes(d));

  const handleGreetingChange = (value: string) => {
    setMenu((prev) => ({ ...prev, greeting: value }));
    setHasChanges(true);
  };

  const handleAddOption = useCallback(() => {
    if (availableForNew.length === 0) return;

    const newOption: MenuOption = {
      id: Date.now().toString(),
      digit: availableForNew[0],
      label: "New Option",
      action: "extension",
      target: extensions[0]?.id || "",
    };
    setMenu((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
    setHasChanges(true);
  }, [availableForNew, extensions]);

  const handleUpdateOption = useCallback(
    (id: string, updates: Partial<MenuOption>) => {
      setMenu((prev) => ({
        ...prev,
        options: prev.options.map((opt) =>
          opt.id === id ? { ...opt, ...updates } : opt
        ),
      }));
      setHasChanges(true);
    },
    []
  );

  const handleRemoveOption = useCallback((id: string) => {
    setMenu((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }));
    setHasChanges(true);
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(menu);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
            <Menu className="h-5 w-5" />
            IVR Menu Builder
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-[#C9A227] border-[#C9A227] hover:bg-[#FDF8E8]"
          >
            <Play className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Greeting */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Greeting Message
          </label>
          <textarea
            value={menu.greeting}
            onChange={(e) => handleGreetingChange(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all resize-none"
            placeholder="Enter your greeting message..."
          />
          <p className="text-xs text-gray-500">
            This message will be played to callers when they reach your phone menu.
          </p>
        </div>

        {/* Menu Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Menu Options
            </label>
            <span className="text-xs text-gray-400">
              {menu.options.length}/12 options
            </span>
          </div>

          <div className="space-y-2">
            {menu.options.map((option, index) => {
              const Icon = actionIcons[option.action];
              const isExpanded = expandedOptions.has(option.id);

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Option Header */}
                  <div
                    className="flex items-center gap-3 p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpanded(option.id)}
                  >
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />

                    {/* Digit Badge */}
                    <div className="w-10 h-10 rounded-xl bg-[#C9A227] text-white flex items-center justify-center font-bold text-lg">
                      {option.digit}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-[#1E3A5F]">{option.label}</p>
                      <p className="text-sm text-gray-500">
                        {actionLabels[option.action]}
                        {option.target && ` → ${option.target}`}
                      </p>
                    </div>

                    <Icon className="h-5 w-5 text-gray-400" />

                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  {/* Option Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-4 border-t border-gray-100">
                          <div className="grid sm:grid-cols-2 gap-4">
                            {/* Digit */}
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500">
                                Press Key
                              </label>
                              <select
                                value={option.digit}
                                onChange={(e) =>
                                  handleUpdateOption(option.id, {
                                    digit: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
                              >
                                <option value={option.digit}>{option.digit}</option>
                                {availableForNew.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Label */}
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500">
                                Label
                              </label>
                              <input
                                type="text"
                                value={option.label}
                                onChange={(e) =>
                                  handleUpdateOption(option.id, {
                                    label: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none"
                                placeholder="e.g., Sales"
                              />
                            </div>

                            {/* Action */}
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500">
                                Action
                              </label>
                              <select
                                value={option.action}
                                onChange={(e) =>
                                  handleUpdateOption(option.id, {
                                    action: e.target.value as MenuAction,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
                              >
                                {Object.entries(actionLabels).map(([key, label]) => (
                                  <option key={key} value={key}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Target */}
                            {option.action === "extension" && (
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">
                                  Extension
                                </label>
                                <select
                                  value={option.target || ""}
                                  onChange={(e) =>
                                    handleUpdateOption(option.id, {
                                      target: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
                                >
                                  {extensions.map((ext) => (
                                    <option key={ext.id} value={ext.id}>
                                      {ext.name} ({ext.number})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {option.action === "external" && (
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">
                                  Phone Number
                                </label>
                                <input
                                  type="tel"
                                  value={option.target || ""}
                                  onChange={(e) =>
                                    handleUpdateOption(option.id, {
                                      target: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none"
                                  placeholder="(555) 123-4567"
                                />
                              </div>
                            )}
                          </div>

                          {/* Delete */}
                          <div className="flex justify-end pt-2 border-t border-gray-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleRemoveOption(option.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Add Option */}
          {availableForNew.length > 0 && (
            <Button
              variant="outline"
              className="w-full gap-2 border-dashed"
              onClick={handleAddOption}
            >
              <Plus className="h-4 w-4" />
              Add Menu Option
            </Button>
          )}
        </div>

        {/* Timeout Settings */}
        <div className="p-4 rounded-xl bg-gray-50 space-y-3">
          <h4 className="font-medium text-[#1E3A5F]">Timeout Settings</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Wait Time (seconds)
              </label>
              <select
                value={menu.timeout}
                onChange={(e) => {
                  setMenu((prev) => ({
                    ...prev,
                    timeout: parseInt(e.target.value),
                  }));
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
              >
                {[5, 10, 15, 20, 30].map((t) => (
                  <option key={t} value={t}>
                    {t} seconds
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                If No Input
              </label>
              <select
                value={menu.timeoutAction}
                onChange={(e) => {
                  setMenu((prev) => ({
                    ...prev,
                    timeoutAction: e.target.value as MenuAction,
                  }));
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none bg-white"
              >
                <option value="repeat">Repeat Menu</option>
                <option value="voicemail">Go to Voicemail</option>
                <option value="extension">Transfer to Operator</option>
              </select>
            </div>
          </div>
        </div>

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
            Save Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default IVRBuilder;

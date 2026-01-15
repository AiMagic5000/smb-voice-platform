"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Play,
  Plus,
  Settings,
  Trash2,
  ArrowRight,
  MessageSquare,
  Users,
  Voicemail,
  Calendar,
  Clock,
  Bot,
  PhoneForwarded,
  Repeat,
  Volume2,
  ChevronDown,
  ChevronRight,
  Edit2,
  Copy,
  MoreVertical,
  Mic,
  Keyboard,
} from "lucide-react";

type MenuAction =
  | "playGreeting"
  | "dialExtension"
  | "transferQueue"
  | "goToVoicemail"
  | "transferExternal"
  | "repeatMenu"
  | "aiReceptionist"
  | "subMenu"
  | "hangup";

type MenuOption = {
  id: string;
  key: string;
  label: string;
  action: MenuAction;
  target?: string;
  subMenuId?: string;
};

type AutoAttendant = {
  id: string;
  name: string;
  greeting: string;
  greetingType: "tts" | "audio";
  isActive: boolean;
  options: MenuOption[];
  timeout: number;
  timeoutAction: MenuAction;
  timeoutTarget?: string;
  invalidAction: MenuAction;
  invalidTarget?: string;
};

const mockAttendant: AutoAttendant = {
  id: "aa_1",
  name: "Main Menu",
  greeting: "Thank you for calling ACME Corporation. Please listen carefully as our menu options have changed.",
  greetingType: "tts",
  isActive: true,
  timeout: 5,
  timeoutAction: "repeatMenu",
  invalidAction: "repeatMenu",
  options: [
    { id: "opt_1", key: "1", label: "Sales", action: "transferQueue", target: "Sales Queue" },
    { id: "opt_2", key: "2", label: "Support", action: "transferQueue", target: "Support Queue" },
    { id: "opt_3", key: "3", label: "Billing", action: "dialExtension", target: "ext_billing" },
    { id: "opt_4", key: "4", label: "Hours & Location", action: "playGreeting", target: "greet_hours" },
    { id: "opt_5", key: "5", label: "AI Assistant", action: "aiReceptionist", target: "ai_main" },
    { id: "opt_6", key: "0", label: "Operator", action: "dialExtension", target: "ext_100" },
    { id: "opt_7", key: "*", label: "Repeat Menu", action: "repeatMenu" },
  ],
};

const actionLabels: Record<MenuAction, string> = {
  playGreeting: "Play Greeting",
  dialExtension: "Dial Extension",
  transferQueue: "Transfer to Queue",
  goToVoicemail: "Go to Voicemail",
  transferExternal: "Transfer External",
  repeatMenu: "Repeat Menu",
  aiReceptionist: "AI Receptionist",
  subMenu: "Sub Menu",
  hangup: "Hang Up",
};

const actionIcons: Record<MenuAction, React.ElementType> = {
  playGreeting: Volume2,
  dialExtension: Phone,
  transferQueue: Users,
  goToVoicemail: Voicemail,
  transferExternal: PhoneForwarded,
  repeatMenu: Repeat,
  aiReceptionist: Bot,
  subMenu: ChevronRight,
  hangup: Phone,
};

export function AutoAttendantBuilder() {
  const [attendant, setAttendant] = useState(mockAttendant);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAddOption, setShowAddOption] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addOption = () => {
    const newOption: MenuOption = {
      id: `opt_${Date.now()}`,
      key: "",
      label: "New Option",
      action: "dialExtension",
    };
    setAttendant({
      ...attendant,
      options: [...attendant.options, newOption],
    });
    setShowAddOption(false);
  };

  const removeOption = (id: string) => {
    setAttendant({
      ...attendant,
      options: attendant.options.filter((o) => o.id !== id),
    });
    setSelectedOption(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E3A5F] flex items-center justify-center">
            <Phone className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white">{attendant.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={attendant.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {attendant.isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-gray-500">{attendant.options.length} options configured</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Play className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button className="btn-primary">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Greeting Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Greeting */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Greeting Message
                </h3>
                <div className="flex gap-2">
                  <button className={`px-3 py-1.5 rounded-lg text-sm ${
                    attendant.greetingType === "tts"
                      ? "bg-[#1E3A5F] text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    Text-to-Speech
                  </button>
                  <button className={`px-3 py-1.5 rounded-lg text-sm ${
                    attendant.greetingType === "audio"
                      ? "bg-[#1E3A5F] text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    Audio File
                  </button>
                </div>
              </div>
              <textarea
                className="w-full h-24 px-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 resize-none"
                value={attendant.greeting}
                onChange={(e) => setAttendant({ ...attendant, greeting: e.target.value })}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-500">
                  {attendant.greeting.length} characters
                </span>
                <Button variant="outline" size="sm">
                  <Mic className="h-4 w-4 mr-2" />
                  Test Voice
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Menu Options */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Menu Options
                </h3>
                <Button size="sm" className="btn-primary gap-2" onClick={addOption}>
                  <Plus className="h-4 w-4" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-3">
                {attendant.options.map((option, i) => {
                  const ActionIcon = actionIcons[option.action];
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                        selectedOption === option.id
                          ? "border-[#C9A227] bg-[#FDF8E8] dark:bg-[#C9A227]/10"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedOption(selectedOption === option.id ? null : option.id)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Key Badge */}
                        <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-lg">
                          {option.key}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <p className="font-semibold text-[#1E3A5F] dark:text-white">{option.label}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <ActionIcon className="h-3.5 w-3.5" />
                            <span>{actionLabels[option.action]}</span>
                            {option.target && (
                              <>
                                <ArrowRight className="h-3 w-3" />
                                <span className="text-[#C9A227]">{option.target}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeOption(option.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Timeout Settings */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5" />
                Timeout Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Wait Time</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={attendant.timeout}
                      onChange={(e) => setAttendant({ ...attendant, timeout: parseInt(e.target.value) })}
                      className="w-20"
                    />
                    <span className="text-gray-500">seconds</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">On Timeout</label>
                  <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    <option value="repeatMenu">Repeat Menu</option>
                    <option value="goToVoicemail">Go to Voicemail</option>
                    <option value="dialExtension">Transfer to Operator</option>
                    <option value="hangup">Hang Up</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invalid Input Settings */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5" />
                Invalid Input
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">On Invalid Key</label>
                  <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    <option value="repeatMenu">Repeat Menu</option>
                    <option value="goToVoicemail">Go to Voicemail</option>
                    <option value="dialExtension">Transfer to Operator</option>
                    <option value="hangup">Hang Up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Error Message</label>
                  <Input placeholder="Invalid option, please try again." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Calls Today</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Most Used Option</span>
                  <span className="font-medium">Press 1 (Sales)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg. Time in Menu</span>
                  <span className="font-medium">8.2 seconds</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Timeout Rate</span>
                  <span className="font-medium">3.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white">Menu Preview</h2>
                  <p className="text-sm text-gray-500 mt-1">Listen to how callers will experience your menu</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    "{attendant.greeting}"
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {attendant.options.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-3 text-sm">
                      <span className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-white flex items-center justify-center font-bold">
                        {opt.key}
                      </span>
                      <span>for {opt.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowPreview(false)}>
                    Close
                  </Button>
                  <Button className="flex-1 gap-2">
                    <Play className="h-4 w-4" />
                    Play Audio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

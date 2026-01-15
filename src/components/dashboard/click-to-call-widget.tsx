"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Code,
  Copy,
  Check,
  Eye,
  Settings,
  Palette,
  MessageSquare,
  Clock,
  Users,
  Globe,
  ChevronRight,
  Smartphone,
  Monitor,
  Zap,
  ExternalLink,
} from "lucide-react";

type WidgetStyle = "floating" | "inline" | "banner";
type WidgetPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

type WidgetConfig = {
  id: string;
  name: string;
  style: WidgetStyle;
  position: WidgetPosition;
  primaryColor: string;
  phoneNumber: string;
  greeting: string;
  showAfterSeconds: number;
  showOnMobile: boolean;
  collectName: boolean;
  collectEmail: boolean;
  businessHoursOnly: boolean;
  offlineMessage: string;
  destinations: string[];
  isActive: boolean;
  domain: string;
  embedCode: string;
  impressions: number;
  clicks: number;
  calls: number;
};

const mockWidgets: WidgetConfig[] = [
  {
    id: "widget_1",
    name: "Main Website Widget",
    style: "floating",
    position: "bottom-right",
    primaryColor: "#1E3A5F",
    phoneNumber: "+1 (555) 100-0000",
    greeting: "Need help? Call us now!",
    showAfterSeconds: 5,
    showOnMobile: true,
    collectName: true,
    collectEmail: true,
    businessHoursOnly: true,
    offlineMessage: "We're offline. Leave a message!",
    destinations: ["sales", "support"],
    isActive: true,
    domain: "example.com",
    embedCode: '<script src="https://voiceplatform.com/widget/widget_1.js"></script>',
    impressions: 12500,
    clicks: 890,
    calls: 234,
  },
  {
    id: "widget_2",
    name: "Support Page Widget",
    style: "inline",
    position: "bottom-right",
    primaryColor: "#C9A227",
    phoneNumber: "+1 (555) 100-0001",
    greeting: "Talk to a support specialist",
    showAfterSeconds: 0,
    showOnMobile: true,
    collectName: false,
    collectEmail: true,
    businessHoursOnly: false,
    offlineMessage: "Leave a voicemail and we'll call back.",
    destinations: ["support"],
    isActive: true,
    domain: "support.example.com",
    embedCode: '<script src="https://voiceplatform.com/widget/widget_2.js"></script>',
    impressions: 4200,
    clicks: 340,
    calls: 156,
  },
];

const colorOptions = [
  "#1E3A5F",
  "#C9A227",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
];

export function ClickToCallWidget() {
  const [widgets, setWidgets] = useState(mockWidgets);
  const [selectedWidget, setSelectedWidget] = useState<string | null>("widget_1");
  const [activeTab, setActiveTab] = useState<"settings" | "appearance" | "behavior">("settings");
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedWidgetData = widgets.find((w) => w.id === selectedWidget);

  const copyEmbedCode = () => {
    if (selectedWidgetData) {
      navigator.clipboard.writeText(selectedWidgetData.embedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const totalStats = {
    impressions: widgets.reduce((acc, w) => acc + w.impressions, 0),
    clicks: widgets.reduce((acc, w) => acc + w.clicks, 0),
    calls: widgets.reduce((acc, w) => acc + w.calls, 0),
    conversionRate: widgets.reduce((acc, w) => acc + w.calls, 0) / widgets.reduce((acc, w) => acc + w.clicks, 0) * 100,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Impressions</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                    {totalStats.impressions.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Widget Clicks</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                    {totalStats.clicks.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Calls Made</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                    {totalStats.calls.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Conversion</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                    {totalStats.conversionRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Widget List */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1E3A5F] dark:text-white">Your Widgets</h3>
                <Button size="sm" className="btn-primary">
                  <Code className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>

              <div className="space-y-2">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    onClick={() => setSelectedWidget(widget.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedWidget === widget.id
                        ? "bg-[#1E3A5F] text-white"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: widget.primaryColor }}
                        />
                        <span className="font-medium text-sm">{widget.name}</span>
                      </div>
                      <Badge
                        variant={widget.isActive ? "default" : "secondary"}
                        className={widget.isActive ? "bg-green-500" : ""}
                      >
                        {widget.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-4 text-xs ${
                      selectedWidget === widget.id ? "text-white/70" : "text-gray-500"
                    }`}>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {widget.domain}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {widget.calls} calls
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Widget Configuration */}
        <div className="lg:col-span-2">
          {selectedWidgetData ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white">
                    {selectedWidgetData.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  {(["settings", "appearance", "behavior"] as const).map((tab) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab(tab)}
                      className={activeTab === tab ? "btn-primary" : ""}
                    >
                      {tab === "settings" && <Settings className="h-4 w-4 mr-1" />}
                      {tab === "appearance" && <Palette className="h-4 w-4 mr-1" />}
                      {tab === "behavior" && <Clock className="h-4 w-4 mr-1" />}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Button>
                  ))}
                </div>

                {activeTab === "settings" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Widget Name</label>
                      <Input value={selectedWidgetData.name} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number to Display</label>
                      <Input value={selectedWidgetData.phoneNumber} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Greeting Message</label>
                      <Input value={selectedWidgetData.greeting} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Offline Message</label>
                      <Input value={selectedWidgetData.offlineMessage} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Authorized Domain</label>
                      <Input value={selectedWidgetData.domain} placeholder="example.com" />
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Widget Style</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(["floating", "inline", "banner"] as const).map((style) => (
                          <div
                            key={style}
                            className={`p-4 rounded-lg border-2 cursor-pointer text-center ${
                              selectedWidgetData.style === style
                                ? "border-[#1E3A5F] bg-[#1E3A5F]/5"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {style === "floating" && <Phone className="h-6 w-6 mx-auto mb-2" />}
                            {style === "inline" && <Monitor className="h-6 w-6 mx-auto mb-2" />}
                            {style === "banner" && <MessageSquare className="h-6 w-6 mx-auto mb-2" />}
                            <span className="text-sm capitalize">{style}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Position</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["bottom-right", "bottom-left", "top-right", "top-left"] as const).map((pos) => (
                          <div
                            key={pos}
                            className={`p-3 rounded-lg border-2 cursor-pointer text-center ${
                              selectedWidgetData.position === pos
                                ? "border-[#1E3A5F] bg-[#1E3A5F]/5"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            <span className="text-sm capitalize">{pos.replace("-", " ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Color</label>
                      <div className="flex gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                              selectedWidgetData.primaryColor === color
                                ? "border-[#1E3A5F] ring-2 ring-offset-2 ring-[#1E3A5F]"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "behavior" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Show After (seconds)</label>
                      <Input type="number" value={selectedWidgetData.showAfterSeconds} />
                      <p className="text-xs text-gray-500 mt-1">0 = Show immediately</p>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedWidgetData.showOnMobile}
                          className="rounded"
                        />
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <span>Show on mobile devices</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedWidgetData.collectName}
                          className="rounded"
                        />
                        <span>Collect caller name before connecting</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedWidgetData.collectEmail}
                          className="rounded"
                        />
                        <span>Collect email address before connecting</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedWidgetData.businessHoursOnly}
                          className="rounded"
                        />
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Only show during business hours</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Embed Code */}
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <h4 className="font-medium text-[#1E3A5F] dark:text-white mb-3 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Embed Code
                  </h4>
                  <div className="relative">
                    <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-x-auto">
                      {selectedWidgetData.embedCode}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={copyEmbedCode}
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Add this code to your website just before the closing &lt;/body&gt; tag.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Code className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Select a widget to configure</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

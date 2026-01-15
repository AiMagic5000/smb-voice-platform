"use client";

import { useState } from "react";
import {
  Puzzle,
  Search,
  Check,
  ExternalLink,
  Star,
  Users,
  Zap,
  Settings,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  isInstalled: boolean;
  isPremium: boolean;
  rating: number;
  users: number;
  features: string[];
}

// Mock integrations
const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "Salesforce",
    description: "Sync contacts and log calls automatically to Salesforce CRM",
    category: "CRM",
    logo: "/logos/salesforce.svg",
    isInstalled: true,
    isPremium: false,
    rating: 4.8,
    users: 15420,
    features: ["Call logging", "Contact sync", "Screen pop"],
  },
  {
    id: "2",
    name: "HubSpot",
    description: "Connect your phone system with HubSpot CRM and marketing",
    category: "CRM",
    logo: "/logos/hubspot.svg",
    isInstalled: true,
    isPremium: false,
    rating: 4.7,
    users: 12350,
    features: ["Call tracking", "Contact sync", "Deal updates"],
  },
  {
    id: "3",
    name: "Slack",
    description: "Get call notifications and voicemail alerts in Slack",
    category: "Communication",
    logo: "/logos/slack.svg",
    isInstalled: false,
    isPremium: false,
    rating: 4.9,
    users: 28900,
    features: ["Call alerts", "Voicemail notifications", "Team mentions"],
  },
  {
    id: "4",
    name: "Microsoft Teams",
    description: "Integrate calling features directly into Microsoft Teams",
    category: "Communication",
    logo: "/logos/teams.svg",
    isInstalled: false,
    isPremium: true,
    rating: 4.6,
    users: 18200,
    features: ["Direct calling", "Presence sync", "Calendar integration"],
  },
  {
    id: "5",
    name: "Zendesk",
    description: "Create tickets from calls and access customer info instantly",
    category: "Support",
    logo: "/logos/zendesk.svg",
    isInstalled: false,
    isPremium: false,
    rating: 4.5,
    users: 9800,
    features: ["Ticket creation", "Customer lookup", "Call recording"],
  },
  {
    id: "6",
    name: "Zapier",
    description: "Connect to 5000+ apps with custom automation workflows",
    category: "Automation",
    logo: "/logos/zapier.svg",
    isInstalled: true,
    isPremium: false,
    rating: 4.9,
    users: 45000,
    features: ["Custom triggers", "Multi-step workflows", "Webhooks"],
  },
  {
    id: "7",
    name: "Google Calendar",
    description: "Sync call schedules and set availability based on calendar",
    category: "Productivity",
    logo: "/logos/google-calendar.svg",
    isInstalled: false,
    isPremium: false,
    rating: 4.7,
    users: 32100,
    features: ["Schedule sync", "Availability rules", "Meeting integration"],
  },
  {
    id: "8",
    name: "Zoho CRM",
    description: "Full integration with Zoho CRM for contact and deal management",
    category: "CRM",
    logo: "/logos/zoho.svg",
    isInstalled: false,
    isPremium: false,
    rating: 4.4,
    users: 7200,
    features: ["Call logging", "Contact management", "Lead scoring"],
  },
  {
    id: "9",
    name: "Intercom",
    description: "Route calls from Intercom chats and sync customer data",
    category: "Support",
    logo: "/logos/intercom.svg",
    isInstalled: false,
    isPremium: true,
    rating: 4.6,
    users: 5600,
    features: ["Chat-to-call", "Customer context", "Conversation history"],
  },
  {
    id: "10",
    name: "Pipedrive",
    description: "Streamline your sales pipeline with integrated calling",
    category: "CRM",
    logo: "/logos/pipedrive.svg",
    isInstalled: false,
    isPremium: false,
    rating: 4.5,
    users: 8900,
    features: ["Deal tracking", "Activity logging", "Pipeline updates"],
  },
];

const categories = [
  "All",
  "CRM",
  "Communication",
  "Support",
  "Automation",
  "Productivity",
];

export function IntegrationMarketplace() {
  const [integrations, setIntegrations] =
    useState<Integration[]>(mockIntegrations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showInstalled, setShowInstalled] = useState(false);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || integration.category === selectedCategory;
    const matchesInstalled = !showInstalled || integration.isInstalled;
    return matchesSearch && matchesCategory && matchesInstalled;
  });

  const handleInstall = (integrationId: string) => {
    setIntegrations(
      integrations.map((i) =>
        i.id === integrationId ? { ...i, isInstalled: !i.isInstalled } : i
      )
    );
  };

  const installedCount = integrations.filter((i) => i.isInstalled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Integration Marketplace
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connect SMB Voice with your favorite tools
          </p>
        </div>
        <Button variant="outline" className="gap-2 dark:border-gray-700">
          <Settings className="h-4 w-4" />
          Manage Integrations ({installedCount})
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {integrations.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Available Integrations
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {installedCount}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Installed</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {categories.length - 1}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {integrations.filter((i) => i.isPremium).length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Premium Only
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                selectedCategory === category &&
                  "bg-[#1E3A5F] hover:bg-[#2d4a6f]",
                "dark:border-gray-700"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Installed Filter */}
      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={showInstalled}
          onChange={(e) => setShowInstalled(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
        />
        <span className="text-gray-700 dark:text-gray-300">
          Show installed only
        </span>
      </label>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className={cn(
              "p-5 bg-white dark:bg-gray-800 rounded-xl border transition-all hover:shadow-md",
              integration.isInstalled
                ? "border-green-300 dark:border-green-700"
                : "border-gray-200 dark:border-gray-700"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Puzzle className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {integration.name}
                    </h3>
                    {integration.isPremium && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-[#C9A227]/20 text-[#C9A227]">
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {integration.category}
                  </span>
                </div>
              </div>
              {integration.isInstalled && (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {integration.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mb-4">
              {integration.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-[#C9A227]" />
                {integration.rating}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {integration.users.toLocaleString()} users
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleInstall(integration.id)}
                className={cn(
                  "flex-1",
                  integration.isInstalled
                    ? "bg-green-500 hover:bg-green-600"
                    : "btn-primary"
                )}
              >
                {integration.isInstalled ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Installed
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Install
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="dark:border-gray-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Puzzle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No integrations found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Request Integration */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
        <Zap className="h-8 w-8 mx-auto text-[#C9A227] mb-3" />
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Don&apos;t see what you need?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Request an integration and we&apos;ll consider adding it to the marketplace
        </p>
        <Button variant="outline" className="dark:border-gray-700">
          Request Integration
        </Button>
      </div>
    </div>
  );
}

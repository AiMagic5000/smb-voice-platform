"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Phone,
  Users,
  Voicemail,
  Settings,
  Bot,
  History,
  HelpCircle,
  CreditCard,
  X,
  Command,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: "page" | "action" | "contact" | "number";
  title: string;
  description?: string;
  icon: typeof Search;
  href?: string;
  action?: () => void;
}

const pages: SearchResult[] = [
  {
    id: "dashboard",
    type: "page",
    title: "Dashboard",
    description: "View your call overview",
    icon: Phone,
    href: "/dashboard",
  },
  {
    id: "phone-numbers",
    type: "page",
    title: "Phone Numbers",
    description: "Manage your business numbers",
    icon: Phone,
    href: "/dashboard/phone-numbers",
  },
  {
    id: "extensions",
    type: "page",
    title: "Extensions",
    description: "Manage team extensions",
    icon: Users,
    href: "/dashboard/extensions",
  },
  {
    id: "calls",
    type: "page",
    title: "Call History",
    description: "View past calls",
    icon: History,
    href: "/dashboard/calls",
  },
  {
    id: "voicemails",
    type: "page",
    title: "Voicemails",
    description: "Listen to messages",
    icon: Voicemail,
    href: "/dashboard/voicemails",
  },
  {
    id: "ai-receptionist",
    type: "page",
    title: "AI Receptionist",
    description: "Configure your AI assistant",
    icon: Bot,
    href: "/dashboard/ai-receptionist",
  },
  {
    id: "billing",
    type: "page",
    title: "Billing",
    description: "Manage subscription and payments",
    icon: CreditCard,
    href: "/dashboard/billing",
  },
  {
    id: "settings",
    type: "page",
    title: "Settings",
    description: "Account settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
  {
    id: "help",
    type: "page",
    title: "Help & Support",
    description: "Get help",
    icon: HelpCircle,
    href: "/dashboard/help",
  },
];

const actions: SearchResult[] = [
  {
    id: "new-number",
    type: "action",
    title: "Add New Number",
    description: "Get a new business phone number",
    icon: Phone,
    href: "/dashboard/phone-numbers",
  },
  {
    id: "new-extension",
    type: "action",
    title: "Add Team Member",
    description: "Create a new extension",
    icon: Users,
    href: "/dashboard/extensions",
  },
  {
    id: "configure-ai",
    type: "action",
    title: "Configure AI Greeting",
    description: "Update your AI receptionist",
    icon: Bot,
    href: "/dashboard/ai-receptionist",
  },
];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// Inner component that handles search - remounts when key changes
function GlobalSearchInner({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const searchResults = (() => {
    if (!query.trim()) {
      return [...pages.slice(0, 5), ...actions.slice(0, 2)];
    }

    const lowerQuery = query.toLowerCase();
    const filtered = [...pages, ...actions].filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );

    return filtered.slice(0, 8);
  })();

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(0);
  }, []);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      if (result.action) {
        result.action();
      } else if (result.href) {
        router.push(result.href);
      }
      onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (searchResults[selectedIndex]) {
            handleSelect(searchResults[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [searchResults, selectedIndex, handleSelect, onClose]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-4 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search Input */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search pages, actions, or contacts..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-[#1E3A5F] placeholder:text-gray-400"
        />
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Results */}
      <div className="max-h-[400px] overflow-y-auto">
        {searchResults.length > 0 ? (
          <div className="p-2">
            {searchResults.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                  selectedIndex === index
                    ? "bg-[#FDF8E8]"
                    : "hover:bg-gray-50"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    selectedIndex === index
                      ? "bg-[#C9A227] text-white"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  <result.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium truncate",
                      selectedIndex === index
                        ? "text-[#1E3A5F]"
                        : "text-gray-700"
                    )}
                  >
                    {result.title}
                  </p>
                  {result.description && (
                    <p className="text-sm text-gray-500 truncate">
                      {result.description}
                    </p>
                  )}
                </div>
                {selectedIndex === index && (
                  <ArrowRight className="h-4 w-4 text-[#C9A227]" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No results found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try searching for something else
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">
              ↑↓
            </kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">
              Enter
            </kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">
              Esc
            </kbd>
            Close
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Command className="h-3 w-3" />
          <span>K to open</span>
        </div>
      </div>
    </motion.div>
  );
}

// Wrapper component that handles open/close state
export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  // Track open count to force remount on each open
  const [openCount, setOpenCount] = useState(0);
  const wasOpen = useRef(false);

  // Update open count when modal opens (not in effect, but derived)
  if (isOpen && !wasOpen.current) {
    wasOpen.current = true;
    // Schedule state update for next render to avoid sync setState in render
    Promise.resolve().then(() => setOpenCount((c) => c + 1));
  } else if (!isOpen && wasOpen.current) {
    wasOpen.current = false;
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[15vh]"
        onClick={onClose}
      >
        <GlobalSearchInner key={openCount} onClose={onClose} />
      </motion.div>
    </AnimatePresence>
  );
}

export default GlobalSearch;

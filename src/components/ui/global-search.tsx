"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ============================================
// Types
// ============================================

interface SearchResult {
  id: string;
  type: "contact" | "call" | "voicemail" | "page" | "action";
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  url?: string;
  action?: () => void;
}

interface SearchCategory {
  name: string;
  results: SearchResult[];
}

// ============================================
// Quick Actions & Pages
// ============================================

const quickPages: SearchResult[] = [
  { id: "page-dashboard", type: "page", title: "Dashboard", subtitle: "Home", url: "/dashboard" },
  { id: "page-calls", type: "page", title: "Call History", subtitle: "View call logs", url: "/dashboard/calls" },
  { id: "page-voicemails", type: "page", title: "Voicemails", subtitle: "Listen to messages", url: "/dashboard/voicemails" },
  { id: "page-contacts", type: "page", title: "Contacts", subtitle: "Manage contacts", url: "/dashboard/contacts" },
  { id: "page-messaging", type: "page", title: "Messaging", subtitle: "SMS/Text messages", url: "/dashboard/messaging" },
  { id: "page-analytics", type: "page", title: "Analytics", subtitle: "Call reports", url: "/dashboard/analytics" },
  { id: "page-ai", type: "page", title: "AI Receptionist", subtitle: "Configure AI", url: "/dashboard/ai-receptionist" },
  { id: "page-numbers", type: "page", title: "Phone Numbers", subtitle: "Manage numbers", url: "/dashboard/phone-numbers" },
  { id: "page-extensions", type: "page", title: "Extensions", subtitle: "Team extensions", url: "/dashboard/extensions" },
  { id: "page-queues", type: "page", title: "Call Queues", subtitle: "Queue management", url: "/dashboard/queues" },
  { id: "page-ivr", type: "page", title: "IVR Builder", subtitle: "Phone tree editor", url: "/dashboard/ivr" },
  { id: "page-hours", type: "page", title: "Business Hours", subtitle: "Set schedule", url: "/dashboard/hours" },
  { id: "page-billing", type: "page", title: "Billing", subtitle: "Subscription & invoices", url: "/dashboard/billing" },
  { id: "page-settings", type: "page", title: "Settings", subtitle: "Account settings", url: "/dashboard/settings" },
  { id: "page-developer", type: "page", title: "Developer", subtitle: "API & webhooks", url: "/dashboard/developer" },
  { id: "page-help", type: "page", title: "Help", subtitle: "Get support", url: "/dashboard/help" },
];

// ============================================
// Global Search Component
// ============================================

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchCategory[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut to open (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setSearchResults([]);
    }
  }, [isOpen]);

  // Search logic
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const lowerQuery = searchQuery.toLowerCase();

    // Filter pages
    const matchedPages = quickPages.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.subtitle?.toLowerCase().includes(lowerQuery)
    );

    // Search contacts via API
    let contacts: SearchResult[] = [];
    try {
      const response = await fetch(`/api/contacts?search=${encodeURIComponent(searchQuery)}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        contacts = (data.contacts || []).map((c: { id: string; firstName: string; lastName: string; phone: string; email?: string }) => ({
          id: `contact-${c.id}`,
          type: "contact" as const,
          title: `${c.firstName} ${c.lastName}`,
          subtitle: c.phone || c.email,
          url: `/dashboard/contacts?id=${c.id}`,
        }));
      }
    } catch {
      // Ignore search errors
    }

    // Search calls via API
    let calls: SearchResult[] = [];
    try {
      const response = await fetch(`/api/calls?search=${encodeURIComponent(searchQuery)}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        calls = (data.calls || []).map((c: { id: string; fromNumber: string; toNumber: string; direction: string; createdAt: string }) => ({
          id: `call-${c.id}`,
          type: "call" as const,
          title: `${c.direction === "inbound" ? c.fromNumber : c.toNumber}`,
          subtitle: `${c.direction} - ${new Date(c.createdAt).toLocaleDateString()}`,
          url: `/dashboard/calls?id=${c.id}`,
        }));
      }
    } catch {
      // Ignore search errors
    }

    // Compile results
    const categories: SearchCategory[] = [];

    if (matchedPages.length > 0) {
      categories.push({ name: "Pages", results: matchedPages.slice(0, 5) });
    }
    if (contacts.length > 0) {
      categories.push({ name: "Contacts", results: contacts });
    }
    if (calls.length > 0) {
      categories.push({ name: "Recent Calls", results: calls });
    }

    setSearchResults(categories);
    setSelectedIndex(0);
    setIsLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Calculate all results flat array for keyboard navigation
  const allResults = searchResults.flatMap((cat) => cat.results);

  // Handle selection
  const handleSelect = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.url) {
      router.push(result.url);
    }
    setIsOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (allResults[selectedIndex]) {
          handleSelect(allResults[selectedIndex]);
        }
        break;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 bg-white rounded border">
          <span className="text-xs">Cmd</span>
          <span>K</span>
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="fixed inset-x-0 top-[10%] mx-auto max-w-xl z-50 px-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search contacts, calls, or navigate..."
              className="flex-1 text-lg outline-none placeholder-gray-400"
            />
            {isLoading && (
              <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <kbd className="px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.trim() === "" ? (
              // Show quick actions when no query
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Quick Navigation
                </div>
                {quickPages.slice(0, 8).map((page, index) => (
                  <ResultItem
                    key={page.id}
                    result={page}
                    isSelected={index === selectedIndex}
                    onSelect={() => handleSelect(page)}
                  />
                ))}
              </div>
            ) : searchResults.length === 0 && !isLoading ? (
              // No results
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              // Show categorized results
              <div className="p-2">
                {searchResults.map((category) => (
                  <div key={category.name}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      {category.name}
                    </div>
                    {category.results.map((result) => {
                      const globalIndex = allResults.findIndex((r) => r.id === result.id);
                      return (
                        <ResultItem
                          key={result.id}
                          result={result}
                          isSelected={globalIndex === selectedIndex}
                          onSelect={() => handleSelect(result)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border">Enter</kbd>
                <span>to select</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border">↑↓</kbd>
                <span>to navigate</span>
              </span>
            </div>
            <span>Powered by SMB Voice</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================
// Result Item Component
// ============================================

function ResultItem({
  result,
  isSelected,
  onSelect,
}: {
  result: SearchResult;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const typeIcons: Record<SearchResult["type"], React.ReactNode> = {
    page: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    contact: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    call: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    voicemail: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    action: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  };

  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
        transition-colors
        ${isSelected ? "bg-[#C9A227]/10 text-[#1E3A5F]" : "hover:bg-gray-100"}
      `}
    >
      <div className={`flex-shrink-0 ${isSelected ? "text-[#C9A227]" : "text-gray-400"}`}>
        {result.icon || typeIcons[result.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{result.title}</div>
        {result.subtitle && (
          <div className="text-sm text-gray-500 truncate">{result.subtitle}</div>
        )}
      </div>
      {isSelected && (
        <svg className="w-4 h-4 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

// ============================================
// Search Trigger Button (for header)
// ============================================

export function SearchTrigger({ className = "" }: { className?: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg ${className}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
      </div>
    );
  }

  return <GlobalSearch />;
}

export default GlobalSearch;

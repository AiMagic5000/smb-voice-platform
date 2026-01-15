"use client";

import { useState, useEffect, useCallback } from "react";

interface AuditLog {
  id: string;
  tenantId: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  resourceName: string | null;
  details: Record<string, unknown> | null;
  previousValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  status: string;
  errorMessage: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Filters {
  actions: string[];
  resourceTypes: string[];
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  login: "bg-purple-100 text-purple-700",
  logout: "bg-gray-100 text-gray-700",
  export: "bg-amber-100 text-amber-700",
  import: "bg-cyan-100 text-cyan-700",
  default: "bg-gray-100 text-gray-600",
};

const RESOURCE_ICONS: Record<string, string> = {
  phone_number: "📞",
  contact: "👤",
  extension: "🔌",
  call: "📲",
  voicemail: "📝",
  sms: "💬",
  recording: "🎙️",
  user: "👥",
  billing: "💳",
  settings: "⚙️",
  ai_receptionist: "🤖",
  webhook: "🔗",
  default: "📄",
};

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    actions: [],
    resourceTypes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedResourceType, setSelectedResourceType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const fetchLogs = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (selectedAction) params.set("action", selectedAction);
      if (selectedResourceType) params.set("resourceType", selectedResourceType);
      if (searchQuery) params.set("search", searchQuery);
      if (dateRange.start) params.set("startDate", dateRange.start);
      if (dateRange.end) params.set("endDate", dateRange.end);

      const response = await fetch(`/api/audit-logs?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
      }

      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
      setFilters(data.filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAction, selectedResourceType, searchQuery, dateRange]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(1);
  };

  const clearFilters = () => {
    setSelectedAction("");
    setSelectedResourceType("");
    setSearchQuery("");
    setDateRange({ start: "", end: "" });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatActionLabel = (action: string) => {
    return action
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const getActionColor = (action: string) => {
    return ACTION_COLORS[action] || ACTION_COLORS.default;
  };

  const getResourceIcon = (resourceType: string) => {
    return RESOURCE_ICONS[resourceType] || RESOURCE_ICONS.default;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#1E3A5F] dark:text-white">
              Audit Logs
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track all system activity and user actions
            </p>
          </div>
          <button
            onClick={() => fetchLogs(pagination.page)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by resource, user, or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227]"
              />
            </div>

            {/* Action Filter */}
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227]"
            >
              <option value="">All Actions</option>
              {filters.actions.map((action) => (
                <option key={action} value={action}>
                  {formatActionLabel(action)}
                </option>
              ))}
            </select>

            {/* Resource Type Filter */}
            <select
              value={selectedResourceType}
              onChange={(e) => setSelectedResourceType(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227]"
            >
              <option value="">All Resources</option>
              {filters.resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {formatActionLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227]"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227]"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#C9A227] text-white rounded-lg hover:bg-[#B8922C] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading audit logs...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchLogs(pagination.page)}
              className="mt-2 text-[#C9A227] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mt-4">No audit logs found</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Resource Icon */}
                <div className="text-2xl">{getResourceIcon(log.resourceType)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getActionColor(
                        log.action
                      )}`}
                    >
                      {formatActionLabel(log.action)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {formatActionLabel(log.resourceType)}
                    </span>
                    {log.status === "failure" && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        Failed
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {log.resourceName || log.resourceId || "Resource"}
                    {log.userEmail && (
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}
                        by {log.userEmail}
                      </span>
                    )}
                  </p>

                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDate(log.createdAt)}</span>
                    {log.ipAddress && log.ipAddress !== "unknown" && (
                      <span>IP: {log.ipAddress}</span>
                    )}
                  </div>

                  {/* Expandable Details */}
                  {(log.details || log.previousValues || log.newValues || log.errorMessage) && (
                    <button
                      onClick={() =>
                        setExpandedLog(expandedLog === log.id ? null : log.id)
                      }
                      className="mt-2 text-xs text-[#C9A227] hover:underline"
                    >
                      {expandedLog === log.id ? "Hide details" : "Show details"}
                    </button>
                  )}

                  {expandedLog === log.id && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs space-y-2">
                      {log.errorMessage && (
                        <div>
                          <span className="font-medium text-red-600">Error:</span>{" "}
                          <span className="text-red-600">{log.errorMessage}</span>
                        </div>
                      )}
                      {log.previousValues && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            Previous:
                          </span>
                          <pre className="mt-1 text-gray-700 dark:text-gray-300 overflow-x-auto">
                            {JSON.stringify(log.previousValues, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.newValues && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            New:
                          </span>
                          <pre className="mt-1 text-gray-700 dark:text-gray-300 overflow-x-auto">
                            {JSON.stringify(log.newValues, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.details && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            Details:
                          </span>
                          <pre className="mt-1 text-gray-700 dark:text-gray-300 overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} logs
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchLogs(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => fetchLogs(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLogViewer;

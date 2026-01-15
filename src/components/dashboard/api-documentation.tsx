"use client";

import { useState } from "react";
import {
  Code,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Lock,
  Zap,
  Book,
  Terminal,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface APIEndpoint {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  description: string;
  auth: boolean;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response?: string;
}

interface APICategory {
  name: string;
  description: string;
  endpoints: APIEndpoint[];
}

const apiCategories: APICategory[] = [
  {
    name: "Phone Numbers",
    description: "Manage your phone numbers and provisioning",
    endpoints: [
      {
        method: "GET",
        path: "/api/phone-numbers",
        description: "List all phone numbers for your account",
        auth: true,
        response: '{ "phoneNumbers": [...], "pagination": {...} }',
      },
      {
        method: "GET",
        path: "/api/phone-numbers/available",
        description: "Search for available phone numbers to purchase",
        auth: true,
        parameters: [
          { name: "areaCode", type: "string", required: false, description: "Filter by area code" },
          { name: "type", type: "string", required: false, description: "local, tollFree, or mobile" },
        ],
      },
      {
        method: "POST",
        path: "/api/phone-numbers/provision",
        description: "Provision a new phone number",
        auth: true,
        parameters: [
          { name: "phoneNumber", type: "string", required: true, description: "Phone number to provision" },
          { name: "type", type: "string", required: true, description: "Number type" },
        ],
      },
    ],
  },
  {
    name: "Calls",
    description: "Call management and click-to-call",
    endpoints: [
      {
        method: "GET",
        path: "/api/calls",
        description: "List call history with filtering",
        auth: true,
        parameters: [
          { name: "startDate", type: "string", required: false, description: "Filter from date (ISO 8601)" },
          { name: "endDate", type: "string", required: false, description: "Filter to date (ISO 8601)" },
          { name: "direction", type: "string", required: false, description: "inbound or outbound" },
        ],
      },
      {
        method: "GET",
        path: "/api/calls/:id",
        description: "Get details for a specific call",
        auth: true,
      },
      {
        method: "POST",
        path: "/api/calls/click-to-call",
        description: "Initiate an outbound call",
        auth: true,
        parameters: [
          { name: "to", type: "string", required: true, description: "Destination phone number" },
          { name: "from", type: "string", required: true, description: "Your phone number (caller ID)" },
        ],
      },
    ],
  },
  {
    name: "SMS",
    description: "Send and receive text messages",
    endpoints: [
      {
        method: "GET",
        path: "/api/sms",
        description: "List SMS messages",
        auth: true,
      },
      {
        method: "POST",
        path: "/api/sms",
        description: "Send an SMS message",
        auth: true,
        parameters: [
          { name: "to", type: "string", required: true, description: "Recipient phone number" },
          { name: "from", type: "string", required: true, description: "Your phone number" },
          { name: "body", type: "string", required: true, description: "Message content" },
        ],
      },
    ],
  },
  {
    name: "Contacts",
    description: "Contact management",
    endpoints: [
      {
        method: "GET",
        path: "/api/contacts",
        description: "List all contacts",
        auth: true,
      },
      {
        method: "POST",
        path: "/api/contacts",
        description: "Create a new contact",
        auth: true,
        parameters: [
          { name: "firstName", type: "string", required: true, description: "First name" },
          { name: "lastName", type: "string", required: false, description: "Last name" },
          { name: "phoneNumber", type: "string", required: true, description: "Phone number" },
          { name: "email", type: "string", required: false, description: "Email address" },
        ],
      },
      {
        method: "PATCH",
        path: "/api/contacts/:id",
        description: "Update a contact",
        auth: true,
      },
      {
        method: "DELETE",
        path: "/api/contacts/:id",
        description: "Delete a contact",
        auth: true,
      },
    ],
  },
  {
    name: "Voicemails",
    description: "Voicemail management",
    endpoints: [
      {
        method: "GET",
        path: "/api/voicemails",
        description: "List all voicemails",
        auth: true,
      },
      {
        method: "GET",
        path: "/api/voicemails/:id",
        description: "Get voicemail details and audio URL",
        auth: true,
      },
      {
        method: "DELETE",
        path: "/api/voicemails/:id",
        description: "Delete a voicemail",
        auth: true,
      },
    ],
  },
];

const methodColors = {
  GET: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PATCH: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  PUT: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function APIDocumentation() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    apiCategories[0]?.name || null
  );
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateCurlExample = (endpoint: APIEndpoint) => {
    const baseUrl = "https://api.smbvoice.com";
    let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;
    curl += ` \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;
    curl += ` \\\n  -H "Content-Type: application/json"`;

    if (endpoint.method === "POST" || endpoint.method === "PATCH") {
      const bodyObj: Record<string, string> = {};
      endpoint.parameters?.forEach((p) => {
        if (p.required) {
          bodyObj[p.name] = `<${p.type}>`;
        }
      });
      if (Object.keys(bodyObj).length > 0) {
        curl += ` \\\n  -d '${JSON.stringify(bodyObj, null, 2)}'`;
      }
    }

    return curl;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            API Documentation
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Integrate SMB Voice into your applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 dark:border-gray-700">
            <Book className="h-4 w-4" />
            Full Docs
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button variant="outline" className="gap-2 dark:border-gray-700">
            <Terminal className="h-4 w-4" />
            API Console
          </Button>
        </div>
      </div>

      {/* Quick Start */}
      <div className="p-6 bg-[#1E3A5F] dark:bg-gray-800 rounded-xl text-white">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#C9A227]" />
          Quick Start
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-white/70 mb-2">Base URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-2 bg-white/10 rounded-lg font-mono text-sm">
                https://api.smbvoice.com/v1
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  handleCopy("https://api.smbvoice.com/v1", "baseUrl")
                }
                className="text-white hover:bg-white/10"
              >
                {copiedCode === "baseUrl" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-white/70 mb-2">Authentication</p>
            <code className="block px-4 py-2 bg-white/10 rounded-lg font-mono text-sm overflow-x-auto">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
        </div>
      </div>

      {/* API Key Info */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <Key className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-amber-800 dark:text-amber-300">
            API Keys
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            Generate and manage your API keys in the{" "}
            <a href="/dashboard/developer" className="underline">
              Developer Settings
            </a>
            . Keep your keys secure and never expose them in client-side code.
          </p>
        </div>
      </div>

      {/* API Categories */}
      <div className="space-y-4">
        {apiCategories.map((category) => {
          const isExpanded = expandedCategory === category.name;

          return (
            <div
              key={category.name}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : category.name)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-[#1E3A5F] dark:text-[#C9A227]" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.endpoints.length} endpoints
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Endpoints */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {category.endpoints.map((endpoint, idx) => {
                    const endpointId = `${category.name}-${idx}`;
                    const isEndpointExpanded = expandedEndpoint === endpointId;

                    return (
                      <div
                        key={idx}
                        className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <button
                          onClick={() =>
                            setExpandedEndpoint(
                              isEndpointExpanded ? null : endpointId
                            )
                          }
                          className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "px-2 py-1 text-xs font-mono font-bold rounded",
                                methodColors[endpoint.method]
                              )}
                            >
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                              {endpoint.path}
                            </code>
                            {endpoint.auth && (
                              <Lock className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                            {endpoint.description}
                          </span>
                        </button>

                        {isEndpointExpanded && (
                          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {endpoint.description}
                            </p>

                            {/* Parameters */}
                            {endpoint.parameters &&
                              endpoint.parameters.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Parameters
                                  </h4>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="text-left text-gray-500 dark:text-gray-400">
                                          <th className="pb-2 pr-4">Name</th>
                                          <th className="pb-2 pr-4">Type</th>
                                          <th className="pb-2 pr-4">Required</th>
                                          <th className="pb-2">Description</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-gray-700 dark:text-gray-300">
                                        {endpoint.parameters.map((param) => (
                                          <tr key={param.name}>
                                            <td className="py-1 pr-4 font-mono text-[#1E3A5F] dark:text-[#C9A227]">
                                              {param.name}
                                            </td>
                                            <td className="py-1 pr-4 text-gray-500 dark:text-gray-400">
                                              {param.type}
                                            </td>
                                            <td className="py-1 pr-4">
                                              {param.required ? (
                                                <span className="text-red-500">
                                                  Yes
                                                </span>
                                              ) : (
                                                <span className="text-gray-400">
                                                  No
                                                </span>
                                              )}
                                            </td>
                                            <td className="py-1">
                                              {param.description}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                            {/* Example */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  Example Request
                                </h4>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleCopy(
                                      generateCurlExample(endpoint),
                                      endpointId
                                    )
                                  }
                                  className="gap-1 text-xs"
                                >
                                  {copiedCode === endpointId ? (
                                    <>
                                      <Check className="h-3 w-3" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                              </div>
                              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs font-mono">
                                {generateCurlExample(endpoint)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rate Limits */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Rate Limits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Standard</p>
            <p className="font-medium text-gray-900 dark:text-white">
              100 requests/minute
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Pro</p>
            <p className="font-medium text-gray-900 dark:text-white">
              500 requests/minute
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Enterprise</p>
            <p className="font-medium text-gray-900 dark:text-white">
              Unlimited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

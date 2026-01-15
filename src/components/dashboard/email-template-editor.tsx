"use client";

import { useState } from "react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "voicemail" | "missed_call" | "call_summary" | "welcome" | "invoice" | "custom";
  isActive: boolean;
  variables: string[];
  lastModified: Date;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "voicemail-notification",
    name: "Voicemail Notification",
    subject: "New Voicemail from {{caller_name}}",
    body: `Hi {{recipient_name}},

You have a new voicemail from {{caller_name}} ({{caller_number}}).

Duration: {{duration}}
Received: {{timestamp}}

{{#if transcription}}
Transcription:
"{{transcription}}"
{{/if}}

Listen to the full message in your dashboard.

Best,
{{company_name}}`,
    type: "voicemail",
    isActive: true,
    variables: ["recipient_name", "caller_name", "caller_number", "duration", "timestamp", "transcription", "company_name"],
    lastModified: new Date(),
  },
  {
    id: "missed-call",
    name: "Missed Call Alert",
    subject: "Missed Call from {{caller_name}}",
    body: `Hi {{recipient_name}},

You missed a call from {{caller_name}} ({{caller_number}}).

Time: {{timestamp}}

Return the call or check your dashboard for more details.

Best,
{{company_name}}`,
    type: "missed_call",
    isActive: true,
    variables: ["recipient_name", "caller_name", "caller_number", "timestamp", "company_name"],
    lastModified: new Date(),
  },
  {
    id: "daily-summary",
    name: "Daily Call Summary",
    subject: "Your Daily Call Summary - {{date}}",
    body: `Hi {{recipient_name}},

Here's your call summary for {{date}}:

Total Calls: {{total_calls}}
Answered: {{answered_calls}}
Missed: {{missed_calls}}
Voicemails: {{voicemail_count}}

Average Call Duration: {{avg_duration}}
Total Talk Time: {{total_duration}}

View detailed analytics in your dashboard.

Best,
{{company_name}}`,
    type: "call_summary",
    isActive: false,
    variables: ["recipient_name", "date", "total_calls", "answered_calls", "missed_calls", "voicemail_count", "avg_duration", "total_duration", "company_name"],
    lastModified: new Date(),
  },
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to {{company_name}}!",
    body: `Hi {{recipient_name}},

Welcome to {{company_name}}! We're excited to have you on board.

Your phone number: {{phone_number}}

Getting Started:
1. Set up your voicemail greeting
2. Configure your business hours
3. Customize your AI receptionist

Need help? Reply to this email or check our help center.

Best,
The {{company_name}} Team`,
    type: "welcome",
    isActive: true,
    variables: ["recipient_name", "company_name", "phone_number"],
    lastModified: new Date(),
  },
];

export function EmailTemplateEditor() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditedSubject(template.subject);
    setEditedBody(template.body);
    setShowPreview(false);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id
          ? { ...t, subject: editedSubject, body: editedBody, lastModified: new Date() }
          : t
      )
    );

    setSelectedTemplate((prev) =>
      prev ? { ...prev, subject: editedSubject, body: editedBody, lastModified: new Date() } : null
    );

    setIsSaving(false);
  };

  const toggleActive = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, isActive: !t.isActive } : t))
    );
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById("template-body") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBody =
        editedBody.substring(0, start) + `{{${variable}}}` + editedBody.substring(end);
      setEditedBody(newBody);
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length + 4;
        textarea.focus();
      }, 0);
    }
  };

  const previewContent = (content: string) => {
    const sampleData: Record<string, string> = {
      recipient_name: "John Smith",
      caller_name: "Jane Doe",
      caller_number: "(555) 123-4567",
      duration: "2:34",
      timestamp: "Jan 14, 2026 at 3:45 PM",
      transcription: "Hi, this is Jane calling about the project proposal...",
      company_name: "Acme Corp",
      date: "January 14, 2026",
      total_calls: "23",
      answered_calls: "18",
      missed_calls: "5",
      voicemail_count: "3",
      avg_duration: "4:12",
      total_duration: "1h 36m",
      phone_number: "(555) 987-6543",
    };

    let result = content;
    // Replace simple variables
    Object.entries(sampleData).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    });
    // Handle conditionals (simplified)
    result = result.replace(/\{\{#if \w+\}\}/g, "");
    result = result.replace(/\{\{\/if\}\}/g, "");
    return result;
  };

  const getTypeColor = (type: EmailTemplate["type"]) => {
    const colors = {
      voicemail: "bg-purple-100 text-purple-700",
      missed_call: "bg-red-100 text-red-700",
      call_summary: "bg-blue-100 text-blue-700",
      welcome: "bg-green-100 text-green-700",
      invoice: "bg-amber-100 text-amber-700",
      custom: "bg-gray-100 text-gray-700",
    };
    return colors[type];
  };

  const getTypeLabel = (type: EmailTemplate["type"]) => {
    const labels = {
      voicemail: "Voicemail",
      missed_call: "Missed Call",
      call_summary: "Summary",
      welcome: "Welcome",
      invoice: "Invoice",
      custom: "Custom",
    };
    return labels[type];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#1E3A5F]">Email Templates</h2>
        <p className="text-sm text-gray-500 mt-1">
          Customize the emails your system sends automatically
        </p>
      </div>

      <div className="flex h-[600px]">
        {/* Template List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227]"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => selectTemplate(template)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedTemplate?.id === template.id ? "bg-[#C9A227]/10" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#1E3A5F] truncate">
                        {template.name}
                      </span>
                      {!template.isActive && (
                        <span className="text-xs text-gray-400">(disabled)</span>
                      )}
                    </div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getTypeColor(
                        template.type
                      )}`}
                    >
                      {getTypeLabel(template.type)}
                    </span>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      template.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button className="w-full px-4 py-2 text-sm text-[#C9A227] border border-[#C9A227] rounded-lg hover:bg-[#C9A227]/5 transition-colors">
              + Create Custom Template
            </button>
          </div>
        </div>

        {/* Editor */}
        {selectedTemplate ? (
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedTemplate.isActive}
                    onChange={() => toggleActive(selectedTemplate.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#C9A227] focus:ring-[#C9A227]"
                  />
                  <span className="text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    showPreview
                      ? "bg-[#1E3A5F] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {showPreview ? "Edit" : "Preview"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-1.5 text-sm bg-[#C9A227] text-white rounded-lg hover:bg-[#B8922C] disabled:opacity-50 transition-colors"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {showPreview ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      SUBJECT PREVIEW
                    </label>
                    <p className="text-[#1E3A5F] font-medium">
                      {previewContent(editedSubject)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      BODY PREVIEW
                    </label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {previewContent(editedBody)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Body
                    </label>
                    <textarea
                      id="template-body"
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Variables
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable) => (
                        <button
                          key={variable}
                          onClick={() => insertVariable(variable)}
                          className="px-2 py-1 text-xs bg-[#1E3A5F]/10 text-[#1E3A5F] rounded hover:bg-[#1E3A5F]/20 transition-colors font-mono"
                        >
                          {`{{${variable}}}`}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Click a variable to insert it at cursor position
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
              Last modified:{" "}
              {selectedTemplate.lastModified.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p>Select a template to edit</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailTemplateEditor;

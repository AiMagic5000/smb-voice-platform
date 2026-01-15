/**
 * Data Export Utilities for SMB Voice Platform
 *
 * Provides CSV and JSON export functionality for various data types.
 */

/**
 * Convert array of objects to CSV string
 */
export function toCSV<T extends Record<string, unknown>>(
  data: T[],
  columns?: { key: keyof T; header: string }[]
): string {
  if (data.length === 0) {
    return "";
  }

  // Determine columns
  const cols = columns || Object.keys(data[0]).map((key) => ({
    key: key as keyof T,
    header: formatHeader(key),
  }));

  // Header row
  const header = cols.map((col) => escapeCSV(col.header)).join(",");

  // Data rows
  const rows = data.map((item) =>
    cols.map((col) => {
      const value = item[col.key];
      return escapeCSV(formatValue(value));
    }).join(",")
  );

  return [header, ...rows].join("\n");
}

/**
 * Escape CSV special characters
 */
function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format header from camelCase to Title Case
 */
function formatHeader(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Format value for CSV export
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Download data as file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data as CSV file
 */
export function exportCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; header: string }[]
): void {
  const csv = toCSV(data, columns);
  downloadFile(csv, `${filename}.csv`, "text/csv");
}

/**
 * Export data as JSON file
 */
export function exportJSON<T>(data: T, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, "application/json");
}

// ============================================
// Specific Export Functions
// ============================================

/**
 * Export call logs
 */
export interface CallLogExport {
  [key: string]: unknown;
  id: string;
  direction: string;
  fromNumber: string;
  toNumber: string;
  extension?: string;
  duration?: number;
  status: string;
  createdAt: string;
}

export function exportCallLogs(calls: CallLogExport[], format: "csv" | "json" = "csv"): void {
  const filename = `call-logs-${new Date().toISOString().split("T")[0]}`;

  if (format === "json") {
    exportJSON(calls, filename);
    return;
  }

  const columns = [
    { key: "createdAt" as const, header: "Date/Time" },
    { key: "direction" as const, header: "Direction" },
    { key: "fromNumber" as const, header: "From" },
    { key: "toNumber" as const, header: "To" },
    { key: "extension" as const, header: "Extension" },
    { key: "duration" as const, header: "Duration (sec)" },
    { key: "status" as const, header: "Status" },
  ];

  exportCSV(calls, filename, columns);
}

/**
 * Export contacts
 */
export interface ContactExport {
  [key: string]: unknown;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  company?: string;
  department?: string;
  notes?: string;
}

export function exportContacts(contacts: ContactExport[], format: "csv" | "json" = "csv"): void {
  const filename = `contacts-${new Date().toISOString().split("T")[0]}`;

  if (format === "json") {
    exportJSON(contacts, filename);
    return;
  }

  const columns = [
    { key: "firstName" as const, header: "First Name" },
    { key: "lastName" as const, header: "Last Name" },
    { key: "email" as const, header: "Email" },
    { key: "phone" as const, header: "Phone" },
    { key: "company" as const, header: "Company" },
    { key: "department" as const, header: "Department" },
    { key: "notes" as const, header: "Notes" },
  ];

  exportCSV(contacts, filename, columns);
}

/**
 * Export voicemails
 */
export interface VoicemailExport {
  [key: string]: unknown;
  extension: string;
  callerNumber: string;
  callerName?: string;
  duration: number;
  transcription?: string;
  isRead: boolean;
  createdAt: string;
}

export function exportVoicemails(voicemails: VoicemailExport[], format: "csv" | "json" = "csv"): void {
  const filename = `voicemails-${new Date().toISOString().split("T")[0]}`;

  if (format === "json") {
    exportJSON(voicemails, filename);
    return;
  }

  const columns = [
    { key: "createdAt" as const, header: "Date/Time" },
    { key: "extension" as const, header: "Extension" },
    { key: "callerNumber" as const, header: "Caller" },
    { key: "callerName" as const, header: "Caller Name" },
    { key: "duration" as const, header: "Duration (sec)" },
    { key: "transcription" as const, header: "Transcription" },
    { key: "isRead" as const, header: "Read" },
  ];

  exportCSV(voicemails, filename, columns);
}

/**
 * Export SMS messages
 */
export interface SMSExport {
  [key: string]: unknown;
  direction: string;
  fromNumber: string;
  toNumber: string;
  body: string;
  status: string;
  createdAt: string;
}

export function exportSMSMessages(messages: SMSExport[], format: "csv" | "json" = "csv"): void {
  const filename = `sms-messages-${new Date().toISOString().split("T")[0]}`;

  if (format === "json") {
    exportJSON(messages, filename);
    return;
  }

  const columns = [
    { key: "createdAt" as const, header: "Date/Time" },
    { key: "direction" as const, header: "Direction" },
    { key: "fromNumber" as const, header: "From" },
    { key: "toNumber" as const, header: "To" },
    { key: "body" as const, header: "Message" },
    { key: "status" as const, header: "Status" },
  ];

  exportCSV(messages, filename, columns);
}

/**
 * Export invoices
 */
export interface InvoiceExport {
  [key: string]: unknown;
  number: string;
  date: string;
  dueDate: string;
  status: string;
  amount: number;
  currency: string;
}

export function exportInvoices(invoices: InvoiceExport[], format: "csv" | "json" = "csv"): void {
  const filename = `invoices-${new Date().toISOString().split("T")[0]}`;

  if (format === "json") {
    exportJSON(invoices, filename);
    return;
  }

  // Transform amount to dollars
  const transformedInvoices = invoices.map((inv) => ({
    ...inv,
    amount: `$${(inv.amount / 100).toFixed(2)}`,
  }));

  const columns = [
    { key: "number" as const, header: "Invoice Number" },
    { key: "date" as const, header: "Date" },
    { key: "dueDate" as const, header: "Due Date" },
    { key: "amount" as const, header: "Amount" },
    { key: "status" as const, header: "Status" },
  ];

  exportCSV(transformedInvoices, filename, columns);
}

/**
 * Parse CSV file to array of objects
 */
export function parseCSV<T extends Record<string, string>>(
  csvContent: string,
  headerMap?: Record<string, keyof T>
): T[] {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);

  // Parse data rows
  const data: T[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      const key = headerMap?.[header] || header;
      row[key as string] = values[index] || "";
    });

    data.push(row as T);
  }

  return data;
}

/**
 * Parse a single CSV line
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

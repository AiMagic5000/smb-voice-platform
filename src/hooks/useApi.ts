/**
 * API Data Fetching Hooks for SMB Voice Platform
 *
 * These hooks provide easy-to-use data fetching with caching,
 * error handling, and automatic revalidation.
 */

import { useState, useEffect, useCallback, useRef } from "react";

// Base fetch options
interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

// Generic hook return type
interface UseApiReturn<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  mutate: () => Promise<void>;
}

// Simple cache for deduplication
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

/**
 * Base API fetcher with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Generic data fetching hook
 */
export function useApi<T>(
  endpoint: string | null,
  options: FetchOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setIsLoading(false);
      return;
    }

    // Check cache for GET requests
    if (options.method === "GET" || !options.method) {
      const cached = cache.get(endpoint);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data as T);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchApi<T>(endpoint, options);
      if (mountedRef.current) {
        setData(result);
        // Update cache
        if (options.method === "GET" || !options.method) {
          cache.set(endpoint, { data: result, timestamp: Date.now() });
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [endpoint, options.method, options.body]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  const mutate = useCallback(async () => {
    if (endpoint) {
      cache.delete(endpoint);
    }
    await fetchData();
  }, [endpoint, fetchData]);

  return { data, error, isLoading, mutate };
}

// ============================================
// Specialized Hooks for Each Resource
// ============================================

/**
 * Phone numbers hook
 */
export interface PhoneNumber {
  id: string;
  number: string;
  type: "local" | "toll_free";
  routesTo: string;
  status: string;
  voiceEnabled: boolean;
  smsEnabled: boolean;
}

export function usePhoneNumbers() {
  return useApi<{ phoneNumbers: PhoneNumber[] }>("/api/phone-numbers");
}

/**
 * Extensions hook
 */
export interface Extension {
  id: string;
  extension: string;
  name: string;
  email: string | null;
  status: string;
  forwardTo: string | null;
}

export function useExtensions() {
  return useApi<{ extensions: Extension[] }>("/api/extensions");
}

/**
 * Call logs hook with filtering
 */
export interface CallLog {
  id: string;
  direction: "inbound" | "outbound";
  fromNumber: string;
  toNumber: string;
  extension: string | null;
  duration: number | null;
  status: string;
  recordingUrl: string | null;
  createdAt: string;
}

export interface CallStats {
  total: number;
  inbound: number;
  outbound: number;
  answered: number;
  missed: number;
  voicemail: number;
  avgDuration: number;
}

export function useCalls(params?: {
  direction?: string;
  status?: string;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.direction) query.set("direction", params.direction);
  if (params?.status) query.set("status", params.status);
  if (params?.limit) query.set("limit", String(params.limit));

  const endpoint = `/api/calls${query.toString() ? `?${query}` : ""}`;
  return useApi<{ calls: CallLog[]; stats: CallStats; total: number }>(endpoint);
}

/**
 * Voicemails hook
 */
export interface Voicemail {
  id: string;
  extension: string;
  callerNumber: string;
  callerName: string | null;
  duration: number;
  transcription: string | null;
  audioUrl: string;
  isRead: boolean;
  createdAt: string;
}

export function useVoicemails(params?: { extension?: string; isRead?: boolean }) {
  const query = new URLSearchParams();
  if (params?.extension) query.set("extension", params.extension);
  if (params?.isRead !== undefined) query.set("isRead", String(params.isRead));

  const endpoint = `/api/voicemails${query.toString() ? `?${query}` : ""}`;
  return useApi<{ voicemails: Voicemail[]; unreadCount: number; total: number }>(endpoint);
}

/**
 * Contacts hook
 */
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  company: string | null;
  isFavorite: boolean;
  lastContactedAt: string | null;
}

export function useContacts(params?: { search?: string; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.limit) query.set("limit", String(params.limit));

  const endpoint = `/api/contacts${query.toString() ? `?${query}` : ""}`;
  return useApi<{ contacts: Contact[]; total: number }>(endpoint);
}

/**
 * AI Receptionist configuration hook
 */
export interface AIReceptionistConfig {
  id: string | null;
  greeting: string;
  businessDescription: string;
  businessHours: string;
  transferExtension: string;
  isEnabled: boolean;
  swmlConfig: Record<string, unknown>;
}

export function useAIReceptionist() {
  return useApi<AIReceptionistConfig>("/api/ai-receptionist");
}

/**
 * Billing information hook
 */
export interface BillingInfo {
  subscription: {
    plan: string;
    status: string;
    billingCycle: string;
    nextBillingDate: string;
    basePrice: number;
  };
  phoneNumbers: {
    local: number;
    tollFree: number;
    total: number;
  };
  usage: {
    current: {
      aiMinutes: number;
      smsOutbound: number;
      smsInbound: number;
      callMinutes: number;
      recordingStorageGB: number;
    };
    charges: Record<string, number>;
  };
  charges: {
    base: number;
    additionalNumbers: number;
    tollFree: number;
    usage: number;
    total: number;
  };
  paymentMethod: {
    type: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

export function useBilling() {
  return useApi<BillingInfo>("/api/billing");
}

/**
 * Settings hook
 */
export interface UserSettings {
  userId: string;
  orgId: string | null;
  settings: {
    notifications: {
      emailOnMissedCall: boolean;
      emailOnVoicemail: boolean;
      emailOnSMS: boolean;
      pushNotifications: boolean;
      dailyDigest: boolean;
    };
    callHandling: {
      defaultRingTimeout: number;
      sendToVoicemailAfter: number;
      recordAllCalls: boolean;
      transcribeVoicemails: boolean;
      callScreening: boolean;
    };
    display: {
      timezone: string;
      dateFormat: string;
      timeFormat: string;
      language: string;
    };
    privacy: {
      showCallerIdOnOutbound: boolean;
      blockAnonymousCalls: boolean;
      doNotDisturb: boolean;
      doNotDisturbSchedule: string | null;
    };
  };
  updatedAt: string;
}

export function useSettings() {
  return useApi<UserSettings>("/api/settings");
}

/**
 * Business hours hook
 */
export interface BusinessHoursConfig {
  id: string;
  timezone: string;
  schedule: Record<string, { enabled: boolean; openTime: string; closeTime: string }>;
  holidays: Array<{ id: string; name: string; date: string; recurring: boolean }>;
  afterHoursAction: string;
  afterHoursTarget: string | null;
  afterHoursMessage: string | null;
  isActive: boolean;
}

export function useBusinessHours() {
  return useApi<BusinessHoursConfig>("/api/business-hours");
}

/**
 * IVR menus hook
 */
export interface IVRMenu {
  id: string;
  name: string;
  greeting: string;
  options: Array<{
    id: string;
    digit: string;
    label: string;
    action: string;
    target?: string;
  }>;
  timeout: number;
  timeoutAction: string;
  isDefault: boolean;
  isEnabled: boolean;
}

export function useIVRMenus() {
  return useApi<{ menus: IVRMenu[] }>("/api/ivr");
}

/**
 * Call queues hook
 */
export interface CallQueue {
  id: string;
  name: string;
  description: string | null;
  ringStrategy: string;
  ringTimeout: number;
  maxWaitTime: number;
  holdMusic: string;
  announcePosition: boolean;
  announceWaitTime: boolean;
  wrapUpTime: number;
  isEnabled: boolean;
  agentCount?: number;
}

export function useCallQueues() {
  return useApi<{ queues: CallQueue[] }>("/api/queues");
}

/**
 * Invoices hook
 */
export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: string;
  amount: number;
  currency: string;
  items: Array<{ description: string; amount: number }>;
  paidAt: string | null;
  pdfUrl: string;
}

export function useInvoices(params?: { status?: string; year?: string; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.year) query.set("year", params.year);
  if (params?.limit) query.set("limit", String(params.limit));

  const endpoint = `/api/billing/invoices${query.toString() ? `?${query}` : ""}`;
  return useApi<{
    invoices: Invoice[];
    summary: {
      total: number;
      totalPaid: number;
      totalPending: number;
      currency: string;
    };
  }>(endpoint);
}

/**
 * Mutation helper for POST/PUT/PATCH/DELETE
 */
export function useApiMutation<TData, TResponse>(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (data?: TData): Promise<TResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchApi<TResponse>(endpoint, {
          method,
          body: data,
        });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, method]
  );

  return { mutate, isLoading, error };
}

/**
 * Clear all cached data
 */
export function clearApiCache() {
  cache.clear();
}

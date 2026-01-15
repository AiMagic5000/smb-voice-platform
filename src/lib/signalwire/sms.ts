/**
 * SignalWire SMS Service
 * Handles SMS sending, receiving, and conversation management.
 */

import { getSignalWireClient } from "./client";

export interface SMSMessage {
  sid: string;
  from: string;
  to: string;
  body: string;
  status: "queued" | "sending" | "sent" | "delivered" | "undelivered" | "failed";
  direction: "inbound" | "outbound-api" | "outbound-reply";
  dateSent?: string;
  dateCreated: string;
  numSegments: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface SendSMSParams {
  from: string;
  to: string;
  body: string;
  statusCallback?: string;
  mediaUrl?: string[];
}

export interface SMSListParams {
  from?: string;
  to?: string;
  dateSentAfter?: Date;
  dateSentBefore?: Date;
  pageSize?: number;
}

class SignalWireSMSService {
  private projectId: string;
  private apiToken: string;
  private spaceUrl: string;
  private baseUrl: string;

  constructor() {
    this.projectId = process.env.SIGNALWIRE_PROJECT_ID || "";
    this.apiToken = process.env.SIGNALWIRE_API_TOKEN || "";
    this.spaceUrl = process.env.SIGNALWIRE_SPACE_URL || "";
    this.baseUrl = `https://${this.spaceUrl}/api/laml/2010-04-01/Accounts/${this.projectId}`;
  }

  private get authHeader(): string {
    const credentials = Buffer.from(
      `${this.projectId}:${this.apiToken}`
    ).toString("base64");
    return `Basic ${credentials}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `SignalWire SMS API error: ${response.status} - ${JSON.stringify(error)}`
      );
    }

    return response.json();
  }

  /**
   * Send an SMS message
   */
  async sendMessage(params: SendSMSParams): Promise<SMSMessage> {
    const body = new URLSearchParams();
    body.set("From", params.from);
    body.set("To", params.to);
    body.set("Body", params.body);

    if (params.statusCallback) {
      body.set("StatusCallback", params.statusCallback);
    }

    if (params.mediaUrl && params.mediaUrl.length > 0) {
      params.mediaUrl.forEach((url) => {
        body.append("MediaUrl", url);
      });
    }

    const response = await this.request<SMSMessage>("/Messages.json", {
      method: "POST",
      body: body.toString(),
    });

    return response;
  }

  /**
   * Get a specific message by SID
   */
  async getMessage(messageSid: string): Promise<SMSMessage> {
    const response = await this.request<SMSMessage>(
      `/Messages/${messageSid}.json`
    );
    return response;
  }

  /**
   * List messages with optional filters
   */
  async listMessages(params?: SMSListParams): Promise<{
    messages: SMSMessage[];
    nextPageUri?: string;
    previousPageUri?: string;
  }> {
    const queryParams = new URLSearchParams();

    if (params?.from) queryParams.set("From", params.from);
    if (params?.to) queryParams.set("To", params.to);
    if (params?.dateSentAfter) {
      queryParams.set("DateSent>", params.dateSentAfter.toISOString());
    }
    if (params?.dateSentBefore) {
      queryParams.set("DateSent<", params.dateSentBefore.toISOString());
    }
    if (params?.pageSize) {
      queryParams.set("PageSize", String(params.pageSize));
    }

    const queryString = queryParams.toString();
    const endpoint = `/Messages.json${queryString ? `?${queryString}` : ""}`;

    const response = await this.request<{
      messages: SMSMessage[];
      next_page_uri?: string;
      previous_page_uri?: string;
    }>(endpoint);

    return {
      messages: response.messages,
      nextPageUri: response.next_page_uri,
      previousPageUri: response.previous_page_uri,
    };
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageSid: string): Promise<void> {
    await this.request(`/Messages/${messageSid}.json`, {
      method: "DELETE",
    });
  }

  /**
   * Generate TwiML response for incoming SMS
   */
  generateSMSResponse(message: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${this.escapeXml(message)}</Message>
</Response>`;
  }

  /**
   * Generate empty response (acknowledge without reply)
   */
  generateEmptyResponse(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  /**
   * Validate E.164 phone number format
   */
  static validatePhoneNumber(phone: string): boolean {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
  }

  /**
   * Format phone number to E.164
   */
  static formatToE164(phone: string, defaultCountry: string = "1"): string {
    // Remove all non-numeric characters
    const digits = phone.replace(/\D/g, "");

    // If already has country code (11 digits starting with 1 for US)
    if (digits.length === 11 && digits.startsWith("1")) {
      return `+${digits}`;
    }

    // If 10 digits (US number without country code)
    if (digits.length === 10) {
      return `+${defaultCountry}${digits}`;
    }

    // If already in E.164 format
    if (phone.startsWith("+") && digits.length >= 10) {
      return `+${digits}`;
    }

    // Return as-is if we can't determine format
    return phone;
  }

  /**
   * Calculate SMS segment count
   */
  static calculateSegments(message: string): number {
    // GSM-7 characters (160 chars/segment)
    // Unicode characters (70 chars/segment)
    const hasUnicode = /[^\x00-\x7F]/.test(message);
    const charsPerSegment = hasUnicode ? 70 : 160;
    const multipartCharsPerSegment = hasUnicode ? 67 : 153;

    if (message.length <= charsPerSegment) {
      return 1;
    }

    return Math.ceil(message.length / multipartCharsPerSegment);
  }
}

// Singleton instance
let smsServiceInstance: SignalWireSMSService | null = null;

export function getSignalWireSMSService(): SignalWireSMSService {
  if (!smsServiceInstance) {
    smsServiceInstance = new SignalWireSMSService();
  }
  return smsServiceInstance;
}

export { SignalWireSMSService };

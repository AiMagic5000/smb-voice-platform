/**
 * SignalWire Client
 * Handles VoIP operations including phone number provisioning,
 * call management, and AI receptionist integration.
 */

interface SignalWireConfig {
  projectId: string;
  apiToken: string;
  spaceUrl: string;
}

interface PhoneNumber {
  id: string;
  number: string;
  type: "local" | "toll-free";
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

interface AvailableNumber {
  number: string;
  type: "local" | "toll-free";
  monthlyPrice: number;
  setupPrice: number;
}

interface Call {
  id: string;
  from: string;
  to: string;
  status: "queued" | "ringing" | "in-progress" | "completed" | "failed";
  direction: "inbound" | "outbound";
  duration?: number;
  recordingUrl?: string;
}

class SignalWireClient {
  private config: SignalWireConfig;
  private baseUrl: string;

  constructor(config: SignalWireConfig) {
    this.config = config;
    this.baseUrl = `https://${config.spaceUrl}/api/relay/rest`;
  }

  private get authHeader(): string {
    const credentials = Buffer.from(
      `${this.config.projectId}:${this.config.apiToken}`
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
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `SignalWire API error: ${response.status} - ${JSON.stringify(error)}`
      );
    }

    return response.json();
  }

  /**
   * Search for available phone numbers
   */
  async searchAvailableNumbers(params: {
    type: "local" | "toll-free";
    areaCode?: string;
    contains?: string;
    limit?: number;
  }): Promise<AvailableNumber[]> {
    const queryParams = new URLSearchParams();

    if (params.type === "toll-free") {
      queryParams.set("toll_free", "true");
    } else if (params.areaCode) {
      queryParams.set("area_code", params.areaCode);
    }

    if (params.contains) {
      queryParams.set("contains", params.contains);
    }

    queryParams.set("limit", String(params.limit || 10));

    const response = await this.request<{ data: AvailableNumber[] }>(
      `/phone_numbers/available?${queryParams.toString()}`
    );

    return response.data;
  }

  /**
   * Purchase a phone number
   */
  async purchaseNumber(number: string): Promise<PhoneNumber> {
    const response = await this.request<{ data: PhoneNumber }>(
      "/phone_numbers",
      {
        method: "POST",
        body: JSON.stringify({ number }),
      }
    );

    return response.data;
  }

  /**
   * List owned phone numbers
   */
  async listNumbers(): Promise<PhoneNumber[]> {
    const response = await this.request<{ data: PhoneNumber[] }>(
      "/phone_numbers"
    );
    return response.data;
  }

  /**
   * Release a phone number
   */
  async releaseNumber(numberId: string): Promise<void> {
    await this.request(`/phone_numbers/${numberId}`, {
      method: "DELETE",
    });
  }

  /**
   * Configure call forwarding for a number
   */
  async configureCallForwarding(
    numberId: string,
    forwardTo: string
  ): Promise<void> {
    await this.request(`/phone_numbers/${numberId}`, {
      method: "PATCH",
      body: JSON.stringify({
        call_handler: "relay_script",
        call_relay_script_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/signalwire/voice`,
        metadata: {
          forward_to: forwardTo,
        },
      }),
    });
  }

  /**
   * Make an outbound call
   */
  async makeCall(params: {
    from: string;
    to: string;
    timeout?: number;
    record?: boolean;
  }): Promise<Call> {
    const response = await this.request<{ data: Call }>("/calls", {
      method: "POST",
      body: JSON.stringify({
        from: params.from,
        to: params.to,
        timeout: params.timeout || 30,
        record: params.record || false,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/signalwire/voice`,
      }),
    });

    return response.data;
  }

  /**
   * Get call details
   */
  async getCall(callId: string): Promise<Call> {
    const response = await this.request<{ data: Call }>(`/calls/${callId}`);
    return response.data;
  }

  /**
   * Generate TwiML for AI receptionist greeting
   */
  generateAIGreeting(params: {
    greeting: string;
    businessName: string;
    transcribeCallback: string;
  }): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${params.greeting}</Say>
  <Record
    maxLength="120"
    transcribe="true"
    transcribeCallback="${params.transcribeCallback}"
    playBeep="true"
  />
  <Say voice="Polly.Joanna">Thank you for your message. Someone from ${params.businessName} will get back to you shortly. Goodbye!</Say>
  <Hangup />
</Response>`;
  }

  /**
   * Generate TwiML for call forwarding
   */
  generateForwardingResponse(forwardTo: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="30" callerId="+18885344145">
    <Number>${forwardTo}</Number>
  </Dial>
</Response>`;
  }
}

// Singleton instance
let signalWireClient: SignalWireClient | null = null;

export function getSignalWireClient(): SignalWireClient {
  if (!signalWireClient) {
    const projectId = process.env.SIGNALWIRE_PROJECT_ID;
    const apiToken = process.env.SIGNALWIRE_API_TOKEN;
    const spaceUrl = process.env.SIGNALWIRE_SPACE_URL;

    if (!projectId || !apiToken || !spaceUrl) {
      throw new Error(
        "SignalWire configuration missing. Set SIGNALWIRE_PROJECT_ID, SIGNALWIRE_API_TOKEN, and SIGNALWIRE_SPACE_URL."
      );
    }

    signalWireClient = new SignalWireClient({
      projectId,
      apiToken,
      spaceUrl,
    });
  }

  return signalWireClient;
}

export type { SignalWireConfig, PhoneNumber, AvailableNumber, Call };
export { SignalWireClient };

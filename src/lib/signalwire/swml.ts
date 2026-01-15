/**
 * SignalWire SWML (SignalWire Markup Language) Generator
 * Creates JSON-based call flow configurations for AI agents and IVR systems.
 */

interface SWMLSection {
  [key: string]: unknown;
}

interface AIAgentParams {
  voice?: string;
  language?: string;
  engine?: string;
  greeting?: string;
  systemPrompt?: string;
  postPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  transferNumber?: string;
  businessHours?: string;
  endCallOnSilence?: number;
}

interface IVRMenuOption {
  digit: string;
  label: string;
  action: "transfer" | "voicemail" | "submenu" | "hangup" | "repeat";
  target?: string;
}

interface IVRParams {
  greeting: string;
  options: IVRMenuOption[];
  timeout?: number;
  maxAttempts?: number;
  invalidMessage?: string;
  timeoutMessage?: string;
}

interface CallQueueParams {
  name: string;
  agents: string[];
  ringStrategy: "round_robin" | "ring_all" | "random" | "least_recent";
  ringTimeout?: number;
  holdMusic?: string;
  announcePosition?: boolean;
  maxWaitTime?: number;
}

export class SWMLGenerator {
  /**
   * Generate SWML for AI Receptionist agent
   */
  static aiReceptionist(params: AIAgentParams): SWMLSection {
    const {
      voice = "en-US-Standard-C",
      language = "en-US",
      engine = "gcloud",
      greeting = "Hello! Thank you for calling. How can I help you today?",
      systemPrompt = "You are a helpful AI receptionist. Be professional, friendly, and concise.",
      postPrompt = "If the caller wants to speak with a human or seems frustrated, offer to transfer them.",
      temperature = 0.7,
      maxTokens = 150,
      transferNumber,
      businessHours,
      endCallOnSilence = 5,
    } = params;

    const fullSystemPrompt = [
      systemPrompt,
      businessHours ? `Business hours: ${businessHours}` : "",
      transferNumber ? `You can transfer callers to ${transferNumber} if they request to speak with a human.` : "",
    ].filter(Boolean).join("\n");

    const swml: SWMLSection = {
      version: "1.0.0",
      sections: {
        main: [
          {
            ai: {
              voice: {
                engine,
                voice,
                language,
              },
              prompt: {
                text: fullSystemPrompt,
                temperature,
                max_tokens: maxTokens,
              },
              post_prompt: {
                text: postPrompt,
              },
              SWAIG: {
                defaults: {
                  web_hook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/signalwire/swaig`,
                },
                functions: [
                  {
                    function: "transfer_call",
                    description: "Transfer the call to a human agent",
                    parameters: {
                      type: "object",
                      properties: {
                        reason: {
                          type: "string",
                          description: "Why the caller wants to be transferred",
                        },
                      },
                    },
                  },
                  {
                    function: "end_call",
                    description: "End the call politely",
                    parameters: {
                      type: "object",
                      properties: {
                        reason: {
                          type: "string",
                          description: "Why the call is ending",
                        },
                      },
                    },
                  },
                  {
                    function: "take_message",
                    description: "Take a message from the caller",
                    parameters: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Caller name" },
                        phone: { type: "string", description: "Callback number" },
                        message: { type: "string", description: "Message content" },
                      },
                      required: ["message"],
                    },
                  },
                ],
              },
              params: {
                end_of_speech_timeout: endCallOnSilence * 1000,
                attention_timeout: 30000,
                inactivity_timeout: 60000,
                background_file: "silence://",
                background_file_loops: -1,
                background_file_volume: 0,
              },
            },
          },
        ],
      },
    };

    // Add greeting as initial TTS
    if (greeting) {
      (swml.sections as Record<string, unknown[]>).main.unshift({
        play: {
          url: `say:${greeting}`,
          say_voice: voice,
          say_language: language,
        },
      });
    }

    return swml;
  }

  /**
   * Generate SWML for IVR menu system
   */
  static ivrMenu(params: IVRParams): SWMLSection {
    const {
      greeting,
      options,
      timeout = 10,
      maxAttempts = 3,
      invalidMessage = "Sorry, that was not a valid option.",
      timeoutMessage = "We didn't receive your selection.",
    } = params;

    // Build menu prompt from options
    const menuPrompt = options
      .map((opt) => `Press ${opt.digit} for ${opt.label}`)
      .join(". ");

    const fullGreeting = `${greeting} ${menuPrompt}`;

    // Build digit handlers
    const digitHandlers: Record<string, unknown[]> = {};
    options.forEach((opt) => {
      switch (opt.action) {
        case "transfer":
          digitHandlers[opt.digit] = [
            { play: { url: "say:Please hold while we transfer your call." } },
            { connect: { to: opt.target, from: "{{call.from}}" } },
          ];
          break;
        case "voicemail":
          digitHandlers[opt.digit] = [
            { play: { url: "say:Please leave a message after the tone." } },
            {
              record: {
                beep: true,
                max_length: 120,
                format: "mp3",
                stereo: false,
                direction: "speak",
                terminators: "#",
              },
            },
            { play: { url: "say:Thank you. Goodbye." } },
            { hangup: {} },
          ];
          break;
        case "submenu":
          digitHandlers[opt.digit] = [
            { execute: { dest: `section:${opt.target}` } },
          ];
          break;
        case "repeat":
          digitHandlers[opt.digit] = [
            { execute: { dest: "section:main" } },
          ];
          break;
        case "hangup":
          digitHandlers[opt.digit] = [
            { play: { url: "say:Thank you for calling. Goodbye." } },
            { hangup: {} },
          ];
          break;
      }
    });

    return {
      version: "1.0.0",
      sections: {
        main: [
          {
            prompt: {
              play: `say:${fullGreeting}`,
              digits: {
                max: 1,
                terminators: "#",
                digit_timeout: timeout,
              },
              max_digits: 1,
              initial_timeout: timeout,
              speech: {
                end_silence_timeout: 3,
                speech_timeout: 30,
              },
            },
          },
          {
            switch: {
              variable: "prompt_value",
              case: digitHandlers,
              default: [
                { play: { url: `say:${invalidMessage}` } },
                { execute: { dest: "section:main" } },
              ],
            },
          },
        ],
      },
    };
  }

  /**
   * Generate SWML for call queue distribution
   */
  static callQueue(params: CallQueueParams): SWMLSection {
    const {
      name,
      agents,
      ringStrategy = "round_robin",
      ringTimeout = 20,
      holdMusic = "https://cdn.signalwire.com/default-music/hold.mp3",
      announcePosition = true,
      maxWaitTime = 300,
    } = params;

    // Build connect section based on ring strategy
    let connectSection: unknown;
    if (ringStrategy === "ring_all") {
      // Ring all agents simultaneously
      connectSection = {
        connect: {
          parallel: agents.map((agent) => ({
            to: agent,
            timeout: ringTimeout,
          })),
        },
      };
    } else {
      // Sequential/round robin
      connectSection = {
        connect: {
          serial: agents.map((agent) => ({
            to: agent,
            timeout: ringTimeout,
          })),
        },
      };
    }

    return {
      version: "1.0.0",
      sections: {
        main: [
          {
            play: {
              url: `say:Thank you for calling. You are being connected to our ${name} team.`,
            },
          },
          announcePosition
            ? {
                play: {
                  url: "say:Please hold while we connect you to the next available representative.",
                },
              }
            : null,
          {
            play: {
              url: holdMusic,
              volume: 50,
            },
          },
          connectSection,
          {
            play: {
              url: "say:We're sorry, but all representatives are currently busy. Please leave a message.",
            },
          },
          {
            record: {
              beep: true,
              max_length: 120,
              format: "mp3",
            },
          },
          { hangup: {} },
        ].filter(Boolean),
      },
    };
  }

  /**
   * Generate SWML for voicemail
   */
  static voicemail(params: {
    greeting?: string;
    maxLength?: number;
    transcribe?: boolean;
    webhookUrl?: string;
  }): SWMLSection {
    const {
      greeting = "Please leave a message after the tone.",
      maxLength = 120,
      transcribe = true,
      webhookUrl,
    } = params;

    return {
      version: "1.0.0",
      sections: {
        main: [
          {
            play: {
              url: `say:${greeting}`,
            },
          },
          {
            record: {
              beep: true,
              max_length: maxLength,
              format: "mp3",
              stereo: false,
              direction: "speak",
              terminators: "#",
              ...(transcribe && webhookUrl ? { transcription: { url: webhookUrl } } : {}),
            },
          },
          {
            play: {
              url: "say:Thank you. Goodbye.",
            },
          },
          { hangup: {} },
        ],
      },
    };
  }

  /**
   * Generate simple call forwarding SWML
   */
  static forward(params: {
    to: string;
    from?: string;
    timeout?: number;
    announcement?: string;
  }): SWMLSection {
    const {
      to,
      from,
      timeout = 30,
      announcement,
    } = params;

    return {
      version: "1.0.0",
      sections: {
        main: [
          announcement
            ? { play: { url: `say:${announcement}` } }
            : null,
          {
            connect: {
              to,
              from: from || "{{call.from}}",
              timeout,
            },
          },
        ].filter(Boolean),
      },
    };
  }

  /**
   * Validate SWML structure
   */
  static validate(swml: SWMLSection): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!swml.version) {
      errors.push("Missing version field");
    }

    if (!swml.sections) {
      errors.push("Missing sections field");
    } else if (!(swml.sections as Record<string, unknown>).main) {
      errors.push("Missing main section");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert SWML to JSON string
   */
  static toJSON(swml: SWMLSection, pretty = false): string {
    return JSON.stringify(swml, null, pretty ? 2 : 0);
  }
}

export type { AIAgentParams, IVRParams, IVRMenuOption, CallQueueParams, SWMLSection };

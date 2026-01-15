import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
    lastCleanup = now;
  }
}

/**
 * Get the identifier for rate limiting (IP address or user ID)
 */
function getIdentifier(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get the real IP from various headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return `ip:${forwardedFor.split(",")[0].trim()}`;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return `ip:${realIp}`;
  }

  // Fallback to a default identifier
  return `ip:unknown`;
}

/**
 * Check rate limit and return result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  cleanup();

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // Create new entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.interval,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

/**
 * Rate limiting middleware for API routes
 */
export function rateLimit(config: RateLimitConfig = { interval: 60000, maxRequests: 60 }) {
  return function rateLimitMiddleware(
    handler: (request: NextRequest) => Promise<NextResponse>
  ) {
    return async function (request: NextRequest): Promise<NextResponse> {
      const identifier = getIdentifier(request);
      const result = checkRateLimit(identifier, config);

      if (!result.allowed) {
        return NextResponse.json(
          {
            error: "Too many requests",
            message: "Rate limit exceeded. Please try again later.",
            retryAfter: Math.ceil(result.resetIn / 1000),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": config.maxRequests.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": Math.ceil(result.resetIn / 1000).toString(),
              "Retry-After": Math.ceil(result.resetIn / 1000).toString(),
            },
          }
        );
      }

      const response = await handler(request);

      // Add rate limit headers to response
      response.headers.set("X-RateLimit-Limit", config.maxRequests.toString());
      response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
      response.headers.set("X-RateLimit-Reset", Math.ceil(result.resetIn / 1000).toString());

      return response;
    };
  };
}

/**
 * Higher-order function to wrap API route handlers with rate limiting
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return rateLimit(config)(handler);
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // Standard API rate limit: 60 requests per minute
  standard: { interval: 60000, maxRequests: 60 },

  // Strict rate limit for sensitive endpoints: 10 requests per minute
  strict: { interval: 60000, maxRequests: 10 },

  // Relaxed rate limit: 120 requests per minute
  relaxed: { interval: 60000, maxRequests: 120 },

  // Authentication endpoints: 5 requests per minute
  auth: { interval: 60000, maxRequests: 5 },

  // Webhooks: 100 requests per minute
  webhooks: { interval: 60000, maxRequests: 100 },

  // Search: 30 requests per minute
  search: { interval: 60000, maxRequests: 30 },
} as const;

export default rateLimit;

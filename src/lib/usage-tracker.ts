/**
 * Usage Tracking and Enforcement for SMB Voice
 * Tracks and enforces tier limits for phone numbers, SMS, AI minutes, etc.
 */

import { db } from "@/lib/db";
import { organizations, phoneNumbers, smsMessages, extensions, usageRecords, subscriptions } from "@/lib/db/schema";
import { eq, and, gte, sql, count } from "drizzle-orm";
import { getTierLimits, canAddPhoneNumber, canSendSms, canAccessApi, calculateOverageCharges } from "./tier-limits";
import type { UsageSummary } from "./tier-limits";

/**
 * Get the current billing period dates
 */
function getCurrentBillingPeriod(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

/**
 * Get organization plan from database
 */
export async function getOrganizationPlan(organizationId: string): Promise<string> {
  const [org] = await db
    .select({ plan: organizations.plan })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  return org?.plan || 'starter';
}

/**
 * Get organization by Clerk org ID
 */
export async function getOrganizationByClerkId(clerkOrgId: string) {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.clerkOrgId, clerkOrgId))
    .limit(1);

  return org;
}

/**
 * Count phone numbers for an organization
 */
export async function countPhoneNumbers(organizationId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(phoneNumbers)
    .where(eq(phoneNumbers.organizationId, organizationId));

  return result?.count || 0;
}

/**
 * Check if organization can provision a new phone number
 */
export async function checkPhoneNumberLimit(organizationId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount: number;
  maxAllowed: number;
}> {
  const [plan, currentCount] = await Promise.all([
    getOrganizationPlan(organizationId),
    countPhoneNumbers(organizationId),
  ]);

  const check = canAddPhoneNumber(plan, currentCount);

  return {
    ...check,
    currentCount,
  };
}

/**
 * Count SMS sent this billing period
 */
export async function countMonthlySms(organizationId: string): Promise<number> {
  const { start, end } = getCurrentBillingPeriod();

  const [result] = await db
    .select({ count: count() })
    .from(smsMessages)
    .where(
      and(
        eq(smsMessages.direction, 'outbound'),
        gte(smsMessages.createdAt, start),
        sql`${smsMessages.createdAt} <= ${end}`,
        // Join through phone numbers to get org's messages
        sql`${smsMessages.phoneNumberId} IN (
          SELECT id FROM phone_numbers WHERE organization_id = ${organizationId}
        )`
      )
    );

  return result?.count || 0;
}

/**
 * Check if organization can send SMS
 */
export async function checkSmsLimit(organizationId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount: number;
  remaining: number;
  willIncurOverage: boolean;
}> {
  const [plan, currentCount] = await Promise.all([
    getOrganizationPlan(organizationId),
    countMonthlySms(organizationId),
  ]);

  const check = canSendSms(plan, currentCount);

  return {
    ...check,
    currentCount,
  };
}

/**
 * Count AI minutes used this billing period
 */
export async function countMonthlyAiMinutes(organizationId: string): Promise<number> {
  const { start, end } = getCurrentBillingPeriod();

  const [result] = await db
    .select({ total: sql<number>`COALESCE(SUM(quantity), 0)` })
    .from(usageRecords)
    .where(
      and(
        eq(usageRecords.organizationId, organizationId),
        eq(usageRecords.type, 'ai_minutes'),
        gte(usageRecords.createdAt, start),
        sql`${usageRecords.createdAt} <= ${end}`
      )
    );

  return result?.total || 0;
}

/**
 * Count extensions for an organization
 */
export async function countExtensions(organizationId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(extensions)
    .where(eq(extensions.organizationId, organizationId));

  return result?.count || 0;
}

/**
 * Check if organization can add more extensions
 */
export async function checkExtensionLimit(organizationId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount: number;
  maxAllowed: number;
}> {
  const [plan, currentCount] = await Promise.all([
    getOrganizationPlan(organizationId),
    countExtensions(organizationId),
  ]);

  const tier = getTierLimits(plan);

  // Unlimited extensions
  if (tier.maxExtensions === -1) {
    return { allowed: true, currentCount, maxAllowed: -1 };
  }

  if (currentCount >= tier.maxExtensions) {
    return {
      allowed: false,
      reason: `Your ${tier.displayName} plan allows up to ${tier.maxExtensions} extensions. Upgrade to add more.`,
      currentCount,
      maxAllowed: tier.maxExtensions,
    };
  }

  return { allowed: true, currentCount, maxAllowed: tier.maxExtensions };
}

/**
 * Check API access for organization
 */
export async function checkApiAccess(organizationId: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const plan = await getOrganizationPlan(organizationId);
  return canAccessApi(plan);
}

/**
 * Get complete usage summary for an organization
 */
export async function getUsageSummary(organizationId: string): Promise<UsageSummary> {
  const [plan, phoneCount, smsCount, aiMinutes, extensionCount] = await Promise.all([
    getOrganizationPlan(organizationId),
    countPhoneNumbers(organizationId),
    countMonthlySms(organizationId),
    countMonthlyAiMinutes(organizationId),
    countExtensions(organizationId),
  ]);

  const tier = getTierLimits(plan);
  const overageCharges = calculateOverageCharges(plan, smsCount, aiMinutes);

  return {
    plan,
    phoneNumbers: {
      used: phoneCount,
      limit: tier.maxPhoneNumbers,
    },
    sms: {
      used: smsCount,
      limit: tier.monthlySmsBudget,
    },
    aiMinutes: {
      used: aiMinutes,
      limit: tier.aiMinutesIncluded,
    },
    extensions: {
      used: extensionCount,
      limit: tier.maxExtensions,
    },
    overageCharges,
  };
}

/**
 * Record usage for billing
 */
export async function recordUsage(
  organizationId: string,
  type: 'ai_minutes' | 'sms_outbound' | 'sms_inbound' | 'call_recording' | 'international_minutes',
  quantity: number,
  unitPrice: number,
  description?: string
): Promise<void> {
  const { start, end } = getCurrentBillingPeriod();

  // Get subscription for this org
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.organizationId, organizationId))
    .limit(1);

  await db.insert(usageRecords).values({
    organizationId,
    subscriptionId: sub?.id,
    type,
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
    description,
    billingPeriodStart: start,
    billingPeriodEnd: end,
  });
}

/**
 * Enforcement middleware helper - returns 403 response if limit exceeded
 */
export function createLimitExceededResponse(
  resource: string,
  reason: string,
  upgradeUrl: string = 'https://coreypearson.gumroad.com/l/ojjjt'
) {
  return {
    success: false,
    error: {
      code: 'LIMIT_EXCEEDED',
      message: reason,
      resource,
      upgradeUrl,
    },
  };
}

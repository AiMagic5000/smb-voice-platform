/**
 * SMB Voice Subscription Tier Configuration
 * Defines limits and features for each pricing tier
 */

export interface TierLimits {
  // Phone Numbers
  maxPhoneNumbers: number;

  // SMS
  monthlySmsBudget: number; // -1 for unlimited

  // AI Receptionist
  aiReceptionistTier: 'basic' | 'advanced' | 'premium';
  aiMinutesIncluded: number; // -1 for unlimited

  // Team / Extensions
  maxExtensions: number;

  // Features
  features: {
    callRecording: boolean;
    callAnalytics: boolean;
    customIVR: boolean;
    customGreetings: boolean;
    apiAccess: boolean;
    crmIntegrations: boolean;
    dedicatedAccountManager: boolean;
    prioritySupport: boolean;
    voicemailTranscription: boolean;
    businessHoursRouting: boolean;
  };

  // Pricing (in cents)
  monthlyPrice: number;

  // Display
  displayName: string;
  description: string;
}

export const TIER_LIMITS: Record<string, TierLimits> = {
  starter: {
    maxPhoneNumbers: 1,
    monthlySmsBudget: 500,
    aiReceptionistTier: 'basic',
    aiMinutesIncluded: 100, // 100 AI minutes included
    maxExtensions: 5,
    features: {
      callRecording: false,
      callAnalytics: false,
      customIVR: false,
      customGreetings: false,
      apiAccess: false,
      crmIntegrations: false,
      dedicatedAccountManager: false,
      prioritySupport: false,
      voicemailTranscription: true,
      businessHoursRouting: true,
    },
    monthlyPrice: 795, // $7.95
    displayName: 'Starter',
    description: 'Perfect for solopreneurs',
  },

  professional: {
    maxPhoneNumbers: 3,
    monthlySmsBudget: 1500,
    aiReceptionistTier: 'advanced',
    aiMinutesIncluded: 500, // 500 AI minutes included
    maxExtensions: 10,
    features: {
      callRecording: true,
      callAnalytics: true,
      customIVR: true,
      customGreetings: true,
      apiAccess: false,
      crmIntegrations: false,
      dedicatedAccountManager: false,
      prioritySupport: true,
      voicemailTranscription: true,
      businessHoursRouting: true,
    },
    monthlyPrice: 1995, // $19.95
    displayName: 'Professional',
    description: 'Best for growing businesses',
  },

  enterprise: {
    maxPhoneNumbers: 10,
    monthlySmsBudget: -1, // Unlimited
    aiReceptionistTier: 'premium',
    aiMinutesIncluded: -1, // Unlimited
    maxExtensions: -1, // Unlimited
    features: {
      callRecording: true,
      callAnalytics: true,
      customIVR: true,
      customGreetings: true,
      apiAccess: true,
      crmIntegrations: true,
      dedicatedAccountManager: true,
      prioritySupport: true,
      voicemailTranscription: true,
      businessHoursRouting: true,
    },
    monthlyPrice: 4995, // $49.95
    displayName: 'Enterprise',
    description: 'For established businesses',
  },
};

// Overage pricing (in cents)
export const OVERAGE_PRICING = {
  sms: 2, // $0.02 per SMS over limit
  aiMinutes: 5, // $0.05 per AI minute over limit
  additionalPhoneNumber: 500, // $5.00 per additional phone number
};

/**
 * Get tier limits for a plan
 */
export function getTierLimits(planId: string): TierLimits {
  return TIER_LIMITS[planId] || TIER_LIMITS.starter;
}

/**
 * Check if a feature is available for a tier
 */
export function hasFeature(planId: string, feature: keyof TierLimits['features']): boolean {
  const tier = getTierLimits(planId);
  return tier.features[feature];
}

/**
 * Check if organization can add more phone numbers
 */
export function canAddPhoneNumber(planId: string, currentCount: number): {
  allowed: boolean;
  reason?: string;
  maxAllowed: number;
} {
  const tier = getTierLimits(planId);

  if (currentCount >= tier.maxPhoneNumbers) {
    return {
      allowed: false,
      reason: `Your ${tier.displayName} plan allows up to ${tier.maxPhoneNumbers} phone number(s). Upgrade to add more.`,
      maxAllowed: tier.maxPhoneNumbers,
    };
  }

  return { allowed: true, maxAllowed: tier.maxPhoneNumbers };
}

/**
 * Check if organization can send more SMS this month
 */
export function canSendSms(planId: string, currentMonthCount: number): {
  allowed: boolean;
  reason?: string;
  remaining: number;
  willIncurOverage: boolean;
} {
  const tier = getTierLimits(planId);

  // Unlimited SMS for this tier
  if (tier.monthlySmsBudget === -1) {
    return { allowed: true, remaining: -1, willIncurOverage: false };
  }

  const remaining = tier.monthlySmsBudget - currentMonthCount;

  // For now, we allow overage but flag it (could be changed to hard limit)
  return {
    allowed: true,
    remaining: Math.max(0, remaining),
    willIncurOverage: remaining <= 0,
  };
}

/**
 * Check if organization can use AI receptionist features
 */
export function canUseAiFeature(planId: string, feature: string): {
  allowed: boolean;
  reason?: string;
  tierRequired?: string;
} {
  const tier = getTierLimits(planId);

  // Features only available on advanced/premium AI tiers
  const advancedFeatures = ['appointment_scheduling', 'custom_knowledge_base', 'sentiment_analysis'];
  const premiumFeatures = ['multi_language', 'advanced_analytics', 'custom_voice'];

  if (advancedFeatures.includes(feature) && tier.aiReceptionistTier === 'basic') {
    return {
      allowed: false,
      reason: `This AI feature requires Professional plan or higher.`,
      tierRequired: 'professional',
    };
  }

  if (premiumFeatures.includes(feature) && tier.aiReceptionistTier !== 'premium') {
    return {
      allowed: false,
      reason: `This AI feature requires Enterprise plan.`,
      tierRequired: 'enterprise',
    };
  }

  return { allowed: true };
}

/**
 * Check API access
 */
export function canAccessApi(planId: string): {
  allowed: boolean;
  reason?: string;
} {
  const tier = getTierLimits(planId);

  if (!tier.features.apiAccess) {
    return {
      allowed: false,
      reason: 'API access is only available on the Enterprise plan. Upgrade to enable API access.',
    };
  }

  return { allowed: true };
}

/**
 * Get usage summary for an organization
 */
export interface UsageSummary {
  plan: string;
  phoneNumbers: { used: number; limit: number; };
  sms: { used: number; limit: number; };
  aiMinutes: { used: number; limit: number; };
  extensions: { used: number; limit: number; };
  overageCharges: number; // in cents
}

/**
 * Calculate overage charges
 */
export function calculateOverageCharges(
  planId: string,
  smsUsed: number,
  aiMinutesUsed: number
): number {
  const tier = getTierLimits(planId);
  let overage = 0;

  // SMS overage
  if (tier.monthlySmsBudget !== -1 && smsUsed > tier.monthlySmsBudget) {
    overage += (smsUsed - tier.monthlySmsBudget) * OVERAGE_PRICING.sms;
  }

  // AI minutes overage
  if (tier.aiMinutesIncluded !== -1 && aiMinutesUsed > tier.aiMinutesIncluded) {
    overage += (aiMinutesUsed - tier.aiMinutesIncluded) * OVERAGE_PRICING.aiMinutes;
  }

  return overage;
}

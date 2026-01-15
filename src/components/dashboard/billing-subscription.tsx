"use client";

import React, { useState } from "react";

// ============================================
// Types
// ============================================

export type PlanTier = "starter" | "professional" | "enterprise";
export type BillingCycle = "monthly" | "annual";
export type PaymentStatus = "active" | "past_due" | "cancelled" | "trialing";

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: PlanTier;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  limits: {
    users: number | "unlimited";
    phoneNumbers: number | "unlimited";
    minutesIncluded: number | "unlimited";
    smsIncluded: number | "unlimited";
    storage: string;
  };
  highlighted?: boolean;
}

export interface CurrentSubscription {
  planId: string;
  planName: string;
  tier: PlanTier;
  billingCycle: BillingCycle;
  status: PaymentStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: string;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "bank_account";
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface UsageMetrics {
  users: { used: number; limit: number | "unlimited" };
  phoneNumbers: { used: number; limit: number | "unlimited" };
  minutes: { used: number; limit: number | "unlimited" };
  sms: { used: number; limit: number | "unlimited" };
}

interface BillingSubscriptionProps {
  subscription?: CurrentSubscription;
  paymentMethods?: PaymentMethod[];
  usage?: UsageMetrics;
  plans?: SubscriptionPlan[];
  onChangePlan?: (planId: string, cycle: BillingCycle) => Promise<void>;
  onCancelSubscription?: () => Promise<void>;
  onResumeSubscription?: () => Promise<void>;
  onAddPaymentMethod?: () => void;
  onRemovePaymentMethod?: (id: string) => Promise<void>;
  onSetDefaultPaymentMethod?: (id: string) => Promise<void>;
}

// ============================================
// Default Plans
// ============================================

const defaultPlans: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tier: "starter",
    price: { monthly: 795, annual: 7150 }, // cents
    features: [
      "1 phone number included",
      "100 minutes/month",
      "100 SMS/month",
      "Basic AI receptionist",
      "Call forwarding",
      "Voicemail transcription",
      "Email support",
    ],
    limits: {
      users: 2,
      phoneNumbers: 1,
      minutesIncluded: 100,
      smsIncluded: 100,
      storage: "1 GB",
    },
  },
  {
    id: "professional",
    name: "Professional",
    tier: "professional",
    price: { monthly: 2495, annual: 22450 },
    features: [
      "3 phone numbers included",
      "500 minutes/month",
      "500 SMS/month",
      "Advanced AI receptionist",
      "Custom IVR builder",
      "Call queues",
      "Analytics dashboard",
      "Priority support",
    ],
    limits: {
      users: 10,
      phoneNumbers: 3,
      minutesIncluded: 500,
      smsIncluded: 500,
      storage: "10 GB",
    },
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tier: "enterprise",
    price: { monthly: 9995, annual: 89950 },
    features: [
      "Unlimited phone numbers",
      "Unlimited minutes",
      "Unlimited SMS",
      "Custom AI training",
      "Advanced integrations",
      "API access",
      "Dedicated account manager",
      "99.99% SLA",
      "Custom contracts",
    ],
    limits: {
      users: "unlimited",
      phoneNumbers: "unlimited",
      minutesIncluded: "unlimited",
      smsIncluded: "unlimited",
      storage: "Unlimited",
    },
  },
];

// ============================================
// Billing Subscription Component
// ============================================

export function BillingSubscription({
  subscription,
  paymentMethods = [],
  usage,
  plans = defaultPlans,
  onChangePlan,
  onCancelSubscription,
  onResumeSubscription,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onSetDefaultPaymentMethod,
}: BillingSubscriptionProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription?.billingCycle || "monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateUsagePercent = (used: number, limit: number | "unlimited") => {
    if (limit === "unlimited") return 0;
    return Math.min(100, (used / limit) * 100);
  };

  const handleChangePlan = async (planId: string) => {
    if (!onChangePlan) return;
    setIsProcessing(true);
    try {
      await onChangePlan(planId, billingCycle);
      setSelectedPlan(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!onCancelSubscription) return;
    setIsProcessing(true);
    try {
      await onCancelSubscription();
      setShowCancelModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPlan = plans.find((p) => p.id === subscription?.planId);

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
      {subscription && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Current Plan</h3>
                <p className="text-white/80 text-sm mt-1">{subscription.planName}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {currentPlan && formatPrice(currentPlan.price[subscription.billingCycle])}
                  <span className="text-sm font-normal text-white/80">
                    /{subscription.billingCycle === "annual" ? "year" : "month"}
                  </span>
                </div>
                <StatusBadge status={subscription.status} />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-500">Billing Period</div>
                <div className="font-medium">{formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Next Invoice</div>
                <div className="font-medium">
                  {subscription.cancelAtPeriodEnd ? "N/A" : formatDate(subscription.currentPeriodEnd)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Billing Cycle</div>
                <div className="font-medium capitalize">{subscription.billingCycle}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium capitalize">{subscription.status.replace("_", " ")}</div>
              </div>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-800">Subscription ending</p>
                    <p className="text-sm text-yellow-700">
                      Your subscription will end on {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  {onResumeSubscription && (
                    <button
                      onClick={onResumeSubscription}
                      className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Resume
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedPlan(subscription.planId)}
                className="px-4 py-2 bg-[#C9A227] text-white rounded-lg hover:bg-[#B8911F] transition-colors"
              >
                Change Plan
              </button>
              {!subscription.cancelAtPeriodEnd && onCancelSubscription && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Usage Stats */}
      {usage && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Period</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <UsageBar label="Users" {...usage.users} />
            <UsageBar label="Phone Numbers" {...usage.phoneNumbers} />
            <UsageBar label="Minutes" {...usage.minutes} />
            <UsageBar label="SMS Messages" {...usage.sms} />
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          {onAddPaymentMethod && (
            <button
              onClick={onAddPaymentMethod}
              className="text-sm text-[#C9A227] hover:text-[#B8911F] font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Method
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-100">
          {paymentMethods.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p>No payment methods on file</p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <PaymentMethodRow
                key={method.id}
                method={method}
                onRemove={onRemovePaymentMethod}
                onSetDefault={onSetDefaultPaymentMethod}
              />
            ))
          )}
        </div>
      </div>

      {/* Plan Selection */}
      {selectedPlan !== null && (
        <PlanSelector
          plans={plans}
          currentPlanId={subscription?.planId}
          billingCycle={billingCycle}
          isProcessing={isProcessing}
          onBillingCycleChange={setBillingCycle}
          onSelectPlan={handleChangePlan}
          onClose={() => setSelectedPlan(null)}
          formatPrice={formatPrice}
        />
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelModal
          isProcessing={isProcessing}
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
}

// ============================================
// Helper Components
// ============================================

function StatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    active: "bg-green-500",
    trialing: "bg-blue-500",
    past_due: "bg-yellow-500",
    cancelled: "bg-red-500",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs text-white ${styles[status]}`}>
      {status === "past_due" ? "Past Due" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number | "unlimited" }) {
  const percent = limit === "unlimited" ? 0 : Math.min(100, (used / limit) * 100);
  const isNearLimit = percent >= 80;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className={`font-medium ${isNearLimit ? "text-orange-600" : "text-gray-900"}`}>
          {used.toLocaleString()} / {limit === "unlimited" ? "∞" : limit.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isNearLimit ? "bg-orange-500" : "bg-[#C9A227]"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function PaymentMethodRow({
  method,
  onRemove,
  onSetDefault,
}: {
  method: PaymentMethod;
  onRemove?: (id: string) => Promise<void>;
  onSetDefault?: (id: string) => Promise<void>;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetDefault = async () => {
    if (!onSetDefault) return;
    setIsProcessing(true);
    try {
      await onSetDefault(method.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove || !confirm("Remove this payment method?")) return;
    setIsProcessing(true);
    try {
      await onRemove(method.id);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex-shrink-0">
        {method.type === "card" ? (
          <div className="w-10 h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">{method.brand?.slice(0, 1) || "C"}</span>
          </div>
        ) : (
          <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">
          {method.type === "card" ? `${method.brand || "Card"} ending in ${method.last4}` : `Bank account ending in ${method.last4}`}
        </div>
        {method.expiryMonth && method.expiryYear && (
          <div className="text-sm text-gray-500">
            Expires {method.expiryMonth}/{method.expiryYear}
          </div>
        )}
      </div>
      {method.isDefault && (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Default</span>
      )}
      <div className="flex items-center gap-2">
        {!method.isDefault && onSetDefault && (
          <button
            onClick={handleSetDefault}
            disabled={isProcessing}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Set Default
          </button>
        )}
        {onRemove && (
          <button
            onClick={handleRemove}
            disabled={isProcessing}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

function PlanSelector({
  plans,
  currentPlanId,
  billingCycle,
  isProcessing,
  onBillingCycleChange,
  onSelectPlan,
  onClose,
  formatPrice,
}: {
  plans: SubscriptionPlan[];
  currentPlanId?: string;
  billingCycle: BillingCycle;
  isProcessing: boolean;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  onSelectPlan: (planId: string) => void;
  onClose: () => void;
  formatPrice: (cents: number) => string;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-0 top-[5%] mx-auto max-w-4xl z-50 px-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
            <h3 className="text-xl font-semibold">Choose Your Plan</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center py-4 border-b">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onBillingCycleChange("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === "monthly" ? "bg-white shadow text-gray-900" : "text-gray-600"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => onBillingCycleChange("annual")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === "annual" ? "bg-white shadow text-gray-900" : "text-gray-600"
                }`}
              >
                Annual
                <span className="ml-1 text-green-600 text-xs">Save 25%</span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 p-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`
                  relative rounded-lg border-2 p-6 transition-all
                  ${plan.highlighted ? "border-[#C9A227] shadow-lg" : "border-gray-200"}
                  ${currentPlanId === plan.id ? "ring-2 ring-[#C9A227]" : ""}
                `}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#C9A227] text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="text-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{formatPrice(plan.price[billingCycle])}</span>
                    <span className="text-gray-500">/{billingCycle === "annual" ? "year" : "month"}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  disabled={isProcessing || currentPlanId === plan.id}
                  className={`
                    w-full py-2 rounded-lg font-medium transition-colors
                    ${currentPlanId === plan.id
                      ? "bg-gray-100 text-gray-500 cursor-default"
                      : plan.highlighted
                        ? "bg-[#C9A227] text-white hover:bg-[#B8911F]"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }
                    disabled:opacity-50
                  `}
                >
                  {currentPlanId === plan.id ? "Current Plan" : "Select Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function CancelModal({
  isProcessing,
  onConfirm,
  onClose,
}: {
  isProcessing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-0 top-[20%] mx-auto max-w-md z-50 px-4">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription?</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Your subscription will remain active until the end of the current billing period.
            You can resume anytime before then.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Keep Subscription
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Cancel Subscription"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BillingSubscription;

import Stripe from "stripe";

// Lazy initialize Stripe client
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Use getter for stripe access
const stripe = {
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get prices() { return getStripe().prices; },
  get paymentMethods() { return getStripe().paymentMethods; },
  get invoices() { return getStripe().invoices; },
  get invoiceItems() { return getStripe().invoiceItems; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get billing() { return getStripe().billing; },
  get webhooks() { return getStripe().webhooks; },
};

// SMB Voice Product IDs (create these in Stripe Dashboard)
export const STRIPE_PRODUCTS = {
  starter: process.env.STRIPE_PRODUCT_STARTER || "prod_starter",
  professional: process.env.STRIPE_PRODUCT_PROFESSIONAL || "prod_professional",
  business: process.env.STRIPE_PRODUCT_BUSINESS || "prod_business",
  enterprise: process.env.STRIPE_PRODUCT_ENTERPRISE || "prod_enterprise",
};

// Pricing in cents
export const PRICING = {
  starter: {
    monthly: 795, // $7.95
    name: "Starter",
    phoneNumbers: 1,
    users: 2,
    aiMinutes: 100,
  },
  professional: {
    monthly: 1995, // $19.95
    name: "Professional",
    phoneNumbers: 3,
    users: 5,
    aiMinutes: 500,
  },
  business: {
    monthly: 3995, // $39.95
    name: "Business",
    phoneNumbers: 10,
    users: 15,
    aiMinutes: 2000,
  },
  enterprise: {
    monthly: 9995, // $99.95 base
    name: "Enterprise",
    phoneNumbers: -1, // unlimited
    users: -1, // unlimited
    aiMinutes: -1, // unlimited
  },
};

// Usage-based pricing (per unit in cents)
export const USAGE_PRICING = {
  additionalPhoneNumber: 500, // $5.00 per additional number
  tollFreeNumber: 1000, // $10.00 per toll-free number
  aiMinuteOverage: 10, // $0.10 per AI minute overage
  smsOutbound: 2, // $0.02 per outbound SMS
  smsInbound: 1, // $0.01 per inbound SMS
  callRecordingStorage: 100, // $1.00 per GB
  internationalCall: 15, // $0.15 per minute base (varies by country)
};

// ==================== Customer Management ====================

export async function createCustomer(params: {
  email: string;
  name: string;
  organizationId: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      organizationId: params.organizationId,
      ...params.metadata,
    },
  });
}

export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
  try {
    return await stripe.customers.retrieve(customerId) as Stripe.Customer;
  } catch {
    return null;
  }
}

export async function updateCustomer(
  customerId: string,
  params: Stripe.CustomerUpdateParams
): Promise<Stripe.Customer> {
  return stripe.customers.update(customerId, params);
}

export async function deleteCustomer(customerId: string): Promise<Stripe.DeletedCustomer> {
  return stripe.customers.del(customerId);
}

// ==================== Subscription Management ====================

export async function createSubscription(params: {
  customerId: string;
  priceId: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}): Promise<Stripe.Subscription> {
  const subscriptionParams: Stripe.SubscriptionCreateParams = {
    customer: params.customerId,
    items: [{ price: params.priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    metadata: params.metadata,
  };

  if (params.trialDays) {
    subscriptionParams.trial_period_days = params.trialDays;
  }

  return stripe.subscriptions.create(subscriptionParams);
}

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch {
    return null;
  }
}

export async function updateSubscription(
  subscriptionId: string,
  params: Stripe.SubscriptionUpdateParams
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, params);
}

export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

export async function listSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  const result = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 100,
  });
  return result.data;
}

// ==================== Price Management ====================

export async function createPrice(params: {
  productId: string;
  unitAmount: number;
  currency?: string;
  interval?: "month" | "year";
  nickname?: string;
}): Promise<Stripe.Price> {
  return stripe.prices.create({
    product: params.productId,
    unit_amount: params.unitAmount,
    currency: params.currency || "usd",
    recurring: params.interval ? { interval: params.interval } : undefined,
    nickname: params.nickname,
  });
}

export async function listPrices(productId?: string): Promise<Stripe.Price[]> {
  const params: Stripe.PriceListParams = { active: true, limit: 100 };
  if (productId) {
    params.product = productId;
  }
  const result = await stripe.prices.list(params);
  return result.data;
}

// ==================== Payment Methods ====================

export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
): Promise<Stripe.PaymentMethod> {
  return stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
}

export async function detachPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
  return stripe.paymentMethods.detach(paymentMethodId);
}

export async function listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
  const result = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  return result.data;
}

export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<Stripe.Customer> {
  return stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
}

// ==================== Invoice Management ====================

export async function createInvoice(params: {
  customerId: string;
  description?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Invoice> {
  return stripe.invoices.create({
    customer: params.customerId,
    description: params.description,
    metadata: params.metadata,
    auto_advance: true,
  });
}

export async function addInvoiceItem(params: {
  customerId: string;
  amount: number;
  description: string;
  invoiceId?: string;
}): Promise<Stripe.InvoiceItem> {
  return stripe.invoiceItems.create({
    customer: params.customerId,
    amount: params.amount,
    currency: "usd",
    description: params.description,
    invoice: params.invoiceId,
  });
}

export async function finalizeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.finalizeInvoice(invoiceId);
}

export async function payInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.pay(invoiceId);
}

export async function listInvoices(customerId: string): Promise<Stripe.Invoice[]> {
  const result = await stripe.invoices.list({
    customer: customerId,
    limit: 100,
  });
  return result.data;
}

export async function getUpcomingInvoice(customerId: string): Promise<Stripe.UpcomingInvoice | null> {
  try {
    return await stripe.invoices.createPreview({ customer: customerId });
  } catch {
    return null;
  }
}

// ==================== Checkout Sessions ====================

export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: params.customerId,
    line_items: [{ price: params.priceId, quantity: 1 }],
    mode: "subscription",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: params.trialDays
      ? { trial_period_days: params.trialDays, metadata: params.metadata }
      : { metadata: params.metadata },
  });
}

export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

// ==================== Usage Records (Metered Billing) ====================

export async function reportUsage(params: {
  subscriptionItemId: string;
  quantity: number;
  timestamp?: number;
  action?: "increment" | "set";
}): Promise<Stripe.Billing.MeterEvent> {
  // Report metered billing usage
  return stripe.billing.meterEvents.create({
    event_name: "usage_record",
    payload: {
      stripe_customer_id: params.subscriptionItemId, // This should be a meter event
      value: String(params.quantity),
    },
    timestamp: params.timestamp || Math.floor(Date.now() / 1000),
  });
}

// ==================== Webhook Handling ====================

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

// Export the stripe instance for direct use if needed
export { stripe };

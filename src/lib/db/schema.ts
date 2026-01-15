import { pgTable, text, timestamp, boolean, integer, uuid, json } from 'drizzle-orm/pg-core';

// Organizations - Multi-tenant support
export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkOrgId: text('clerk_org_id').unique().notNull(),
  name: text('name').notNull(),
  domain: text('domain').unique().notNull(),
  status: text('status').default('active').notNull(), // active, suspended, cancelled
  plan: text('plan').default('starter').notNull(), // starter, professional, business, enterprise
  monthlyPrice: integer('monthly_price').default(795).notNull(), // cents ($7.95)
  stripeCustomerId: text('stripe_customer_id'),
  billingStatus: text('billing_status').default('active'), // active, trialing, past_due, canceled, incomplete
  billingEmail: text('billing_email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Subscriptions - Stripe subscription tracking
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(), // Use Stripe subscription ID
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull(),
  stripePriceId: text('stripe_price_id').notNull(),
  planId: text('plan_id').notNull(), // starter, professional, business, enterprise
  status: text('status').notNull(), // active, trialing, past_due, canceled, incomplete, paused
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  canceledAt: timestamp('canceled_at'),
  trialEndsAt: timestamp('trial_ends_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Invoices - Stripe invoice tracking
export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(), // Use Stripe invoice ID
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  stripeInvoiceId: text('stripe_invoice_id').notNull(),
  subscriptionId: text('subscription_id'),
  amountDue: integer('amount_due').notNull(), // in cents
  amountPaid: integer('amount_paid').default(0).notNull(), // in cents
  currency: text('currency').default('usd').notNull(),
  status: text('status').notNull(), // draft, open, paid, void, uncollectible, failed
  invoiceUrl: text('invoice_url'),
  pdfUrl: text('pdf_url'),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Usage Records - Track metered usage for billing
export const usageRecords = pgTable('usage_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  subscriptionId: text('subscription_id').references(() => subscriptions.id),
  type: text('type').notNull(), // ai_minutes, sms_outbound, sms_inbound, call_recording, international_minutes
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(), // in cents
  totalPrice: integer('total_price').notNull(), // in cents
  description: text('description'),
  billingPeriodStart: timestamp('billing_period_start').notNull(),
  billingPeriodEnd: timestamp('billing_period_end').notNull(),
  reportedToStripe: boolean('reported_to_stripe').default(false).notNull(),
  stripeUsageRecordId: text('stripe_usage_record_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Users - Synced from Clerk
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkUserId: text('clerk_user_id').unique().notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role').default('member').notNull(), // admin, member, super_admin
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Phone Numbers - DIDs from SignalWire
export const phoneNumbers = pgTable('phone_numbers', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(), // clerkOrgId or clerkUserId
  organizationId: uuid('organization_id').references(() => organizations.id),
  number: text('number').notNull(),
  type: text('type').notNull(), // local, toll_free
  signalwireId: text('signalwire_id').notNull(),
  routesTo: text('routes_to').notNull(), // extension number or 'ai'
  status: text('status').default('active').notNull(), // active, inactive, pending
  voiceEnabled: boolean('voice_enabled').default(true).notNull(),
  smsEnabled: boolean('sms_enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Extensions - SIP endpoints
export const extensions = pgTable('extensions', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  extension: text('extension').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  sipPassword: text('sip_password').notNull(),
  voicemailPin: text('voicemail_pin').notNull(),
  forwardTo: text('forward_to'),
  status: text('status').default('active').notNull(), // active, inactive
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI Receptionists - SignalWire AI configuration
export const aiReceptionists = pgTable('ai_receptionists', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  greeting: text('greeting').notNull(),
  businessDescription: text('business_description'),
  businessHours: text('business_hours'),
  transferExtension: text('transfer_extension'),
  isEnabled: boolean('is_enabled').default(true).notNull(),
  swmlConfig: json('swml_config'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Call Logs - Call history
export const callLogs = pgTable('call_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  direction: text('direction').notNull(), // inbound, outbound
  fromNumber: text('from_number').notNull(),
  toNumber: text('to_number').notNull(),
  callerNumber: text('caller_number'), // Caller ID (may differ from fromNumber)
  calledNumber: text('called_number'), // Destination (may differ from toNumber)
  extension: text('extension'),
  duration: integer('duration'), // seconds
  status: text('status').notNull(), // answered, missed, voicemail, busy
  recordingUrl: text('recording_url'),
  transcription: text('transcription'),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Voicemails
export const voicemails = pgTable('voicemails', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  extension: text('extension').notNull(),
  callerNumber: text('caller_number').notNull(),
  callerName: text('caller_name'),
  duration: integer('duration').notNull(), // seconds
  transcription: text('transcription'),
  audioUrl: text('audio_url').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Contacts - CRM contacts
export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(), // clerkOrgId or clerkUserId
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  company: text('company'),
  department: text('department'),
  notes: text('notes'),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  lastContactedAt: timestamp('last_contacted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Contact Tags - Many-to-many tags for contacts
export const contactTags = pgTable('contact_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  tag: text('tag').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// SMS Conversations
export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  phoneNumberId: uuid('phone_number_id').references(() => phoneNumbers.id).notNull(),
  participantPhone: text('participant_phone').notNull(),
  participantName: text('participant_name'),
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  unreadCount: integer('unread_count').default(0).notNull(),
  isStarred: boolean('is_starred').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// SMS Messages
export const smsMessages = pgTable('sms_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  phoneNumberId: uuid('phone_number_id').references(() => phoneNumbers.id).notNull(),
  direction: text('direction').notNull(), // inbound, outbound
  fromNumber: text('from_number').notNull(),
  toNumber: text('to_number').notNull(),
  body: text('body').notNull(),
  status: text('status').default('queued').notNull(), // queued, sent, delivered, failed
  segmentCount: integer('segment_count').default(1).notNull(),
  signalwireSid: text('signalwire_sid'),
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Webhook Endpoints
export const webhookEndpoints = pgTable('webhook_endpoints', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  events: json('events').$type<string[]>().notNull(),
  secret: text('secret'),
  enabled: boolean('enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Webhook Logs
export const webhookLogs = pgTable('webhook_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  webhookEndpointId: uuid('webhook_endpoint_id').references(() => webhookEndpoints.id),
  event: text('event').notNull(),
  status: text('status').notNull(), // success, failed, pending, retrying
  statusCode: integer('status_code'),
  requestBody: json('request_body'),
  responseBody: json('response_body'),
  error: text('error'),
  duration: integer('duration'), // milliseconds
  retryCount: integer('retry_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Business Hours
export const businessHours = pgTable('business_hours', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  timezone: text('timezone').default('America/New_York').notNull(),
  schedule: json('schedule').$type<Record<string, { enabled: boolean; openTime: string; closeTime: string }>>().notNull(),
  holidays: json('holidays').$type<{ id: string; name: string; date: string; recurring: boolean }[]>(),
  afterHoursAction: text('after_hours_action').default('voicemail').notNull(), // voicemail, message, forward
  afterHoursTarget: text('after_hours_target'),
  afterHoursMessage: text('after_hours_message'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// IVR Menus (Phone Tree)
export const ivrMenus = pgTable('ivr_menus', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  name: text('name').notNull(),
  greeting: text('greeting').notNull(),
  options: json('options').$type<{
    id: string;
    digit: string;
    label: string;
    action: 'extension' | 'department' | 'voicemail' | 'external' | 'submenu' | 'repeat';
    target?: string;
  }[]>().notNull(),
  timeout: integer('timeout').default(10).notNull(),
  timeoutAction: text('timeout_action').default('repeat').notNull(),
  timeoutTarget: text('timeout_target'),
  isDefault: boolean('is_default').default(false).notNull(),
  isEnabled: boolean('is_enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Call Queues
export const callQueues = pgTable('call_queues', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  name: text('name').notNull(),
  description: text('description'),
  ringStrategy: text('ring_strategy').default('round_robin').notNull(), // round_robin, ring_all, least_recent, fewest_calls
  ringTimeout: integer('ring_timeout').default(20).notNull(),
  maxWaitTime: integer('max_wait_time').default(300).notNull(),
  holdMusic: text('hold_music').default('default').notNull(),
  announcePosition: boolean('announce_position').default(true).notNull(),
  announceWaitTime: boolean('announce_wait_time').default(false).notNull(),
  wrapUpTime: integer('wrap_up_time').default(0).notNull(),
  isEnabled: boolean('is_enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Queue Agents - Many-to-many relationship between queues and extensions
export const queueAgents = pgTable('queue_agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  queueId: uuid('queue_id').references(() => callQueues.id).notNull(),
  extensionId: uuid('extension_id').references(() => extensions.id).notNull(),
  priority: integer('priority').default(1).notNull(),
  isPaused: boolean('is_paused').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Call Forwarding Rules
export const callForwardingRules = pgTable('call_forwarding_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  extensionId: uuid('extension_id').references(() => extensions.id),
  phoneNumberId: uuid('phone_number_id').references(() => phoneNumbers.id),
  ruleName: text('rule_name').notNull(),
  ruleType: text('rule_type').notNull(), // always, busy, no_answer, after_hours, custom
  forwardTo: text('forward_to').notNull(), // phone number or extension
  forwardType: text('forward_type').default('extension').notNull(), // extension, external, voicemail, queue
  ringTimeout: integer('ring_timeout').default(20),
  isEnabled: boolean('is_enabled').default(true).notNull(),
  priority: integer('priority').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Audit Logs - Track all user/system actions
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  userId: text('user_id'), // Clerk user ID who performed action (null for system)
  userEmail: text('user_email'),
  action: text('action').notNull(), // create, update, delete, login, export, etc.
  resourceType: text('resource_type').notNull(), // phone_number, contact, extension, etc.
  resourceId: text('resource_id'), // ID of affected resource
  resourceName: text('resource_name'), // Human-readable name
  details: json('details').$type<Record<string, unknown>>(), // Additional context
  previousValues: json('previous_values').$type<Record<string, unknown>>(), // For updates
  newValues: json('new_values').$type<Record<string, unknown>>(), // For creates/updates
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  status: text('status').default('success').notNull(), // success, failure
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notification Preferences - User notification settings
export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').notNull(),
  userId: text('user_id').notNull(), // Clerk user ID
  emailEnabled: boolean('email_enabled').default(true).notNull(),
  smsEnabled: boolean('sms_enabled').default(false).notNull(),
  pushEnabled: boolean('push_enabled').default(true).notNull(),
  voicemailNotify: boolean('voicemail_notify').default(true).notNull(),
  missedCallNotify: boolean('missed_call_notify').default(true).notNull(),
  smsNotify: boolean('sms_notify').default(true).notNull(),
  dailySummary: boolean('daily_summary').default(false).notNull(),
  weeklySummary: boolean('weekly_summary').default(true).notNull(),
  systemAlerts: boolean('system_alerts').default(true).notNull(),
  billingAlerts: boolean('billing_alerts').default(true).notNull(),
  quietHoursEnabled: boolean('quiet_hours_enabled').default(false).notNull(),
  quietHoursStart: text('quiet_hours_start'), // HH:mm format
  quietHoursEnd: text('quiet_hours_end'), // HH:mm format
  timezone: text('timezone').default('America/New_York').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports for use in application
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type UsageRecord = typeof usageRecords.$inferSelect;
export type NewUsageRecord = typeof usageRecords.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PhoneNumber = typeof phoneNumbers.$inferSelect;
export type NewPhoneNumber = typeof phoneNumbers.$inferInsert;
export type Extension = typeof extensions.$inferSelect;
export type NewExtension = typeof extensions.$inferInsert;
export type AIReceptionist = typeof aiReceptionists.$inferSelect;
export type NewAIReceptionist = typeof aiReceptionists.$inferInsert;
export type CallLog = typeof callLogs.$inferSelect;
export type NewCallLog = typeof callLogs.$inferInsert;
export type Voicemail = typeof voicemails.$inferSelect;
export type NewVoicemail = typeof voicemails.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type ContactTag = typeof contactTags.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type SMSMessage = typeof smsMessages.$inferSelect;
export type WebhookEndpoint = typeof webhookEndpoints.$inferSelect;
export type WebhookLog = typeof webhookLogs.$inferSelect;
export type BusinessHours = typeof businessHours.$inferSelect;
export type NewBusinessHours = typeof businessHours.$inferInsert;
export type IVRMenu = typeof ivrMenus.$inferSelect;
export type NewIVRMenu = typeof ivrMenus.$inferInsert;
export type CallQueue = typeof callQueues.$inferSelect;
export type NewCallQueue = typeof callQueues.$inferInsert;
export type QueueAgent = typeof queueAgents.$inferSelect;
export type NewQueueAgent = typeof queueAgents.$inferInsert;
export type CallForwardingRule = typeof callForwardingRules.$inferSelect;
export type NewCallForwardingRule = typeof callForwardingRules.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type NewNotificationPreference = typeof notificationPreferences.$inferInsert;

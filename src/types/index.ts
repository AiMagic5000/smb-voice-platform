// SMB Voice Platform Types

export interface Organization {
  id: string;
  clerkOrgId: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended' | 'cancelled';
  plan: 'basic' | 'pro' | 'enterprise';
  monthlyPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  clerkUserId: string;
  organizationId: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'admin' | 'member' | 'super_admin';
  createdAt: Date;
}

export interface PhoneNumber {
  id: string;
  organizationId: string;
  number: string;
  type: 'local' | 'toll_free';
  signalwireId: string;
  routesTo: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}

export interface Extension {
  id: string;
  organizationId: string;
  extension: string;
  name: string;
  email: string | null;
  sipPassword: string;
  voicemailPin: string;
  forwardTo: string | null;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface AIReceptionist {
  id: string;
  organizationId: string;
  greeting: string;
  businessDescription: string | null;
  businessHours: string | null;
  transferExtension: string | null;
  isEnabled: boolean;
  swmlConfig: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallLog {
  id: string;
  organizationId: string;
  direction: 'inbound' | 'outbound';
  fromNumber: string;
  toNumber: string;
  extension: string | null;
  duration: number | null;
  status: 'answered' | 'missed' | 'voicemail' | 'busy';
  recordingUrl: string | null;
  createdAt: Date;
}

export interface Voicemail {
  id: string;
  organizationId: string;
  extension: string;
  callerNumber: string;
  callerName: string | null;
  duration: number;
  transcription: string | null;
  audioUrl: string;
  isRead: boolean;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface ProvisioningFormData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  areaCode: string;
  wantTollFree: boolean;
  numExtensions: number;
  businessDescription?: string;
  businessHours?: string;
  enableAiReceptionist: boolean;
}

export interface ExtensionFormData {
  extension: string;
  name: string;
  email?: string;
  forwardTo?: string;
}

// Dashboard Stats
export interface DashboardStats {
  callsToday: number;
  voicemails: number;
  activeExtensions: number;
  missedCalls: number;
}

// Recent Activity
export interface RecentActivity {
  id: string;
  type: 'call' | 'voicemail' | 'extension' | 'setting';
  description: string;
  time: Date;
  details?: string;
}

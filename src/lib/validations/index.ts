import { z } from "zod";

// Contact form validation
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\(\)\+]+$/.test(val),
      "Please enter a valid phone number"
    ),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Sign up form validation
export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name must be less than 100 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => /^[\d\s\-\(\)\+]+$/.test(val),
      "Please enter a valid phone number"
    ),
});

export type SignUpData = z.infer<typeof signUpSchema>;

// AI Receptionist settings validation
export const aiReceptionistSchema = z.object({
  greeting: z
    .string()
    .min(10, "Greeting must be at least 10 characters")
    .max(500, "Greeting must be less than 500 characters"),
  businessHours: z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    end: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  }),
  afterHoursMessage: z
    .string()
    .max(500, "After hours message must be less than 500 characters")
    .optional(),
  transferNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\(\)\+]+$/.test(val),
      "Please enter a valid phone number"
    ),
  voicemailEnabled: z.boolean().default(true),
  transcriptionEnabled: z.boolean().default(true),
});

export type AIReceptionistSettings = z.infer<typeof aiReceptionistSchema>;

// Phone number configuration validation
export const phoneNumberConfigSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(50, "Label must be less than 50 characters"),
  forwardTo: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\(\)\+]+$/.test(val),
      "Please enter a valid phone number"
    ),
  voicemailEnabled: z.boolean().default(true),
  recordCalls: z.boolean().default(false),
  aiReceptionistEnabled: z.boolean().default(true),
});

export type PhoneNumberConfig = z.infer<typeof phoneNumberConfigSchema>;

// Extension validation
export const extensionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  extensionNumber: z
    .string()
    .min(3, "Extension must be at least 3 digits")
    .max(6, "Extension must be at most 6 digits")
    .regex(/^\d+$/, "Extension must be numeric"),
  forwardTo: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\(\)\+]+$/.test(val),
      "Please enter a valid phone number"
    ),
  role: z.enum(["admin", "member"]).default("member"),
});

export type ExtensionData = z.infer<typeof extensionSchema>;

// Profile settings validation
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\(\)\+]+$/.test(val),
      "Please enter a valid phone number"
    ),
});

export type ProfileData = z.infer<typeof profileSchema>;

// Business settings validation
export const businessSchema = z.object({
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name must be less than 100 characters"),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  industry: z
    .string()
    .max(50, "Industry must be less than 50 characters")
    .optional(),
  timezone: z.string().min(1, "Timezone is required"),
});

export type BusinessData = z.infer<typeof businessSchema>;

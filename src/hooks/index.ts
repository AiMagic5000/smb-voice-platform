// Form handling
export { useForm } from "./useForm";

// Keyboard shortcuts
export { useKeyboardShortcuts } from "./useKeyboardShortcuts";

// Theme management
export { useTheme, useThemeProvider, useThemeToggle } from "./useTheme";

// API data fetching hooks
export {
  // Generic hooks
  useApi,
  useApiMutation,
  clearApiCache,
  // Resource-specific hooks
  usePhoneNumbers,
  useExtensions,
  useCalls,
  useVoicemails,
  useContacts,
  useAIReceptionist,
  useBilling,
  useSettings,
  useBusinessHours,
  useIVRMenus,
  useCallQueues,
  useInvoices,
  // Types
  type PhoneNumber,
  type Extension,
  type CallLog,
  type CallStats,
  type Voicemail,
  type Contact,
  type AIReceptionistConfig,
  type BillingInfo,
  type UserSettings,
  type BusinessHoursConfig,
  type IVRMenu,
  type CallQueue,
  type Invoice,
} from "./useApi";

// Notifications
export {
  useNotifications,
  NotificationProvider,
  AlertBanner,
  StatusBadge,
  NotificationBadge,
  type Notification,
  type NotificationType,
} from "../components/ui/notifications";

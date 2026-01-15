"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// ============================================
// Types
// ============================================

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  timestamp: Date;
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
}

// ============================================
// Context
// ============================================

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

// ============================================
// Provider
// ============================================

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp">): string => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: new Date(),
        dismissible: notification.dismissible ?? true,
        duration: notification.duration ?? 5000,
      };

      setNotifications((prev) => [...prev, newNotification]);
      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const success = useCallback(
    (title: string, message?: string) =>
      addNotification({ type: "success", title, message }),
    [addNotification]
  );

  const error = useCallback(
    (title: string, message?: string) =>
      addNotification({ type: "error", title, message, duration: 8000 }),
    [addNotification]
  );

  const warning = useCallback(
    (title: string, message?: string) =>
      addNotification({ type: "warning", title, message }),
    [addNotification]
  );

  const info = useCallback(
    (title: string, message?: string) =>
      addNotification({ type: "info", title, message }),
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

// ============================================
// Container Component
// ============================================

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

// ============================================
// Notification Item Component
// ============================================

function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onDismiss, 300);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 300);
  };

  const typeStyles: Record<NotificationType, { bg: string; border: string; icon: string }> = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-500",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-500",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-500",
    },
  };

  const styles = typeStyles[notification.type];

  return (
    <div
      className={`
        pointer-events-auto
        ${styles.bg} ${styles.border}
        border rounded-lg shadow-lg p-4
        transform transition-all duration-300
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {notification.type === "success" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {notification.type === "error" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {notification.type === "warning" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {notification.type === "info" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
          {notification.message && (
            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
          )}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium text-[#C9A227] hover:text-[#B8911F]"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {notification.dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// Standalone Notification Components
// ============================================

/**
 * Alert banner for inline notifications
 */
export function AlertBanner({
  type,
  title,
  message,
  onDismiss,
  action,
}: {
  type: NotificationType;
  title: string;
  message?: string;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}) {
  const typeStyles: Record<NotificationType, { bg: string; border: string; text: string }> = {
    success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" },
    error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
    warning: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800" },
    info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
  };

  const styles = typeStyles[type];

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className={`font-medium ${styles.text}`}>{title}</h4>
          {message && <p className={`mt-1 text-sm ${styles.text} opacity-80`}>{message}</p>}
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-2 text-sm font-medium ${styles.text} underline hover:no-underline`}
            >
              {action.label}
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${styles.text} opacity-60 hover:opacity-100`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Badge for status indicators
 */
export function StatusBadge({
  status,
  label,
}: {
  status: "online" | "offline" | "busy" | "away";
  label?: string;
}) {
  const statusStyles: Record<string, { dot: string; text: string; bg: string }> = {
    online: { dot: "bg-green-500", text: "text-green-700", bg: "bg-green-100" },
    offline: { dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-100" },
    busy: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-100" },
    away: { dot: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-100" },
  };

  const styles = statusStyles[status];
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
      <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
      {displayLabel}
    </span>
  );
}

/**
 * Notification dot/counter for nav items
 */
export function NotificationBadge({
  count,
  max = 99,
  showZero = false,
}: {
  count: number;
  max?: number;
  showZero?: boolean;
}) {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
      {displayCount}
    </span>
  );
}

export default {
  NotificationProvider,
  useNotifications,
  AlertBanner,
  StatusBadge,
  NotificationBadge,
};

"use client";

import { useEffect, useCallback, useRef } from "react";

type KeyHandler = () => void;

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: KeyHandler;
  description?: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  ignoreInputs?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutConfig[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, ignoreInputs = true } = options;
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if focus is on an input element
      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        const isInput =
          tagName === "input" ||
          tagName === "textarea" ||
          tagName === "select" ||
          target.isContentEditable;

        if (isInput) return;
      }

      for (const shortcut of shortcutsRef.current) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatch = shortcut.meta ? event.metaKey : true;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler();
          break;
        }
      }
    },
    [enabled, ignoreInputs]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// Common shortcuts for dashboard
export function useDashboardShortcuts(navigate: (path: string) => void) {
  const shortcuts: ShortcutConfig[] = [
    {
      key: "d",
      ctrl: true,
      handler: () => navigate("/dashboard"),
      description: "Go to Dashboard",
    },
    {
      key: "p",
      ctrl: true,
      handler: () => navigate("/dashboard/phone-numbers"),
      description: "Go to Phone Numbers",
    },
    {
      key: "v",
      ctrl: true,
      handler: () => navigate("/dashboard/voicemails"),
      description: "Go to Voicemails",
    },
    {
      key: "h",
      ctrl: true,
      handler: () => navigate("/dashboard/calls"),
      description: "Go to Call History",
    },
    {
      key: ",",
      ctrl: true,
      handler: () => navigate("/dashboard/settings"),
      description: "Go to Settings",
    },
    {
      key: "/",
      ctrl: true,
      handler: () => {
        // Focus search input if exists
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="search"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: "Focus Search",
    },
    {
      key: "Escape",
      handler: () => {
        // Blur any focused element
        const activeElement = document.activeElement as HTMLElement;
        activeElement?.blur();
      },
      description: "Cancel / Close",
      preventDefault: false,
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}

// Hook to show keyboard shortcuts modal
export function useShortcutsHelp() {
  const shortcuts = [
    { keys: "Ctrl + D", description: "Go to Dashboard" },
    { keys: "Ctrl + P", description: "Go to Phone Numbers" },
    { keys: "Ctrl + V", description: "Go to Voicemails" },
    { keys: "Ctrl + H", description: "Go to Call History" },
    { keys: "Ctrl + ,", description: "Go to Settings" },
    { keys: "Ctrl + /", description: "Focus Search" },
    { keys: "Esc", description: "Cancel / Close" },
    { keys: "?", description: "Show Keyboard Shortcuts" },
  ];

  return shortcuts;
}

export default useKeyboardShortcuts;

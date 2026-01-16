/**
 * Capacitor utilities for native mobile features
 */

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network } from '@capacitor/network';
import { Share } from '@capacitor/share';

/**
 * Check if running as native app
 */
export const isNative = () => Capacitor.isNativePlatform();

/**
 * Get the current platform
 */
export const getPlatform = () => Capacitor.getPlatform();

/**
 * Check if running on iOS
 */
export const isIOS = () => Capacitor.getPlatform() === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = () => Capacitor.getPlatform() === 'android';

/**
 * Initialize app on mobile platform
 */
export const initializeApp = async () => {
  if (!isNative()) return;

  try {
    // Hide splash screen
    await SplashScreen.hide();

    // Configure status bar
    if (isAndroid() || isIOS()) {
      await StatusBar.setStyle({ style: Style.Dark });
      if (isAndroid()) {
        await StatusBar.setBackgroundColor({ color: '#0F172A' });
      }
    }

    // Listen for app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive);
    });

    // Listen for back button (Android)
    if (isAndroid()) {
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
    }

    console.log('Mobile app initialized');
  } catch (error) {
    console.error('Error initializing mobile app:', error);
  }
};

/**
 * Haptic feedback
 */
export const hapticFeedback = {
  light: () => Haptics.impact({ style: ImpactStyle.Light }),
  medium: () => Haptics.impact({ style: ImpactStyle.Medium }),
  heavy: () => Haptics.impact({ style: ImpactStyle.Heavy }),
  selection: () => Haptics.selectionStart(),
};

/**
 * Keyboard utilities
 */
export const keyboard = {
  show: () => Keyboard.show(),
  hide: () => Keyboard.hide(),
};

/**
 * Network utilities
 */
export const network = {
  getStatus: () => Network.getStatus(),
  addListener: (callback: (status: any) => void) => {
    return Network.addListener('networkStatusChange', callback);
  },
};

/**
 * Share content
 */
export const shareContent = async (options: {
  title?: string;
  text?: string;
  url?: string;
}) => {
  try {
    await Share.share(options);
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

/**
 * Check if app can share
 */
export const canShare = async () => {
  try {
    const result = await Share.canShare();
    return result.value;
  } catch {
    return false;
  }
};

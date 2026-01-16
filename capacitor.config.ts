import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.startmybusiness.voice',
  appName: 'SMB Voice',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'app.startmybusiness.us',
    // For development, uncomment the following:
    // url: 'http://localhost:3000',
    // cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0F172A',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#3B82F6',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F172A',
    },
    // Keyboard plugin configured at runtime
  },
};

export default config;

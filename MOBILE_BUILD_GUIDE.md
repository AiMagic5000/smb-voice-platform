# SMB Voice - Mobile Build Guide

This guide covers building native iOS and Android apps from the SMB Voice Next.js platform using Capacitor.

## Prerequisites

### For Android Development
- **Node.js** (v18+)
- **JDK** (Java Development Kit 17)
  ```bash
  # Install on Ubuntu/WSL
  sudo apt update
  sudo apt install openjdk-17-jdk

  # Verify installation
  java -version
  ```
- **Android Studio** (for building and testing)
  - Download from https://developer.android.com/studio
  - Install Android SDK (API Level 33 or higher)
  - Set ANDROID_HOME environment variable
  ```bash
  export ANDROID_HOME=$HOME/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
  ```

### For iOS Development (macOS only)
- **Xcode** (latest version from Mac App Store)
- **CocoaPods**
  ```bash
  sudo gem install cocoapods
  ```

## Project Configuration

### Bundle IDs
- **Android**: com.startmybusiness.voice
- **iOS**: com.startmybusiness.voice

### App Name
**SMB Voice**

## Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Mobile

#### Option A: Using the build script (Recommended)
```bash
./scripts/build-mobile.sh
```

#### Option B: Manual steps
```bash
# Build Next.js with static export
NEXT_CONFIG_FILE=next.config.mobile.ts npm run build

# Sync with Capacitor
npx cap sync
```

### 3. Platform-Specific Builds

#### Android

**Debug Build** (for testing)
```bash
# Open Android Studio
npm run cap:open:android

# Or build via command line
cd android
./gradlew assembleDebug

# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

**Release Build** (for distribution)
```bash
cd android
./gradlew assembleRelease

# APK will be at: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

**Sign the Release APK**
```bash
# Generate a keystore (one-time setup)
keytool -genkey -v -keystore smb-voice-release.keystore \
  -alias smb-voice -keyalg RSA -keysize 2048 -validity 10000

# Sign the APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore smb-voice-release.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  smb-voice

# Align the APK (optimize)
zipalign -v 4 \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  android/app/build/outputs/apk/release/smb-voice-release.apk
```

#### iOS (macOS only)

```bash
# Open Xcode
npm run cap:open:ios

# Then build from Xcode:
# 1. Select your target device/simulator
# 2. Product > Archive
# 3. Distribute App
```

## Development Workflow

### Live Reload with Device
```bash
# Start Next.js dev server
npm run dev

# Update capacitor.config.ts - uncomment development server lines:
# server: {
#   url: 'http://YOUR_IP:3000',
#   cleartext: true
# }

# Sync changes
npx cap sync android  # or ios

# Run on device
npm run cap:run:android
```

### Sync After Code Changes
```bash
# After modifying web code
npm run build:mobile

# Or manually
NEXT_CONFIG_FILE=next.config.mobile.ts npm run build
npx cap sync
```

## Native Features

The app includes Capacitor plugins for:
- **Splash Screen** - Branded launch screen
- **Status Bar** - Native status bar styling
- **Keyboard** - Keyboard behavior control
- **App** - App lifecycle events
- **Haptics** - Touch feedback
- **Network** - Connectivity status
- **Share** - Native share dialog

### Using Native Features in Code

```typescript
import { initializeApp, hapticFeedback, shareContent } from '@/lib/capacitor';

// Initialize on app mount
useEffect(() => {
  initializeApp();
}, []);

// Use haptic feedback
const handleButtonClick = () => {
  hapticFeedback.medium();
  // ... your logic
};

// Share content
const handleShare = async () => {
  await shareContent({
    title: 'SMB Voice',
    text: 'Check out this amazing platform!',
    url: 'https://app.startmybusiness.us',
  });
};
```

## Troubleshooting

### Android Build Errors

**Gradle build fails**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

**Missing SDK**
- Open Android Studio > Tools > SDK Manager
- Install Android SDK 33 or higher
- Install Android SDK Build-Tools

**ANDROID_HOME not set**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### iOS Build Errors

**CocoaPods issues**
```bash
cd ios/App
pod repo update
pod install --repo-update
cd ../..
npx cap sync ios
```

**Signing errors**
- Open Xcode
- Select project > Signing & Capabilities
- Select your development team
- Let Xcode automatically manage signing

### Common Issues

**Out directory not found**
- Ensure you're using the mobile Next.js config
- Run: `NEXT_CONFIG_FILE=next.config.mobile.ts npm run build`

**White screen on app launch**
- Check browser console in Android Studio / Xcode
- Verify all assets are loading correctly
- Check Capacitor config server settings

**API calls not working**
- Update CORS settings on backend
- Ensure API URLs are absolute (not relative)
- Check network permissions in AndroidManifest.xml / Info.plist

## App Store Submission

### Android (Google Play)

1. Generate signed release APK (see above)
2. Create app listing at https://play.google.com/console
3. Upload APK
4. Fill out store listing details
5. Set up pricing & distribution
6. Submit for review

### iOS (App Store)

1. Enroll in Apple Developer Program ($99/year)
2. Create App ID at https://developer.apple.com
3. Create app listing at https://appstoreconnect.apple.com
4. Archive and upload from Xcode
5. Fill out app information
6. Submit for review

## Performance Optimization

### Reduce App Size
```bash
# Enable ProGuard (Android)
# Edit android/app/build.gradle:
buildTypes {
  release {
    minifyEnabled true
    shrinkResources true
  }
}
```

### Optimize Images
- Use WebP format for images
- Compress images before bundling
- Use appropriate image sizes

### Code Splitting
- Next.js automatically code-splits
- Keep mobile build lean by removing unnecessary dependencies

## Testing

### Device Testing
- Test on multiple Android versions (8.0+)
- Test on multiple iOS versions (12.0+)
- Test on different screen sizes
- Test offline functionality
- Test deep links and navigation

### Performance Testing
- Monitor app startup time
- Check memory usage
- Profile JavaScript performance
- Test on lower-end devices

## Maintenance

### Updating Capacitor
```bash
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/android@latest @capacitor/ios@latest
npx cap sync
```

### Updating Dependencies
```bash
npm update
npm audit fix
npx cap sync
```

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [iOS Developer Guide](https://developer.apple.com/documentation)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run build:mobile` | Build and sync |
| `npm run cap:sync` | Sync web assets to native |
| `npm run cap:open:android` | Open Android Studio |
| `npm run cap:open:ios` | Open Xcode |
| `npm run android:build` | Build release APK |
| `npm run android:build:debug` | Build debug APK |
| `./scripts/build-mobile.sh` | Full mobile build |

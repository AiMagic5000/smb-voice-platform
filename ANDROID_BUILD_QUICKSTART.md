# Android Build Quick Start

Fast-track guide to building the SMB Voice Android APK.

## Prerequisites Setup

### 1. Install Java JDK 17
```bash
# On Ubuntu/WSL
sudo apt update
sudo apt install openjdk-17-jdk

# Verify
java -version
# Should show: openjdk version "17.x.x"
```

### 2. Set up Android SDK

#### Option A: Install Android Studio (Recommended)
1. Download from https://developer.android.com/studio
2. Install Android Studio
3. During setup, select "Standard" installation
4. SDK will be installed to `~/Android/Sdk` by default

#### Option B: Command Line Tools Only
```bash
# Download command line tools
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip

# Extract
mkdir -p ~/Android/Sdk/cmdline-tools
unzip commandlinetools-linux-9477386_latest.zip -d ~/Android/Sdk/cmdline-tools
mv ~/Android/Sdk/cmdline-tools/cmdline-tools ~/Android/Sdk/cmdline-tools/latest

# Install platform tools
cd ~/Android/Sdk/cmdline-tools/latest/bin
./sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

### 3. Set Environment Variables
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin

# Reload
source ~/.bashrc
```

### 4. Verify Setup
```bash
npm run mobile:check
```

## Build Commands

### Quick Build (One Command)
```bash
# Full build: Next.js export + Capacitor sync
npm run mobile:build
```

### Step-by-Step Build

#### 1. Export Next.js as Static Site
```bash
NEXT_CONFIG_FILE=next.config.mobile.ts npm run build
```

#### 2. Sync to Capacitor
```bash
npx cap sync android
```

#### 3. Build APK

**Debug APK** (for testing on device)
```bash
cd android
./gradlew assembleDebug

# APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK** (unsigned)
```bash
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## Installing APK on Device

### Via USB (ADB)
```bash
# Enable USB debugging on Android device
# Connect device via USB

# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or install release APK
adb install android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Via File Transfer
1. Copy APK to your device (email, cloud storage, etc.)
2. On device, tap the APK file
3. Allow "Install from Unknown Sources" if prompted
4. Install

## Development Workflow

### Live Testing with Hot Reload

1. Start Next.js dev server:
```bash
npm run dev
```

2. Get your local IP address:
```bash
# Linux/Mac
hostname -I | awk '{print $1}'

# Or
ip addr show | grep "inet " | grep -v 127.0.0.1
```

3. Edit `capacitor.config.ts` and update server section:
```typescript
server: {
  url: 'http://YOUR_IP_ADDRESS:3000',
  cleartext: true
}
```

4. Sync and run:
```bash
npx cap sync android
npx cap run android
```

Now changes will hot-reload on your device!

## Signing Release APK

For production/distribution, you need to sign the APK.

### 1. Generate Keystore (One-Time)
```bash
keytool -genkey -v -keystore smb-voice-release.keystore \
  -alias smb-voice \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Enter passwords and info when prompted
# SAVE THE PASSWORD - you'll need it!
```

### 2. Configure Gradle Signing

Edit `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../smb-voice-release.keystore')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'smb-voice'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### 3. Build Signed APK
```bash
cd android
./gradlew assembleRelease

# Signed APK:
# android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Build Fails

**Error: ANDROID_HOME not set**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
source ~/.bashrc
```

**Error: SDK not found**
```bash
# Install via Android Studio SDK Manager
# Or via command line:
sdkmanager "platform-tools" "platforms;android-33"
```

**Error: Gradle build failed**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### App Crashes on Launch

**Check logs:**
```bash
# With device connected
adb logcat | grep -i "capacitor\|chromium"
```

**Common fixes:**
- Rebuild: `npm run mobile:build`
- Clear app data on device
- Reinstall APK

### White Screen

- Check that `out` directory has content
- Verify Next.js build completed successfully
- Check for JavaScript errors in device logs

### Network Errors

- Update CORS on backend to allow mobile app origin
- Check API endpoints use absolute URLs
- Verify network permissions in `AndroidManifest.xml`

## Quick Reference

| Task | Command |
|------|---------|
| Check environment | `npm run mobile:check` |
| Full build | `npm run mobile:build` |
| Build debug APK | `npm run android:build:debug` |
| Build release APK | `npm run android:build` |
| Open in Android Studio | `npm run cap:open:android` |
| Install on device | `adb install path/to/app.apk` |
| View device logs | `adb logcat` |

## File Locations

| Item | Location |
|------|----------|
| Debug APK | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Release APK | `android/app/build/outputs/apk/release/app-release.apk` |
| Web assets | `out/` |
| Android project | `android/` |
| Capacitor config | `capacitor.config.ts` |
| Mobile build config | `next.config.mobile.ts` |

## Next Steps

1. Test the debug APK on multiple Android devices
2. Set up signing for release builds
3. Prepare for Google Play Store submission
4. Consider adding Android App Bundle (AAB) build for Play Store

For detailed information, see [MOBILE_BUILD_GUIDE.md](./MOBILE_BUILD_GUIDE.md)

#!/bin/bash

# Check if the development environment is ready for mobile builds

echo "Checking SMB Voice Mobile Build Environment..."
echo "================================================"
echo ""

# Check Node.js
echo "Node.js:"
if command -v node &> /dev/null; then
    node_version=$(node -v)
    echo "  ✓ Installed: $node_version"
else
    echo "  ✗ Not installed"
    echo "    Install from: https://nodejs.org/"
fi
echo ""

# Check npm
echo "npm:"
if command -v npm &> /dev/null; then
    npm_version=$(npm -v)
    echo "  ✓ Installed: $npm_version"
else
    echo "  ✗ Not installed"
fi
echo ""

# Check Java
echo "Java (JDK):"
if command -v java &> /dev/null; then
    java_version=$(java -version 2>&1 | head -n 1)
    echo "  ✓ Installed: $java_version"
else
    echo "  ✗ Not installed"
    echo "    Install JDK 17: sudo apt install openjdk-17-jdk"
fi
echo ""

# Check Android SDK
echo "Android SDK:"
if [ -n "$ANDROID_HOME" ]; then
    echo "  ✓ ANDROID_HOME set: $ANDROID_HOME"
    if [ -d "$ANDROID_HOME" ]; then
        echo "  ✓ Directory exists"
    else
        echo "  ✗ Directory does not exist"
    fi
else
    echo "  ✗ ANDROID_HOME not set"
    echo "    Add to ~/.bashrc: export ANDROID_HOME=$HOME/Android/Sdk"
fi
echo ""

# Check Gradle
echo "Gradle:"
if [ -f "./android/gradlew" ]; then
    echo "  ✓ Gradle wrapper found"
else
    echo "  ✗ Gradle wrapper not found"
fi
echo ""

# Check Capacitor
echo "Capacitor:"
if [ -f "./capacitor.config.ts" ]; then
    echo "  ✓ Configuration found"
else
    echo "  ✗ Configuration not found"
fi
echo ""

# Check platforms
echo "Platforms:"
if [ -d "./android" ]; then
    echo "  ✓ Android platform added"
else
    echo "  ✗ Android platform not added"
    echo "    Run: npx cap add android"
fi

if [ -d "./ios" ]; then
    echo "  ✓ iOS platform added"
else
    echo "  ✗ iOS platform not added"
    echo "    Run: npx cap add ios"
fi
echo ""

# Check dependencies
echo "Dependencies:"
if [ -d "./node_modules" ]; then
    echo "  ✓ Node modules installed"
else
    echo "  ✗ Node modules not installed"
    echo "    Run: npm install"
fi
echo ""

echo "================================================"
echo "Environment Check Complete"
echo ""

# Summary
if command -v java &> /dev/null && [ -n "$ANDROID_HOME" ] && [ -d "./android" ] && [ -d "./node_modules" ]; then
    echo "✓ Ready for Android builds"
else
    echo "✗ Android environment incomplete - see issues above"
fi

echo ""

if command -v pod &> /dev/null && [ -d "./ios" ]; then
    echo "✓ Ready for iOS builds (macOS only)"
else
    echo "✗ iOS environment incomplete or not on macOS"
fi

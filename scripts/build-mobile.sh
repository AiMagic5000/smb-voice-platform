#!/bin/bash

# Build script for mobile apps
# This script builds the Next.js app with static export and syncs to Capacitor

set -e

echo "Building SMB Voice mobile apps..."

# Step 1: Clean previous build
echo "Cleaning previous build..."
rm -rf out

# Step 2: Build Next.js with static export for mobile
echo "Building Next.js static export..."
NEXT_CONFIG_FILE=next.config.mobile.ts npm run build

# Step 3: Ensure out directory exists
if [ ! -d "out" ]; then
  echo "Error: out directory not created. Check build output."
  exit 1
fi

# Step 4: Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync

echo "Mobile build complete!"
echo ""
echo "Next steps:"
echo "  Android: npm run cap:open:android"
echo "  iOS: npm run cap:open:ios (requires macOS)"

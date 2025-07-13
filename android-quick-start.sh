#!/bin/bash

# Goalee Android Quick Start Script
# This script sets up the Goalee app for Android development

set -e

echo "🚀 Goalee Android Quick Start"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if Capacitor CLI is installed
if ! command -v npx cap &> /dev/null; then
    echo "📦 Installing Capacitor CLI..."
    npm install -g @capacitor/cli
else
    echo "✅ Capacitor CLI is installed"
fi

# Initialize Capacitor if not already done
if [ ! -f "capacitor.config.ts" ] && [ ! -f "capacitor.config.js" ]; then
    echo "🔧 Initializing Capacitor..."
    npx cap init Goalee com.goalee.app --web-dir=build
else
    echo "✅ Capacitor already initialized"
fi

# Add Android platform if not already added
if [ ! -d "android" ]; then
    echo "📱 Adding Android platform..."
    npx cap add android
else
    echo "✅ Android platform already added"
fi

# Build the web app
echo "🔨 Building web app..."
npm run build

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync

echo ""
echo "🎉 Setup complete! Here are your next steps:"
echo ""
echo "📱 For Android Development:"
echo "1. Install Android Studio from https://developer.android.com/studio"
echo "2. Install Android SDK and set up environment variables"
echo "3. Open the project in Android Studio:"
echo "   npx cap open android"
echo "4. Build and run on device or emulator"
echo ""
echo "🌐 For PWA (Easiest):"
echo "1. Start the development server: npm start"
echo "2. Open Chrome on your Android device"
echo "3. Navigate to http://localhost:3000"
echo "4. Tap menu (three dots) → 'Add to Home screen'"
echo ""
echo "📚 For detailed instructions, see android-setup.md"
echo ""
echo "🚀 Ready to build your Android app!" 
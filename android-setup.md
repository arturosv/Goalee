# Android Development Setup Guide

This guide provides multiple options for building an Android app from the containerized Goalee web application.

## Option 1: Capacitor (Recommended - Cross-platform)

### Setup Capacitor for Android

1. **Install Capacitor CLI**
```bash
npm install -g @capacitor/cli
```

2. **Initialize Capacitor in your project**
```bash
npx cap init Goalee com.goalee.app
```

3. **Add Android platform**
```bash
npx cap add android
```

4. **Build and sync**
```bash
npm run build
npx cap sync
npx cap open android
```

### Android Studio Setup
1. **Install Android Studio** from [developer.android.com](https://developer.android.com/studio)
2. **Install Android SDK** and set up environment variables
3. **Open the project** in Android Studio
4. **Configure app icons** in `android/app/src/main/res/`
5. **Build and run** on device or emulator

## Option 2: React Native (Full Native)

### Create React Native Android App

1. **Create React Native project**
```bash
npx react-native init GoaleeApp
```

2. **Add WebView dependency**
```bash
npm install react-native-webview
```

3. **Create WebView component**
```javascript
import React from 'react';
import { WebView } from 'react-native-webview';

const App = () => {
  return (
    <WebView 
      source={{ uri: 'http://localhost:3000' }}
      style={{ flex: 1 }}
    />
  );
};

export default App;
```

4. **Run on Android**
```bash
npx react-native run-android
```

## Option 3: Flutter (Cross-platform)

### Create Flutter Android App

1. **Create Flutter project**
```bash
flutter create goalee_app
```

2. **Add webview_flutter dependency**
```yaml
dependencies:
  webview_flutter: ^4.0.0
```

3. **Create WebView app**
```dart
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(GoaleeApp());
}

class GoaleeApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: WebView(
          initialUrl: 'http://localhost:3000',
          javascriptMode: JavascriptMode.unrestricted,
        ),
      ),
    );
  }
}
```

4. **Run on Android**
```bash
flutter run
```

## Option 4: Progressive Web App (PWA)

### Android PWA Installation

1. **Deploy your app** to a public URL (Vercel, Netlify, etc.)
2. **Open Chrome** on Android device
3. **Navigate to your app URL**
4. **Tap the menu** (three dots)
5. **Select "Add to Home screen"**
6. **Your app** will now appear on the home screen

### PWA Features for Android
- Offline functionality
- Push notifications
- Native app-like experience
- Automatic updates

## Option 5: Native Android Development

### Using Kotlin with WebView

1. **Create Android project** in Android Studio
2. **Add WebView to layout**
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>
```

3. **Configure WebView in Activity**
```kotlin
import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        val webView = findViewById<WebView>(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.loadUrl("http://localhost:3000")
    }
}
```

## Docker Setup for Android Development

### Build and Run Container

1. **Build the container**
```bash
docker build -t goalee-app .
```

2. **Run the container**
```bash
docker run -p 3000:3000 goalee-app
```

3. **For development with hot reload**
```bash
docker-compose --profile dev up
```

### Access from Android Device

- **Local development**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical device**: Use your computer's IP address (e.g., `http://192.168.1.100:3000`)

## Android-Specific Features

### Capacitor Plugins for Android

1. **Camera Plugin**
```bash
npm install @capacitor/camera
npx cap sync
```

2. **Geolocation Plugin**
```bash
npm install @capacitor/geolocation
npx cap sync
```

3. **Push Notifications**
```bash
npm install @capacitor/push-notifications
npx cap sync
```

### Android Permissions

Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## Recommended Approach

### For Quick Android App:
1. Use **Capacitor** (Option 1) - easiest and most reliable
2. Containerize the web app with Docker
3. Deploy to a cloud service (Vercel, Netlify, or your own server)
4. Use the deployed URL in Capacitor

### For Production Android App:
1. Use **React Native** (Option 2) - best performance and native feel
2. Convert the web components to React Native
3. Implement native Android features (camera, notifications, etc.)
4. Use native navigation and animations

## Android App Store Submission

### Using Capacitor
1. Build the web app: `npm run build`
2. Sync with Capacitor: `npx cap sync`
3. Open in Android Studio: `npx cap open android`
4. Configure app icons and metadata
5. Test on device
6. Submit to Google Play Store

### Using React Native
1. Convert web components to React Native
2. Implement native Android features
3. Use React Navigation for routing
4. Add native animations
5. Test and submit to Google Play Store

## Android Development Environment

### Prerequisites
1. **Install Android Studio**
2. **Install Android SDK**
3. **Set up environment variables**
4. **Create Android Virtual Device (AVD)**

### Environment Variables
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Testing on Android

### Using Android Emulator
1. **Open Android Studio**
2. **Launch AVD Manager**
3. **Start an emulator**
4. **Run your app** on the emulator

### Using Physical Device
1. **Enable Developer Options** on your Android device
2. **Enable USB Debugging**
3. **Connect device** via USB
4. **Run your app** on the device

## Deployment Options

### Google Play Store
1. **Create developer account** on Google Play Console
2. **Build APK or AAB** file
3. **Upload to Play Console**
4. **Configure store listing**
5. **Submit for review**

### Alternative Stores
- **Amazon Appstore**
- **Samsung Galaxy Store**
- **Huawei AppGallery**

## Next Steps

1. **Choose your approach** based on your needs
2. **Set up the containerized environment**
3. **Deploy to a cloud service**
4. **Build the Android app** using your chosen method
5. **Test on Android emulator and device**
6. **Submit to Google Play Store** (if using native approach)

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Flutter Documentation](https://flutter.dev/docs)
- [Android Developer Documentation](https://developer.android.com/docs)
- [Google Play Console](https://play.google.com/console) 
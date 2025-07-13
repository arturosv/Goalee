# iOS Development Setup Guide

This guide provides multiple options for building an iOS app from the containerized Goalee web application.

## Option 1: WebView Wrapper (Easiest)

### Using Capacitor (Recommended)

1. **Install Capacitor CLI**
```bash
npm install -g @capacitor/cli
```

2. **Initialize Capacitor in your project**
```bash
npx cap init Goalee com.goalee.app
```

3. **Add iOS platform**
```bash
npx cap add ios
```

4. **Build and sync**
```bash
npm run build
npx cap sync
npx cap open ios
```

### Using React Native WebView

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

## Option 2: Progressive Web App (PWA)

### Add PWA Support

1. **Install PWA dependencies**
```bash
npm install workbox-webpack-plugin
```

2. **Create manifest.json**
```json
{
  "name": "Goalee - Calorie Tracker",
  "short_name": "Goalee",
  "description": "Track calories and macros with precision",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f2f2f7",
  "theme_color": "#007aff",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

3. **Add to index.html**
```html
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Goalee">
```

## Option 3: Native iOS Development

### Using SwiftUI with WebView

1. **Create iOS project in Xcode**
2. **Add WebView component**
```swift
import SwiftUI
import WebKit

struct ContentView: View {
    var body: some View {
        WebView(url: URL(string: "http://localhost:3000")!)
            .edgesIgnoringSafeArea(.all)
    }
}

struct WebView: UIViewRepresentable {
    let url: URL
    
    func makeUIView(context: Context) -> WKWebView {
        return WKWebView()
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        webView.load(request)
    }
}
```

## Option 4: Flutter (Cross-platform)

### Create Flutter WebView App

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

## Docker Setup for iOS Development

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

### Access from iOS Simulator/Device

- **Local development**: `http://localhost:3000`
- **iOS Simulator**: `http://localhost:3000`
- **Physical device**: Use your computer's IP address (e.g., `http://192.168.1.100:3000`)

## Option 5: React Native (Full Native)

### Convert to React Native

1. **Create React Native project**
```bash
npx react-native init GoaleeApp
```

2. **Install dependencies**
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-vector-icons
npm install react-native-reanimated react-native-gesture-handler
```

3. **Convert components to React Native**
- Replace HTML elements with React Native components
- Convert CSS to StyleSheet
- Use React Navigation for routing
- Implement native animations with Reanimated

## Recommended Approach

### For Quick iOS App:
1. Use **Capacitor** (Option 1) - easiest and most reliable
2. Containerize the web app with Docker
3. Deploy to a cloud service (Vercel, Netlify, or your own server)
4. Use the deployed URL in Capacitor

### For Production iOS App:
1. Use **React Native** (Option 5) - best performance and native feel
2. Convert the web components to React Native
3. Implement native iOS features (camera, notifications, etc.)
4. Use native navigation and animations

## Deployment Options

### Cloud Deployment
1. **Vercel**: `vercel --prod`
2. **Netlify**: `netlify deploy --prod`
3. **AWS S3 + CloudFront**: Upload build folder
4. **Docker on EC2**: Deploy container to AWS

### Local Development
1. **Docker**: `docker-compose up`
2. **Direct**: `npm start`
3. **Production build**: `npm run build && serve -s build`

## Next Steps

1. **Choose your approach** based on your needs
2. **Set up the containerized environment**
3. **Deploy to a cloud service**
4. **Build the iOS app** using your chosen method
5. **Test on iOS Simulator and device**
6. **Submit to App Store** (if using native approach)

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Flutter Documentation](https://flutter.dev/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/) 
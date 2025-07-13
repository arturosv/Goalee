# Goalee - Calorie & Macro Tracker

A modern, mobile-first web application for tracking calories and macros with precision. Built with React, TypeScript, and designed to look and feel like a native mobile app. **Now containerized for easy iOS development!**

## 🚀 Quick Start (iOS Ready)

### Option 1: Docker (Recommended)
```bash
# Clone and setup
git clone <repository-url>
cd goalee-calorie-tracker

# Run with Docker
./quick-start.sh

# Or manually:
docker build -t goalee-app .
docker-compose up -d
```

### Option 2: Direct Development
```bash
npm install
npm start
```

## 📱 Mobile Development Options

### iOS Development

#### 1. **PWA (Easiest)**
- Open Safari on your iPhone/iPad
- Navigate to `http://localhost:3000`
- Tap "Add to Home Screen"
- Your app now works like a native iOS app!

#### 2. **Capacitor (Recommended for App Store)**
```bash
npm install -g @capacitor/cli
npx cap init Goalee com.goalee.app
npx cap add ios
npm run build
npx cap sync
npx cap open ios
```

#### 3. **React Native (Full Native)**
See `ios-setup.md` for detailed instructions.

### Android Development

#### 1. **PWA (Easiest)**
- Open Chrome on your Android device
- Navigate to `http://localhost:3000`
- Tap menu (three dots) → "Add to Home screen"
- Your app now works like a native Android app!

#### 2. **Capacitor (Recommended for Play Store)**
```bash
npm install -g @capacitor/cli
npx cap init Goalee com.goalee.app
npx cap add android
npm run build
npx cap sync
npx cap open android
```

#### 3. **React Native (Full Native)**
See `android-setup.md` for detailed instructions.

## Features

### 🎯 Dashboard
- **Daily Overview**: See your day at a glance with summary cards
- **Energy Intake**: Track calories and macros with visual progress indicators
- **Energy Output**: Monitor workouts and activity levels
- **Net Analysis**: View surplus/deficit calculations with actionable insights
- **Quick Actions**: Fast access to add meals and log workouts

### 📱 Input Screen
- **Multiple Input Methods**: Text, voice, photo, and video input options
- **Smart Food Recognition**: AI-powered meal analysis and ingredient detection
- **Precision Tracking**: Accurate portion and ingredient identification
- **Real-time Calculation**: Instant calorie and macro calculations
- **Food Database**: Comprehensive database with nutritional information

### 📊 Trends & Analytics
- **Progress Tracking**: Monitor weight and calorie trends over time
- **Goal Analysis**: Compare actual vs. projected weight changes
- **Smart Recommendations**: Personalized advice based on your data
- **Time Period Analysis**: Week, month, and quarter views
- **BMR & TDEE Calculations**: Scientific metabolic rate calculations

### 👤 Profile Management
- **Personal Information**: Age, gender, height, weight tracking
- **Activity Levels**: Detailed activity level assessment
- **Goal Setting**: Weight loss, maintenance, or gain targets
- **BMR Calculation**: Basal Metabolic Rate using Mifflin-St Jeor Equation
- **TDEE Calculation**: Total Daily Energy Expenditure
- **Macro Targets**: Personalized protein, carbs, and fat goals

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Custom CSS with Apple Health-inspired design
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router for navigation
- **Containerization**: Docker for easy deployment
- **PWA**: Progressive Web App support for iOS installation

## Docker Setup

### Production Build
```bash
docker build -t goalee-app .
docker run -p 3000:3000 goalee-app
```

### Development with Hot Reload
```bash
docker-compose --profile dev up
```

### Docker Compose Services
- **Production**: `docker-compose up` (port 3000)
- **Development**: `docker-compose --profile dev up` (port 3001)

## Mobile Development Guides

### iOS Development Guide
See `ios-setup.md` for comprehensive iOS development options:

1. **PWA Installation** - Add to Home Screen
2. **Capacitor** - WebView wrapper for App Store
3. **React Native** - Full native conversion
4. **Flutter** - Cross-platform development
5. **Native iOS** - SwiftUI with WebView

### Android Development Guide
See `android-setup.md` for comprehensive Android development options:

1. **PWA Installation** - Add to Home Screen
2. **Capacitor** - WebView wrapper for Play Store
3. **React Native** - Full native conversion
4. **Flutter** - Cross-platform development
5. **Native Android** - Kotlin with WebView

## App Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Main dashboard with action cards
│   ├── InputScreen.tsx    # Food input with multiple methods
│   ├── Trends.tsx         # Analytics and progress tracking
│   ├── Profile.tsx        # User profile and settings
│   └── BottomNavigation.tsx # Mobile navigation
├── App.tsx               # Main app component with routing
├── App.css              # Global styles and utilities
└── index.tsx            # App entry point

Docker/
├── Dockerfile           # Container configuration
├── docker-compose.yml   # Multi-service setup
└── .dockerignore        # Excluded files

PWA/
├── manifest.json        # App manifest
├── sw.js              # Service worker
└── icons/             # App icons
```

## Key Features Explained

### Mobile-First Design
The app is designed to look and feel like a native mobile application with:
- Touch-friendly interface elements
- Smooth animations and transitions
- Bottom navigation for easy thumb access
- Responsive design that works on all screen sizes
- Apple Health-inspired design language

### Precision Food Tracking
- **Text Input**: Natural language food descriptions
- **Voice Input**: Speech-to-text for hands-free logging
- **Photo Recognition**: AI-powered food identification from photos
- **Video Analysis**: Enhanced accuracy with video input
- **Smart Suggestions**: Intelligent food database matching

### Scientific Calculations
- **BMR**: Basal Metabolic Rate using Mifflin-St Jeor Equation
- **TDEE**: Total Daily Energy Expenditure with activity multipliers
- **Goal-Based Targets**: Personalized calorie goals based on objectives
- **Macro Ratios**: Optimal protein, carbs, and fat distribution

### Progress Analytics
- **Trend Analysis**: Track changes over time periods
- **Goal Comparison**: Actual vs. projected weight changes
- **Smart Recommendations**: Personalized advice based on data
- **Visual Insights**: Easy-to-understand progress indicators

## Deployment Options

### Local Development
```bash
# Docker
./quick-start.sh

# Direct
npm start

# Production build
npm run build && serve -s build
```

### Cloud Deployment
1. **Vercel**: `vercel --prod`
2. **Netlify**: `netlify deploy --prod`
3. **AWS S3 + CloudFront**: Upload build folder
4. **Docker on EC2**: Deploy container to AWS

## App Store Submission

### iOS App Store Submission

#### Using Capacitor
1. Build the web app: `npm run build`
2. Sync with Capacitor: `npx cap sync`
3. Open in Xcode: `npx cap open ios`
4. Configure app icons and metadata
5. Test on device
6. Submit to App Store

#### Using React Native

### Android Play Store Submission

#### Using Capacitor
1. Build the web app: `npm run build`
2. Sync with Capacitor: `npx cap sync`
3. Open in Android Studio: `npx cap open android`
4. Configure app icons and metadata
5. Test on device
6. Submit to Google Play Store

#### Using React Native
1. Convert web components to React Native
2. Implement native iOS features
3. Use React Navigation for routing
4. Add native animations
5. Test and submit to App Store

## Future Enhancements

- [ ] Real-time data synchronization
- [ ] Advanced chart visualizations
- [ ] Social features and sharing
- [ ] Integration with fitness trackers
- [ ] Meal planning and recipes
- [ ] Barcode scanning for packaged foods
- [ ] Export and backup functionality
- [ ] Dark mode support
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Apple Health integration
- [ ] Siri shortcuts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@goalee.app or create an issue in the repository. 
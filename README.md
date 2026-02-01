# SubmissionApp

A production-ready React Native application with Clean Architecture, Dark Mode support, and secure authentication via DummyJSON API.

## 🎯 Features

### Architecture
- ✅ **Clean Architecture** - 5 layers: Presentation, Domain, Data, Core, Config
- ✅ **Dependency Injection** - Service locator pattern for loose coupling
- ✅ **TypeScript** - Full type safety across the application

### Authentication
- ✅ **Secure Login** - DummyJSON API integration with email/password
- ✅ **Token Management** - Access & refresh token handling
- ✅ **AsyncStorage** - Secure token persistence
- ✅ **Error Handling** - Proper distinction between auth errors and network errors

### UI & Theme
- ✅ **Dark Mode** - Full light/dark theme support with system detection
- ✅ **Responsive Design** - Works on all device sizes
- ✅ **Theme Persistence** - User preference saved to AsyncStorage
- ✅ **System Theme Detection** - Auto-switch based on device settings

### State Management
- ✅ **Zustand** - Lightweight state management with DevTools
- ✅ **React Context** - For theme management
- ✅ **Custom Hooks** - Reusable logic with proper typing

### Network
- ✅ **Axios** - HTTP client with interceptors
- ✅ **Request/Response Interceptors** - Automatic token injection
- ✅ **Error Handling** - Smart error detection and categorization
- ✅ **Retry Logic** - Automatic retry for failed requests

---

## 📱 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React Native | 0.83.1 |
| **Language** | TypeScript | 5.8.3 |
| **State Management** | Zustand | 5.0.11 |
| **HTTP Client** | Axios | 1.13.4 |
| **Storage** | AsyncStorage | ~1.23.1 |
| **UI** | React Native Safe Area | ~4.10.0 |
| **Build Tool** | Metro | 0.83.3 |
| **Package Manager** | npm | Latest |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Android SDK (for Android development)
- Xcode (for iOS development)
- Java Development Kit (JDK)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/facto05/SubmissionApp.git
cd SubmissionApp
```

2. **Install dependencies**
```bash
npm install
```

3. **For iOS (macOS only)**
```bash
bundle install
bundle exec pod install
```

### Running the App

**Android**
```bash
npm run android
```

**iOS**
```bash
npm run ios
```

**Metro Dev Server** (if needed separately)
```bash
npm start
```

---

## 📁 Project Structure

```
src/
├── presentation/           # UI Layer
│   ├── screens/           # Screen components
│   │   ├── LoginScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── context/           # React Context
│   │   └── ThemeContext.tsx
│   ├── hooks/             # Custom hooks
│   │   └── useThemeColors.ts
│   ├── store/             # Zustand stores
│   │   ├── auth.ts
│   │   └── user.ts
│   └── theme/             # Design system
│       └── colors.ts
│
├── domain/                # Business Logic
│   ├── entities/          # Data models
│   ├── repositories/      # Interfaces
│   └── usecases/          # Business logic
│
├── data/                  # Data Layer
│   ├── datasources/       # API & local data
│   └── repositories/      # Implementations
│
├── core/                  # Core Utilities
│   ├── types/             # Type definitions
│   ├── utils/             # Helper functions
│   └── constants/         # App-wide constants
│
└── config/                # Configuration
    ├── service_locator.ts # DI setup
    └── constants.ts       # Global constants
```

---

## 🔐 Authentication

### Login Flow
1. User enters email and password
2. App validates input locally
3. Sends credentials to DummyJSON API
4. API returns access and refresh tokens
5. Tokens stored in AsyncStorage
6. User navigated to home screen

### Error Handling
- **Invalid Credentials** (400/401) → "Invalid email or password"
- **Network Error** → "Network connection error"
- **Server Error** (5xx) → "Server error"
- **Unknown Error** → "An error occurred"

### Test Credentials (DummyJSON)
```
Email: atuny0@sohu.com
Password: 9uQFF122De
```

---

## 🎨 Dark Mode

### Features
- **Automatic Detection** - Detects system theme preference
- **Manual Toggle** - User can manually switch theme
- **Persistent** - User preference saved to AsyncStorage
- **Real-time Switching** - Immediate theme update on all screens

### Usage
```tsx
import { useColors } from './hooks/useThemeColors';
import { useTheme } from './context/ThemeContext';

export const MyComponent = () => {
  const colors = useColors();
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
};
```

---

## 📚 Documentation

- **[START_HERE.md](./START_HERE.md)** - Getting started guide
- **[DARK_MODE_SETUP.md](./DARK_MODE_SETUP.md)** - Dark mode implementation
- **[CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md)** - Architecture guide
- **[ERROR_HANDLING_FIX.md](./ERROR_HANDLING_FIX.md)** - Error handling details
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Project status & metrics
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick API reference

---

## 🛠️ Development

### Building for Production

**Android**
```bash
cd android && ./gradlew assembleRelease
```

**iOS**
```bash
cd ios && xcodebuild -workspace SubmissioApp.xcworkspace -scheme SubmissioApp -configuration Release
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npx eslint src/
```

### Running Tests
```bash
npm test
```

---

## 🐛 Troubleshooting

### Build Issues
1. **Cache Issues** - Run `npm run android -- --clean` for Android
2. **Pod Issues** - Run `bundle exec pod install --repo-update` for iOS
3. **Node Modules** - Delete node_modules and `npm install` again

### Runtime Issues
- Check error logs in console
- Clear app cache: Android Settings > Apps > SubmissionApp > Clear Cache
- Check network connectivity
- Verify API endpoint is accessible

### Common Errors
- **"Cannot find module"** - Run `npm install`
- **"Build failed"** - Clear Gradle cache: `./gradlew clean`
- **"Port already in use"** - Kill Metro: `lsof -ti:8081 | xargs kill`

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more details.

---

## 📊 API Integration

### Base URL
```
https://dummyjson.com
```

### Endpoints
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user data
- `GET /users` - Get users list
- `GET /users/:id` - Get user details
- `GET /users/search` - Search users

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**facto05** - GitHub: [@facto05](https://github.com/facto05)

---

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

## 🔗 Links

- **Repository**: https://github.com/facto05/SubmissionApp
- **DummyJSON API**: https://dummyjson.com
- **React Native Docs**: https://reactnative.dev
- **TypeScript Docs**: https://www.typescriptlang.org

---

**Last Updated**: February 1, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready


For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

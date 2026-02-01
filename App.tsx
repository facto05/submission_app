/**
 * Root App Component
 * Clean architecture with proper dependency injection
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/presentation/context/ThemeContext';
import { HomeScreen } from './src/presentation/screens/HomeScreen';
import { LoginScreen } from './src/presentation/screens/LoginScreen';
import { serviceLocator } from './src/config/service_locator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppCore />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppCore(): React.JSX.Element {
  const { isDarkMode } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppContent
        isLoggedIn={isLoggedIn}
        onLoginSuccess={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />
    </>
  );
}

function AppContent({
  isLoggedIn,
  onLoginSuccess,
  onLogout,
}: {
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      {!isLoggedIn ? (
        <LoginScreen onLoginSuccess={onLoginSuccess} />
      ) : (
        <HomeScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

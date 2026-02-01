/**
 * Root Navigation
 * Main navigation container setup
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store';
import { useColors } from '../hooks/useThemeColors';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeStack } from './HomeStack';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const colors = useColors();
  const { isAuthenticated, user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate checking auth state
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated || !user ? (
          <Stack.Screen
            name="Auth"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="App"
            component={HomeStack}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

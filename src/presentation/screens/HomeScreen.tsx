/**
 * Home screen component
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useUserStore } from '../../presentation/store';
import { useColors } from '../hooks/useThemeColors';

interface HomeScreenProps {}

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const colors = useColors();
  const { users, isLoading, error, setLoading } = useUserStore();
  const dynamicStyles = useMemo(() => createStyles(colors), [colors]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Home Screen</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Users: {users.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

interface ColorScheme {
  background: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  error: string;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    title: {
      color: colors.text,
    },
    subtitle: {
      color: colors.textSecondary,
    },
    errorText: {
      color: colors.error,
    },
  });

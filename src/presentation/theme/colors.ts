/**
 * Shared Colors
 * Global color palette for the application with light and dark mode support
 */

const lightPalette = {
  // Primary
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',

  // Secondary
  secondary: '#34C759',
  secondaryLight: '#63D26E',
  secondaryDark: '#1FA842',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Status
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#00C7BE',

  // Semantic (Light Mode)
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceLight: '#FFFFFF',
  card: '#F3F4F6',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  disabled: '#D1D5DB',
};

const darkPalette = {
  // Primary
  primary: '#0A84FF',
  primaryLight: '#64B5F6',
  primaryDark: '#0052CC',

  // Secondary
  secondary: '#34C759',
  secondaryLight: '#63D26E',
  secondaryDark: '#1FA842',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#1F1F1F',
  gray100: '#2D2D2D',
  gray200: '#3A3A3A',
  gray300: '#4B4B4B',
  gray400: '#6B6B6B',
  gray500: '#8B8B8B',
  gray600: '#A1A1A1',
  gray700: '#C1C1C1',
  gray800: '#E1E1E1',
  gray900: '#F5F5F5',

  // Status
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FF9500',
  info: '#00C7BE',

  // Semantic (Dark Mode)
  background: '#0A0A0A',
  surface: '#1C1C1C',
  surfaceLight: '#2D2D2D',
  card: '#272727',
  border: '#3A3A3A',
  text: '#F5F5F5',
  textSecondary: '#A1A1A1',
  textTertiary: '#6B6B6B',
  disabled: '#4B4B4B',
};

export const COLORS = {
  light: lightPalette,
  dark: darkPalette,
} as const;

export type ColorKey = keyof typeof lightPalette;

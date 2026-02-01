/**
 * useColors Hook
 * Returns color palette based on current theme mode
 */

import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';

export const useColors = () => {
  const { isDarkMode } = useTheme();
  return isDarkMode ? COLORS.dark : COLORS.light;
};

/**
 * useThemedStyles Hook
 * Returns themed styles for consistent styling across light/dark modes
 */
export const useThemedStyles = () => {
  const colors = useColors();
  const { isDarkMode } = useTheme();

  return {
    colors,
    isDarkMode,
    // Common style patterns
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 12,
    },
    text: {
      color: colors.text,
    },
    textSecondary: {
      color: colors.textSecondary,
    },
    input: {
      backgroundColor: colors.surfaceLight,
      borderColor: colors.border,
      color: colors.text,
      placeholderTextColor: colors.textTertiary,
    },
    button: {
      backgroundColor: colors.primary,
      pressedOpacity: isDarkMode ? 0.8 : 0.7,
    },
  };
};

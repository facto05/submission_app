/**
 * Login Screen Component
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../presentation/store';
import { serviceLocator } from '../../config/service_locator';
import { LoginUseCase } from '../../domain/usecases/login.usecase';
import { isSuccess } from '../../core/utils';
import { useColors } from '../hooks/useThemeColors';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const { isLoading, error, loginStart, loginSuccess, loginError, clearError } =
    useAuthStore();

  // Memoize dynamic styles based on colors
  const dynamicStyles = useMemo(() => createStyles(colors), [colors]);

  // Validate email format
  const isValidEmail = useCallback((emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password, isValidEmail]);

  // Handle login
  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    loginStart();

    try {
      const loginUseCase = serviceLocator.get<LoginUseCase>('loginUseCase');
      const result = await loginUseCase.execute({
        email: email.trim(),
        password,
      });

      if (isSuccess(result)) {
        loginSuccess(result.data);
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => {
              setEmail('');
              setPassword('');
              onLoginSuccess?.();
            },
          },
        ]);
      } else {
        loginError(result.message || 'Login failed');
        Alert.alert('Login Failed', result.message || 'An error occurred');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      loginError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, [validateForm, email, password, loginStart, loginSuccess, loginError, onLoginSuccess]);

  // Clear validation error when user starts typing
  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (validationErrors.email) {
      setValidationErrors({ ...validationErrors, email: undefined });
    }
  }, [validationErrors]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (validationErrors.password) {
      setValidationErrors({ ...validationErrors, password: undefined });
    }
  }, [validationErrors]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>SubmissionApp</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Welcome Back</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Error Alert */}
          {error && (
            <View style={[dynamicStyles.errorContainer, { borderLeftColor: colors.error }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              <TouchableOpacity
                onPress={handleClearError}
                style={styles.errorClose}
              >
                <Text style={[styles.errorCloseText, { color: colors.error }]}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <TextInput
              style={[
                dynamicStyles.input,
                validationErrors.email && dynamicStyles.inputError,
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={handleEmailChange}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {validationErrors.email && (
              <Text style={[styles.errorMessage, { color: colors.error }]}>{validationErrors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  dynamicStyles.input,
                  styles.passwordInput,
                  validationErrors.password && dynamicStyles.inputError,
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={handlePasswordChange}
                editable={!isLoading}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={handleTogglePassword}
                style={[dynamicStyles.showPasswordButton]}
                disabled={isLoading}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? '👁' : '👁‍🗨'}
                </Text>
              </TouchableOpacity>
            </View>
            {validationErrors.password && (
              <Text style={[styles.errorMessage, { color: colors.error }]}>{validationErrors.password}</Text>
            )}
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            disabled={isLoading}
          >
            <Text style={[styles.forgotPassword, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              dynamicStyles.loginButton,
              isLoading && dynamicStyles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.surfaceLight} />
            ) : (
              <Text style={[styles.loginButtonText, { color: colors.surfaceLight }]}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: colors.textSecondary }]}>Don't have an account? </Text>
            <TouchableOpacity disabled={isLoading}>
              <Text style={[styles.signupLink, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>By signing in, you agree to our</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity disabled={isLoading}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={[styles.footerText, { color: colors.textTertiary }]}> and </Text>
            <TouchableOpacity disabled={isLoading}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  errorClose: {
    padding: 4,
  },
  errorCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    marginRight: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  showPasswordText: {
    fontSize: 18,
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '500',
  },
});

interface ColorScheme {
  background: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  error: string;
  surfaceLight: string;
  border: string;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    errorContainer: {
      backgroundColor: colors.error + '1a',
      borderLeftWidth: 4,
      padding: 12,
      borderRadius: 4,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    input: {
      backgroundColor: colors.surfaceLight,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
      backgroundColor: colors.error + '0a',
    },
    showPasswordButton: {
      backgroundColor: colors.surfaceLight,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 0,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    loginButtonDisabled: {
      backgroundColor: colors.primary + '66',
      opacity: 0.7,
    },
  });

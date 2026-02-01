/**
 * Auth Store using Zustand
 * Centralized state management for authentication
 * 
 * Usage:
 * const { user, isLoading, error, loginStart, loginSuccess } = useAuthStore();
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserAuth } from '../../domain/entities/auth';

export interface AuthState {
  // State
  user: UserAuth | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  loginStart: () => void;
  loginSuccess: (user: UserAuth) => void;
  loginError: (error: string) => void;
  logoutStart: () => void;
  logoutSuccess: () => void;
  logoutError: (error: string) => void;
  setUser: (user: UserAuth | null) => void;
  clearError: () => void;
  checkAuth: (isAuthenticated: boolean) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      ...initialState,

      loginStart: () =>
        set(
          (_state) => ({
            isLoading: true,
            error: null,
          }),
          false,
          'loginStart'
        ),

      loginSuccess: (user: UserAuth) =>
        set(
          (_state) => ({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          }),
          false,
          'loginSuccess'
        ),

      loginError: (error: string) =>
        set(
          (_state) => ({
            isLoading: false,
            error,
          }),
          false,
          'loginError'
        ),

      logoutStart: () =>
        set(
          (_state) => ({
            isLoading: true,
            error: null,
          }),
          false,
          'logoutStart'
        ),

      logoutSuccess: () =>
        set(
          (_state) => ({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          }),
          false,
          'logoutSuccess'
        ),

      logoutError: (error: string) =>
        set(
          (_state) => ({
            isLoading: false,
            error,
          }),
          false,
          'logoutError'
        ),

      setUser: (user: UserAuth | null) =>
        set(
          (_state) => ({
            user,
            isAuthenticated: user !== null,
          }),
          false,
          'setUser'
        ),

      clearError: () =>
        set(
          (_state) => ({
            error: null,
          }),
          false,
          'clearError'
        ),

      checkAuth: (isAuthenticated: boolean) =>
        set(
          (_state) => ({
            isAuthenticated,
          }),
          false,
          'checkAuth'
        ),

      reset: () =>
        set(initialState, false, 'reset'),
    }),
    { name: 'AuthStore' }
  )
);

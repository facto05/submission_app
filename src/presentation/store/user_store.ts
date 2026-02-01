/**
 * User Store using Zustand
 * Centralized state management for user data
 * 
 * Usage:
 * const { users, user, isLoading, error, setUsers, setUser } = useUserStore();
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '../../domain/entities/user';

export interface UserState {
  // State
  user: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (userId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  users: [],
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      ...initialState,

      setUser: (user: User | null) =>
        set(
          (_state) => ({
            user,
          }),
          false,
          'setUser'
        ),

      setUsers: (users: User[]) =>
        set(
          (_state) => ({
            users,
          }),
          false,
          'setUsers'
        ),

      addUser: (user: User) =>
        set(
          (state) => ({
            users: [...state.users, user],
          }),
          false,
          'addUser'
        ),

      updateUser: (user: User) =>
        set(
          (state) => ({
            users: state.users.map((u) => (u.id === user.id ? user : u)),
            ...(state.user?.id === user.id && { user }),
          }),
          false,
          'updateUser'
        ),

      removeUser: (userId: string) =>
        set(
          (state) => ({
            users: state.users.filter((u) => u.id !== userId),
            ...(state.user?.id === userId && { user: null }),
          }),
          false,
          'removeUser'
        ),

      setLoading: (isLoading: boolean) =>
        set(
          (_state) => ({
            isLoading,
          }),
          false,
          'setLoading'
        ),

      setError: (error: string | null) =>
        set(
          (_state) => ({
            error,
          }),
          false,
          'setError'
        ),

      clearError: () =>
        set(
          (_state) => ({
            error: null,
          }),
          false,
          'clearError'
        ),

      reset: () =>
        set(initialState, false, 'reset'),
    }),
    { name: 'UserStore' }
  )
);

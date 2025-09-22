import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore, User, LoginRequest, RegisterRequest } from '../types';
import { authApi } from '../services/api';

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials: LoginRequest) => {
        try {
          const response = await authApi.login(credentials);
          
          // Store token in localStorage for API requests
          localStorage.setItem('auth_token', response.access_token);
          
          set({
            user: response.user || null,
            token: response.access_token,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      register: async (credentials: RegisterRequest) => {
        try {
          const response = await authApi.register(credentials);
          
          // Store token in localStorage for API requests
          localStorage.setItem('auth_token', response.access_token);
          
          set({
            user: response.user || null,
            token: response.access_token,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      setUser: (user: User) => {
        set({ user });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);


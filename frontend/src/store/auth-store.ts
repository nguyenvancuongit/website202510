import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { authAPI } from "@/services/api";
import { Permission } from "@/types/permissions";

export interface User {
  id: string;
  username: string;
  email: string;
  role: number;
  status: string;
  phone: string;
  permissions: Permission[];
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  // Actions
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  fetchUser: () => Promise<boolean>;
  checkAuth: () => boolean;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      // Login action
      login: async (phone: string, password: string) => {
        set({ isLoading: true });

        try {
          const response = await authAPI.login({ phone, password });

          const user: User = {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            role: response.user.role,
            status: response.user.status,
            phone: response.user.phone,
            permissions: response.user.permissions || [],
          };

          set({
            user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          console.error("Login error:", error);
          set({ isLoading: false });
          return false;
        }
      },

      // Logout action
      logout: () => {
        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Set user
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // Set token
      setToken: (token: string) => {
        set({ token });
      },

      fetchUser: async () => {
        const { token } = get();

        if (!token) {
          return false;
        }

        try {
          set({ isLoading: true });
          const userData = await authAPI.getCurrentUser();
          const user: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            status: userData.status,
            phone: userData.phone,
            permissions: userData.permissions || [],
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          // If token is invalid, clear it
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          console.error("Fetch user error:", error);

          return false;
        }
      },

      // Check authentication status
      checkAuth: () => {
        const { token, user, isAuthenticated } = get();

        // Basic validation - check if both token and user exist
        const isValid = !!(token && user && user.id);

        // Additional validation could be added here (e.g., token expiry check)

        if (isValid !== isAuthenticated) {
          set({ isAuthenticated: isValid });
        }

        return isValid;
      },

      // Initialize auth on app startup
      initializeAuth: async () => {
        const state = get();
        const { token, fetchUser } = state;

        if (token) {
          await fetchUser();
        } else {
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the token, not user data
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

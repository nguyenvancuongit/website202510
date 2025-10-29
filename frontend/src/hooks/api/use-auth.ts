import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";
import { useAuthStore, User } from "@/store/auth-store";

// Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// API Functions
const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>("/auth/login", credentials);
  },

  refreshToken: async (): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>("/auth/refresh");
  },

  profile: async (): Promise<LoginResponse["user"]> => {
    return httpClient.get<LoginResponse["user"]>("/auth/profile");
  },

  changePassword: async (payload: {
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean }> =>
    httpClient.post<{ success: boolean }>("/auth/change-password", payload),
};

// Custom Hooks
export function useLogin() {
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      toast.success("登录成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "登录失败";
      toast.error(message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
}

export function useRefreshToken() {
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
    },
    onError: (error: any) => {
      const message = error?.message || "刷新token失败";
      console.error(message);
    },
  });
}

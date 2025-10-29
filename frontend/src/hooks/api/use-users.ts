import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  status: "active" | "disabled";
  created_at: string;
  updated_at: string;
  permissions?: string[];
}

export interface Permission {
  name: string;
  value: string;
}

export interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface UserResponse {
  data: User;
}

export interface CreateUserData {
  username: string;
  email?: string;
  phone?: string;
  status: "active" | "disabled";
  permissions?: string[];
}

export interface CreateUserResponse {
  user: User;
  generated_password: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  phone?: string;
  status?: "active" | "disabled";
  permissions?: string[];
}

export interface UpdateUserResponse {
  message: string;
  data: User;
}

export interface ResetPasswordData {
  new_password?: string;
}

export interface ResetPasswordResponse {
  message: string;
  data: {
    new_password: string;
  };
}

export type PermissionsResponse = Permission[];

export interface UsersFilter {
  page?: number;
  page_size?: number;
  username?: string;
  email?: string;
  phone?: string;
  status?: "active" | "disabled";
  sort_by?: "username" | "email" | "phone" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
}

export interface UserFormData {
  username: string;
  email?: string;
  phone?: string;
  status: "active" | "disabled";
  permission_ids?: string[];
}

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UsersFilter) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  permissions: () => ["permissions"] as const,
};

// API Functions
const userApi = {
  getList: async (filters: UsersFilter = {}): Promise<UsersResponse> => {
    const params = new URLSearchParams();

    if (filters.page) {params.append("page", filters.page.toString());}
    if (filters.page_size)
      {params.append("pageSize", filters.page_size.toString());}
    if (filters.username) {params.append("username", filters.username);}
    if (filters.email) {params.append("email", filters.email);}
    if (filters.phone) {params.append("phone", filters.phone);}
    if (filters.status) {params.append("status", filters.status);}
    if (filters.sort_by) {params.append("sortBy", filters.sort_by);}
    if (filters.sort_order) {params.append("sortOrder", filters.sort_order);}

    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : "/users";
    return httpClient.get<UsersResponse>(endpoint);
  },

  getById: async (id: string): Promise<User> => {
    return httpClient.get<User>(`/users/${id}`);
  },

  create: async (data: CreateUserData): Promise<CreateUserResponse> => {
    return httpClient.post<CreateUserResponse>("/users", data);
  },

  update: async (
    id: string,
    data: UpdateUserData
  ): Promise<UpdateUserResponse> => {
    return httpClient.patch<UpdateUserResponse>(`/users/${id}`, data);
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return httpClient.delete<{ message: string }>(`/users/${id}`);
  },

  resetPassword: async (
    id: string,
    data: ResetPasswordData = {}
  ): Promise<ResetPasswordResponse> => {
    return httpClient.post<ResetPasswordResponse>(
      `/users/${id}/reset-password`,
      data
    );
  },

  getPermissions: async () => {
    return httpClient.get<PermissionsResponse>("/users/permissions");
  },
};

// Custom Hooks
export function useUsers(filters: UsersFilter = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => userApi.getList(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("用户创建成功！");

      // Show generated password if available
      if (data.generated_password) {
        toast.info(`生成的密码: ${data.generated_password}`, {
          duration: 10000, // Show for 10 seconds
        });
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "创建用户失败";
      toast.error(message);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      toast.success(data.message || "用户更新成功！");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "更新用户失败";
      toast.error(message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(data.message || "用户删除成功！");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "删除用户失败";
      toast.error(message);
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.resetPassword(id, {}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(data.message || "密码重置成功！");

      // Show the new password
      if (data.data?.new_password) {
        toast.info(`新密码: ${data.data.new_password}`, {
          duration: 10000, // Show for 10 seconds
        });
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "重置密码失败";
      toast.error(message);
    },
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: userKeys.permissions(),
    queryFn: userApi.getPermissions,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";

// Types
export interface FriendLink {
  id: string;
  name: string;
  url: string;
  sort_order: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface FriendLinkListResponse {
  data: FriendLink[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface FriendLinkQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface CreateFriendLinkData {
  name: string;
  url: string;
  sortOrder?: number;
  status: number;
}

export interface UpdateFriendLinkData {
  name?: string;
  url?: string;
  sortOrder?: number;
  status?: number;
}

// Query Keys
export const friendLinkKeys = {
  all: ["friendLinks"] as const,
  lists: () => [...friendLinkKeys.all, "list"] as const,
  list: (params: FriendLinkQuery) =>
    [...friendLinkKeys.lists(), params] as const,
  details: () => [...friendLinkKeys.all, "detail"] as const,
  detail: (id: string) => [...friendLinkKeys.details(), id] as const,
};

// API Functions
const friendLinkApi = {
  getList: async (
    params?: FriendLinkQuery
  ): Promise<FriendLinkListResponse> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/friend-links?${queryString}`
      : "/friend-links";
    return httpClient.get<FriendLinkListResponse>(endpoint);
  },

  getById: async (id: string): Promise<FriendLink> => {
    return httpClient.get<FriendLink>(`/friend-links/${id}`);
  },

  create: async (data: CreateFriendLinkData): Promise<FriendLink> => {
    return httpClient.post<FriendLink>("/friend-links", data);
  },

  update: async (
    id: string,
    data: UpdateFriendLinkData
  ): Promise<FriendLink> => {
    return httpClient.patch<FriendLink>(`/friend-links/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/friend-links/${id}`);
  },

  toggleStatus: async (id: string): Promise<FriendLink> => {
    return httpClient.patch<FriendLink>(`/friend-links/${id}/toggle-status`);
  },

  updateSortOrder: async (
    friendLinks: { id: string; sort_order: number }[]
  ): Promise<void> => {
    return httpClient.put<void>("/friend-links/order", {
      orders: friendLinks,
    });
  },
};

// Custom Hooks
export function useFriendLinks(params?: FriendLinkQuery) {
  return useQuery({
    queryKey: friendLinkKeys.list(params || {}),
    queryFn: () => friendLinkApi.getList(params),
  });
}

export function useFriendLink(id: string) {
  return useQuery({
    queryKey: friendLinkKeys.detail(id),
    queryFn: () => friendLinkApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateFriendLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendLinkApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendLinkKeys.lists() });
      toast.success("友情链接创建成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "创建友情链接失败";
      toast.error(message);
    },
  });
}

export function useUpdateFriendLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFriendLinkData }) =>
      friendLinkApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: friendLinkKeys.lists() });
      queryClient.invalidateQueries({ queryKey: friendLinkKeys.detail(id) });
      toast.success("友情链接更新成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "更新友情链接失败";
      toast.error(message);
    },
  });
}

export function useDeleteFriendLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendLinkApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendLinkKeys.lists() });
      toast.success("友情链接删除成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "删除友情链接失败";
      toast.error(message);
    },
  });
}

export function useToggleFriendLinkStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendLinkApi.toggleStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: friendLinkKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: friendLinkKeys.detail(data.id),
      });
      toast.success(`友情链接已${data.status === 1 ? "启用" : "禁用"}`);
    },
    onError: (error: any) => {
      const message = error?.message || "切换友情链接状态失败";
      toast.error(message);
    },
  });
}

export function useUpdateFriendLinkSortOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendLinkApi.updateSortOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendLinkKeys.lists() });
      toast.success("排序更新成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "排序更新失败";
      toast.error(message);
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";
import { ListResponse, Media } from "@/types";

// Types
export enum LatestNewsStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
  status: "enabled" | "disabled";
}

export interface LatestNews {
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string;
  status: LatestNewsStatus;
  featured: boolean;
  category_id: string;
  web_thumbnail_media_id: number;
  mobile_thumbnail_media_id: number;
  published_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  category?: Category;
  web_thumbnail?: Media;
  mobile_thumbnail?: Media;
  created_by_user?: {
    id: number;
    username: string;
  };
  updated_by_user?: {
    id: number;
    username: string;
  };
}

export interface LatestNewsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: LatestNewsStatus;
  featured?: boolean;
  sort_by?:
    | "title"
    | "status"
    | "featured"
    | "createdAt"
    | "updatedAt"
    | "publishedDate";
  sort_order?: "asc" | "desc";
}

export interface CreateLatestNewsData {
  title: string;
  content: string;
  description: string;
  status?: LatestNewsStatus;
  featured?: boolean;
  category_id: string;
  published_date?: string;
}

export interface UpdateLatestNewsData {
  title?: string;
  content?: string;
  description?: string;
  status?: LatestNewsStatus;
  featured?: boolean;
  category_id?: string;
  published_date?: string;
}

// Query Keys
export const latestNewsKeys = {
  all: ["latest-news"] as const,
  lists: () => [...latestNewsKeys.all, "list"] as const,
  list: (params: LatestNewsQuery) =>
    [...latestNewsKeys.lists(), params] as const,
  details: () => [...latestNewsKeys.all, "detail"] as const,
  detail: (id: number) => [...latestNewsKeys.details(), id] as const,
};

// API Functions
const latestNewsApi = {
  getList: async (params?: LatestNewsQuery) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/latest-news?${queryString}`
      : "/latest-news";
    return httpClient.get<ListResponse<LatestNews>>(endpoint);
  },

  getById: async (id: number): Promise<LatestNews> => {
    return httpClient.get<LatestNews>(`/latest-news/${id}`);
  },

  create: async (
    data: CreateLatestNewsData,
    files: { webThumbnail: File; mobileThumbnail: File }
  ): Promise<LatestNews> => {
    const formData = new FormData();

    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, String(value));
      }
    });
    // Add files
    formData.append("webThumbnail", files.webThumbnail);
    formData.append("mobileThumbnail", files.mobileThumbnail);

    return httpClient.upload<LatestNews>("/latest-news", formData);
  },

  update: async (
    id: number,
    data: UpdateLatestNewsData,
    files?: { webThumbnail?: File; mobileThumbnail?: File }
  ): Promise<LatestNews> => {
    const formData = new FormData();

    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, String(value));
      }
    });

    // Add files if provided
    if (files?.webThumbnail) {
      formData.append("webThumbnail", files.webThumbnail);
    }
    if (files?.mobileThumbnail) {
      formData.append("mobileThumbnail", files.mobileThumbnail);
    }

    return httpClient.upload<LatestNews>(`/latest-news/${id}`, formData, {
      method: "PATCH",
    });
  },

  delete: async (id: number): Promise<void> => {
    return httpClient.delete<void>(`/latest-news/${id}`);
  },

  toggleFeatured: async (id: number): Promise<LatestNews> => {
    return httpClient.patch<LatestNews>(`/latest-news/${id}/toggle-featured`);
  },

  updateStatus: async (
    id: number,
    status: LatestNewsStatus
  ): Promise<LatestNews> => {
    return httpClient.patch<LatestNews>(`/latest-news/${id}/status`, {
      status,
    });
  },
};

// Custom Hooks
export function useLatestNews(params?: LatestNewsQuery) {
  return useQuery({
    queryKey: latestNewsKeys.list(params || {}),
    queryFn: () => latestNewsApi.getList(params),
  });
}

export function useLatestNewsDetail(id?: number) {
  return useQuery({
    queryKey: latestNewsKeys.detail(id ?? 0),
    queryFn: () => latestNewsApi.getById(id ?? 0),
    enabled: !!id,
  });
}

export function useCreateLatestNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      files,
    }: {
      data: CreateLatestNewsData;
      files: { webThumbnail: File; mobileThumbnail: File };
    }) => latestNewsApi.create(data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: latestNewsKeys.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "创建失败";
      toast.error(message);
    },
  });
}

export function useUpdateLatestNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      files,
    }: {
      id: number;
      data: UpdateLatestNewsData;
      files?: { webThumbnail?: File; mobileThumbnail?: File };
    }) => latestNewsApi.update(id, data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: latestNewsKeys.all });
      toast.success("最新资讯更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "更新失败";
      toast.error(message);
    },
  });
}

export function useDeleteLatestNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => latestNewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: latestNewsKeys.all });
      toast.success("最新资讯删除成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "删除失败";
      toast.error(message);
    },
  });
}

export function useToggleLatestNewsFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => latestNewsApi.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: latestNewsKeys.all });
      toast.success("置顶状态更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "更新失败";
      toast.error(message);
    },
  });
}

export function useUpdateLatestNewsStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: LatestNewsStatus }) =>
      latestNewsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: latestNewsKeys.all });
      toast.success("状态更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "状态更新失败";
      toast.error(message);
    },
  });
}

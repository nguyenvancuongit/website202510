import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";
import { Media } from "@/types";

export enum BannerStatus {
  enabled = "enabled",
  disabled = "disabled",
}

export interface Banner {
  id: number;
  title: string | null;
  web_media_id: number;
  mobile_media_id: number;
  link_url: string | null;
  sort_order: number;
  status: BannerStatus;
  created_at: string;
  updated_at: string;
  web_media: Media;
  mobile_media: Media;
}

export interface BannerListResponse {
  data: Banner[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface BannerQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface CreateBannerData {
  title?: string;
  link_url?: string;
  status: BannerStatus;
  webMediaFile?: File;
  mobileMediaFile?: File;
}

export interface UpdateBannerData {
  title?: string;
  link_url?: string;
  status?: BannerStatus;
  sort_order?: number;
  webMedia?: File;
  mobileMedia?: File;
}

// Query Keys
export const bannerKeys = {
  all: ["banners"] as const,
  lists: () => [...bannerKeys.all, "list"] as const,
  list: (params: BannerQuery) => [...bannerKeys.lists(), params] as const,
  details: () => [...bannerKeys.all, "detail"] as const,
  detail: (id: number) => [...bannerKeys.details(), id] as const,
};

// API Functions
const bannerApi = {
  getList: async (params?: BannerQuery): Promise<BannerListResponse> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/banners?${queryString}` : "/banners";
    return httpClient.get<BannerListResponse>(endpoint);
  },

  getById: async (
    id: number
  ): Promise<{
    message: string;
    data: Banner;
  }> => {
    return httpClient.get<{
      message: string;
      data: Banner;
    }>(`/banners/${id}`);
  },

  create: async (data: CreateBannerData): Promise<Banner> => {
    const formData = new FormData();
    if (data.title) {
      formData.append("title", data.title);
    }
    if (data.link_url) {
      formData.append("link_url", data.link_url);
    }
    formData.append("status", String(data.status));
    if (data.webMediaFile) {
      formData.append("webMedia", data.webMediaFile);
    }
    if (data.mobileMediaFile) {
      formData.append("mobileMedia", data.mobileMediaFile);
    }

    return httpClient.upload<Banner>("/banners", formData);
  },

  update: async (id: number, data: UpdateBannerData): Promise<Banner> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    return httpClient.upload<Banner>(`/banners/${id}`, formData, {
      method: "PATCH",
    });
  },

  delete: async (id: number): Promise<void> => {
    return httpClient.delete<void>(`/banners/${id}`);
  },

  updateSortOrder: async (
    banners: { id: number; sort_order: number }[]
  ): Promise<void> => {
    return httpClient.put<void>("/banners/reorder", {
      banner_orders: banners,
    });
  },

  toggleStatus: async (id: number): Promise<void> => {
    return httpClient.patch<void>(`/banners/${id}/toggle-status`);
  },
};

// Custom Hooks
export function useBanners(params?: BannerQuery) {
  return useQuery({
    queryKey: bannerKeys.list(params || {}),
    queryFn: () => bannerApi.getList(params),
  });
}

export function useBanner(id: number) {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: () => bannerApi.getById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: CreateBannerData }) =>
      bannerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      toast.success("Banner创建成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "创建Banner失败";
      toast.error(message);
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBannerData }) =>
      bannerApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(id) });
      toast.success("Banner更新成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "更新Banner失败";
      toast.error(message);
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bannerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      toast.success("Banner删除成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "删除Banner失败";
      toast.error(message);
    },
  });
}

export function useUpdateBannerSortOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bannerApi.updateSortOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      toast.success("排序更新成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "排序更新失败";
      toast.error(message);
    },
  });
}

export function useToggleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bannerApi.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      toast.success("状态切换成功！");
    },
    onError: (error: any) => {
      const message = error?.message || "状态切换失败";
      toast.error(message);
    },
  });
}

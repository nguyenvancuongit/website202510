import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";
import { Media } from "@/types";

// Types
export enum CaseStudyStatus {
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

export interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: CaseStudyStatus;
  featured: boolean;
  featured_at: boolean;
  category_id: string;
  customer_name?: string;
  web_thumbnail_media_id: number;
  mobile_thumbnail_media_id: number;
  customer_logo_media_id?: number;
  key_highlights?: string[];
  highlight_description?: string;
  customer_feedback?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  category?: Category;
  web_thumbnail?: Media;
  mobile_thumbnail?: Media;
  customer_logo?: Media;
}

export interface CaseStudyListResponse {
  data: CaseStudy[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CaseStudyQuery {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: CaseStudyStatus;
  featured?: boolean;
  customer_name?: string;
  sort_by?: "title" | "status" | "featured" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

export interface CreateCaseStudyData {
  title: string;
  content: string;
  status?: CaseStudyStatus;
  featured?: boolean;
  category_id: number;
  customer_name?: string;
  key_highlights?: string[];
  highlight_description?: string;
  customer_feedback?: string;
}

export interface UpdateCaseStudyData {
  title?: string;
  content?: string;
  status?: CaseStudyStatus;
  featured?: boolean;
  category_id?: number;
  customer_name?: string;
  key_highlights?: string[];
  highlight_description?: string;
  customer_feedback?: string;
}

// Query Keys
export const caseStudyKeys = {
  all: ["case-studies"] as const,
  lists: () => [...caseStudyKeys.all, "list"] as const,
  list: (params: CaseStudyQuery) => [...caseStudyKeys.lists(), params] as const,
  details: () => [...caseStudyKeys.all, "detail"] as const,
  detail: (id: number) => [...caseStudyKeys.details(), id] as const,
};

// API Functions
const caseStudyApi = {
  getList: async (params?: CaseStudyQuery): Promise<CaseStudyListResponse> => {
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
      ? `/case-studies?${queryString}`
      : "/case-studies";
    return httpClient.get<CaseStudyListResponse>(endpoint);
  },

  getById: async (id: number): Promise<CaseStudy> => {
    return httpClient.get<CaseStudy>(`/case-studies/${id}`);
  },

  create: async (
    data: CreateCaseStudyData,
    files: {
      webThumbnail?: File;
      mobileThumbnail?: File;
      customerLogo?: File;
    }
  ): Promise<CaseStudy> => {
    const formData = new FormData();

    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        if (key === "key_highlights" && Array.isArray(value)) {
          value.forEach((highlight, index) => {
            formData.append(`key_highlights[${index}]`, highlight);
          });
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Add files (only if they exist)
    if (files.webThumbnail) {
      formData.append("webThumbnail", files.webThumbnail);
    }
    if (files.mobileThumbnail) {
      formData.append("mobileThumbnail", files.mobileThumbnail);
    }
    if (files.customerLogo) {
      formData.append("customerLogo", files.customerLogo);
    }

    return httpClient.upload<CaseStudy>("/case-studies", formData);
  },

  update: async (
    id: number,
    data: UpdateCaseStudyData,
    files?: {
      webThumbnail?: File;
      mobileThumbnail?: File;
      customerLogo?: File;
    }
  ): Promise<CaseStudy> => {
    const formData = new FormData();

    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        if (key === "key_highlights" && Array.isArray(value)) {
          value.forEach((highlight, index) => {
            formData.append(`key_highlights[${index}]`, highlight);
          });
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Add files if provided
    if (files?.webThumbnail) {
      formData.append("webThumbnail", files.webThumbnail);
    }
    if (files?.mobileThumbnail) {
      formData.append("mobileThumbnail", files.mobileThumbnail);
    }
    if (files?.customerLogo) {
      formData.append("customerLogo", files.customerLogo);
    }

    return httpClient.upload<CaseStudy>(`/case-studies/${id}`, formData, {
      method: "PATCH",
    });
  },

  delete: async (id: number): Promise<void> => {
    return httpClient.delete<void>(`/case-studies/${id}`);
  },

  toggleFeatured: async (id: number): Promise<CaseStudy> => {
    return httpClient.patch<CaseStudy>(`/case-studies/${id}/toggle-featured`);
  },

  updateStatus: async (
    id: number,
    status: CaseStudyStatus
  ): Promise<CaseStudy> => {
    return httpClient.patch<CaseStudy>(`/case-studies/${id}/status`, {
      status,
    });
  },
};

// Custom Hooks
export function useCaseStudies(params?: CaseStudyQuery) {
  return useQuery({
    queryKey: caseStudyKeys.list(params || {}),
    queryFn: () => caseStudyApi.getList(params),
  });
}

export function useCaseStudyDetail(id?: number) {
  return useQuery({
    queryKey: caseStudyKeys.detail(id ?? 0),
    queryFn: () => caseStudyApi.getById(id ?? 0),
    enabled: !!id,
  });
}

export function useCreateCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      files,
    }: {
      data: CreateCaseStudyData;
      files: {
        webThumbnail: File;
        mobileThumbnail: File;
        customerLogo?: File;
      };
    }) => caseStudyApi.create(data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseStudyKeys.all });
      toast.success("客户案例创建成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "创建失败";
      toast.error(message);
    },
  });
}

export function useUpdateCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      files,
    }: {
      id: number;
      data: UpdateCaseStudyData;
      files?: {
        webThumbnail?: File;
        mobileThumbnail?: File;
        customerLogo?: File;
      };
    }) => caseStudyApi.update(id, data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseStudyKeys.all });
      toast.success("客户案例更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "更新失败";
      toast.error(message);
    },
  });
}

export function useDeleteCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => caseStudyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseStudyKeys.all });
      toast.success("客户案例删除成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "删除失败";
      toast.error(message);
    },
  });
}

export function useToggleCaseStudyFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => caseStudyApi.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseStudyKeys.all });
      toast.success("推荐状态更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "更新失败";
      toast.error(message);
    },
  });
}

export function useUpdateCaseStudyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: CaseStudyStatus }) =>
      caseStudyApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseStudyKeys.all });
      toast.success("状态更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "状态更新失败";
      toast.error(message);
    },
  });
}

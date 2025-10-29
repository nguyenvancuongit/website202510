import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";

// Types
export enum CategoryType {
  LATEST_NEW = "latest-new",
  PRODUCT = "product",
  SOLUTION = "solution",
  CASE_STUDY = "case-study",
}
export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  status: "enabled" | "disabled";
  type: CategoryType;
  published_post: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  data: Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface CategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "enabled" | "disabled";
  sort_by?:
    | "name"
    | "order"
    | "status"
    | "created_at"
    | "updated_at"
    | "published_post";
  sort_order?: "asc" | "desc";
}

export interface CreateCategoryData {
  name: string;
  order?: number;
  status?: "enabled" | "disabled";
}

export interface UpdateCategoryData {
  name?: string;
  order?: number;
  status?: "enabled" | "disabled";
}

export interface CategoryOrderItem {
  id: string;
  order: number;
}

export interface UpdateCategoryOrderData {
  category_orders: CategoryOrderItem[];
}

// Query Keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (categoryType: CategoryType, params: CategoryQuery) =>
    [...categoryKeys.lists(), categoryType, params] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (categoryType: CategoryType, id: number) =>
    [...categoryKeys.details(), categoryType, id] as const,
};

// API Functions
const latestNewCategoryApi = {
  getList: async (
    categoryType: CategoryType,
    params?: CategoryQuery
  ): Promise<CategoryListResponse> => {
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
      ? `/categories/${categoryType}?${queryString}`
      : `/categories/${categoryType}`;
    return httpClient.get<CategoryListResponse>(endpoint);
  },

  getById: async (
    categoryType: CategoryType,
    id: number
  ): Promise<Category> => {
    return httpClient.get<Category>(`/categories/${categoryType}/${id}`);
  },

  create: async (
    categoryType: CategoryType,
    data: CreateCategoryData
  ): Promise<Category> => {
    return httpClient.post<Category>(`/categories/${categoryType}`, data);
  },

  update: async (
    categoryType: CategoryType,
    id: string,
    data: UpdateCategoryData
  ): Promise<Category> => {
    return httpClient.patch<Category>(
      `/categories/${categoryType}/${id}`,
      data
    );
  },

  delete: async (categoryType: CategoryType, id: string): Promise<void> => {
    return httpClient.delete<void>(`/categories/${categoryType}/${id}`);
  },

  updateOrder: async (
    categoryType: CategoryType,
    data: UpdateCategoryOrderData
  ): Promise<void> => {
    return httpClient.put<void>(`/categories/${categoryType}/reorder`, data);
  },
};

// Custom Hooks
export function useCategories(
  categoryType: CategoryType,
  params?: CategoryQuery
) {
  return useQuery({
    queryKey: categoryKeys.list(categoryType, params || {}),
    queryFn: () => latestNewCategoryApi.getList(categoryType, params),
  });
}

export function useCategory(categoryType: CategoryType, id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(categoryType, id),
    queryFn: () => latestNewCategoryApi.getById(categoryType, id),
    enabled: !!id,
  });
}

export function useCreateCategory(categoryType: CategoryType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) =>
      latestNewCategoryApi.create(categoryType, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("分类创建成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "创建失败";
      toast.error(message);
    },
  });
}

export function useUpdateCategory(categoryType: CategoryType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      latestNewCategoryApi.update(categoryType, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("分类更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "更新失败";
      toast.error(message);
    },
  });
}

export function useDeleteCategory(categoryType: CategoryType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => latestNewCategoryApi.delete(categoryType, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("分类删除成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "删除失败";
      toast.error(message);
    },
  });
}

export function useUpdateCategoryOrder(categoryType: CategoryType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryOrderData) =>
      latestNewCategoryApi.updateOrder(categoryType, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("排序更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "排序更新失败";
      toast.error(message);
    },
  });
}

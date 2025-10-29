import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";
import { Media } from "@/types";

// Types
export enum ProductStatus {
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

export interface ProductSectionSubItem {
  id?: number;
  title: string;
  description: string;
  cta_text?: string;
  cta_icon_media_id?: number;
  sub_item_image_media_id?: number;
  cta_icon?: Media;
  sub_item_image?: Media;
}

export interface ProductSection {
  id?: number;
  section_type: string;
  title: string;
  description: string;
  sub_title?: string;
  sub_description?: string;
  section_image_media_id?: number;
  section_image_title?: string;
  section_image_description?: string;
  cta_text?: string;
  cta_link?: string;
  sort_order: number;
  is_active: boolean;
  section_image?: Media;
  section_sub_items: ProductSectionSubItem[];
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  sort_order: number;
  status: ProductStatus;
  featured: boolean;
  category_id: number;
  banner_media_id?: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  banner_media?: Media;
  sections: ProductSection[];
}

export interface ProductListResponse {
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next?: boolean;
    has_prev?: boolean;
  };
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: ProductStatus;
  featured?: boolean;
  sort_by?:
    | "name"
    | "status"
    | "featured"
    | "sort_order"
    | "created_at"
    | "updated_at";
  sort_order?: "asc" | "desc";
}

export interface CreateProductData {
  name: string;
  description?: string;
  status?: ProductStatus;
  featured?: boolean;
  sort_order?: number;
  category_id: number;
  sections?: Array<{
    title: string;
    description: string;
    sort_order?: number;
    section_image_position?: "top" | "left" | "bottom" | "right";
    sub_items?: Array<{
      title: string;
      description: string;
      sort_order?: number;
    }>;
  }>;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  status?: ProductStatus;
  featured?: boolean;
  sort_order?: number;
  category_id?: number;
  sections?: Array<{
    title: string;
    description: string;
    sort_order?: number;
    section_image_position?: "top" | "left" | "bottom" | "right";
    sub_items?: Array<{
      title: string;
      description: string;
      sort_order?: number;
    }>;
  }>;
}

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: ProductQuery) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// API Functions
const productApi = {
  getList: async (params?: ProductQuery): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : "/products";
    return httpClient.get<ProductListResponse>(endpoint);
  },

  getById: async (id: number): Promise<Product> => {
    return httpClient.get<Product>(`/products/${id}`);
  },

  create: async (data: CreateProductData): Promise<Product> => {
    return httpClient.post<Product>("/products", data);
  },

  update: async (id: number, data: UpdateProductData): Promise<Product> => {
    return httpClient.patch<Product>(`/products/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return httpClient.delete<void>(`/products/${id}`);
  },

  toggleFeatured: async (id: number): Promise<Product> => {
    return httpClient.patch<Product>(`/products/${id}/toggle-featured`);
  },

  updateStatus: async (id: number, status: ProductStatus): Promise<Product> => {
    return httpClient.patch<Product>(`/products/${id}/status`, {
      status,
    });
  },
};

// Custom Hooks
export function useProducts(params?: ProductQuery) {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productApi.getList(params),
  });
}

export function useProductDetail(id?: number) {
  return useQuery({
    queryKey: productKeys.detail(id ?? 0),
    queryFn: () => productApi.getById(id ?? 0),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product }: { product: CreateProductData }) =>
      productApi.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("产品创建成功");
    },
    onError: (error) => {
      console.error("创建产品失败:", error);
      toast.error("创建产品失败");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductData }) =>
      productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("产品更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "更新失败";
      toast.error(message);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("产品删除成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "删除失败";
      toast.error(message);
    },
  });
}

export function useToggleProductFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("推荐状态更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "更新失败";
      toast.error(message);
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ProductStatus }) =>
      productApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("状态更新成功");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "状态更新失败";
      toast.error(message);
    },
  });
}

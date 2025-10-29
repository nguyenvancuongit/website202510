import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";
import { ListResponse } from "@/types";

const API_BASE = "/corporate-honors";

export interface QueryCorporateHonorDto {
  page?: number;
  limit?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface CorporateHonor {
  id: string;
  name: string;
  image_id: string | null;
  obtained_date: string;
  author_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
  image: {
    id: string;
    name: string;
    path: string;
    alt_text: string | null;
  } | null;
}

export const useCorporateHonors = (query: QueryCorporateHonorDto = {}) => {
  return useQuery({
    queryKey: ["corporate-honors", query],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await httpClient.get<ListResponse<CorporateHonor>>(
        `${API_BASE}?${params.toString()}`
      );
      return response;
    },
  });
};

export const useCorporateHonor = (id: string) => {
  return useQuery({
    queryKey: ["corporate-honors", id],
    queryFn: async () => {
      const response = await httpClient.get<CorporateHonor>(
        `${API_BASE}/${id}`
      );
      return response;
    },
    enabled: !!id,
  });
};

export const useCreateCorporateHonor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      // Align with banner create: return created entity, not wrapped message
      const response = await httpClient.upload(API_BASE, data);
      return response as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporate-honors"] });
      toast.success("荣誉创建成功！");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "创建荣誉失败";
      toast.error(message);
    },
  });
};

export const useUpdateCorporateHonor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      return httpClient.upload(`${API_BASE}/${id}`, data as FormData, {
        method: "PATCH",
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["corporate-honors"] });
      queryClient.invalidateQueries({ queryKey: ["corporate-honors", id] });
      toast.success("荣誉更新成功！");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "更新荣誉失败";
      toast.error(message);
    },
  });
};

export const useDeleteCorporateHonor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await httpClient.delete(`${API_BASE}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporate-honors"] });
      toast.success("荣誉删除成功！");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "删除荣誉失败";
      toast.error(message);
    },
  });
};

export const useUpdateCorporateHonorSortOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      honors: { id: string; sort_order: number }[]
    ): Promise<void> => {
      return httpClient.patch(`${API_BASE}/order/update`, {
        honor_orders: honors,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporate-honors"] });
      toast.success("排序更新成功！");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "排序更新失败";
      toast.error(message);
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";

export enum RecruitmentPostTypeStatus {
  ENABLED = "enabled",
  DISABLED = "disabled",
}

export interface RecruitmentPostType {
  id: string;
  name: string;
  slug: string;
  status: RecruitmentPostTypeStatus;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  created_by_user?: {
    id: string;
    username: string;
  };
  updated_by_user?: {
    id: string;
    username: string;
  };
  _count?: {
    recruitment_posts: number;
  };
}

export interface CreateRecruitmentPostTypeData {
  name: string;
}

export interface UpdateRecruitmentPostTypeData {
  id: string;
  data: {
    name: string;
  };
}

export interface RecruitmentPostTypesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: RecruitmentPostTypeStatus;
}

export interface RecruitmentPostTypesResponse {
  data: RecruitmentPostType[];
  page: number;
  limit: number;
  total: number;
}

// Get all recruitment post types
export function useRecruitmentPostTypes(params: RecruitmentPostTypesQuery = {}) {
  return useQuery({
    queryKey: ["recruitment-post-types", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.status) searchParams.append("status", params.status);

      return httpClient.get<RecruitmentPostTypesResponse>(`/recruitment-post-types?${searchParams.toString()}`);
    },
  });
}

// Get single recruitment post type
export function useRecruitmentPostType(id: string) {
  return useQuery({
    queryKey: ["recruitment-post-types", id],
    queryFn: async () => {
      return httpClient.get<RecruitmentPostType>(`/recruitment-post-types/${id}`);
    },
    enabled: !!id,
  });
}

// Create recruitment post type
export function useCreateRecruitmentPostType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRecruitmentPostTypeData) => {
      return httpClient.post<RecruitmentPostType>("/recruitment-post-types", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment-post-types"] });
      toast.success("职位类型创建成功");
    },
    onError: (error) => {
      toast.error(error.message || "创建失败");
    },
  });
}

// Update recruitment post type
export function useUpdateRecruitmentPostType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateRecruitmentPostTypeData) => {
      return httpClient.patch<RecruitmentPostType>(`/recruitment-post-types/${data.id}`, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment-post-types"] });
      toast.success("职位类型更新成功");
    },
    onError: (error) => {
      toast.error(error.message || "更新失败");
    },
  });
}

// Delete recruitment post type
export function useDeleteRecruitmentPostType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return httpClient.delete(`/recruitment-post-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment-post-types"] });
      toast.success("职位类型删除成功");
    },
    onError: (error) => {
      toast.error(error.message || "删除失败");
    },
  });
}

// Toggle recruitment post type status
export function useToggleRecruitmentPostTypeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RecruitmentPostTypeStatus }) => {
      return httpClient.patch<RecruitmentPostType>(`/recruitment-post-types/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment-post-types"] });
      toast.success("状态更新成功");
    },
    onError: (error) => {
      toast.error(error.message || "状态更新失败");
    },
  });
}
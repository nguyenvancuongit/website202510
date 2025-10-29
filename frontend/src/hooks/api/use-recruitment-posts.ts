import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";

export enum RecruitmentPostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

export enum JobType {
  FULL_TIME = "full_time",
  INTERNSHIP = "internship",
}

export interface RecruitmentPost {
  id: string;
  job_title: string;
  job_description: string;
  recruitment_post_type_id: string;
  job_type: JobType;
  status: RecruitmentPostStatus;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  recruitment_post_type?: {
    id: string;
    name: string;
    slug: string;
  };
  created_by_user?: {
    id: string;
    username: string;
  };
  updated_by_user?: {
    id: string;
    username: string;
  };
  _count?: {
    resume_applications?: number;
  };
}

export interface CreateRecruitmentPostData {
  job_title: string;
  job_description: string;
  recruitment_post_type_id: string | number;
  job_type?: JobType;
  status?: RecruitmentPostStatus;
}

export interface UpdateRecruitmentPostData {
  id: string;
  data: {
    job_title?: string;
    job_description?: string;
    recruitment_post_type_id?: string | number;
    job_type?: JobType;
    status?: RecruitmentPostStatus;
  };
}

export interface UpdateRecruitmentPostStatusData {
  id: string;
  status: RecruitmentPostStatus;
}

export interface RecruitmentPostsQuery {
  job_title?: string;
  recruitment_post_type_id?: string;
  job_type?: JobType;
  status?: RecruitmentPostStatus;
  page?: number;
  limit?: number;
}

export interface RecruitmentPostsResponse {
  data: RecruitmentPost[];
  total: number;
  page: number;
  limit: number;
}

export const RECRUITMENT_POSTS_QUERY_KEY = "recruitment-posts";

// Get all recruitment posts
export function useRecruitmentPosts(query?: RecruitmentPostsQuery) {
  return useQuery({
    queryKey: [RECRUITMENT_POSTS_QUERY_KEY, query],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (query?.job_title) params.append("job_title", query.job_title);
      if (query?.recruitment_post_type_id) params.append("recruitment_post_type_id", query.recruitment_post_type_id);
      if (query?.job_type) params.append("job_type", query.job_type);
      if (query?.status) params.append("status", query.status);
      if (query?.page) params.append("page", query.page.toString());
      if (query?.limit) params.append("limit", query.limit.toString());

      return httpClient.get<RecruitmentPostsResponse>(`/recruitment-posts?${params.toString()}`);
    },
  });
}

// Get single recruitment post
export function useRecruitmentPost(id: string) {
  return useQuery({
    queryKey: [RECRUITMENT_POSTS_QUERY_KEY, id],
    queryFn: async () => {
      return httpClient.get<RecruitmentPost>(`/recruitment-posts/${id}`);
    },
    enabled: !!id,
  });
}

// Create recruitment post
export function useCreateRecruitmentPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRecruitmentPostData) => {
      const payload = {
        ...data,
        recruitment_post_type_id: Number(data.recruitment_post_type_id)
      };
      return httpClient.post<RecruitmentPost>("/recruitment-posts", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECRUITMENT_POSTS_QUERY_KEY] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(errorMessage ?? "创建失败");
      }
    },
  });
}

// Update recruitment post
export function useUpdateRecruitmentPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateRecruitmentPostData) => {
      const payload = {
        ...data,
        ...(data.recruitment_post_type_id && {
          recruitment_post_type_id: Number(data.recruitment_post_type_id)
        })
      };
      return httpClient.patch<RecruitmentPost>(`/recruitment-posts/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECRUITMENT_POSTS_QUERY_KEY] });
      toast.success("职位更新成功");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(error?.message || "更新失败");
      }
    },
  });
}

// Update recruitment post status
export function useUpdateRecruitmentPostStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateRecruitmentPostStatusData) => {
      return httpClient.patch<RecruitmentPost>(`/recruitment-posts/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECRUITMENT_POSTS_QUERY_KEY] });
      toast.success("状态更新成功");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error("状态更新失败");
      }
    },
  });
}

// Delete recruitment post
export function useDeleteRecruitmentPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await httpClient.delete(`/recruitment-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECRUITMENT_POSTS_QUERY_KEY] });
      toast.success("职位删除成功");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error("删除失败");
      }
    },
  });
}
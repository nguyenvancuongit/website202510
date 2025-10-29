import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";
import { authenticatedFetch, downloadFile } from "@/lib/utils";
export interface ResumeApplication {
  id: string;
  recruitment_post_id: string;
  resume_file_path: string | null;
  resume_file_name: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
  recruitment_post: {
    id: string;
    job_title: string;
    job_type: string;
    recruitment_post_type: {
      name: string;
    };
  };
}

export interface ResumeApplicationsQuery {
  page?: number;
  limit?: number;
  search?: string;
  recruitment_post_id?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface ResumeApplicationsResponse {
  data: ResumeApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Queries
export const useResumeApplications = (params: ResumeApplicationsQuery = {}) => {
  return useQuery({
    queryKey: ["resume-applications", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.recruitment_post_id) searchParams.append("recruitment_post_id", params.recruitment_post_id);
      if (params.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params.sort_order) searchParams.append("sort_order", params.sort_order);

      return httpClient.get<ResumeApplicationsResponse>(`/resume-applications?${searchParams.toString()}`);
    },
  });
};

export const useResumeApplication = (id: string | undefined) => {
  return useQuery({
    queryKey: ["resume-application", id],
    queryFn: () => httpClient.get<ResumeApplication>(`/resume-applications/${id}`),
    enabled: !!id,
  });
};

// Mutations
export const useDeleteResumeApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      httpClient.delete(`/resume-applications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume-applications"] });
      toast.success("简历申请删除成功");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "删除失败");
    },
  });
};

// Download resume
export const downloadResume = async (id: string, filename: string) => {
  try {
    const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/resume-applications/${id}/download`);

    if (!response.ok) {
      throw new Error("下载失败");
    }

    const blob = await response.blob();
    downloadFile(blob, filename);

    toast.success("简历下载成功");
  } catch (error) {
    toast.error("下载失败，请重试");
  }
};

// Export applications
export const exportApplications = async (ids?: string[]) => {
  try {
    const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/resume-applications/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error("导出失败");
    }

    const blob = await response.blob();
    const filename = `resume-applications-${new Date().toISOString().split("T")[0]}.csv`;
    downloadFile(blob, filename);

    toast.success("导出成功");
  } catch (error) {
    toast.error("导出失败，请重试");
  }
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";
import { Media } from "@/types/index";

// Types
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
}

export interface QueryMediaParams {
  page?: number;
  limit?: number;
  type?: MediaType;
  search?: string;
}

export interface MediaListResponse {
  data: Media[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UploadMediaResponse {
  id: string;
  name: string;
  path: string;
  type: MediaType;
  size: number;
  upload_by?: string;
  created_at: string;
  uploader?: {
    id: string;
    username: string;
  };
}

export interface UpdateMediaData {
  alt_text?: string;
  caption?: string;
}

// Query Keys
const MEDIA_QUERY_KEYS = {
  all: ["media"] as const,
  lists: () => [...MEDIA_QUERY_KEYS.all, "list"] as const,
  list: (params?: QueryMediaParams) =>
    [...MEDIA_QUERY_KEYS.lists(), params] as const,
  details: () => [...MEDIA_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...MEDIA_QUERY_KEYS.details(), id] as const,
};

// API Functions
const mediaApi = {
  getMedias: async (): Promise<Media[]> => {
    const response = await httpClient.get<{ data: Media[] }>("/admin/medias");
    return response.data || [];
  },

  // Get single media
  getMedia: async (id: string): Promise<Media> => {
    const response = await httpClient.get<Media>(`/admin/medias/${id}`);
    return response;
  },

  // Upload multiple medias
  uploadMedias: async (files: File[]): Promise<UploadMediaResponse[]> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await httpClient.upload<UploadMediaResponse[]>(
      "/admin/medias/upload",
      formData
    );
    return response;
  },

  // Update media
  updateMedia: async (id: string, data: UpdateMediaData): Promise<Media> => {
    const response = await httpClient.put<Media>(`/admin/medias/${id}`, data);
    return response;
  },

  // Delete media
  deleteMedia: async (id: string): Promise<void> => {
    await httpClient.delete(`/admin/medias/${id}`);
  },
};

// Hooks
export const useMedias = () => {
  return useQuery({
    queryKey: MEDIA_QUERY_KEYS.lists(),
    queryFn: () => mediaApi.getMedias(),
  });
};

export const useMedia = (id: string) => {
  return useQuery({
    queryKey: MEDIA_QUERY_KEYS.detail(id),
    queryFn: () => mediaApi.getMedia(id),
    enabled: !!id,
  });
};

export const useUploadMedias = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ files }: { files: File[] }) => {
      return mediaApi.uploadMedias(files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.lists() });
      toast.success("媒体文件上传成功");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || "上传失败"
      );
    },
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMediaData }) =>
      mediaApi.updateMedia(id, data),
    onSuccess: (updatedMedia) => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.lists() });
      queryClient.setQueryData(
        MEDIA_QUERY_KEYS.detail(updatedMedia.id),
        updatedMedia
      );
      toast.success("媒体信息更新成功");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "更新失败");
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaApi.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.lists() });
      toast.success("媒体文件删除成功");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "删除失败");
    },
  });
};

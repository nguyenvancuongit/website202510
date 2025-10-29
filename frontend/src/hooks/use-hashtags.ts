"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { HASHTAG_CONFIG, HASHTAG_STATUS_VALUES } from "@/config/constants";
import { Hashtag, hashtagAPI, HashtagQuery } from "@/services/api";
import { useAuthStore } from "@/store/auth-store";

interface FormData {
  name: string;
  status: number;
}

export function useHashtags() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  // State
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHashtag, setEditingHashtag] = useState<Hashtag | null>(null);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: HASHTAG_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [filters, setFilters] = useState<HashtagQuery>({
    page: 1,
    limit: HASHTAG_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Form data
  const [formData, setFormData] = useState<FormData>({
    name: "",
    status: HASHTAG_STATUS_VALUES.ACTIVE,
  });

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }
    fetchHashtags();
  }, [user, token, router, filters]);

  const fetchHashtags = async () => {
    try {
      setLoading(true);
      const response = await hashtagAPI.getAll(filters);

      if (!response || !response.data) {
        toast.error("服务器返回数据格式错误");
        return;
      }

      setHashtags(Array.isArray(response.data) ? response.data : []);

      const paginationData = response.pagination || ({} as any);
      setPagination({
        page: paginationData.page || 1,
        limit:
          paginationData.limit || HASHTAG_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
        total: paginationData.total || 0,
        totalPages: paginationData.total_pages || 0,
      });
    } catch (error) {
      console.error("Error fetching hashtags:", error);

      if (error instanceof Error) {
        if (
          error.message.includes("401") ||
          error.message.includes("Unauthorized")
        ) {
          toast.error("登录已过期，请重新登录");
          router.push("/login");
        } else if (
          error.message.includes("403") ||
          error.message.includes("Forbidden")
        ) {
          toast.error("您没有权限访问此页面");
        } else if (error.message.includes("500")) {
          toast.error("服务器内部错误，请稍后重试");
        } else {
          toast.error(error.message || "获取标签失败");
        }
      } else {
        toast.error("获取标签失败");
      }

      setHashtags([]);
      setPagination({
        page: 1,
        limit: HASHTAG_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("请先登录");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("请输入标签名称");
      return;
    }

    try {
      setSubmitting(true);

      if (editingHashtag) {
        await hashtagAPI.update(parseInt(editingHashtag.id), formData, token);
        toast.success("标签更新成功");
      } else {
        await hashtagAPI.create(formData, token);
        toast.success("标签创建成功");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchHashtags();
    } catch (error) {
      console.error("Error submitting hashtag:", error);
      if (error instanceof Error) {
        toast.error(error.message || "操作失败");
      } else {
        toast.error("操作失败");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (hashtag: Hashtag) => {
    setEditingHashtag(hashtag);
    setFormData({
      name: hashtag.name,
      status: hashtag.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      toast.error("请先登录");
      return;
    }

    if (!confirm("确定要删除这个标签吗？")) {
      return;
    }

    try {
      await hashtagAPI.delete(parseInt(id), token);
      toast.success("删除成功");
      fetchHashtags();
    } catch (error) {
      console.error("Error deleting hashtag:", error);
      if (error instanceof Error) {
        toast.error(error.message || "删除失败");
      } else {
        toast.error("删除失败");
      }
    }
  };

  const handleToggleStatus = async (id: string, status: number) => {
    if (!token) {
      toast.error("请先登录");
      return;
    }

    try {
      await hashtagAPI.updateStatus(parseInt(id), status, token);
      toast.success("状态更新成功");
      fetchHashtags();
    } catch (error) {
      console.error("Error updating hashtag status:", error);
      if (error instanceof Error) {
        toast.error(error.message || "状态更新失败");
      } else {
        toast.error("状态更新失败");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      status: HASHTAG_STATUS_VALUES.ACTIVE,
    });
    setEditingHashtag(null);
  };

  const handleFilterChange = (newFilters: Partial<HashtagQuery>) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };

      // Handle each filter property explicitly
      Object.keys(newFilters).forEach((key) => {
        const value = newFilters[key as keyof HashtagQuery];
        if (value === undefined) {
          delete updatedFilters[key as keyof HashtagQuery];
        } else {
          updatedFilters[key as keyof HashtagQuery] = value as any;
        }
      });

      // Always reset to page 1 when filters change (except when only page changes)
      if (!newFilters.page) {
        updatedFilters.page = 1;
      }

      return updatedFilters;
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    hashtags,
    loading,
    submitting,
    isDialogOpen,
    setIsDialogOpen,
    editingHashtag,
    pagination,
    filters,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    resetForm,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    fetchHashtags,
  };
}

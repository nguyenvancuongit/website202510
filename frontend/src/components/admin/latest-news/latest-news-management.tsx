"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Edit2, Plus, RotateCcw, Search, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import PublishIcon from "@/assets/icons/publish-icon";
import UnPublishIcon from "@/assets/icons/unpublish-icon";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalDialog } from "@/contexts/dialog-context";
import { CategoryType, useCategories } from "@/hooks/api/use-categories";
import {
  type LatestNews,
  type LatestNewsQuery,
  LatestNewsStatus,
  useDeleteLatestNews,
  useLatestNews,
  useToggleLatestNewsFeatured,
  useUpdateLatestNewsStatus,
} from "@/hooks/api/use-latest-news";
import { cn } from "@/lib/utils";
import { Column } from "@/types/data-table.types";

export function LatestNewsManagement() {
  const router = useRouter();
  const dialog = useGlobalDialog();

  const [query, setQuery] = useState<LatestNewsQuery>({
    page: 1,
    limit: 10,
    sort_by: "publishedDate",
    sort_order: "desc",
  });

  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
  });

  // Fetch latest news
  const { data: latestNewsResponse, isLoading, refetch } = useLatestNews(query);

  // Fetch categories for "latest-news" type
  const { data: categoriesResponse } = useCategories(CategoryType.LATEST_NEW, {
    limit: 100,
  });

  // Mutations
  const deleteLatestNews = useDeleteLatestNews();
  const toggleFeatured = useToggleLatestNewsFeatured();
  const updateStatus = useUpdateLatestNewsStatus();

  const latestNews = latestNewsResponse?.data || [];
  const pagination = latestNewsResponse?.pagination;
  const categories = categoriesResponse?.data || [];

  const handleSearch = () => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: filters.search || undefined,
      category_id: filters.category_id
        ? Number(filters.category_id)
        : undefined,
    }));
  };

  const handleReset = () => {
    setFilters({ search: "", category_id: "" });
    setQuery({
      page: 1,
      limit: 10,
      sort_by: "publishedDate",
      sort_order: "desc",
    });
  };

  const handleCreate = () => {
    router.push("/latest-news/create");
  };

  const handleEdit = (item: LatestNews) => {
    router.push(`/latest-news/edit/${item.id}`);
  };

  const handleDelete = async (item: LatestNews) => {
    const confirmed = await dialog.confirm({
      title: "确认删除",
      message: `您确定要删除资讯 "${item.title}" 吗？此操作无法撤销。`,
      confirmText: "删除",
    });

    if (confirmed) {
      deleteLatestNews.mutate(item.id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleToggleFeatured = async (id: number) => {
    await toggleFeatured.mutateAsync(id);
  };

  const handleTogglePublishStatus = async (item: LatestNews) => {
    const newStatus =
      item.status === LatestNewsStatus.PUBLISHED
        ? LatestNewsStatus.UNPUBLISHED
        : LatestNewsStatus.PUBLISHED;

    const action =
      newStatus === LatestNewsStatus.PUBLISHED ? "发布" : "取消发布";

    const confirmed = await dialog.confirm({
      title: `确认${action}`,
      message: `您确定要${action}资讯 "${item.title}" 吗？`,
      confirmText: action,
    });

    if (confirmed) {
      updateStatus.mutate(
        { id: item.id, status: newStatus },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
  };

  const getStatusBadge = (status: LatestNewsStatus) => {
    switch (status) {
      case LatestNewsStatus.PUBLISHED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            已发布
          </Badge>
        );
      case LatestNewsStatus.UNPUBLISHED:
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            未发布
          </Badge>
        );
      case LatestNewsStatus.DRAFT:
        return <Badge variant="secondary">草稿</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: Column<LatestNews>[] = useMemo(
    () => [
      {
        id: "title",
        header: "文章名称",
        accessorKey: "title",
        cell: (value) => (
          <div
            className="max-w-md font-medium text-gray-900 truncate"
            title={value}
          >
            {value}
          </div>
        ),
      },
      {
        id: "category",
        header: "所属栏目",
        accessorKey: "category",
        cell: (value) => (
          <span className="text-sm text-gray-600">
            {value?.name || "未分类"}
          </span>
        ),
        width: "120px",
      },
      {
        id: "featured",
        header: "是否置顶",
        accessorKey: "featured",
        cell: (value) => (
          <div className="flex justify-center">
            <span className="text-sm text-gray-600">{value ? "是" : "否"}</span>
          </div>
        ),
        width: "100px",
      },
      {
        id: "status",
        header: "状态",
        accessorKey: "status",
        cell: (value) => <div className="flex ">{getStatusBadge(value)}</div>,
        width: "100px",
      },
      {
        // should be published at
        id: "published_date",
        header: "首次发布时间",
        accessorKey: "published_date",
        cell: (value) => (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {format(new Date(value), "yyyy-MM-dd HH:mm", { locale: zhCN })}
          </span>
        ),
        width: "140px",
      },
      {
        id: "updatedAt",
        header: "更新时间",
        accessorKey: "updated_at",
        cell: (value) => (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {format(new Date(value), "yyyy-MM-dd HH:mm", { locale: zhCN })}
          </span>
        ),
        width: "140px",
      },
      {
        id: "updatedBy",
        header: "操作者",
        accessorKey: "updated_by_user",
        cell: (value) => (
          <span className="text-sm text-gray-600">
            {value?.username || "-"}
          </span>
        ),
        width: "100px",
      },
      {
        id: "actions",
        header: "操作",
        accessorKey: "id",
        cell: (value, row) => (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(row)}
                    disabled={row.status === LatestNewsStatus.PUBLISHED}
                    className={cn(
                      "h-8 w-8 p-0",
                      row.status === LatestNewsStatus.PUBLISHED &&
                      "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === LatestNewsStatus.PUBLISHED
                  ? "请先取消发布再编辑"
                  : "编辑"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleFeatured(row.id)}
                  disabled={toggleFeatured.isPending}
                  className={cn(
                    "h-8 w-8 p-0",
                    row.featured
                      ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                      : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Star
                    className={cn("h-4 w-4", row.featured && "fill-current")}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {row.featured ? "取消置顶" : "设为置顶"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTogglePublishStatus(row)}
                  disabled={updateStatus.isPending}
                  className={cn(
                    "h-8 w-8 p-0",
                    row.status === LatestNewsStatus.PUBLISHED
                      ? "hover:bg-gray-100"
                      : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  )}
                >
                  {row.status === LatestNewsStatus.PUBLISHED ? (
                    <UnPublishIcon className="h-4 w-4" />
                  ) : (
                    <PublishIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === LatestNewsStatus.PUBLISHED
                  ? "取消发布"
                  : "发布"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(row)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={row.status === LatestNewsStatus.PUBLISHED}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === LatestNewsStatus.PUBLISHED
                  ? "请先取消发布再删除"
                  : "删除"}
              </TooltipContent>
            </Tooltip>
          </div>
        ),
        width: "180px",
      },
    ],
    [toggleFeatured.isPending, updateStatus.isPending]
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">最新资讯管理</h1>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新建资讯
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索资讯名称..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={filters.category_id}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, category_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              搜索
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={latestNews}
        columns={columns}
        loading={isLoading}
        emptyMessage="暂无资讯数据"
        draggable={false}
        pagination={{
          page: pagination?.page || 1,
          totalPages: pagination?.total_pages || 0,
          total: pagination?.total || 0,
          limit: pagination?.limit || 10,
          onPageChange: (page) => setQuery((prev) => ({ ...prev, page })),
          onPageSizeChange: (limit) =>
            setQuery((prev) => ({ ...prev, limit, page: 1 })),
          pageSizeOptions: [10, 20, 50, 100],
        }}
      />
    </div>
  );
}

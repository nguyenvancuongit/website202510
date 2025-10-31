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
import {
  type CaseStudy,
  type CaseStudyQuery,
  CaseStudyStatus,
  useCaseStudies,
  useDeleteCaseStudy,
  useToggleCaseStudyFeatured,
  useUpdateCaseStudyStatus,
} from "@/hooks/api/use-case-studies";
import { CategoryType, useCategories } from "@/hooks/api/use-categories";
import { cn } from "@/lib/utils";
import { Column } from "@/types/data-table.types";

export function CaseStudiesManagement() {
  const router = useRouter();
  const dialog = useGlobalDialog();

  const [query, setQuery] = useState<CaseStudyQuery>({
    page: 1,
    limit: 10,
    sort_by: "createdAt",
    sort_order: "desc",
  });

  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
  });

  // Fetch case studies
  const {
    data: caseStudiesResponse,
    isLoading,
    refetch,
  } = useCaseStudies(query);

  // Fetch categories for "case-study" type
  const { data: categoriesResponse } = useCategories(CategoryType.CASE_STUDY, {
    status: "enabled",
    limit: 100, // Get all enabled categories
  });

  // Mutations
  const deleteCaseStudy = useDeleteCaseStudy();
  const toggleFeatured = useToggleCaseStudyFeatured();
  const updateStatus = useUpdateCaseStudyStatus();

  const caseStudies = caseStudiesResponse?.data || [];
  const pagination = caseStudiesResponse?.pagination;
  const categories = categoriesResponse?.data || [];

  const handleSearch = () => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: filters.search || undefined,
      category_id:
        filters.category_id === "all" ? undefined : Number(filters.category_id),
    }));
  };

  const handleReset = () => {
    setFilters({ search: "", category_id: "" });
    setQuery({
      page: 1,
      limit: 10,
      sort_by: "createdAt",
      sort_order: "desc",
    });
  };

  const handleCreate = () => {
    router.push("/case-studies/posts/create");
  };

  const handleEdit = (item: CaseStudy) => {
    router.push(`/case-studies/posts/edit/${item.id}`);
  };

  const handleDelete = async (item: CaseStudy) => {
    const confirmed = await dialog.confirm({
      title: "确认删除",
      message: `您确定要删除案例 "${item.title}" 吗？此操作无法撤销。`,
      confirmText: "删除",
    });

    if (confirmed) {
      deleteCaseStudy.mutate(item.id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleToggleFeatured = async (id: number) => {
    await toggleFeatured.mutateAsync(id);
  };

  const handleTogglePublishStatus = async (item: CaseStudy) => {
    const newStatus =
      item.status === CaseStudyStatus.PUBLISHED
        ? CaseStudyStatus.UNPUBLISHED
        : CaseStudyStatus.PUBLISHED;

    const action =
      newStatus === CaseStudyStatus.PUBLISHED ? "发布" : "取消发布";

    const confirmed = await dialog.confirm({
      title: `确认${action}`,
      message: `您确定要${action}案例 "${item.title}" 吗？`,
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

  const getStatusBadge = (status: CaseStudyStatus) => {
    switch (status) {
      case CaseStudyStatus.PUBLISHED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            已发布
          </Badge>
        );
      case CaseStudyStatus.UNPUBLISHED:
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            未发布
          </Badge>
        );
      case CaseStudyStatus.DRAFT:
        return <Badge variant="secondary">草稿</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: Column<CaseStudy>[] = useMemo(
    () => [
      {
        id: "title",
        header: "案例标题",
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
        id: "customer_name",
        header: "客户名称",
        accessorKey: "customer_name",
        cell: (value) => (
          <span className="text-sm text-gray-600">{value || "-"}</span>
        ),
        width: "120px",
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
        header: "是否推荐",
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
        id: "created_at",
        header: "首次发布时间",
        accessorKey: "created_at",
        cell: (value) => (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {format(new Date(value), "yyyy-MM-dd HH:mm", { locale: zhCN })}
          </span>
        ),
        width: "140px",
      },
      {
        id: "featuredAt",
        header: "推荐时间",
        accessorKey: "featured_at",
        cell: (value) => (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {value ? format(new Date(value), "yyyy-MM-dd HH:mm", { locale: zhCN }) : "-"}
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
        id: "createdBy",
        header: "操作者",
        accessorKey: "created_by",
        cell: (value) => (
          <span className="text-sm text-gray-600">
            {value ? `用户${value}` : "-"}
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
                    disabled={row.status === CaseStudyStatus.PUBLISHED}
                    className={cn(
                      "h-8 w-8 p-0",
                      row.status === CaseStudyStatus.PUBLISHED &&
                      "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === CaseStudyStatus.PUBLISHED
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
                  disabled={
                    toggleFeatured.isPending ||
                    row.status === CaseStudyStatus.DRAFT
                  }
                  className={cn(
                    "h-8 w-8 p-0",
                    row.status === CaseStudyStatus.DRAFT
                      ? "text-gray-400 cursor-not-allowed"
                      : row.featured
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
                {row.status === CaseStudyStatus.DRAFT
                  ? "草稿状态无法设置推荐"
                  : row.featured
                    ? "取消推荐"
                    : "设为推荐"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTogglePublishStatus(row)}
                  disabled={
                    updateStatus.isPending ||
                    row.status === CaseStudyStatus.DRAFT
                  }
                  className={cn(
                    "h-8 w-8 p-0",
                    row.status === CaseStudyStatus.DRAFT
                      ? "text-gray-400 cursor-not-allowed"
                      : row.status === CaseStudyStatus.PUBLISHED
                        ? "text-green-600 hover:text-green-700 hover:bg-gray-100"
                        : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  )}
                >
                  {row.status === CaseStudyStatus.PUBLISHED ? (
                    <UnPublishIcon className="h-4 w-4" />
                  ) : (
                    <PublishIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === CaseStudyStatus.DRAFT
                  ? "草稿状态无法发布"
                  : row.status === CaseStudyStatus.PUBLISHED
                    ? "取消发布"
                    : "发布"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(row)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={row.status === CaseStudyStatus.PUBLISHED}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === CaseStudyStatus.PUBLISHED
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
          <h1 className="text-2xl font-bold text-gray-900">客户案例管理</h1>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新建案例
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索案例标题、客户名称..."
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
        data={caseStudies}
        columns={columns}
        loading={isLoading}
        emptyMessage="暂无案例数据"
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

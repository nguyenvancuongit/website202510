"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Edit2,
  FileX,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
import { PRODUCT_STATUS_OPTIONS } from "@/config/constants";
import { useGlobalDialog } from "@/contexts/dialog-context";
import { CategoryType, useCategories } from "@/hooks/api/use-categories";
import {
  type Product,
  type ProductQuery,
  ProductStatus,
  useDeleteProduct,
  useProducts,
  useToggleProductFeatured,
  useUpdateProductStatus,
} from "@/hooks/api/use-products";
import { cn } from "@/lib/utils";
import { Column } from "@/types/data-table.types";

export function ProductsManagement() {
  const router = useRouter();
  const dialog = useGlobalDialog();

  const [query, setQuery] = useState<ProductQuery>({
    page: 1,
    limit: 10,
    sort_by: "sort_order",
    sort_order: "asc",
  });

  const [filters, setFilters] = useState({
    search: "",
    category_id: "all",
  });

  // Fetch products
  const { data: productsResponse, isLoading, refetch } = useProducts(query);

  // Fetch categories for "product" type
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useCategories(CategoryType.PRODUCT, {
      status: "enabled",
      limit: 100, // Get all enabled categories
    });

  // Mutations
  const deleteProduct = useDeleteProduct();
  const toggleFeatured = useToggleProductFeatured();
  const updateStatus = useUpdateProductStatus();

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;
  const categories = (categoriesResponse?.data || []).filter(
    (category) =>
      category?.id && category?.name && category.id.toString().trim() !== ""
  );

  const handleSearch = () => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: filters.search?.trim() || undefined,
      category_id:
        filters.category_id && filters.category_id !== "all"
          ? Number(filters.category_id)
          : undefined,
    }));
  };

  const handleReset = () => {
    setFilters({ search: "", category_id: "all" });
    setQuery({
      page: 1,
      limit: 10,
      sort_by: "sort_order",
      sort_order: "asc",
    });
  };

  const handleCreate = () => {
    router.push("/products/posts/create");
  };

  const handleEdit = (item: Product) => {
    router.push(`/products/posts/edit/${item.id}`);
  };

  const handleDelete = async (item: Product) => {
    const confirmed = await dialog.confirm({
      title: "确认删除",
      message: `您确定要删除产品 "${item.name}" 吗？此操作无法撤销。`,
      confirmText: "删除",
    });

    if (confirmed) {
      deleteProduct.mutate(item.id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleToggleFeatured = async (id: number) => {
    await toggleFeatured.mutateAsync(id);
  };

  const handleTogglePublishStatus = async (item: Product) => {
    if (item.status === ProductStatus.DRAFT) {
      return;
    }

    const newStatus =
      item.status === ProductStatus.PUBLISHED
        ? ProductStatus.UNPUBLISHED
        : ProductStatus.PUBLISHED;

    const action = newStatus === ProductStatus.PUBLISHED ? "发布" : "取消发布";

    const confirmed = await dialog.confirm({
      title: `确认${action}`,
      message: `您确定要${action}产品 "${item.name}" 吗？`,
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

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.PUBLISHED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {PRODUCT_STATUS_OPTIONS.find(
              (opt) => opt.value === ProductStatus.PUBLISHED
            )?.label || "已发布"}
          </Badge>
        );
      case ProductStatus.UNPUBLISHED:
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            {PRODUCT_STATUS_OPTIONS.find(
              (opt) => opt.value === ProductStatus.UNPUBLISHED
            )?.label || "未发布"}
          </Badge>
        );
      case ProductStatus.DRAFT:
        return (
          <Badge variant="secondary">
            {PRODUCT_STATUS_OPTIONS.find(
              (opt) => opt.value === ProductStatus.DRAFT
            )?.label || "草稿"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: Column<Product>[] = useMemo(
    () => [
      {
        id: "name",
        header: "产品名称",
        accessorKey: "name",
        cell: (value, row) => (
          <div className="flex items-center gap-3">
            {row?.banner_media?.path && (
              <Image
                src={row.banner_media.path}
                width={48}
                height={48}
                alt={row.banner_media.alt_text || row?.name || "Product image"}
                className="w-12 h-12 object-cover rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            )}
            <div
              className="max-w-md font-medium text-gray-900 truncate"
              title={value || "未知产品"}
            >
              {value || "未知产品"}
            </div>
          </div>
        ),
      },
      {
        id: "category",
        header: "所属分类",
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
        header: "创建时间",
        accessorKey: "created_at",
        cell: (value) => (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {format(new Date(value), "yyyy-MM-dd HH:mm", { locale: zhCN })}
          </span>
        ),
        width: "140px",
      },
      {
        id: "updated_at",
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
                    disabled={row.status === ProductStatus.PUBLISHED}
                    className={cn(
                      "h-8 w-8 p-0",
                      row.status === ProductStatus.PUBLISHED &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === ProductStatus.PUBLISHED
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
                    row.status === ProductStatus.DRAFT
                  }
                  className={cn(
                    "h-8 w-8 p-0",
                    row.status === ProductStatus.DRAFT
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
                {row.status === ProductStatus.DRAFT
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
                    updateStatus.isPending || row.status === ProductStatus.DRAFT
                  }
                  className={cn(
                    "h-8 w-8 p-0",
                    row.status === ProductStatus.DRAFT
                      ? "text-gray-400 cursor-not-allowed"
                      : row.status === ProductStatus.PUBLISHED
                      ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                      : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  )}
                >
                  {row.status === ProductStatus.PUBLISHED ? (
                    <FileX className="h-4 w-4" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === ProductStatus.DRAFT
                  ? "草稿状态无法发布"
                  : row.status === ProductStatus.PUBLISHED
                  ? "取消发布"
                  : "发布"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(row)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>删除</TooltipContent>
            </Tooltip>
          </div>
        ),
        width: "180px",
      },
    ],
    [toggleFeatured.isPending, updateStatus.isPending]
  );

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQuery((prev) => ({ ...prev, limit: pageSize, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">产品管理</h1>
          <p className="text-sm text-gray-600 mt-1">
            管理产品信息，包括产品介绍、规格参数等内容
          </p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          新增产品
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索产品名称..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="max-w-sm"
            />
          </div>

          <div className="flex-none">
            <Select
              value={filters.category_id}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, category_id: value }))
              }
              disabled={isCategoriesLoading}
            >
              <SelectTrigger className="w-48">
                <SelectValue
                  placeholder={isCategoriesLoading ? "加载中..." : "选择分类"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {categories.map((category) => {
                  const categoryId = category?.id?.toString();
                  if (!categoryId || categoryId.trim() === "") {
                    return null;
                  }

                  return (
                    <SelectItem key={category.id} value={categoryId}>
                      {category.name || "未知分类"}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              搜索
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg">
        <DataTable
          columns={columns}
          data={products}
          loading={isLoading}
          draggable={false}
          pagination={{
            page: pagination?.page || 1,
            limit: pagination?.limit || 10,
            total: pagination?.total || 0,
            totalPages: pagination?.total_pages || 1,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
            pageSizeOptions: [10, 20, 50, 100],
          }}
        />
      </div>
    </div>
  );
}

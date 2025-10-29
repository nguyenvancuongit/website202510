"use client";

import { useEffect, useImperativeHandle, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Edit } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useGlobalDialog } from "@/contexts/dialog-context";
import {
  Category,
  CategoryType,
  useCategories,
  useUpdateCategory,
  useUpdateCategoryOrder,
} from "@/hooks/api/use-categories";
import { formatDateTimeWithTZ } from "@/lib/datetime-utils";
import { Column } from "@/types/data-table.types";

import { CategoryDialog } from "./category-dialog";

interface CategoriesTableProps {
  categoryType: CategoryType;
  ref: React.Ref<any>;
}

export function CategoriesTable({ categoryType, ref }: CategoriesTableProps) {
  const dialog = useGlobalDialog();
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // React Query hooks
  const { data: categoriesResponse, isLoading } = useCategories(categoryType, {
    ...pagination,
    sort_by: "order",
    sort_order: "asc",
  });
  const updateCategoryMutation = useUpdateCategory(categoryType);
  const updateOrderMutation = useUpdateCategoryOrder(categoryType);

  // Update local state when data changes
  useEffect(() => {
    if (categoriesResponse?.data) {
      // Sort categories by order
      const sortedCategories = [...categoriesResponse.data].sort(
        (a, b) => a.order - b.order
      );
      setLocalCategories(sortedCategories);
      setHasChanges(false);
    }
  }, [categoriesResponse]);

  useImperativeHandle(ref, () => ({
    handleCreate: handleCreate,
  }));

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedCategory(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setDialogMode("edit");
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleToggleStatus = async (category: Category) => {
    const newStatus = category.status === "enabled" ? "disabled" : "enabled";
    const statusText = newStatus === "enabled" ? "启用" : "禁用";

    const confirmed = await dialog.confirm({
      title: "状态变更确认",
      message: `确定要${statusText}分类"${category.name}"吗？`,
      confirmText: statusText,
      variant: newStatus === "disabled" ? "destructive" : "default",
      showCancel: true,
    });

    if (!confirmed) { return; }

    updateCategoryMutation.mutate({
      id: category.id,
      data: { status: newStatus },
    });
  };

  const handleReorder = (newData: Category[]) => {
    setLocalCategories(newData);
    setHasChanges(true);
  };

  const saveOrder = () => {
    if (!hasChanges) { return; }

    // Create order array with new order values
    const orderUpdates = localCategories.map((category, index) => ({
      id: category.id,
      order: index + 1,
    }));

    updateOrderMutation.mutate(
      { category_orders: orderUpdates },
      {
        onSuccess: () => {
          setHasChanges(false);
        },
      }
    );
  };

  const handleResetOrder = () => {
    if (categoriesResponse?.data) {
      const sortedCategories = [...categoriesResponse.data].sort(
        (a, b) => a.order - b.order
      );
      setLocalCategories(sortedCategories);
      setHasChanges(false);
    }
  };

  const handleMoveUp = (category: Category) => {
    const currentIndex = localCategories.findIndex((c) => c.id === category.id);
    if (currentIndex > 0) {
      const newCategories = [...localCategories];
      // Swap with the previous item
      [newCategories[currentIndex - 1], newCategories[currentIndex]] = [
        newCategories[currentIndex],
        newCategories[currentIndex - 1],
      ];

      // Update local state immediately
      setLocalCategories(newCategories);

      // Create order array and save to API
      const orderUpdates = newCategories.map((cat, index) => ({
        id: cat.id,
        order: index + 1,
      }));

      updateOrderMutation.mutate(
        { category_orders: orderUpdates },
        {
          onSuccess: () => {
            setHasChanges(false);
          },
          onError: () => {
            // Revert on error
            setLocalCategories(localCategories);
          },
        }
      );
    }
  };

  const handleMoveDown = (category: Category) => {
    const currentIndex = localCategories.findIndex((c) => c.id === category.id);
    if (currentIndex < localCategories.length - 1) {
      const newCategories = [...localCategories];
      // Swap with the next item
      [newCategories[currentIndex], newCategories[currentIndex + 1]] = [
        newCategories[currentIndex + 1],
        newCategories[currentIndex],
      ];

      // Update local state immediately
      setLocalCategories(newCategories);

      // Create order array and save to API
      const orderUpdates = newCategories.map((cat, index) => ({
        id: cat.id,
        order: index + 1,
      }));

      updateOrderMutation.mutate(
        { category_orders: orderUpdates },
        {
          onSuccess: () => {
            setHasChanges(false);
          },
          onError: () => {
            setLocalCategories(localCategories);
          },
        }
      );
    }
  };

  const columns: Column<Category>[] = useMemo(
    () => [
      {
        id: "order",
        header: "排序",
        accessorKey: "order",
        cell: (value) => (
          <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-mono w-fit">
            #{value}
          </div>
        ),
        width: "60px",
      },
      {
        id: "name",
        header: "分类名称",
        accessorKey: "name",
        cell: (value) => (
          <div className="font-medium max-w-[200px] truncate">{value}</div>
        ),
      },
      {
        id: "published_post",
        header: "发布文章数",
        accessorKey: "published_post",
        cell: (value) => <Badge variant="outline">{value || 0}</Badge>,
        width: "200px",
      },
      {
        id: "operator",
        header: "操作者",
        accessorKey: "published_post", // change later after backend support
        cell: () => <span>管理员</span>,
        width: "100px",
      },
      {
        id: "created_at",
        header: "创建时间",
        accessorKey: "created_at",
        cell: (value) => (
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {value
              ? formatDateTimeWithTZ(value)
              : "未知日期"}
          </div>
        ),
        width: "150px",
      },
      {
        id: "status",
        header: "状态",
        accessorKey: "status",
        cell: (value, row) => (
          <div className="flex items-center gap-1">
            <Switch
              checked={value === "enabled"}
              onCheckedChange={() => handleToggleStatus(row)}
            />
            <Badge
              variant={value === "enabled" ? "default" : "secondary"}
              className="whitespace-nowrap"
            >
              {value === "enabled" ? "启用" : "禁用"}
            </Badge>
          </div>
        ),
        width: "80px",
      },
      {
        id: "actions",
        header: "操作",
        accessorKey: "id",
        cell: (value, row) => {
          const currentIndex = localCategories.findIndex(
            (c) => c.id === row.id
          );
          const isFirst = currentIndex === 0;
          const isLast = currentIndex === localCategories.length - 1;

          return (
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(row)}
                      className="h-8 w-8 p-0"
                      title="编辑"
                      disabled={row.status === "enabled"}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {row.status === "enabled"
                    ? "请先禁用分类后再进行编辑"
                    : "编辑分类"}
                </TooltipContent>
              </Tooltip>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveUp(row)}
                disabled={isFirst || updateOrderMutation.isPending || hasChanges}
                className="h-8 w-8 p-0"
                title="向上移动"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveDown(row)}
                disabled={isLast || updateOrderMutation.isPending || hasChanges}
                className="h-8 w-8 p-0"
                title="向下移动"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        width: "160px",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localCategories, updateOrderMutation.isPending, hasChanges]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-end flex-end">
        {/* Order Actions - Only show when there are categories */}
        {localCategories.length > 0 && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleResetOrder}>
              刷新
            </Button>
            <Button
              className={`${hasChanges
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
              onClick={saveOrder}
              disabled={!hasChanges || updateOrderMutation.isPending}
            >
              {hasChanges ? "保存排序 *" : "保存排序"}
            </Button>
          </div>
        )}
      </div>

      <DataTable
        data={localCategories}
        columns={columns}
        draggable={true}
        onReorder={handleReorder}
        loading={isLoading || updateOrderMutation.isPending}
        emptyMessage="暂无分类数据"
        pagination={{
          page: categoriesResponse?.pagination?.page || 1,
          limit: categoriesResponse?.pagination?.limit || 10,
          total: categoriesResponse?.pagination?.total || 0,
          onPageChange: (page) => {
            setPagination((prev) => ({ ...prev, page }));
          },
          onPageSizeChange: (limit) => {
            setPagination((prev) => ({
              ...prev,
              limit,
              page: 1,
            }));
          },
          pageSizeOptions: [10, 20, 50],
          totalPages: categoriesResponse?.pagination?.total_pages || 1,
        }}
      />

      {/* Create/Edit Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        category={selectedCategory}
        categoryType={categoryType}
      />
    </div>
  );
}

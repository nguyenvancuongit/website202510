"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  EyeIcon,
  EyeOffIcon,
  RefreshCwIcon,
} from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useProductPages,
  useUpdateProductPages,
} from "@/hooks/api/use-product-pages";
import {
  ProductPageItem,
  ProductPagesConfig,
} from "@/services/product-pages.service";
import { Column } from "@/types/data-table.types";


export default function ProductsPage() {
  const { data: config, isLoading, error, refetch } = useProductPages();
  const updateMutation = useUpdateProductPages();
  const [localPages, setLocalPages] = useState<ProductPageItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Transform config object to array format for DataTable
  const configToPages = useCallback((config: ProductPagesConfig): ProductPageItem[] => {
    if (!config) return [];

    return Object.keys(config)
      .map((key) => ({
        id: key,
        key,
        ...config[key],
      }))
      .sort((a, b) => a.order - b.order);
  }, []);

  // Update local state when data changes
  useEffect(() => {
    if (config) {
      const pages = configToPages(config);
      setLocalPages(pages);
      setHasChanges(false);
    }
  }, [config, configToPages]);

  const handleToggleEnabled = useCallback(
    async (pageKey: string) => {
      // Optimistically update UI
      const updatedPages = localPages.map((page) =>
        page.key === pageKey ? { ...page, enabled: !page.enabled } : page
      );
      setLocalPages(updatedPages);

      try {
        // Convert to config format and save immediately
        const configToSave: ProductPagesConfig = {};
        updatedPages.forEach(p => {
          const { id, key, ...pageConfig } = p;
          configToSave[key] = pageConfig;
        });

        await updateMutation.mutateAsync(configToSave);
        toast.success("产品页面状态已更新");
      } catch (err) {
        // Revert on error
        setLocalPages(localPages);
        toast.error("更新失败，请重试");
        // eslint-disable-next-line no-console
        console.error("Failed to update product page status:", err);
      }
    },
    [localPages, updateMutation]
  );

  const handleReorder = (newData: ProductPageItem[]) => {
    const updatedPages = newData.map((page, index) => ({
      ...page,
      order: index + 1,
    }));

    setLocalPages(updatedPages);
    setHasChanges(true);
  };

  const handleMoveUp = useCallback(async (page: ProductPageItem) => {
    const currentIndex = localPages.findIndex((p) => p.id === page.id);
    if (currentIndex > 0) {
      const newPages = [...localPages];
      // Swap with the previous item
      [newPages[currentIndex - 1], newPages[currentIndex]] = [
        newPages[currentIndex],
        newPages[currentIndex - 1],
      ];

      // Update order values
      const updatedPages = newPages.map((p, index) => ({
        ...p,
        order: index + 1,
      }));

      // Optimistically update UI
      setLocalPages(updatedPages);

      try {
        // Convert to config format and save immediately
        const configToSave: ProductPagesConfig = {};
        updatedPages.forEach(p => {
          const { id, key, ...pageConfig } = p;
          configToSave[key] = pageConfig;
        });

        await updateMutation.mutateAsync(configToSave);
        toast.success("页面顺序已更新");
      } catch (err) {
        // Revert on error
        setLocalPages(localPages);
        toast.error("更新失败，请重试");
        // eslint-disable-next-line no-console
        console.error("Failed to update product page order:", err);
      }
    }
  }, [localPages, updateMutation]);

  const handleMoveDown = useCallback(async (page: ProductPageItem) => {
    const currentIndex = localPages.findIndex((p) => p.id === page.id);
    if (currentIndex < localPages.length - 1) {
      const newPages = [...localPages];
      // Swap with the next item
      [newPages[currentIndex], newPages[currentIndex + 1]] = [
        newPages[currentIndex + 1],
        newPages[currentIndex],
      ];

      // Update order values
      const updatedPages = newPages.map((p, index) => ({
        ...p,
        order: index + 1,
      }));

      // Optimistically update UI
      setLocalPages(updatedPages);

      try {
        // Convert to config format and save immediately
        const configToSave: ProductPagesConfig = {};
        updatedPages.forEach(p => {
          const { id, key, ...pageConfig } = p;
          configToSave[key] = pageConfig;
        });

        await updateMutation.mutateAsync(configToSave);
        toast.success("页面顺序已更新");
      } catch (err) {
        // Revert on error
        setLocalPages(localPages);
        toast.error("更新失败，请重试");
        // eslint-disable-next-line no-console
        console.error("Failed to update product page order:", err);
      }
    }
  }, [localPages, updateMutation]);

  const handleSave = async () => {
    // Convert back to ProductPagesConfig format
    const configToSave: ProductPagesConfig = {};
    localPages.forEach((page) => {
      const { id, key, ...pageConfig } = page;
      configToSave[key] = pageConfig;
    });

    updateMutation.mutate(configToSave, {
      onSuccess: () => {
        setHasChanges(false);
        toast.success("产品页面配置已更新");
      },
      onError: () => {
        toast.error("保存失败，请重试");
      }
    });
  };

  const handleReset = () => {
    if (config) {
      const pages = configToPages(config);
      setLocalPages(pages);
      setHasChanges(false);
    }
  };

  const columns: Column<ProductPageItem>[] = useMemo(
    () => [
      {
        id: "order",
        header: "序号",
        accessorKey: "order",
        cell: (value) => (
          <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-mono w-fit">
            #{value}
          </div>
        ),
        width: "80px",
      },
      {
        id: "name",
        header: "产品名称",
        accessorKey: "name",
        cell: (value) => (
          <div className="font-medium max-w-[200px] truncate">{value}</div>
        ),
      },
      {
        id: "slug",
        header: "页面路径",
        accessorKey: "slug",
        cell: (value) => (
          <div className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
            /products/{value}
          </div>
        ),
      },
      {
        id: "description",
        header: "描述",
        accessorKey: "description",
        cell: (value) => (
          <div className="text-sm text-gray-600 max-w-[250px] truncate">
            {value}
          </div>
        ),
      },
      {
        id: "enabled",
        header: "状态",
        accessorKey: "enabled",
        cell: (value, row) => (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value}
              onCheckedChange={() => handleToggleEnabled(row.key)}
            />
            <Badge
              variant={value ? "default" : "secondary"}
              className="whitespace-nowrap"
            >
              {value ? "启用" : "禁用"}
            </Badge>
          </div>
        ),
        width: "100px",
      },
      {
        id: "actions",
        header: "操作",
        accessorKey: "id",
        cell: (_, row) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMoveUp(row)}
              disabled={row.order === 1}
              className="h-8 px-2"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMoveDown(row)}
              disabled={row.order === localPages.length}
              className="h-8 px-2"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        ),
        sortable: false,
        width: "150px",
      },
    ],
    [handleToggleEnabled, handleMoveUp, handleMoveDown, localPages.length]
  );

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">产品页面配置</h1>
          <p className="text-gray-600 mt-2">
            配置产品页面的显示状态和排序
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">加载配置时出错，请刷新页面重试。</p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            重试
          </Button>
        </div>
      </div>
    );
  }

  const enabledCount = localPages.filter((page) => page.enabled).length;

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">解决方案页面管理</h1>
          <p className="text-gray-600 mt-1">管理解决方案页面的显示状态和排序</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <EyeIcon className="h-3 w-3 mr-1" />
            {enabledCount} 个已启用
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <EyeOffIcon className="h-3 w-3 mr-1" />
            {localPages.length - enabledCount} 个已禁用
          </Badge>
        </div>
      </div>

      {/* Actions - Only show when there are changes or pages */}
      {localPages.length > 0 && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={updateMutation.isPending}
          >
            重置
          </Button>
          <Button
            className={`${hasChanges
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
          >
            {hasChanges ? "保存更改 *" : "保存配置"}
            {updateMutation.isPending && " (保存中...)"}
          </Button>
        </div>
      )}

      <DataTable
        data={localPages}
        columns={columns}
        draggable={true}
        onReorder={handleReorder}
        loading={isLoading || updateMutation.isPending}
        emptyMessage="暂无产品页面配置"
      />

      {/* Floating Save Button when changes exist */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">您有未保存的更改</span>
            <div className="flex gap-2">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                disabled={updateMutation.isPending}
              >
                重置
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                disabled={updateMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

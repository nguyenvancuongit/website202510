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
  useSolutionPagesAdmin,
  useUpdateSolutionPages,
} from "@/hooks/api/use-solution-pages";
import {
  SolutionPageItem,
  SolutionPagesConfig,
} from "@/services/solution-pages.service";
import { Column } from "@/types/data-table.types";


export default function SolutionsPage() {
  const { data: config, isLoading, error, refetch } = useSolutionPagesAdmin();
  const updateMutation = useUpdateSolutionPages();
  const [localPages, setLocalPages] = useState<SolutionPageItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when data changes
  useEffect(() => {
    if (config) {
      setLocalPages(config);
      setHasChanges(false);
    }
  }, [config]);

  const handleToggleEnabled = useCallback(
    async (pageKey: string) => {
      // Optimistically update UI
      const updatedPages = localPages.map((page) =>
        page.key === pageKey ? { ...page, enabled: !page.enabled } : page
      );
      setLocalPages(updatedPages);
      // Convert to config format and save immediately
      const configToSave: SolutionPagesConfig = {};
      updatedPages.forEach((page) => {
        const { id, key, ...pageConfig } = page;
        configToSave[key] = pageConfig;
      });

      updateMutation.mutate(configToSave, {
        onSuccess: () => {
          toast.success("页面状态已更新");
        },
        onError: () => {
          // Revert on error
          setLocalPages(localPages);
          toast.error("更新失败，请重试");
        },
      });

    },
    [localPages, updateMutation]
  );

  const handleReorder = (newData: SolutionPageItem[]) => {
    // Update order values based on new positions
    const updatedPages = newData.map((page, index) => ({
      ...page,
      order: index + 1,
    }));

    setLocalPages(updatedPages);
    setHasChanges(true);
  };

  const handleMoveUp = useCallback(
    async (page: SolutionPageItem) => {
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

        // Convert to config format and save immediately
        const configToSave: SolutionPagesConfig = {};
        updatedPages.forEach((p) => {
          const { id, key, ...pageConfig } = p;
          configToSave[key] = pageConfig;
        });

        updateMutation.mutate(configToSave, {
          onSuccess: () => {
            toast.success("页面顺序已更新");
          },
          onError: () => {
            // Revert on error
            setLocalPages(localPages);
            toast.error("更新失败，请重试");
          }
        });

      }
    },
    [localPages, updateMutation]
  );

  const handleMoveDown = useCallback(
    async (page: SolutionPageItem) => {
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

        // Convert to config format and save immediately
        const configToSave: SolutionPagesConfig = {};
        updatedPages.forEach((p) => {
          const { id, key, ...pageConfig } = p;
          configToSave[key] = pageConfig;
        });

        updateMutation.mutate(configToSave, {
          onSuccess: () => {
            toast.success("页面顺序已更新");
          },
          onError: () => {
            // Revert on error
            setLocalPages(localPages);
            toast.error("更新失败，请重试");
          }
        });

      }
    },
    [localPages, updateMutation]
  );

  const handleSave = async () => {
    // Convert back to SolutionPagesConfig format
    const configToSave: SolutionPagesConfig = {};
    localPages.forEach((page) => {
      const { id, key, ...pageConfig } = page;
      configToSave[key] = pageConfig;
    });

    updateMutation.mutate(configToSave, {
      onSuccess: () => {
        setHasChanges(false);
        toast.success("解决方案配置已更新");
      },
      onError: () => {
        toast.error("保存失败，请重试");
      }
    });
  };

  const handleReset = () => {
    if (config) {
      setLocalPages(config);
      setHasChanges(false);
    }
  };

  const columns: Column<SolutionPageItem>[] = useMemo(
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
        header: "页面名称",
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
            /solutions/{value}
          </div>
        ),
        width: "200px",
      },
      {
        id: "description",
        header: "描述",
        accessorKey: "description",
        cell: (value) => (
          <div
            className="text-sm text-gray-600 max-w-[300px] truncate"
            title={value}
          >
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
        width: "120px",
      },
      {
        id: "actions",
        header: "操作",
        accessorKey: "id",
        cell: (value, row) => {
          const currentIndex = localPages.findIndex((p) => p.id === row.id);
          const isFirst = currentIndex === 0;
          const isLast = currentIndex === localPages.length - 1;

          return (
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveUp(row)}
                disabled={isFirst || updateMutation.isPending || hasChanges}
                className="h-8 w-8 p-0"
                title="向上移动"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveDown(row)}
                disabled={isLast || updateMutation.isPending || hasChanges}
                className="h-8 w-8 p-0"
                title="向下移动"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        width: "100px",
      },
    ],
    [
      localPages,
      updateMutation.isPending,
      handleMoveDown,
      handleMoveUp,
      handleToggleEnabled,
      hasChanges
    ]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">解决方案页面管理</h1>
            <p className="text-gray-600 mt-1">
              管理解决方案页面的显示状态和排序
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">解决方案页面管理</h1>
            <p className="text-gray-600 mt-1">
              管理解决方案页面的显示状态和排序
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            重试
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">加载解决方案配置失败</p>
          <Button onClick={() => refetch()} variant="outline">
            重新加载
          </Button>
        </div>
      </div>
    );
  }

  const enabledCount = localPages.filter((page) => page.enabled).length;

  return (
    <div className="space-y-6">
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
        emptyMessage="暂无解决方案页面数据"
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

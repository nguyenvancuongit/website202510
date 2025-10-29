"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useCareerEducation,
  useUpdateCareerEducation,
} from "@/hooks/api/use-career-education";
import {
  type CareerEducationConfig,
} from "@/services/career-education.service";
import { Column } from "@/types/data-table.types";

interface CategoryRow {
  id: string;
  key: string;
  type: "category";
  enabled: boolean;
  order: number;
  name: string;
  icon?: string;
  description?: string;
}

interface ItemRow {
  id: string;
  categoryKey: string;
  type: "item";
  enabled: boolean;
  order: number;
  title: string;
  description?: string;
  bgColor?: string;
  image?: string;
  alt?: string;
}

type TableRow = CategoryRow | ItemRow;

export default function CareerEducationPage() {
  const { data: config, isLoading, error } = useCareerEducation();
  const updateMutation = useUpdateCareerEducation();
  const [localConfig, setLocalConfig] = useState<CareerEducationConfig | null>(null);

  // Update local state when data changes
  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  // Transform config to flat table rows
  const tableRows = useMemo((): TableRow[] => {
    if (!localConfig) return [];

    const rows: TableRow[] = [];
    const categoryKeys = ["platform", "device", "training", "consulting"];

    // Sort categories by order
    const sortedCategories = categoryKeys
      .filter(key => localConfig[key as keyof CareerEducationConfig])
      .sort((a, b) => {
        const catA = localConfig[a as keyof CareerEducationConfig];
        const catB = localConfig[b as keyof CareerEducationConfig];
        return catA.order - catB.order;
      });

    sortedCategories.forEach(categoryKey => {
      const category = localConfig[categoryKey as keyof CareerEducationConfig];

      // Add category row
      rows.push({
        id: categoryKey,
        key: categoryKey,
        type: "category" as const,
        ...category,
      });

      // Add item rows (sorted by order)
      const sortedItems = [...category.items].sort((a, b) => a.order - b.order);
      sortedItems.forEach(item => {
        rows.push({
          ...item,
          categoryKey,
          type: "item" as const,
        });
      });
    });

    return rows;
  }, [localConfig]);

  const handleToggleCategoryEnabled = useCallback(
    async (categoryKey: string) => {
      if (!localConfig) return;

      const updatedConfig = {
        ...localConfig,
        [categoryKey]: {
          ...localConfig[categoryKey as keyof CareerEducationConfig],
          enabled: !localConfig[categoryKey as keyof CareerEducationConfig].enabled,
        },
      };
      setLocalConfig(updatedConfig);

      try {
        await updateMutation.mutateAsync(updatedConfig);
        toast.success("类别状态已更新");
      } catch (err) {
        setLocalConfig(localConfig);
        toast.error("更新失败，请重试");
        // eslint-disable-next-line no-console
        console.error("Failed to update category status:", err);
      }
    },
    [localConfig, updateMutation]
  );

  const handleToggleItemEnabled = useCallback(
    async (categoryKey: string, itemId: string) => {
      if (!localConfig) return;

      const category = localConfig[categoryKey as keyof CareerEducationConfig];
      const updatedItems = category.items.map(item =>
        item.id === itemId ? { ...item, enabled: !item.enabled } : item
      );

      const updatedConfig = {
        ...localConfig,
        [categoryKey]: {
          ...category,
          items: updatedItems,
        },
      };
      setLocalConfig(updatedConfig);

      try {
        await updateMutation.mutateAsync(updatedConfig);
        toast.success("项目状态已更新");
      } catch (err) {
        setLocalConfig(localConfig);
        toast.error("更新失败，请重试");
        // eslint-disable-next-line no-console
        console.error("Failed to update item status:", err);
      }
    },
    [localConfig, updateMutation]
  );

  const handleMoveCategoryUp = useCallback(async (categoryKey: string) => {
    if (!localConfig) return;

    const categoryKeys = ["platform", "device", "training", "consulting"];
    const sortedCategories = categoryKeys
      .filter(key => localConfig[key as keyof CareerEducationConfig])
      .sort((a, b) => {
        const catA = localConfig[a as keyof CareerEducationConfig];
        const catB = localConfig[b as keyof CareerEducationConfig];
        return catA.order - catB.order;
      });

    const currentIndex = sortedCategories.indexOf(categoryKey);
    if (currentIndex <= 0) return;

    const prevKey = sortedCategories[currentIndex - 1];
    const currentCategory = localConfig[categoryKey as keyof CareerEducationConfig];
    const prevCategory = localConfig[prevKey as keyof CareerEducationConfig];

    const updatedConfig = {
      ...localConfig,
      [categoryKey]: { ...currentCategory, order: prevCategory.order },
      [prevKey]: { ...prevCategory, order: currentCategory.order },
    };
    setLocalConfig(updatedConfig);

    try {
      await updateMutation.mutateAsync(updatedConfig);
      toast.success("类别顺序已更新");
    } catch (err) {
      setLocalConfig(localConfig);
      toast.error("更新失败，请重试");
      // eslint-disable-next-line no-console
      console.error("Failed to update category order:", err);
    }
  }, [localConfig, updateMutation]);

  const handleMoveCategoryDown = useCallback(async (categoryKey: string) => {
    if (!localConfig) return;

    const categoryKeys = ["platform", "device", "training", "consulting"];
    const sortedCategories = categoryKeys
      .filter(key => localConfig[key as keyof CareerEducationConfig])
      .sort((a, b) => {
        const catA = localConfig[a as keyof CareerEducationConfig];
        const catB = localConfig[b as keyof CareerEducationConfig];
        return catA.order - catB.order;
      });

    const currentIndex = sortedCategories.indexOf(categoryKey);
    if (currentIndex >= sortedCategories.length - 1) return;

    const nextKey = sortedCategories[currentIndex + 1];
    const currentCategory = localConfig[categoryKey as keyof CareerEducationConfig];
    const nextCategory = localConfig[nextKey as keyof CareerEducationConfig];

    const updatedConfig = {
      ...localConfig,
      [categoryKey]: { ...currentCategory, order: nextCategory.order },
      [nextKey]: { ...nextCategory, order: currentCategory.order },
    };
    setLocalConfig(updatedConfig);

    try {
      await updateMutation.mutateAsync(updatedConfig);
      toast.success("类别顺序已更新");
    } catch (err) {
      setLocalConfig(localConfig);
      toast.error("更新失败，请重试");
      // eslint-disable-next-line no-console
      console.error("Failed to update category order:", err);
    }
  }, [localConfig, updateMutation]);

  const handleMoveItemUp = useCallback(async (categoryKey: string, itemId: string) => {
    if (!localConfig) return;

    const category = localConfig[categoryKey as keyof CareerEducationConfig];
    const sortedItems = [...category.items].sort((a, b) => a.order - b.order);
    const currentIndex = sortedItems.findIndex(item => item.id === itemId);

    if (currentIndex <= 0) return;

    const prevItem = sortedItems[currentIndex - 1];
    const currentItem = sortedItems[currentIndex];

    const updatedItems = category.items.map(item => {
      if (item.id === currentItem.id) return { ...item, order: prevItem.order };
      if (item.id === prevItem.id) return { ...item, order: currentItem.order };
      return item;
    });

    const updatedConfig = {
      ...localConfig,
      [categoryKey]: {
        ...category,
        items: updatedItems,
      },
    };
    setLocalConfig(updatedConfig);

    try {
      await updateMutation.mutateAsync(updatedConfig);
      toast.success("项目顺序已更新");
    } catch (err) {
      setLocalConfig(localConfig);
      toast.error("更新失败，请重试");
      // eslint-disable-next-line no-console
      console.error("Failed to update item order:", err);
    }
  }, [localConfig, updateMutation]);

  const handleMoveItemDown = useCallback(async (categoryKey: string, itemId: string) => {
    if (!localConfig) return;

    const category = localConfig[categoryKey as keyof CareerEducationConfig];
    const sortedItems = [...category.items].sort((a, b) => a.order - b.order);
    const currentIndex = sortedItems.findIndex(item => item.id === itemId);

    if (currentIndex >= sortedItems.length - 1) return;

    const nextItem = sortedItems[currentIndex + 1];
    const currentItem = sortedItems[currentIndex];

    const updatedItems = category.items.map(item => {
      if (item.id === currentItem.id) return { ...item, order: nextItem.order };
      if (item.id === nextItem.id) return { ...item, order: currentItem.order };
      return item;
    });

    const updatedConfig = {
      ...localConfig,
      [categoryKey]: {
        ...category,
        items: updatedItems,
      },
    };
    setLocalConfig(updatedConfig);

    try {
      await updateMutation.mutateAsync(updatedConfig);
      toast.success("项目顺序已更新");
    } catch (err) {
      setLocalConfig(localConfig);
      toast.error("更新失败，请重试");
      // eslint-disable-next-line no-console
      console.error("Failed to update item order:", err);
    }
  }, [localConfig, updateMutation]);

  const columns: Column<TableRow>[] = useMemo(
    () => [
      {
        id: "order",
        header: "序号",
        accessorKey: "order",
        cell: (value, row) => (
          <div className={`bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-mono w-fit ${row.type === "item" ? "ml-8" : ""}`}>
            #{value}
          </div>
        ),
        width: "80px",
      },
      {
        id: "name",
        header: "名称",
        accessorKey: "id",
        cell: (_, row) => {
          const value = row.type === "category" ? row.name : row.title;
          return (
            <div className={`${row.type === "category" ? "font-bold text-gray-900" : "font-medium text-gray-700 ml-8"} max-w-[300px] truncate`}>
              {row.type === "category" && "📁 "}
              {value}
            </div>
          );
        },
      },
      {
        id: "description",
        header: "描述",
        accessorKey: "description",
        cell: (value) => (
          <div className="text-sm text-gray-600 max-w-[350px] truncate">
            {value || "-"}
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
              onCheckedChange={() => {
                if (row.type === "category") {
                  handleToggleCategoryEnabled(row.key);
                } else {
                  handleToggleItemEnabled(row.categoryKey, row.id);
                }
              }}
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
        cell: (_, row) => {
          if (row.type === "category") {
            return (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveCategoryUp(row.key)}
                  disabled={row.order === 1}
                  className="h-8 px-2"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveCategoryDown(row.key)}
                  disabled={row.order === 4}
                  className="h-8 px-2"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            );
          } else {
            const category = localConfig?.[row.categoryKey as keyof CareerEducationConfig];
            const itemCount = category?.items.length || 0;
            const sortedItems = [...(category?.items || [])].sort((a, b) => a.order - b.order);
            const currentIndex = sortedItems.findIndex(item => item.id === row.id);

            return (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveItemUp(row.categoryKey, row.id)}
                  disabled={currentIndex === 0}
                  className="h-8 px-2"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveItemDown(row.categoryKey, row.id)}
                  disabled={currentIndex === itemCount - 1}
                  className="h-8 px-2"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            );
          }
        },
        sortable: false,
        width: "150px",
      },
    ],
    [
      handleToggleCategoryEnabled,
      handleToggleItemEnabled,
      handleMoveCategoryUp,
      handleMoveCategoryDown,
      handleMoveItemUp,
      handleMoveItemDown,
      localConfig,
    ]
  );

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">生涯教育产品配置</h1>
          <p className="text-gray-600 mt-2">
            配置生涯教育产品类别和项目的显示状态和排序
          </p>
        </div>

        <div className="border border-red-200 bg-red-50 p-6 rounded-lg">
          <p className="text-red-600">加载配置失败，请刷新页面重试</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 ">
        <h1 className="text-2xl font-bold text-gray-900">生涯教育产品配置</h1>
        <p className="text-gray-600 mt-2">
          配置生涯教育产品类别和项目的显示状态和排序
        </p>
      </div>

      <DataTable
        columns={columns}
        data={tableRows}
        loading={isLoading}
        draggable={false}
      />

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">说明</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 📁 表示类别，其下的项目为该类别的子项目</li>
          <li>• 切换开关会立即保存更改</li>
          <li>• 使用上下箭头可调整类别和项目的显示顺序</li>
          <li>• 禁用的类别不会在前台显示，即使其子项目是启用的</li>
          <li>• 禁用的项目不会在前台显示</li>
        </ul>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Edit,
  ExternalLink,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STATUS_VALUES } from "@/config/constants";
import {
  FriendLink,
  useToggleFriendLinkStatus,
  useUpdateFriendLinkSortOrder,
} from "@/hooks/api/use-friend-links";
import { formatDateTimeWithTZ } from "@/lib/datetime-utils";
import { cn } from "@/lib/utils";
import { Column } from "@/types/data-table.types";

interface FriendLinkListProps {
  friendLinks: FriendLink[];
  onEdit: (friendLink: FriendLink) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRefresh: () => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (limit: number) => void;
    pageSizeOptions: number[];
  };
}

export function FriendLinkList({
  friendLinks,
  onEdit,
  onDelete,
  // onToggleStatus,
  onRefresh,
  onMoveUp,
  onMoveDown,
  isLoading = false,
  pagination,
}: FriendLinkListProps) {
  const [localFriendLinks, setLocalFriendLinks] =
    useState<FriendLink[]>(friendLinks);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSortOrderMutation = useUpdateFriendLinkSortOrder();
  const toggleStatusMutation = useToggleFriendLinkStatus();

  // Update local state when props change
  useEffect(() => {
    setLocalFriendLinks(friendLinks);
    setHasChanges(false);
  }, [friendLinks]);

  const viewLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleReorder = (newData: FriendLink[]) => {
    setLocalFriendLinks(newData);
    setHasChanges(true);
  };

  const saveOrder = async () => {
    if (!hasChanges) {
      return;
    }

    // Create order array with new sort_order values
    const orderUpdates = localFriendLinks.map((friendLink, index) => ({
      id: friendLink.id,
      sort_order: index + 1,
    }));

    updateSortOrderMutation.mutate(orderUpdates, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const handleResetSortOrder = () => {
    setLocalFriendLinks(friendLinks);
    setHasChanges(false);
    onRefresh();
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const columns: Column<FriendLink>[] = [
    {
      id: "sort_order",
      header: "序号",
      accessorKey: "sort_order",
      cell: (value) => (
        <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-mono w-fit">
          #{value}
        </div>
      ),
      width: "60px",
    },
    {
      id: "name",
      header: "链接名称",
      accessorKey: "name",
      cell: (value) => <div className="font-medium">{value}</div>,
    },
    {
      id: "url",
      header: "跳转链接",
      accessorKey: "url",
      cell: (value) => (
        <button
          onClick={() => viewLink(value)}
          className="text-sm text-blue-600 hover:text-blue-800 truncate cursor-pointer inline-flex items-center space-x-1 max-w-full"
          title="点击访问链接"
        >
          <span className="truncate max-w-[200px]">{value}</span>
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </button>
      ),
    },
    {
      id: "updated_at",
      header: "更新时间",
      accessorKey: "updated_at",
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
        <div className="flex items-center space-x-2">
          <Switch
            checked={value === STATUS_VALUES.ENABLED}
            onCheckedChange={() => handleToggleStatus(row.id)}
            disabled={toggleStatusMutation.isPending}
            className="data-[state=checked]:bg-blue-600"
          />
          <Badge
            variant={value === STATUS_VALUES.ENABLED ? "default" : "secondary"}
          >
            {value === STATUS_VALUES.ENABLED ? "启用" : "禁用"}
          </Badge>
        </div>
      ),
      width: "120px",
    },
    {
      id: "operator",
      header: "操作者",
      accessorKey: "created_at",
      cell: () => <div className="text-sm text-gray-600">系统</div>,
      width: "100px",
    },
    {
      id: "actions",
      header: "操作",
      accessorKey: "id",
      cell: (value, row) => {
        const currentIndex = localFriendLinks.findIndex(
          (item) => item.id === row.id
        );
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === localFriendLinks.length - 1;

        return (
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit({ ...row, id: row.id })}
                    className="h-8 w-8 p-0 ml-1"
                    title="编辑"
                    disabled={row.status === STATUS_VALUES.ENABLED}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === STATUS_VALUES.ENABLED
                  ? "处于已发布状态时无法编辑"
                  : "编辑"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(row.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="删除"
                    disabled={row.status === STATUS_VALUES.ENABLED}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === STATUS_VALUES.ENABLED
                  ? "处于已发布状态时无法删除"
                  : "删除"}
              </TooltipContent>
            </Tooltip>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveUp?.(row.id)}
              disabled={
                isFirst || updateSortOrderMutation.isPending || hasChanges
              }
              className="p-0"
              title="向上移动"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveDown?.(row.id)}
              disabled={
                isLast || updateSortOrderMutation.isPending || hasChanges
              }
              className="p-0"
              title="向下移动"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      width: "160px",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Actions - Only show when there are friendLinks */}
      {localFriendLinks.length > 0 && (
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={handleResetSortOrder}
            disabled={isLoading || updateSortOrderMutation.isPending}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("size-4", { "animate-spin": isLoading })} />
            {isLoading ? "刷新中..." : "刷新"}
          </Button>
          <Button
            className={cn(
              hasChanges
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            )}
            onClick={saveOrder}
            disabled={!hasChanges || updateSortOrderMutation.isPending}
          >
            {updateSortOrderMutation.isPending
              ? "保存中..."
              : hasChanges
                ? "保存拖拽排序 *"
                : "保存拖拽排序"}
          </Button>
        </div>
      )}

      <DataTable
        data={localFriendLinks}
        columns={columns}
        draggable={true}
        onReorder={handleReorder}
        loading={isLoading || updateSortOrderMutation.isPending}
        emptyMessage="暂无友情链接数据"
        pagination={pagination}
      />
    </div>
  );
}

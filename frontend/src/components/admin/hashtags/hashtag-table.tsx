"use client";

import { format } from "date-fns";
import { Edit, Hash, MoreHorizontal, Trash2 } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationProps } from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { HASHTAG_STATUS_VALUES } from "@/config/constants";
import { formatDateWithFallback } from "@/lib/datetime-utils";
import { Hashtag } from "@/services/api";
import { Column } from "@/types/data-table.types";

interface HashtagTableProps {
  hashtags: Hashtag[];
  loading: boolean;
  onStatusUpdate: (hashtagId: string, newStatus: number) => void;
  onEdit: (hashtag: Hashtag) => void;
  onDelete: (hashtagId: string) => void;
  pagination?: PaginationProps;
}

export default function HashtagTable({
  hashtags,
  loading,
  onStatusUpdate,
  onEdit,
  onDelete,
  pagination,
}: HashtagTableProps) {
  const columns: Column<Hashtag>[] = [
    {
      id: "name",
      header: "标签名称",
      accessorKey: "name",
      cell: (value) => (
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      id: "usageCount",
      header: "使用次数",
      accessorKey: "usageCount",
      cell: (value) => (
        <span className="text-sm font-medium">{value || 0}</span>
      ),
    },
    {
      id: "created_at",
      header: "创建时间",
      accessorKey: "created_at",
      cell: (value) =>
        formatDateWithFallback(value || "", (date) =>
          format(date, "yyyy-MM-dd HH:mm")
        ),
    },
    {
      id: "updated_at",
      header: "更新时间",
      accessorKey: "updated_at",
      sortable: true,
      cell: (value) =>
        formatDateWithFallback(value || "", (date) =>
          format(date, "yyyy-MM-dd HH:mm")
        ),
    },
    {
      id: "status",
      header: "状态",
      accessorKey: "status",
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <Switch
            checked={value === HASHTAG_STATUS_VALUES.ACTIVE}
            onCheckedChange={(checked) =>
              onStatusUpdate(
                row.id,
                checked
                  ? HASHTAG_STATUS_VALUES.ACTIVE
                  : HASHTAG_STATUS_VALUES.DISABLED
              )
            }
          />
          <span className="text-sm text-gray-500">
            {value === HASHTAG_STATUS_VALUES.ACTIVE ? "启用" : "禁用"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "操作",
      accessorKey: "id",
      width: "100px",
      cell: (value, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(value)}
              className="text-red-600"
              disabled={(row.usageCount || 0) > 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除
              {(row.usageCount || 0) > 0 && (
                <span className="ml-1 text-xs">(使用中)</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={hashtags}
      columns={columns}
      loading={loading}
      emptyMessage="暂无标签数据"
      draggable={false}
      pagination={pagination}
    />
  );
}

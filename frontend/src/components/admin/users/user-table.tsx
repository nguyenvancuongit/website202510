"use client";

import { useMemo, useState } from "react";
import { Edit2, RotateCcw, Search, Trash2 } from "lucide-react";
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
import { USER_MANAGEMENT } from "@/config/constants";
import { useGlobalDialog } from "@/contexts/dialog-context";
import {
  useDeleteUser,
  User,
  useResetPassword,
  UsersFilter,
  useUsers,
} from "@/hooks/api/use-users";
import { formatDateTimeWithTZ } from "@/lib/datetime-utils";
import { Column } from "@/types/data-table.types";

interface UserTableProps {
  onCreateUser?: () => void;
}

export function UserTable({ onCreateUser }: UserTableProps) {
  const router = useRouter();
  const dialog = useGlobalDialog();

  const [query, setQuery] = useState<UsersFilter>({
    page: 1,
    page_size: USER_MANAGEMENT.PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const [filterInputs, setFilterInputs] = useState({
    username: "",
    phone: "",
    status: "all",
  });

  const { data: usersData, isLoading } = useUsers(query);
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetPassword();

  const users = usersData?.data || [];
  const pagination = usersData?.pagination;

  const handleEdit = (userId: string) => {
    router.push(`/users/${userId}/edit`);
  };

  const handleDelete = async (userId: string) => {
    const confirmed = await dialog.confirm({
      title: "确认删除用户",
      message: "删除用户后，该用户将无法再登录系统，且该操作不可恢复。请确认是否继续？",
      confirmText: "确认",
      cancelText: "取消",
      variant: "destructive"
    });

    if (!confirmed) {
      return;
    }
    deleteUserMutation.mutate(userId);
  }

  const handleResetPassword = async (userId: string, username: string) => {
    const confirmed = await dialog.confirm({
      title: "确认重置密码",
      message: `重置用户 ${username} 的密码后，用户需要使用默认密码 vian2025 登录并修改密码。请确认是否继续？`,
      confirmText: "确认",
      cancelText: "取消",
    });

    if (!confirmed) {
      return;
    }
    resetPasswordMutation.mutate(userId);

  };

  const handleFilterChange = (key: keyof typeof filterInputs, value: any) => {
    setFilterInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilter = () => {
    setQuery((prev) => ({
      ...prev,
      username: filterInputs.username || undefined,
      phone: filterInputs.phone || undefined,
      status:
        filterInputs.status === "all"
          ? undefined
          : (filterInputs.status as "active" | "disabled"),
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleResetFilter = () => {
    setFilterInputs({
      username: "",
      phone: "",
      status: "all",
    });
    setQuery({
      page: 1,
      page_size: USER_MANAGEMENT.PAGINATION.DEFAULT_PAGE_SIZE,
    });
  };

  const columns: Column<User>[] = useMemo(
    () => [
      {
        id: "username",
        header: "用户名称",
        accessorKey: "username",
        cell: (value) => <div className="font-medium">{value}</div>,
        width: "120px",
      },
      {
        id: "phone",
        header: "手机号",
        accessorKey: "phone",
        cell: (value) => <span>{value || "-"}</span>,
        width: "120px",
      },
      {
        id: "permissions",
        header: "用户权限",
        accessorKey: "permissions",
        cell: (value) => (
          <div className="flex flex-wrap gap-1 max-w-full">
            {value?.length ? (
              value.map((permission: string) => (
                <Badge
                  key={permission}
                  variant="outline"
                  className="text-xs whitespace-nowrap"
                >
                  {permission}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">无权限</span>
            )}
          </div>
        ),
      },
      {
        id: "status",
        header: "用户状态",
        accessorKey: "status",
        cell: (value) => (
          <Badge
            variant={
              value === USER_MANAGEMENT.STATUS.ACTIVE
                ? "default"
                : "secondary"
            }
          >
            {
              USER_MANAGEMENT.STATUS_LABELS[
              value as keyof typeof USER_MANAGEMENT.STATUS_LABELS
              ]
            }
          </Badge>
        ),
        width: "100px",
      },
      {
        id: "updated_at",
        header: "更新时间",
        accessorKey: "updated_at",
        cell: (value) => (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {formatDateTimeWithTZ(value)}
          </span>
        ),
        width: "160px",
      },
      {
        id: "operator",
        header: "操作者",
        accessorKey: "username",
        cell: (value) => <span className="text-sm text-gray-600">{value}</span>,
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(row.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>编辑</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetPassword(row.id, row.username)}
                  disabled={resetPasswordMutation.isPending}
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>重置密码</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(row.id)}
                  disabled={deleteUserMutation.isPending}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>删除</TooltipContent>
            </Tooltip>
          </div>
        ),
        width: "140px",
      },
    ],
    [resetPasswordMutation.isPending, deleteUserMutation.isPending]
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索用户名"
            value={filterInputs.username}
            onChange={(e) => handleFilterChange("username", e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索电话"
            value={filterInputs.phone}
            onChange={(e) => handleFilterChange("phone", e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={filterInputs.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              {USER_MANAGEMENT.FILTER_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleApplyFilter} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            搜索
          </Button>
          <Button
            onClick={handleResetFilter}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
        </div>
      </div>

      {onCreateUser && (
        <div className="flex justify-end">
          <Button onClick={onCreateUser}>新增用户</Button>
        </div>
      )}

      {/* DataTable */}
      <DataTable
        data={users}
        columns={columns}
        loading={isLoading}
        emptyMessage="暂无用户数据"
        draggable={false}
        pagination={{
          page: pagination?.page || 1,
          totalPages: pagination?.total_pages || 0,
          total: pagination?.total || 0,
          limit: pagination?.page_size || 10,
          onPageChange: (page) => setQuery((prev) => ({ ...prev, page })),
          onPageSizeChange: (limit) =>
            setQuery((prev) => ({ ...prev, page_size: limit, page: 1 })),
          pageSizeOptions: [10, 20, 50, 100],
        }}
      />
    </div>
  );
}

"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { format } from "date-fns";
import { Edit, RotateCcw, Search, Trash2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalDialog } from "@/contexts/dialog-context";
import {
  RecruitmentPostType,
  RecruitmentPostTypesQuery,
  RecruitmentPostTypeStatus,
  useDeleteRecruitmentPostType,
  useRecruitmentPostTypes,
  useToggleRecruitmentPostTypeStatus,
} from "@/hooks/api/use-recruitment-post-types";
import { formatDateWithFallback } from "@/lib/datetime-utils";
import { Column } from "@/types/data-table.types";

import { RecruitmentPostTypeFormDialog } from "./recruitment-post-type-form-dialog";

export interface RecruitmentPostTypesTableRef {
  handleCreate: () => void;
}

export const RecruitmentPostTypesTable = forwardRef<RecruitmentPostTypesTableRef>((_, ref) => {
  const [selectedItem, setSelectedItem] = useState<RecruitmentPostType | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Separate filters for UI and query
  const [uiFilters, setUiFilters] = useState({
    search: "",
    status: "",
  });

  // Filters for actual API query
  const [filters, setFilters] = useState<RecruitmentPostTypesQuery>({
    page: 1,
    limit: 10,
  });

  const { data: response, isLoading } = useRecruitmentPostTypes(filters);
  const deleteRecruitmentPostType = useDeleteRecruitmentPostType();
  const toggleStatus = useToggleRecruitmentPostTypeStatus();
  const dialog = useGlobalDialog();

  useImperativeHandle(ref, () => ({
    handleCreate: () => {
      setSelectedItem(null);
      setShowForm(true);
    },
  }));

  const handleEdit = (item: RecruitmentPostType) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item: RecruitmentPostType) => {
    const confirmed = await dialog.confirm({
      title: "确认删除",
      message: `确定要删除职位类型"${item.name}"吗？此操作不可撤销。`,
      confirmText: "删除",
      variant: "destructive",
    });

    if (confirmed) {
      deleteRecruitmentPostType.mutate(item.id);
    }
  };

  const handleToggleStatus = async (item: RecruitmentPostType) => {
    const newStatus = item.status === RecruitmentPostTypeStatus.ENABLED
      ? RecruitmentPostTypeStatus.DISABLED
      : RecruitmentPostTypeStatus.ENABLED;

    const statusText = newStatus === RecruitmentPostTypeStatus.ENABLED ? "启用" : "禁用";

    const confirmed = await dialog.confirm({
      title: "状态变更确认",
      message: `确定要${statusText}职位类型"${item.name}"吗？`,
      confirmText: statusText,
      variant: newStatus === RecruitmentPostTypeStatus.DISABLED ? "destructive" : "default",
      showCancel: true,
    });

    if (!confirmed) return;

    toggleStatus.mutate({
      id: item.id,
      status: newStatus,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setUiFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: uiFilters.search || undefined,
      status: (uiFilters.status as RecruitmentPostTypeStatus) || undefined,
      page: 1,
    }));
  };

  const handleReset = () => {
    setUiFilters({
      search: "",
      status: "",
    });
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  const getStatusBadge = (item: RecruitmentPostType) => {
    const variants = {
      [RecruitmentPostTypeStatus.ENABLED]: { variant: "default" as const, label: "启用" },
      [RecruitmentPostTypeStatus.DISABLED]: { variant: "secondary" as const, label: "禁用" },
    };

    const config = variants[item.status];
    return (
      <div className="flex items-center gap-1">
        <Switch
          checked={item.status === RecruitmentPostTypeStatus.ENABLED}
          onCheckedChange={() => handleToggleStatus(item)}
        />
        <Badge variant={config.variant}>
          {config.label}
        </Badge>
      </div>
    );
  };

  const columns: Column<RecruitmentPostType>[] = useMemo(
    () => [
      {
        id: "index",
        header: "序号",
        accessorKey: "id",
        cell: (value, row) => {
          const index = response?.data?.findIndex(item => item.id === row.id) || 0;
          return (
            <div className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 10) + index + 1}</div>
          );
        },
        width: "80px",
      },
      {
        id: "name",
        header: "类型名称",
        accessorKey: "name",
        cell: (value) => (
          <div className="font-medium">{value}</div>
        ),
      },
      {
        id: "recruitment_posts_count",
        header: "关联岗位数量",
        accessorKey: "_count",
        cell: (value) => (
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
            {value?.recruitment_posts || 0}
          </span>
        ),
        width: "120px",
      },
      {
        id: "status",
        header: "状态",
        accessorKey: "status",
        cell: (value, row) => getStatusBadge(row),
        width: "200px",
      },
      {
        id: "updated_at",
        header: "更新时间",
        accessorKey: "updated_at",
        cell: (value) => (
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {formatDateWithFallback(value, (date) => format(date, "yyyy-MM-dd HH:mm:ss"))}
          </div>
        ),
        width: "180px",
      },
      {
        id: "updated_by",
        header: "操作者",
        accessorKey: "updated_by_user",
        cell: (value, row) => (
          <div className="text-sm">
            {value?.username || row.created_by_user?.username || "-"}
          </div>
        ),
        width: "100px",
      },
      {
        id: "actions",
        header: "操作",
        accessorKey: "id",
        cell: (_, row) => (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(row)}
                    className="h-8 w-8 p-0"
                    disabled={row.status === RecruitmentPostTypeStatus.ENABLED}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === RecruitmentPostTypeStatus.ENABLED ? "启用状态下不可编辑" : "编辑"}
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
                    disabled={row.status === RecruitmentPostTypeStatus.ENABLED}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.status === RecruitmentPostTypeStatus.ENABLED ? "启用状态下不可删除" : "删除"}
              </TooltipContent>
            </Tooltip>
          </div>
        ),
        width: "140px",
      },
    ],
    [filters.page, filters.limit, response?.data, deleteRecruitmentPostType.isPending, toggleStatus.isPending]
  );

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            className="w-full"
            placeholder="类型名称"
            value={uiFilters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          <Select
            value={uiFilters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value={RecruitmentPostTypeStatus.ENABLED}>启用</SelectItem>
              <SelectItem value={RecruitmentPostTypeStatus.DISABLED}>禁用</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2 md:col-span-2">
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

        <DataTable
          data={response?.data || []}
          columns={columns}
          draggable={false}
          loading={isLoading || deleteRecruitmentPostType.isPending || toggleStatus.isPending}
          emptyMessage="暂无职位类型数据"
          pagination={{
            page: response?.page || 1,
            limit: response?.limit || 10,
            total: response?.total || 0,
            totalPages: Math.ceil((response?.total || 0) / (response?.limit || 10)),
            onPageChange: (newPage) => {
              setFilters(prev => ({ ...prev, page: newPage }));
            },
            onPageSizeChange: (newLimit) => {
              setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
            },
            pageSizeOptions: [10, 20, 50],
            itemsName: "个职位类型",
          }}
        />
      </div>

      <RecruitmentPostTypeFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        recruitmentPostType={selectedItem}
        mode={selectedItem ? "edit" : "create"}
      />
    </>
  );
});

RecruitmentPostTypesTable.displayName = "RecruitmentPostTypesTable";
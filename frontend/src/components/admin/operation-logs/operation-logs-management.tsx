"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Download, Eye, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";

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
  MODULE_TYPE_LABELS,
  OPERATION_STATUS_CONFIG,
} from "@/config/constants";
import { useGlobalDialog } from "@/contexts/dialog-context";
import {
  exportOperationLogs,
  type GetOperationLogsParams,
  type OperationLog,
  useOperationLogs,
} from "@/hooks/api";
import { Column, SortConfig } from "@/types/data-table.types";

import { OperationLogDetailModal } from "./operation-log-detail-modal";

export function OperationLogsManagement() {
  const dialog = useGlobalDialog();

  const [query, setQuery] = useState<GetOperationLogsParams>({
    page: 1,
    limit: 20,
    username: "",
    phone_number: "",
    module: "",
    operation_type: "",
    status: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Separate filters state that doesn't trigger API calls
  const [filters, setFilters] = useState({
    username: "",
    phone_number: "",
    module: "",
    status: "",
  });

  const { data, isLoading } = useOperationLogs(query);

  // Modal state
  const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal handlers
  const handleRowClick = (log: OperationLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const handleSearch = () => {
    setQuery((prev: GetOperationLogsParams) => ({
      ...prev,
      page: 1,
      username: filters.username || "",
      phone_number: filters.phone_number || "",
      module: filters.module || "",
      status: filters.status || "",
    }));
  };

  const handleReset = () => {
    setFilters({
      username: "",
      phone_number: "",
      module: "",
      status: "",
    });
    setQuery({
      page: 1,
      limit: 20,
      username: "",
      phone_number: "",
      module: "",
      operation_type: "",
      status: "",
      sort_by: "created_at",
      sort_order: "desc",
    });
  };

  const handleSortChange = (sortConfig: SortConfig | null) => {
    if (!sortConfig) return
    setQuery((prev: GetOperationLogsParams) => ({
      ...prev,
      sort_by: sortConfig.key,
      sort_order: sortConfig.direction,
    }));
  }

  const handleExport = async () => {
    const confirmed = await dialog.confirm({
      title: "确认导出",
      message: "您确定要导出当前筛选条件下的操作日志吗？导出可能需要一些时间。",
      confirmText: "导出",
    });

    if (confirmed) {
      try {
        toast.info("正在准备导出文件...");

        // Use current query filters for export (excluding pagination)
        const exportParams = {
          username: query.username,
          phone_number: query.phone_number,
          module: query.module,
          operation_type: query.operation_type,
          status: query.status,
          sort_by: query.sort_by,
          sort_order: query.sort_order,
        };

        await exportOperationLogs(exportParams);
        toast.success("操作日志已成功导出！");
      } catch (error) {
        toast.error("导出失败，请稍后重试。");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const config =
      OPERATION_STATUS_CONFIG[status as keyof typeof OPERATION_STATUS_CONFIG];
    if (!config) { return <span className="text-sm text-gray-600">{status}</span>; }

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const columns: Column<OperationLog>[] = useMemo(
    () => [
      {
        id: "operation_desc",
        header: "操作内容",
        accessorKey: "operation_desc",
        cell: (value) => (
          <div
            className="max-w-xs text-sm text-gray-900 truncate"
            title={value}
          >
            {value || "-"}
          </div>
        ),
      },
      {
        id: "module",
        header: "系统模块",
        accessorKey: "module",
        cell: (value) => (
          <span className="text-sm text-gray-600">
            {MODULE_TYPE_LABELS[value as keyof typeof MODULE_TYPE_LABELS] ||
              value}
          </span>
        ),
        width: "140px",
      },
      {
        id: "user",
        header: "用户名称",
        accessorKey: "user",
        cell: (value) => (
          <span className="text-sm text-gray-600">
            {value?.username || "-"}
          </span>
        ),
        width: "120px",
      },
      {
        id: "phone",
        header: "手机号",
        accessorKey: "user",
        cell: (value) => (
          <span className="text-sm text-gray-600 font-mono">
            {value?.phone || "-"}
          </span>
        ),
        width: "120px",
      },
      {
        id: "status",
        header: "操作结果",
        accessorKey: "status",
        cell: (value) => (
          <div className="flex justify-center">{getStatusBadge(value)}</div>
        ),
        width: "100px",
      },
      {
        id: "created_at",
        header: "操作时间",
        accessorKey: "created_at",
        sortable: true,
        cell: (value) => <span className="text-sm text-gray-600 whitespace-nowrap">
          {format(value, "yyyy-MM-dd HH:mm:ss", { locale: zhCN })}
        </span>,
        width: "160px",
      },
      {
        id: "actions",
        header: "操作",
        accessorKey: "id",
        cell: (value, row) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(row);
              }}
              className="h-8 w-8 p-0 hover:bg-blue-50"
              title="查看详情"
            >
              <Eye className="h-4 w-4 text-blue-600" />
            </Button>
          </div>
        ),
        width: "80px",
      },
    ],
    []
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">操作日志管理</h1>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            导出日志
          </Button>
        </div>
      </div>

      {/* Search filters */}
      <div className="bg-white rounded-lg mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter inputs - responsive layout */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <Input
                placeholder="用户名称"
                value={filters.username}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="h-10"
              />
            </div>
            <div>
              <Input
                placeholder="手机号"
                value={filters.phone_number}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    phone_number: e.target.value,
                  }))
                }
                className="h-10"
              />
            </div>
            <div>
              <Select
                value={filters.module || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    module: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="w-full" style={{ height: "100%" }}>
                  <SelectValue placeholder="全部模块" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部模块</SelectItem>
                  {Object.entries(MODULE_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="w-full" style={{ height: "100%" }}>
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {Object.entries(OPERATION_STATUS_CONFIG).map(
                    ([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 lg:flex-shrink-0">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="h-10 px-6"
            >
              <Search className="h-4 w-4 mr-2" />
              搜索
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-10 px-4"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        draggable={false}
        serverSide={true}
        pagination={{
          page: data?.pagination?.page || 1,
          limit: data?.pagination?.limit || 20,
          total: data?.pagination?.total || 0,
          totalPages: data?.pagination?.total_pages || 1,
          onPageChange: (page: number) =>
            setQuery((prev: GetOperationLogsParams) => ({ ...prev, page })),
          onPageSizeChange: (limit: number) =>
            setQuery((prev: GetOperationLogsParams) => ({
              ...prev,
              limit,
              page: 1,
            })),
          pageSizeOptions: [10, 20, 50, 100],
          itemsName: "条记录",
        }}
        sortConfig={{
          direction: query.sort_order || "desc",
          key: query.sort_by || "created_at",
        }}
        onSort={handleSortChange}
      />

      {/* Detail Modal */}
      {selectedLog && (
        <OperationLogDetailModal
          log={selectedLog}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

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
import { useGlobalDialog } from "@/contexts/dialog-context";
import { useRecruitmentPosts } from "@/hooks/api/use-recruitment-posts";
import {
  downloadResume,
  exportApplications,
  ResumeApplication,
  ResumeApplicationsQuery,
  useResumeApplications,
} from "@/hooks/api/use-resume-applications";
import { formatDateTimeWithTZ } from "@/lib/datetime-utils";
import { Column } from "@/types/data-table.types";

export interface ResumeApplicationsTableRef {
  handleExport: () => void;
}

export const ResumeApplicationsTable = forwardRef<ResumeApplicationsTableRef>((_, ref) => {
  const dialog = useGlobalDialog();

  // Separate filters for UI and query
  const [uiFilters, setUiFilters] = useState({
    search: "",
    recruitment_post_id: "",
  });

  // Filters for actual API query
  const [filters, setFilters] = useState<ResumeApplicationsQuery>({
    page: 1,
    limit: 10,
  });

  // Hooks
  const { data: applicationsResponse, isLoading } = useResumeApplications(filters);
  const { data: recruitmentPostsResponse } = useRecruitmentPosts({ limit: 100 });

  useImperativeHandle(ref, () => ({
    handleExport: () => {
      exportApplications();
    },
  }));

  const handleDownload = (application: ResumeApplication) => {
    if (!application.resume_file_name) {
      dialog.alert({
        title: "下载失败",
        message: "简历文件不存在",
      });
      return;
    }

    downloadResume(application.id, application.resume_file_name);
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
      recruitment_post_id: uiFilters.recruitment_post_id || undefined,
      page: 1,
    }));
  };

  const handleReset = () => {
    setUiFilters({
      search: "",
      recruitment_post_id: "",
    });
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  const columns: Column<ResumeApplication>[] = useMemo(
    () => [
      {
        id: "recruitment_post",
        header: "投递职位",
        accessorKey: "recruitment_post",
        cell: (value) => (
          <div className="max-w-[200px]">
            <div className="font-medium truncate">{value?.job_title}</div>
            <div className="text-xs text-muted-foreground">{value?.recruitment_post_type?.name}</div>
          </div>
        ),
      },
      {
        id: "recruitment_post_id",
        header: "职位ID",
        accessorKey: "recruitment_post",
        cell: (value) => (
          <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-mono w-fit">
            {value?.id}
          </div>
        ),
        width: "100px",
      },
      {
        id: "created_at",
        header: "投递时间",
        accessorKey: "created_at",
        cell: (value) => (
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {value
              ? formatDateTimeWithTZ(value)
              : "未知日期"}
          </div>
        ),
        width: "160px",
      },
      {
        id: "ip_address",
        header: "IP地址",
        accessorKey: "ip_address",
        cell: (value) => (
          <div className="text-sm text-gray-600 font-mono whitespace-nowrap">
            {value || "-"}
          </div>
        ),
        width: "140px",
      },
      {
        id: "resume_file_name",
        header: "简历文件",
        accessorKey: "resume_file_name",
        cell: (value) => (
          <div className="text-sm max-w-[300px]">
            {value ? (
              <span className="truncate block" title={value}>
                {value}
              </span>
            ) : (
              <Badge variant="secondary" className="text-xs">
                无附件
              </Badge>
            )}
          </div>
        ),
        width: "10px",
      },
      {
        id: "actions",
        header: "操作",
        accessorKey: "id", // Use a valid key but ignore it in cell renderer
        cell: (_, row) => (
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(row)}
                  disabled={!row.resume_file_name}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>下载简历</TooltipContent>
            </Tooltip>
          </div>
        ),
        width: "120px",
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="搜索简历文件名或职位名称..."
            value={uiFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="max-w-sm"
          />

          <Select
            value={uiFilters.recruitment_post_id || "all"}
            onValueChange={(value) => handleFilterChange("recruitment_post_id", value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="全部职位" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部职位</SelectItem>
              {recruitmentPostsResponse?.data?.map((post) => (
                <SelectItem key={post.id} value={post.id}>
                  {post.job_title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch} variant="default">
            <Search className="h-4 w-4 mr-2" />
            搜索
          </Button>

          <Button onClick={handleReset} variant="outline">
            重置
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={applicationsResponse?.data || []}
        columns={columns}
        loading={isLoading}
        emptyMessage="暂无简历申请数据"
        draggable={false}
        pagination={{
          page: applicationsResponse?.pagination?.page || 1,
          limit: applicationsResponse?.pagination?.limit || 10,
          total: applicationsResponse?.pagination?.total || 0,
          totalPages: Math.ceil((applicationsResponse?.pagination?.total || 0) / (applicationsResponse?.pagination?.limit || 10)),
          onPageChange: (newPage) => {
            setFilters(prev => ({ ...prev, page: newPage }));
          },
          onPageSizeChange: (newLimit) => {
            setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
          },
          pageSizeOptions: [10, 20, 50],
          itemsName: "个简历申请",
        }}
      />
    </div>
  );
});

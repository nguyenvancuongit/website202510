"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Edit2, RotateCcw, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import PublishIcon from "@/assets/icons/publish-icon";
import UnPublishIcon from "@/assets/icons/unpublish-icon";
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
import { useRecruitmentPostTypes } from "@/hooks/api/use-recruitment-post-types";
import {
  JobType,
  RecruitmentPost,
  RecruitmentPostsQuery,
  RecruitmentPostStatus,
  useDeleteRecruitmentPost,
  useRecruitmentPosts,
  useUpdateRecruitmentPostStatus,
} from "@/hooks/api/use-recruitment-posts";
import { formatDateTimeWithTZ } from "@/lib/datetime-utils";
import { Column } from "@/types/data-table.types";

export interface RecruitmentPostsTableRef {
  handleCreate: () => void;
}

export const RecruitmentPostsTable = forwardRef<RecruitmentPostsTableRef>(
  (_, ref) => {
    const router = useRouter();
    const dialog = useGlobalDialog();

    // Separate filters for UI and query
    const [uiFilters, setUiFilters] = useState({
      job_title: "",
      recruitment_post_type_id: "",
      job_type: "",
      status: "",
    });

    // Filters for actual API query
    const [filters, setFilters] = useState<RecruitmentPostsQuery>({
      page: 1,
      limit: 10,
    });

    // Hooks
    const { data: recruitmentPostTypesResponse } = useRecruitmentPostTypes({
      limit: 100,
    });
    const { data: postsResponse, isLoading } = useRecruitmentPosts(filters);
    const deleteMutation = useDeleteRecruitmentPost();
    const updateStatusMutation = useUpdateRecruitmentPostStatus();

    useImperativeHandle(ref, () => ({
      handleCreate: () => {
        router.push("/recruitment/posts/create");
      },
    }));

    const handleEdit = (post: RecruitmentPost) => {
      router.push(`/recruitment/posts/edit/${post.id}`);
    };

    const handleDelete = async (post: RecruitmentPost) => {
      const confirmed = await dialog.confirm({
        title: "删除确认",
        message: `确定要删除职位"${post.job_title}"吗？此操作不可撤销。`,
        confirmText: "删除",
        variant: "destructive",
        showCancel: true,
      });

      if (!confirmed) return;

      deleteMutation.mutate(post.id);
    };

    const handleStatusChange = async (
      post: RecruitmentPost,
      newStatus: RecruitmentPostStatus
    ) => {
      const statusText =
        newStatus === RecruitmentPostStatus.PUBLISHED
          ? "发布"
          : newStatus === RecruitmentPostStatus.UNPUBLISHED
            ? "下架"
            : "设为草稿";

      const confirmed = await dialog.confirm({
        title: "状态变更确认",
        message: `确定要${statusText}职位"${post.job_title}"吗？`,
        confirmText: statusText,
        variant:
          newStatus === RecruitmentPostStatus.UNPUBLISHED
            ? "destructive"
            : "default",
        showCancel: true,
      });

      if (!confirmed) return;

      updateStatusMutation.mutate({
        id: post.id,
        status: newStatus,
      });
    };

    const handleFilterChange = (key: string, value: string) => {
      setUiFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    const handleSearch = () => {
      setFilters((prev) => ({
        ...prev,
        job_title: uiFilters.job_title || undefined,
        recruitment_post_type_id:
          uiFilters.recruitment_post_type_id || undefined,
        job_type: (uiFilters.job_type as JobType) || undefined,
        status: (uiFilters.status as RecruitmentPostStatus) || undefined,
        page: 1,
      }));
    };

    const handleReset = () => {
      setUiFilters({
        job_title: "",
        recruitment_post_type_id: "",
        job_type: "",
        status: "",
      });
      setFilters({
        page: 1,
        limit: 10,
      });
    };

    const getStatusBadge = (status: RecruitmentPostStatus) => {
      switch (status) {
        case RecruitmentPostStatus.PUBLISHED:
          return (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              已发布
            </Badge>
          );
        case RecruitmentPostStatus.DRAFT:
          return <Badge variant="secondary">草稿</Badge>;
        case RecruitmentPostStatus.UNPUBLISHED:
          return (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              已下架
            </Badge>
          );
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    };

    const getJobTypeBadge = (jobType: JobType) => {
      switch (jobType) {
        case JobType.FULL_TIME:
          return <Badge variant="outline">全职</Badge>;
        case JobType.INTERNSHIP:
          return (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              实习
            </Badge>
          );
        default:
          return <Badge variant="outline">{jobType}</Badge>;
      }
    };

    const columns: Column<RecruitmentPost>[] = useMemo(
      () => [
        {
          id: "id",
          header: "职位ID\n(系统自动顺序生成)",
          accessorKey: "id",
          cell: (value) => (
            <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-mono w-fit">
              {value}
            </div>
          ),
          width: "120px",
        },
        {
          id: "job_title",
          header: "职位名称",
          accessorKey: "job_title",
          cell: (value) => (
            <div className="font-medium max-w-[200px] truncate">{value}</div>
          ),
        },
        {
          id: "job_type",
          header: "职位类型",
          accessorKey: "recruitment_post_type",
          cell: (value) => (
            <div className="text-sm">{value?.name || "未分类"}</div>
          ),
          width: "120px",
        },
        {
          id: "job_nature",
          header: "职位性质",
          accessorKey: "job_type",
          cell: (value) => getJobTypeBadge(value),
          width: "100px",
        },
        {
          id: "status",
          header: "职位状态",
          accessorKey: "status",
          cell: (value) => getStatusBadge(value),
          width: "100px",
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
          id: "updated_by",
          header: "更新人",
          accessorKey: "updated_by_user",
          cell: (value) => (
            <div className="text-sm">{value?.username || "系统"}</div>
          ),
          width: "100px",
        },
        {
          id: "resume_applications_count",
          header: "简历投递",
          accessorKey: "_count",
          cell: (value) => (
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-8 h-6 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                {value?.resume_applications || 0}
              </span>
            </div>
          ),
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
                  <span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(row)}
                      className="h-8 w-8 p-0"
                      disabled={row.status === RecruitmentPostStatus.PUBLISHED}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {row.status === RecruitmentPostStatus.PUBLISHED
                    ? "已发布职位不可编辑"
                    : "编辑"}
                </TooltipContent>
              </Tooltip>

              {row.status === RecruitmentPostStatus.DRAFT && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(row, RecruitmentPostStatus.PUBLISHED)
                      }
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <PublishIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>发布</TooltipContent>
                </Tooltip>
              )}

              {row.status === RecruitmentPostStatus.PUBLISHED && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(
                          row,
                          RecruitmentPostStatus.UNPUBLISHED
                        )
                      }
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-gray-100"
                    >
                      <UnPublishIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>取消发布</TooltipContent>
                </Tooltip>
              )}

              {row.status === RecruitmentPostStatus.UNPUBLISHED && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(row, RecruitmentPostStatus.PUBLISHED)
                      }
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <PublishIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>重新发布</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(row)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={row.status === RecruitmentPostStatus.PUBLISHED}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {row.status === RecruitmentPostStatus.PUBLISHED
                    ? "已发布职位不可删除"
                    : "删除"}
                </TooltipContent>
              </Tooltip>
            </div>
          ),
          width: "160px",
        },
      ],
      [deleteMutation.isPending, updateStatusMutation.isPending]
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
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 rounded-lg">
          <Input
            className="w-full"
            placeholder="职位名称"
            value={uiFilters.job_title || ""}
            onChange={(e) => handleFilterChange("job_title", e.target.value)}
          />

          <Select
            value={uiFilters.job_type || "all"}
            onValueChange={(value) =>
              handleFilterChange("job_type", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="职位性质" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部性质</SelectItem>
              <SelectItem value={JobType.FULL_TIME}>全职</SelectItem>
              <SelectItem value={JobType.INTERNSHIP}>实习</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={uiFilters.recruitment_post_type_id || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "recruitment_post_type_id",
                value === "all" ? "" : value
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="职位类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {recruitmentPostTypesResponse?.data.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={uiFilters.status || "all"}
            onValueChange={(value) =>
              handleFilterChange("status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="职位状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value={RecruitmentPostStatus.DRAFT}>草稿</SelectItem>
              <SelectItem value={RecruitmentPostStatus.PUBLISHED}>
                已发布
              </SelectItem>
              <SelectItem value={RecruitmentPostStatus.UNPUBLISHED}>
                已下架
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
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
          data={postsResponse?.data || []}
          columns={columns}
          draggable={false}
          loading={
            isLoading ||
            deleteMutation.isPending ||
            updateStatusMutation.isPending
          }
          emptyMessage="暂无职位数据"
          pagination={{
            page: postsResponse?.page || 1,
            limit: postsResponse?.limit || 10,
            total: postsResponse?.total || 0,
            totalPages: Math.ceil(
              (postsResponse?.total || 0) / (postsResponse?.limit || 10)
            ),
            onPageChange: (newPage) => {
              setFilters((prev) => ({ ...prev, page: newPage }));
            },
            onPageSizeChange: (newLimit) => {
              setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
            },
            pageSizeOptions: [10, 20, 50],
            itemsName: "个职位",
          }}
        />
      </div>
    );
  }
);

RecruitmentPostsTable.displayName = "RecruitmentPostsTable";

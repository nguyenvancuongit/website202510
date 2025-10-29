"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Edit, ExternalLink, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaModal } from "@/components/ui/media-modal";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalDialog } from "@/contexts/dialog-context";
import {
  Banner,
  BannerStatus,
  useBanners,
  useDeleteBanner,
  useToggleStatus,
  useUpdateBannerSortOrder,
} from "@/hooks/api/use-banners";
import { formatDateTimeWithTZ } from "@/lib/datetime-utils";
import { Column } from "@/types/data-table.types";

import MediaPreview from "./media-preview";

export function BannerTable() {
  const router = useRouter();
  const dialog = useGlobalDialog();
  const [localBanners, setLocalBanners] = useState<Banner[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    type: string;
  } | null>(null);

  // React Query hooks
  const { data: bannersResponse, isLoading } = useBanners({
    ...pagination,
  });
  const deleteBannerMutation = useDeleteBanner();
  const updateSortOrderMutation = useUpdateBannerSortOrder();
  const toggleStatusMutation = useToggleStatus();

  // Update local state when data changes
  useEffect(() => {
    if (bannersResponse?.data) {
      // Sort banners by sort_order
      const sortedBanners = [...bannersResponse.data].sort(
        (a, b) => a.sort_order - b.sort_order
      );
      setLocalBanners(sortedBanners);
      setHasChanges(false);
    }
  }, [bannersResponse]);

  const viewLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openImageModal = (
    mediaPath: string,
    title: string,
    mediaType: string = "image"
  ) => {
    setSelectedImage({
      url: mediaPath,
      title: `${title} ${mediaType === "video" ? "(视频)" : "(图片)"}`,
      type: mediaType,
    });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleEdit = (banner: Banner) => {
    router.push(`/banners/${banner.id}/edit`);
  };

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate(id);
  };

  const handleDelete = async (banner: Banner) => {
    const confirmed = await dialog.confirm({
      title: "删除确认",
      message: "确定删除“象导生涯”Banner？",
      confirmText: "删除",
      variant: "destructive",
      showCancel: false,
    });

    if (!confirmed) {
      return;
    }

    deleteBannerMutation.mutate(banner.id);
  };

  const handleReorder = (newData: Banner[]) => {
    setLocalBanners(newData);
    setHasChanges(true);
  };

  const saveOrder = () => {
    if (!hasChanges) {
      return;
    }

    // Create order array with new sort_order values
    const orderUpdates = localBanners.map((banner, index) => ({
      id: banner.id,
      sort_order: index + 1,
    }));

    updateSortOrderMutation.mutate(orderUpdates, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const handleResetSortOrder = () => {
    if (bannersResponse?.data) {
      const sortedBanners = [...bannersResponse.data].sort(
        (a, b) => a.sort_order - b.sort_order
      );
      setLocalBanners(sortedBanners);
      setHasChanges(false);
    }
  };

  const handleMoveUp = (banner: Banner) => {
    const currentIndex = localBanners.findIndex((b) => b.id === banner.id);
    if (currentIndex > 0) {
      const newBanners = [...localBanners];
      // Swap with the previous item
      [newBanners[currentIndex - 1], newBanners[currentIndex]] = [
        newBanners[currentIndex],
        newBanners[currentIndex - 1],
      ];

      // Update local state immediately
      setLocalBanners(newBanners);

      // Create order array and save to API
      const orderUpdates = newBanners.map((banner, index) => ({
        id: banner.id,
        sort_order: index + 1,
      }));

      updateSortOrderMutation.mutate(orderUpdates, {
        onSuccess: () => {
          setHasChanges(false);
        },
        onError: () => {
          // Revert on error
          setLocalBanners(localBanners);
        },
      });
    }
  };

  const handleMoveDown = (banner: Banner) => {
    const currentIndex = localBanners.findIndex((b) => b.id === banner.id);
    if (currentIndex < localBanners.length - 1) {
      const newBanners = [...localBanners];
      // Swap with the next item
      [newBanners[currentIndex], newBanners[currentIndex + 1]] = [
        newBanners[currentIndex + 1],
        newBanners[currentIndex],
      ];

      // Update local state immediately
      setLocalBanners(newBanners);

      // Create order array and save to API
      const orderUpdates = newBanners.map((banner, index) => ({
        id: banner.id,
        sort_order: index + 1,
      }));

      updateSortOrderMutation.mutate(orderUpdates, {
        onSuccess: () => {
          setHasChanges(false);
        },
        onError: () => {
          setLocalBanners(localBanners);
        },
      });
    }
  };

  const columns: Column<Banner>[] = useMemo(
    () => [
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
        id: "title",
        header: "标题",
        accessorKey: "title",
        cell: (value) => (
          <div className="font-medium max-w-[200px] truncate">
            {value || "-"}
          </div>
        ),
      },
      {
        id: "image",
        header: "Web端媒体",
        accessorKey: "web_media",
        cell: (value, row) => {
          return (
            <MediaPreview
              media={value}
              title={row.title || "Banner"}
              onClick={() =>
                openImageModal(value.path, row.title || "Banner", value.type)
              }
            />
          );
        },
        width: "80px",
      },
      {
        id: "mobile_image",
        header: "H5端媒体",
        accessorKey: "mobile_media",
        cell: (value, row) => {
          return (
            <MediaPreview
              media={value}
              title={row.title || "Banner"}
              onClick={() =>
                openImageModal(value.path, row.title || "Banner", value.type)
              }
            />
          );
        },
        width: "80px",
      },
      {
        id: "link_url",
        header: "跳转链接",
        accessorKey: "link_url",
        cell: (value) => (
          <button
            onClick={() => value && viewLink(value)}
            className="text-sm text-blue-600 hover:text-blue-800 truncate cursor-pointer inline-flex items-center space-x-1 max-w-full"
            title="点击访问链接"
          >
            <span className="truncate max-w-[200px]">{value || "-"}</span>
            {value && <ExternalLink className="h-3 w-3 flex-shrink-0" />}
          </button>
        ),
      },
      {
        id: "created_at",
        header: "更新时间",
        accessorKey: "created_at",
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
              checked={value === BannerStatus.enabled}
              onCheckedChange={() => handleToggleStatus(row.id)}
            />
            <Badge
              variant={value === BannerStatus.enabled ? "default" : "secondary"}
              className="whitespace-nowrap"
            >
              {value === BannerStatus.enabled ? "启用" : "禁用"}
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
          const currentIndex = localBanners.findIndex((b) => b.id === row.id);
          const isFirst = currentIndex === 0;
          const isLast = currentIndex === localBanners.length - 1;

          return (
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(row)}
                      className="h-8 w-8 p-0 ml-1"
                      title="编辑"
                      disabled={row.status === BannerStatus.enabled}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {row.status === BannerStatus.enabled
                    ? "请先禁用Banner后再进行编辑"
                    : "编辑"}
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
                      title="删除"
                      disabled={row.status === BannerStatus.enabled}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {row.status === BannerStatus.enabled
                    ? "请先禁用Banner后再进行删除"
                    : "删除"}
                </TooltipContent>
              </Tooltip>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveUp(row)}
                disabled={
                  isFirst || updateSortOrderMutation.isPending || hasChanges
                }
                className="p-0"
                title="向上移动"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>

              {/* Move Down Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveDown(row)}
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
    ],
    [localBanners, hasChanges]
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
      {/* Actions - Only show when there are banners */}
      {localBanners.length > 0 && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleResetSortOrder}>
            刷新
          </Button>
          <Button
            className={`${hasChanges
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
            onClick={saveOrder}
            disabled={!hasChanges || updateSortOrderMutation.isPending}
          >
            {hasChanges ? "保存拖拽排序 *" : "保存拖拽排序"}
          </Button>
        </div>
      )}

      <DataTable
        data={localBanners}
        columns={columns}
        draggable={true}
        onReorder={handleReorder}
        loading={isLoading || updateSortOrderMutation.isPending}
        emptyMessage="暂无Banner数据"
        pagination={{
          page: bannersResponse?.pagination?.page || 1,
          limit: bannersResponse?.pagination?.limit || 10,
          total: bannersResponse?.pagination?.total || 0,
          onPageChange: (page) => {
            setPagination((prev) => ({ ...prev, page }));
          },
          onPageSizeChange: (limit) => {
            setPagination((prev) => ({
              ...prev,
              limit,
              page: 1,
            }));
          },
          pageSizeOptions: [10, 20, 50],
          totalPages: bannersResponse?.pagination?.total_pages || 1,
        }}
      />

      {/* Media Modal */}
      {selectedImage && (
        <MediaModal
          isOpen={!!selectedImage}
          onClose={closeImageModal}
          mediaUrl={selectedImage.url}
          mediaTitle={selectedImage.title}
          mediaType={selectedImage.type}
        />
      )}
    </div>
  );
}

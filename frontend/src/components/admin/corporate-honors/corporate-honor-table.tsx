"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGlobalDialog } from "@/contexts/dialog-context";
import {
  CorporateHonor,
  useCorporateHonors,
  useDeleteCorporateHonor,
  useUpdateCorporateHonorSortOrder,
} from "@/hooks/api/use-corporate-honors";
import { formatDateTimeWithTZ } from "@/lib/datetime-utils";
import { Column } from "@/types/data-table.types";

export function CorporateHonorTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [viewingHonor, setViewingHonor] = useState<CorporateHonor | null>(null);
  const [localHonors, setLocalHonors] = useState<CorporateHonor[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const dialog = useGlobalDialog();
  // Default sort by sort_order ascending, save this for feature sorting requirement
  const [sortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "sort_order", direction: "asc" });

  const { data, isLoading, error } = useCorporateHonors({
    page,
    limit: limit,
    sort_by: sortConfig.key,
    sort_order: sortConfig.direction,
  });

  const deleteMutation = useDeleteCorporateHonor();
  const updateSortOrderMutation = useUpdateCorporateHonorSortOrder();

  // Update local state when data changes
  useEffect(() => {
    if (data?.data) {
      // Sort honors by sort_order
      const sortedHonors = [...data.data].sort(
        (a, b) => a.sort_order - b.sort_order
      );
      setLocalHonors(sortedHonors);
      setHasChanges(false);
    }
  }, [data]);

  const handleEdit = (honor: CorporateHonor) => {
    // Navigate to edit page
    window.location.href = `/corporate-honors/edit/${honor.id}`;
  };

  const handleReorder = (newData: CorporateHonor[]) => {
    setLocalHonors(newData);
    setHasChanges(true);
  };

  const saveOrder = () => {
    if (!hasChanges) {
      return;
    }

    // Create order array with new sort_order values
    const orderUpdates = localHonors.map((honor, index) => ({
      id: honor.id,
      sort_order: index + 1,
    }));

    updateSortOrderMutation.mutate(orderUpdates, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const handleResetSortOrder = () => {
    if (data?.data) {
      const sortedHonors = [...data.data].sort(
        (a, b) => a.sort_order - b.sort_order
      );
      setLocalHonors(sortedHonors);
      setHasChanges(false);
    }
  };

  const handleMoveUp = (honor: CorporateHonor) => {
    const currentIndex = localHonors.findIndex((h) => h.id === honor.id);
    if (currentIndex > 0) {
      const newHonors = [...localHonors];
      // Swap with the previous item
      [newHonors[currentIndex - 1], newHonors[currentIndex]] = [
        newHonors[currentIndex],
        newHonors[currentIndex - 1],
      ];

      // Update local state immediately
      setLocalHonors(newHonors);

      // Create order array and save to API
      const orderUpdates = newHonors.map((honor, index) => ({
        id: honor.id,
        sort_order: index + 1,
      }));

      updateSortOrderMutation.mutate(orderUpdates, {
        onSuccess: () => {
          setHasChanges(false);
        },
        onError: () => {
          // Revert on error
          setLocalHonors(localHonors);
        },
      });
    }
  };

  const handleMoveDown = (honor: CorporateHonor) => {
    const currentIndex = localHonors.findIndex((h) => h.id === honor.id);
    if (currentIndex < localHonors.length - 1) {
      const newHonors = [...localHonors];
      // Swap with the next item
      [newHonors[currentIndex], newHonors[currentIndex + 1]] = [
        newHonors[currentIndex + 1],
        newHonors[currentIndex],
      ];

      // Update local state immediately
      setLocalHonors(newHonors);

      // Create order array and save to API
      const orderUpdates = newHonors.map((honor, index) => ({
        id: honor.id,
        sort_order: index + 1,
      }));

      updateSortOrderMutation.mutate(orderUpdates, {
        onSuccess: () => {
          setHasChanges(false);
        },
        onError: () => {
          setLocalHonors(localHonors);
        },
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await dialog.confirm({
      title: "删除确认",
      message: "确定删除该荣誉吗？",
      confirmText: "删除",
      variant: "destructive",
      showCancel: false,
    });

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const columns: Column<CorporateHonor>[] = useMemo(
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
      { id: "name", header: "荣誉名称", accessorKey: "name" },
      {
        id: "image",
        header: "荣誉配图",
        accessorKey: "image",
        cell: (_val, row) =>
          row.image ? (
            <Image
              width={48}
              height={48}
              src={row.image.path}
              alt={row.image.alt_text || row.name}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <Badge variant="secondary">无配图</Badge>
          ),
        width: "100px",
      },
      {
        id: "obtained_date",
        header: "获得时间",
        accessorKey: "obtained_date",
        cell: (val) => (val ? new Date(val).toISOString().slice(0, 10) : ""),
        width: "140px",
      },
      {
        id: "updated_at",
        header: "更新时间",
        accessorKey: "updated_at",
        cell: (val) =>
          val ? formatDateTimeWithTZ(val, "yyyy-MM-dd HH:mm") : "",
        width: "180px",
      },
      {
        id: "author",
        header: "操作者",
        accessorKey: "author",
        cell: (_val, row) => row.author?.username || "",
      },
      {
        id: "actions",
        header: "操作",
        accessorKey: "id",
        cell: (_val, row) => {
          const currentIndex = localHonors.findIndex((h) => h.id === row.id);
          const isFirst = currentIndex === 0;
          const isLast = currentIndex === localHonors.length - 1;

          return (
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(row)}
                className="h-8 w-8 p-0"
                title="编辑"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(row.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="删除"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
        width: "180px",
      },
    ],
    [localHonors, updateSortOrderMutation.isPending, hasChanges]
  );

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            加载失败，请刷新页面重试
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">企业荣誉管理</h1>
          <p className="text-gray-500">管理企业获得的荣誉和奖项</p>
        </div>
        <Button asChild>
          <Link href="/corporate-honors/create">
            <Plus className="mr-2 h-4 w-4" />
            添加荣誉
          </Link>
        </Button>
      </div>

      {/* Actions - Only show when there are honors */}
      {localHonors.length > 0 && (
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

      {/* Table */}
      <CardContent className="p-0">
        <DataTable
          data={localHonors}
          columns={columns}
          loading={isLoading || updateSortOrderMutation.isPending}
          draggable={true}
          onReorder={handleReorder}
          emptyMessage="暂无荣誉数据"
          serverSide
          // sortConfig={sortConfig}
          // onSort={(sortConfig) => {
          //   if (sortConfig) {
          //     setSortConfig(sortConfig);
          //   }
          // }}
          pagination={
            data?.pagination
              ? {
                page: data.pagination.page,
                limit: limit,
                total: data.pagination.total,
                totalPages: data.pagination.total_pages,
                onPageChange: (p) => setPage(p),
                onPageSizeChange: (size) => {
                  setLimit(size);
                  setPage(1);
                },
                pageSizeOptions: [10, 20, 50],
              }
              : undefined
          }
        />
      </CardContent>

      {/* View Modal */}
      {viewingHonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-4">{viewingHonor.name}</h2>
            <div className="space-y-4">
              <div>
                <strong>获得时间：</strong>
                {new Date(viewingHonor.obtained_date).toLocaleDateString()}
              </div>
              <div>
                <strong>更新时间：</strong>
                {new Date(viewingHonor.updated_at).toLocaleString()}
              </div>
              <div>
                <strong>操作者：</strong>
                {viewingHonor.author.username} ({viewingHonor.author.email})
              </div>
              {viewingHonor.image && (
                <div>
                  <strong>荣誉配图：</strong>
                  <Image
                    src={viewingHonor.image.path}
                    alt={viewingHonor.image.alt_text || viewingHonor.name}
                    className="mt-2 w-64 h-48 object-cover rounded-md"
                    width={256}
                    height={192}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setViewingHonor(null)}>关闭</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Plus } from "lucide-react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import HashtagDialog from "@/components/admin/hashtags/hashtag-dialog";
import HashtagFilters from "@/components/admin/hashtags/hashtag-filters";
import HashtagTable from "@/components/admin/hashtags/hashtag-table";
import { Button } from "@/components/ui/button";
import { HASHTAG_CONFIG } from "@/config/constants";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";
import { useHashtags } from "@/hooks/use-hashtags";

export default function HashtagsPage() {
  // Set breadcrumbs for this page
  useBreadcrumbEffect([{ label: "标签管理" }]);
  const {
    hashtags,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    editingHashtag,
    pagination,
    filters,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    resetForm,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    fetchHashtags,
  } = useHashtags();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">加载标签中...</div>
      </div>
    );
  }

  const actions = (
    <Button
      onClick={() => setIsDialogOpen(true)}
      className="bg-blue-600 hover:bg-blue-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      添加标签
    </Button>
  );

  return (
    <AdminPageLayout
      title="标签管理"
      subtitle={`共 ${pagination.total} 条记录`}
      actions={actions}
    >
      <HashtagFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() =>
          handleFilterChange({
            page: 1,
            limit: HASHTAG_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
            sort_by: "created_at",
            sort_order: "desc",
          })
        }
      />

      <HashtagTable
        hashtags={hashtags}
        loading={false}
        onStatusUpdate={handleToggleStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
          pageSizeOptions: HASHTAG_CONFIG.PAGINATION.PAGE_SIZE_OPTIONS,
          loading: loading,
          itemsName: "个标签",
        }}
      />

      <HashtagDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        hashtag={editingHashtag}
        onSuccess={() => {
          setIsDialogOpen(false);
          resetForm();
          fetchHashtags(); // Refresh the table after create/update
        }}
      />
    </AdminPageLayout>
  );
}

"use client";

import { useEffect, useState } from "react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { FriendLinkList } from "@/components/admin/friend-links/friend-link-list";
import { FriendLinkMutationModal } from "@/components/admin/friend-links/friend-link-modal";
import { withPermission } from "@/components/auth/withPermission";
import { useGlobalDialog } from "@/contexts/dialog-context";
import {
  CreateFriendLinkData,
  FriendLink,
  useCreateFriendLink,
  useDeleteFriendLink,
  useFriendLinks,
  useToggleFriendLinkStatus,
  useUpdateFriendLink,
  useUpdateFriendLinkSortOrder,
} from "@/hooks/api/use-friend-links";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";

interface FriendLinkFormData {
  name: string;
  url: string;
  sortOrder?: number;
  status: number;
}

const FriendLinksPage = () => {
  // Set breadcrumbs for this page
  useBreadcrumbEffect([{ label: "友情链接管理" }]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFriendLink, setEditingFriendLink] = useState<FriendLink | null>(
    null
  );
  const [formData, setFormData] = useState<FriendLinkFormData>({
    name: "",
    url: "",
    sortOrder: undefined,
    status: 1,
  });
  const [localFriendLinks, setLocalFriendLinks] = useState<FriendLink[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const dialog = useGlobalDialog();

  const { data: friendLinksResponse, isLoading, isFetching, refetch } = useFriendLinks({
    ...pagination,
  });
  const createFriendLinkMutation = useCreateFriendLink();
  const updateFriendLinkMutation = useUpdateFriendLink();
  const deleteFriendLinkMutation = useDeleteFriendLink();
  const toggleStatusMutation = useToggleFriendLinkStatus();
  const updateSortOrderMutation = useUpdateFriendLinkSortOrder();

  // Update local state when data changes
  useEffect(() => {
    if (friendLinksResponse?.data) {
      setLocalFriendLinks(friendLinksResponse.data);
    }
  }, [friendLinksResponse]);

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length > 20) {
      return;
    }

    if (!formData.url.trim()) {
      return;
    }

    const submitData: CreateFriendLinkData = {
      name: formData.name,
      url: formData.url,
      sortOrder: formData.sortOrder,
      status: formData.status,
    };

    if (editingFriendLink) {
      updateFriendLinkMutation.mutate(
        { id: editingFriendLink.id, data: submitData },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            resetForm();
          },
        }
      );
    } else {
      createFriendLinkMutation.mutate(submitData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  // Edit friend link
  const handleEdit = (friendLink: FriendLink) => {
    setEditingFriendLink(friendLink);
    setFormData({
      name: friendLink.name || "",
      url: friendLink.url || "",
      sortOrder: friendLink.sort_order,
      status: friendLink.status ?? 1,
    });
    setIsDialogOpen(true);
  };

  // Delete friend link
  const handleDelete = async (friendLink: FriendLink) => {
    const confirmed = await dialog.confirm({
      title: "删除友情链接",
      message: `确定要删除友情链接 "${friendLink.name}" 吗？此操作不可撤销。`,
      confirmText: "删除",
      cancelText: "取消",
      variant: "destructive",
    });

    if (!confirmed) {
      return;
    }

    deleteFriendLinkMutation.mutate(friendLink.id);
  };

  // Toggle friend link status
  const handleToggleStatus = async (friendLink: FriendLink) => {
    toggleStatusMutation.mutate(friendLink.id);
  };

  // Move friend link up
  const handleMoveUp = (id: string) => {
    const currentIndex = localFriendLinks.findIndex((fl) => fl.id === id);
    if (currentIndex > 0) {
      const currentItem = localFriendLinks[currentIndex]
      const previousItem = localFriendLinks[currentIndex - 1]

      const orderUpdates = [
        {
          id: currentItem.id,
          sort_order: previousItem.sort_order,
        },
        {
          id: previousItem.id,
          sort_order: currentItem.sort_order,
        },
      ];

      const newFriendLinks = [...localFriendLinks];
      // Swap with the previous item
      [newFriendLinks[currentIndex - 1], newFriendLinks[currentIndex]] = [
        newFriendLinks[currentIndex],
        newFriendLinks[currentIndex - 1],
      ];

      // Update local state immediately
      setLocalFriendLinks(newFriendLinks);

      // Only update the sort_order of the two items being swapped


      updateSortOrderMutation.mutate(orderUpdates, {
        onError: () => {
          // Revert on error
          setLocalFriendLinks(localFriendLinks);
        },
      });
    }
  };

  // Move friend link down
  const handleMoveDown = (id: string) => {
    const currentIndex = localFriendLinks.findIndex((fl) => fl.id === id);
    if (currentIndex < localFriendLinks.length - 1) {
      const currentItem = localFriendLinks[currentIndex];
      const nextItem = localFriendLinks[currentIndex + 1];

      // Only update the sort_order of the two items being swapped
      const orderUpdates = [
        {
          id: currentItem.id,
          sort_order: nextItem.sort_order,
        },
        {
          id: nextItem.id,
          sort_order: currentItem.sort_order,
        },
      ];

      const newFriendLinks = [...localFriendLinks];
      // Swap with the next item
      [newFriendLinks[currentIndex], newFriendLinks[currentIndex + 1]] = [
        newFriendLinks[currentIndex + 1],
        newFriendLinks[currentIndex],
      ];

      // Update local state immediately
      setLocalFriendLinks(newFriendLinks);

      updateSortOrderMutation.mutate(orderUpdates, {
        onError: () => {
          // Revert on error
          setLocalFriendLinks(localFriendLinks);
        },
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      sortOrder: undefined,
      status: 1,
    });
    setEditingFriendLink(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  const submitting =
    createFriendLinkMutation.isPending || updateFriendLinkMutation.isPending;

  return (
    <AdminPageLayout
      title="友情链接管理"
      subtitle="添加和管理网站的友情链接"
      actions={
        <FriendLinkMutationModal
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          submitting={submitting}
          editingFriendLink={editingFriendLink}
          resetForm={resetForm}
        />
      }
    >
      {/* Friend Links List */}
      <FriendLinkList
        friendLinks={localFriendLinks}
        onEdit={handleEdit}
        onDelete={(id: string) => {
          const friendLink = localFriendLinks.find(
            (fl: FriendLink) => fl.id === id
          );
          if (friendLink) { handleDelete(friendLink); }
        }}
        onToggleStatus={(id: string) => {
          const friendLink = localFriendLinks.find(
            (fl: FriendLink) => fl.id === id
          );
          if (friendLink) { handleToggleStatus(friendLink); }
        }}
        onRefresh={() => refetch()}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        isLoading={isFetching}
        pagination={{
          page: friendLinksResponse?.pagination?.page || 1,
          limit: friendLinksResponse?.pagination?.limit || 10,
          total: friendLinksResponse?.pagination?.total || 0,
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
          totalPages: friendLinksResponse?.pagination?.total_pages || 1,
        }}
      />
    </AdminPageLayout>
  );
};

export default withPermission(FriendLinksPage, {
  permissions: ["manage_friendly_links"],
  isShowAccessDeniedPage: true,
});

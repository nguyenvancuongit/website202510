"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { BannerTable } from "@/components/admin/banners/banner-table";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { Button } from "@/components/ui/button";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";

export default function BannersPage() {
  const router = useRouter();

  // Set breadcrumbs for this page
  useBreadcrumbEffect([{ label: "Banner管理" }]);

  const handleCreateBanner = () => {
    router.push("/banners/create");
  };

  const actions = (
    <Button onClick={handleCreateBanner}>
      <Plus className="h-4 w-4 mr-2" />
      添加Banner
    </Button>
  );

  return (
    <AdminPageLayout
      title="Banner管理"
      subtitle="管理首页轮播图和广告横幅，拖拽调整显示顺序"
      actions={actions}
    >
      <BannerTable />
    </AdminPageLayout>
  );
}

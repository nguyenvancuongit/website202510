"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { RecruitmentPostTypesTable } from "@/components/admin/recruitment-post-types/recruitment-post-types-table";
import { Button } from "@/components/ui/button";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";

export default function RecruitmentPostTypesPage() {
  const ref = useRef<{ handleCreate: () => void }>(null);
  
  // Set breadcrumbs for this page
  useBreadcrumbEffect([
    { label: "招聘管理", href: "/recruitment" },
    { label: "职位类型管理" },
  ]);

  const actions = (
    <Button onClick={ref.current?.handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      新增职位
    </Button>
  );

  return (
    <AdminPageLayout
      title="职位类型管理"
      subtitle="管理招聘职位的类型分类，拖拽调整显示顺序"
      actions={actions}
    >
      <RecruitmentPostTypesTable ref={ref} />
    </AdminPageLayout>
  );
}
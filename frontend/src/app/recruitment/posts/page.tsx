"use client";

import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { RecruitmentPostsTable, RecruitmentPostsTableRef } from "@/components/admin/recruitment-posts/recruitment-posts-table";
import { Button } from "@/components/ui/button";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function RecruitmentPostsPage() {
  const tableRef = useRef<RecruitmentPostsTableRef>(null);
  const { setBreadcrumbs } = useBreadcrumbStore();

  // Set breadcrumbs for this page
  useEffect(() => {
    setBreadcrumbs([
      { label: "招聘管理", href: "/recruitment" },
      { label: "招聘职位管理" },
    ]);
  }, [setBreadcrumbs]);

  const actions = (
    <Button onClick={() => tableRef.current?.handleCreate()}>
      <Plus className="h-4 w-4 mr-2" />
      新增职位
    </Button>
  );

  return (
    <AdminPageLayout
      title="招聘职位管理"
      subtitle="管理公司的招聘职位信息，包括职位发布、编辑和状态管理"
      actions={actions}
    >
      <RecruitmentPostsTable ref={tableRef} />
    </AdminPageLayout>
  );
}
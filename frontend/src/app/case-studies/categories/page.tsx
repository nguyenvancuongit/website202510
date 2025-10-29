"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";

import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/hooks/api/use-categories";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";

export default function CaseStudyCategoriesPage() {
  const ref = useRef<{ handleCreate: () => void }>(null);
  // Set breadcrumbs for this page
  useBreadcrumbEffect([
    { label: "客户案例管理", href: "/case-studies" },
    { label: "案例分类管理" },
  ]);

  const actions = (
    <Button onClick={ref.current?.handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      添加分类
    </Button>
  );

  return (
    <AdminPageLayout
      title="案例分类管理"
      subtitle="管理客户案例的分类，拖拽调整显示顺序"
      actions={actions}
    >
      <CategoriesTable categoryType={CategoryType.CASE_STUDY} ref={ref} />
    </AdminPageLayout>
  );
}

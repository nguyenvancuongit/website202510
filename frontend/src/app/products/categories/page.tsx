"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";

import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/hooks/api/use-categories";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";

export default function ProductsCategoriesPage() {
  const ref = useRef<{ handleCreate: () => void }>(null);
  // Set breadcrumbs for this page
  useBreadcrumbEffect([
    { label: "产品管理", href: "/products" },
    { label: "产品分类管理" },
  ]);

  const actions = (
    <Button onClick={ref.current?.handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      添加分类
    </Button>
  );

  return (
    <AdminPageLayout
      title="产品分类管理"
      subtitle="管理产品的分类，拖拽调整显示顺序"
      actions={actions}
    >
      <CategoriesTable categoryType={CategoryType.PRODUCT} ref={ref} />
    </AdminPageLayout>
  );
}

"use client";

import { useEffect } from "react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { ProductForm } from "@/components/admin/products/product-form";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function CreateProductPage() {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "产品管理", href: "/products" },
      { label: "产品文章管理", href: "/products/posts" },
      { label: "新增产品" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <AdminPageLayout
      title="新增产品"
      showBackButton={true}
      backUrl="/products/posts"
    >
      <ProductForm mode="create" />
    </AdminPageLayout>
  );
}

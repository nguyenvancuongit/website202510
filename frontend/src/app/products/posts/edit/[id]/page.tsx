"use client";

import React, { useEffect, useState } from "react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { ProductForm } from "@/components/admin/products/product-form";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [id, setId] = useState<string>("");

  useEffect(() => {
    setBreadcrumbs([
      { label: "产品管理", href: "/products" },
      { label: "产品文章管理", href: "/products/posts" },
      { label: "编辑产品" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  if (!id) {return <div>加载中...</div>;}

  return (
    <AdminPageLayout
      title="编辑产品"
      subtitle="修改产品内容"
      showBackButton={true}
      backUrl="/products/posts"
    >
      <ProductForm mode="edit" id={id} />
    </AdminPageLayout>
  );
}

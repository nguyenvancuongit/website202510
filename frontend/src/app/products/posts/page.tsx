"use client";

import { useEffect } from "react";

import { ProductsManagement } from "@/components/admin/products/products-management";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function ProductsPage() {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "产品管理", href: "/products" },
      { label: "产品管理" },
    ]);
  }, [setBreadcrumbs]);

  return <ProductsManagement />;
}

"use client";

import { useEffect } from "react";

import { CaseStudiesManagement } from "@/components/admin/case-studies/case-studies-management";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function CaseStudiesPage() {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "客户案例管理", href: "/case-studies" },
      { label: "客户案例文章管理" },
    ]);
  }, [setBreadcrumbs]);

  return <CaseStudiesManagement />;
}

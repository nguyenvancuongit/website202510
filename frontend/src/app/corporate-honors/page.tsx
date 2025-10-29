"use client";

import { useEffect } from "react";

import { CorporateHonorTable } from "@/components/admin/corporate-honors/corporate-honor-table";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function CorporateHonorsPage() {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "企业荣誉管理" },
    ]);
  }, [setBreadcrumbs]);

  return <CorporateHonorTable />;
}

"use client";

import { useEffect } from "react";

import { CaseStudyForm } from "@/components/admin/case-studies/case-study-form";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function CreateCaseStudyPage() {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "客户案例管理", href: "/case-studies" },
      { label: "客户案例文章管理", href: "/case-studies/posts" },
      { label: "新增文章" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <AdminPageLayout
      title="新增文章"
      showBackButton={true}
      backUrl="/case-studies/posts"
    >
      <CaseStudyForm mode="create" />
    </AdminPageLayout>
  );
}

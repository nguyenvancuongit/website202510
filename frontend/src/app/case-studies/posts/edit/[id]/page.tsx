"use client";

import React, { useEffect, useState } from "react";

import { CaseStudyForm } from "@/components/admin/case-studies/case-study-form";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

interface EditCaseStudyPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCaseStudyPage({ params }: EditCaseStudyPageProps) {
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [id, setId] = useState<string>("");

  useEffect(() => {
    setBreadcrumbs([
      { label: "客户案例管理", href: "/case-studies" },
      { label: "客户案例文章管理", href: "/case-studies/posts" },
      { label: "编辑客户案例" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  if (!id) {return <div>加载中...</div>;}

  return (
    <AdminPageLayout
      title="编辑客户案例"
      subtitle="修改客户案例内容"
      showBackButton={true}
      backUrl="/case-studies/posts"
    >
      <CaseStudyForm mode="edit" id={id} />
    </AdminPageLayout>
  );
}

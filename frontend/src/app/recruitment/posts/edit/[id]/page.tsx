"use client";

import React, { useEffect, useState } from "react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { RecruitmentPostForm } from "@/components/admin/recruitment-posts/recruitment-post-form";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

interface EditRecruitmentPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditRecruitmentPostPage({ params }: EditRecruitmentPostPageProps) {
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [id, setId] = useState<string>("");

  useEffect(() => {
    setBreadcrumbs([
      { label: "招聘管理", href: "/recruitment" },
      { label: "招聘职位管理", href: "/recruitment/posts" },
      { label: "编辑职位" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  if (!id) {
    return <div>加载中...</div>;
  }

  return (
    <AdminPageLayout
      title="编辑职位"
      subtitle="修改招聘职位信息"
      showBackButton={true}
      backUrl="/recruitment/posts"
    >
      <RecruitmentPostForm mode="edit" id={id} />
    </AdminPageLayout>
  );
}
"use client";

import { useEffect } from "react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { RecruitmentPostForm } from "@/components/admin/recruitment-posts/recruitment-post-form";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function CreateRecruitmentPostPage() {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "招聘管理", href: "/recruitment" },
      { label: "招聘职位管理", href: "/recruitment/posts" },
      { label: "新增职位" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <AdminPageLayout
      title="新增职位"
      subtitle="创建新的招聘职位"
      showBackButton={true}
      backUrl="/recruitment/posts"
    >
      <RecruitmentPostForm mode="create" />
    </AdminPageLayout>
  );
}
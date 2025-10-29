"use client";

import { useEffect } from "react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import LatestNewsForm from "@/components/admin/latest-news/latest-news-form";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function CreateLatestNewsPage() {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "资讯管理", href: "/latest-news" },
      { label: "最新资讯文章管理", href: "/latest-news/posts" },
      { label: "新增资讯" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <AdminPageLayout
      title="新增资讯"
      subtitle="创建和管理最新的资讯内容"
      showBackButton={true}
      backUrl="/latest-news/posts"
    >
      <LatestNewsForm />
    </AdminPageLayout>
  );
}

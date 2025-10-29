"use client";

import React, { useEffect, useState } from "react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import LatestNewsForm from "@/components/admin/latest-news/latest-news-form";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

interface EditLatestNewsPageProps {
  params: Promise<{ id: string }>;
}

export default function EditLatestNewsPage({
  params,
}: EditLatestNewsPageProps) {
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [id, setId] = useState<string>("");

  useEffect(() => {
    setBreadcrumbs([
      { label: "资讯管理", href: "/latest-news" },
      { label: "最新资讯文章管理", href: "/latest-news/posts" },
      { label: "编辑资讯" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  if (!id) {return <div>加载中...</div>;}

  return (
    <AdminPageLayout
      title="编辑最新资讯"
      subtitle="修改最新资讯内容"
      showBackButton={true}
      backUrl="/latest-news/posts"
    >
      <LatestNewsForm id={parseInt(id)} />
    </AdminPageLayout>
  );
}

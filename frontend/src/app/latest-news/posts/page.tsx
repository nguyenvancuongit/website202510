"use client";

import { useEffect } from "react";

import { LatestNewsManagement } from "@/components/admin/latest-news/latest-news-management";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function LatestNewsPage() {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "资讯管理", href: "/latest-news" },
      { label: "最新资讯文章管理" },
    ]);
  }, [setBreadcrumbs]);

  return <LatestNewsManagement />;
}

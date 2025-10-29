"use client";

import { ClientTable } from "@/components/admin/clients/client-table";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";

export default function ClientsPage() {
  // Set breadcrumbs for this page
  useBreadcrumbEffect([{ label: "应聘投递用户列表" }]);

  return (
    <AdminPageLayout title="应聘投递用户列表" subtitle="管理注册用户账户信息">
      <ClientTable />
    </AdminPageLayout>
  );
}

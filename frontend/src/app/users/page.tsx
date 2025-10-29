"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { UserTable } from "@/components/admin/users/user-table";
import { Button } from "@/components/ui/button";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";

const UsersPage = () => {
  const router = useRouter();

  // Set breadcrumbs for this page
  useBreadcrumbEffect([{ label: "后台用户权限管理" }]);

  const handleCreateUser = () => {
    router.push("/users/create");
  };

  const actions = (
    <Button
      onClick={handleCreateUser}
      className="bg-blue-600 hover:bg-blue-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      新增用户
    </Button>
  );

  return (
    <AdminPageLayout
      title="后台用户权限管理"
      subtitle="管理后台用户账户和权限分配"
      actions={actions}
    >
      <UserTable />
    </AdminPageLayout>
  );
};

export default UsersPage;

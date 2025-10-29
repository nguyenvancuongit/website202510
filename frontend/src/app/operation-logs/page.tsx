"use client";

import { useEffect } from "react";

import { OperationLogsManagement } from "@/components/admin/operation-logs/operation-logs-management";
import { withPermission } from "@/components/auth/withPermission";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

const OperationLogsPage = () => {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "系统管理", href: "/system" },
      { label: "操作日志" },
    ]);
  }, [setBreadcrumbs]);

  return <OperationLogsManagement />;
};

export default withPermission(OperationLogsPage, {
  permissions: ["manage_operation_logs"],
  isShowAccessDeniedPage: true,
});

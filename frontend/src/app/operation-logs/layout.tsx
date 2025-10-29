"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const OperationLogsLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(OperationLogsLayout, {
  permissions: ["manage_operation_logs"],
  isShowAccessDeniedPage: true,
});

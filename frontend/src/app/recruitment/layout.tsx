"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const RecruitmentLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(RecruitmentLayout, {
  permissions: ["manage_recruitments"],
  isShowAccessDeniedPage: true,
});

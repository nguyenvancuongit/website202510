"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const CorporateHonorsLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(CorporateHonorsLayout, {
  permissions: ["manage_corporate_honors"],
  isShowAccessDeniedPage: true,
});

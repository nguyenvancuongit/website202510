"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const CaseStudiesLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(CaseStudiesLayout, {
  permissions: ["manage_case_studies"],
  isShowAccessDeniedPage: true,
});

"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const LatestNewsLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(LatestNewsLayout, {
  permissions: ["manage_latest_news"],
  isShowAccessDeniedPage: true,
});

"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const BannersLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(BannersLayout, {
  permissions: ["manage_banners"],
  isShowAccessDeniedPage: true,
});

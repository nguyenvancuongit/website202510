"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(UserLayout, {
  permissions: ["manage_users"],
  isShowAccessDeniedPage: true,
});

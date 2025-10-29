"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(SettingsLayout, {
  permissions: ["manage_system_settings"],
  isShowAccessDeniedPage: true,
});

"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const CustomersLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(CustomersLayout, {
  permissions: ["manage_data"],
  isShowAccessDeniedPage: true,
});

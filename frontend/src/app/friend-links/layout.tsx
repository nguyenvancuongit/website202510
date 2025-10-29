"use client";

import { Fragment } from "react";

import { withPermission } from "@/components/auth/withPermission";

const FriendLinksLayout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default withPermission(FriendLinksLayout, {
  permissions: ["manage_friendly_links"],
  isShowAccessDeniedPage: true,
});

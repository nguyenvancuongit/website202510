"use client";

import { useEffect, useMemo } from "react";

import { BreadcrumbItem, useBreadcrumbStore } from "@/store/breadcrumb-store";

export function useBreadcrumbEffect(breadcrumbs: BreadcrumbItem[]) {
  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbStore();

  // Memoize the breadcrumbs to prevent unnecessary re-renders
  const memoizedBreadcrumbs = useMemo(
    () => breadcrumbs,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(breadcrumbs)]
  );

  useEffect(() => {
    setBreadcrumbs(memoizedBreadcrumbs);

    // Cleanup function to reset breadcrumbs when component unmounts
    return () => {
      clearBreadcrumbs();
    };
  }, [memoizedBreadcrumbs, setBreadcrumbs, clearBreadcrumbs]);
}

"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

import FullPageLoading from "@/components/ui/loading";
import { useSolutionPages } from "@/hooks/use-solution-pages";

type PageKey =
  | "classroom"
  | "enterprise"
  | "guidance-center"
  | "teacher-guidance"
  | "teacher-training"
  | "university-city";

interface SolutionPageGuardProps {
  pageKey: PageKey;
  children: React.ReactNode;
}

export function SolutionPageGuard({
  pageKey,
  children,
}: SolutionPageGuardProps) {
  const { loading, error, config } = useSolutionPages();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (config) {
      const enabled = Boolean(
        config?.some((page) => page.key === pageKey && page.enabled)
      );

      if (!enabled) {
        notFound();
      } else {
        setShouldRender(true);
      }
    }
  }, [pageKey, config]);

  // Show loading state
  if (loading) {
    return <FullPageLoading />
  }
  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">加载失败</h2>
          <p className="text-gray-500">无法验证页面访问权限，请稍后再试</p>
        </div>
      </div>
    );
  }

  // Only render children if page is enabled
  if (shouldRender) {
    return <>{children}</>;
  }

  // notFound();
  return null;
  // Return null while checking (should trigger notFound() before this point)
}

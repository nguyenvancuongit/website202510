"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

import FullPageLoading from "@/components/ui/loading";
import { useProductPages } from "@/hooks/use-product-pages";

type ProductPageKey = "cloud-platform" | "terminal" | "games" | "assessment";

interface ProductPageGuardProps {
  pageKey: ProductPageKey;
  children: React.ReactNode;
}

export function ProductPageGuard({
  pageKey,
  children,
}: ProductPageGuardProps) {
  const { data: config, isLoading, error } = useProductPages();
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
  if (isLoading) {
    return <FullPageLoading />
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">加载配置时出现错误</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // Don't render until we've confirmed the page should be visible
  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
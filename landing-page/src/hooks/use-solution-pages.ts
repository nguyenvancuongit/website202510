"use client";

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { SolutionPageConfig, solutionPagesService } from "@/services/solution-pages.service";

export interface SolutionPage extends SolutionPageConfig {
  key: string;
}

const SOLUTION_PAGES_QUERY_KEY = ["solution-pages", "enabled"] as const;

export function useSolutionPages() {
  const {
    data: config,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: SOLUTION_PAGES_QUERY_KEY,
    queryFn: () => solutionPagesService.getEnabledPages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
    select: (data) => Object.entries(data)
      .sort(([_, a], [__, b]) => a.order - b.order)
      .map(([key, page]) => ({ ...page, key }))
  });

  const checkVisibleSolutionPages = useCallback((href: string) => {
    if (!config) return false;
    const solutionPageKey = href.split("/").pop();
    if (!solutionPageKey) return true;
    return config.findLastIndex((page) => page.key === solutionPageKey) !== -1;
  }, [config])

  return {
    config,
    loading,
    error: error ? "Failed to fetch solution pages" : null,
    refetch,
    checkVisibleSolutionPages
  };
}
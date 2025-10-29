import { useQuery } from "@tanstack/react-query";

import { getLatestNewsPerCategory } from "@/services/latest-news.service";

export function useLatestNewsPerCategory() {
  return useQuery({
    queryKey: ["latest-news-per-category"],
    queryFn: getLatestNewsPerCategory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3, // Retry failed requests 3 times
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
  });
}

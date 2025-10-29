import { useQuery } from "@tanstack/react-query";

import { productPagesService } from "@/services/product-pages.service";

export function useProductPages() {
  return useQuery({
    queryKey: ["product-pages", "enabled"],
    queryFn: productPagesService.getEnabledPages,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => Object.entries(data)
      .sort(([_, a], [__, b]) => a.order - b.order)
      .map(([key, page]) => ({ ...page, key })),
  });
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { productPagesService } from "@/services/product-pages.service";

export const PRODUCT_PAGES_QUERY_KEY = "product-pages";

export function useProductPages() {
    return useQuery({
        queryKey: [PRODUCT_PAGES_QUERY_KEY],
        queryFn: productPagesService.getAllPages,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useUpdateProductPages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productPagesService.updatePages,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [PRODUCT_PAGES_QUERY_KEY],
            });
        },
    });
}

export function useEnabledProductPages() {
    return useQuery({
        queryKey: [PRODUCT_PAGES_QUERY_KEY, "enabled"],
        queryFn: productPagesService.getEnabledPages,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
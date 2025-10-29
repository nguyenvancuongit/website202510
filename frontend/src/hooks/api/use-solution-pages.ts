import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SolutionPageItem, SolutionPagesConfig, solutionPagesService } from "@/services/solution-pages.service";

export const SOLUTION_PAGES_KEYS = {
    all: ["solution-pages"] as const,
    admin: () => [...SOLUTION_PAGES_KEYS.all, "admin"] as const,
};

/**
 * Hook for fetching all solution pages configuration (admin)
 */
export function useSolutionPagesAdmin() {
    return useQuery({
        queryKey: SOLUTION_PAGES_KEYS.admin(),
        queryFn: () => solutionPagesService.getAllPages(),
        placeholderData: keepPreviousData,
        select: (data) => {
            const pages: SolutionPageItem[] = Object.entries(data)
                .map(([key, page]) => ({
                    ...page,
                    id: key,
                    key,
                }))
                .sort((a, b) => a.order - b.order);
            return pages;

        }
    });
}

/**
 * Hook for updating solution pages configuration
 */
export function useUpdateSolutionPages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (config: SolutionPagesConfig) =>
            solutionPagesService.updatePages(config),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SOLUTION_PAGES_KEYS.all });
        },
    });
}

import { api } from "@/lib/fetch";

export interface SolutionPageConfig {
    enabled: boolean;
    order: number;
    name: string;
    description: string;
    slug: string;
}

export interface SolutionPagesConfig {
    [key: string]: SolutionPageConfig;
}

export interface SolutionPagesResponse {
    data: SolutionPagesConfig;
}

export const solutionPagesService = {
    /**
     * Get enabled solution pages configuration (public endpoint)
     */
    async getEnabledPages() {
        const response = await api.get<SolutionPagesConfig>(
            "/system-settings/public/solution-pages"
        );
        return response.data;
    },
};
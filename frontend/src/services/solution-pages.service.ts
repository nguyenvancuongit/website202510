import { httpClient } from "@/lib/http-client";

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

export interface SolutionPageItem extends SolutionPageConfig {
    id: string;
    key: string;
}



export const solutionPagesService = {
    /**
     * Get all solution pages configuration (admin endpoint)
     */
    async getAllPages(): Promise<SolutionPagesConfig> {
        const response = await httpClient.get<SolutionPagesConfig>(
            "/system-settings/solution-pages"
        );
        return response;
    },

    /**
     * Update solution pages configuration
     */
    async updatePages(config: SolutionPagesConfig): Promise<SolutionPagesConfig> {
        const response = await httpClient.post<SolutionPagesConfig>(
            "/system-settings/solution-pages",
            config
        );
        return response;
    },

    /**
     * Get enabled solution pages (public endpoint)
     */
    async getEnabledPages(): Promise<SolutionPagesConfig> {
        const response = await httpClient.get<SolutionPagesConfig>(
            "/system-settings/public/solution-pages"
        );
        return response;
    },
};
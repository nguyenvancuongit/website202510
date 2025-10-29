import { httpClient } from "@/lib/http-client";

export interface ProductPageConfig {
    enabled: boolean;
    order: number;
    name: string;
    description: string;
    slug: string;
}

export interface ProductPagesConfig {
    [key: string]: ProductPageConfig;
}

export interface ProductPageItem extends ProductPageConfig {
    id: string;
    key: string;
}

export const productPagesService = {
    /**
     * Get all product pages configuration (admin endpoint)
     */
    async getAllPages(): Promise<ProductPagesConfig> {
        const response = await httpClient.get<ProductPagesConfig>(
            "/system-settings/product-pages"
        );
        return response;
    },

    /**
     * Update product pages configuration
     */
    async updatePages(config: ProductPagesConfig): Promise<ProductPagesConfig> {
        const response = await httpClient.post<ProductPagesConfig>(
            "/system-settings/product-pages",
            config
        );
        return response;
    },

    /**
     * Get enabled product pages (public endpoint)
     */
    async getEnabledPages(): Promise<ProductPagesConfig> {
        const response = await httpClient.get<ProductPagesConfig>(
            "/system-settings/public/product-pages"
        );
        return response;
    }
};
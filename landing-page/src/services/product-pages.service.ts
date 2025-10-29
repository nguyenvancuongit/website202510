import { api } from "@/lib/fetch";

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

export const productPagesService = {
	/**
	 * Get enabled product pages (public endpoint)
	 */
	async getEnabledPages() {
		const response = await api.get<ProductPagesConfig>(
			"/system-settings/public/product-pages"
		);
		return response.data;
	}
};
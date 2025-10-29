import { api } from "@/lib/fetch";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export async function getCategories(type: "latest-new" | "case-study" = "latest-new"): Promise<Category[]> {
  const { data } = await api.get<Category[]>(
    `/public/categories/${type}`
  );
  return data;
}
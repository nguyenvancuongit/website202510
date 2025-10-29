import { api } from "@/lib/fetch";
import { withQuery } from "@/lib/http";
import { MediaObject } from "@/services/banner.service";
import { ListResponse } from "@/types";

export interface LatestNewsCategory {
  id: string;
  name: string;
  slug: string;
}

export interface LatestNewsItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: LatestNewsCategory;
  web_thumbnail: MediaObject;
  mobile_thumbnail: MediaObject;
  featured: boolean;
  created_at: string;
  published_date: string;
  updated_at: string;
  previous_post?: ShortenLatestNews | null;
  next_post?: ShortenLatestNews | null;
}

export type LatestNewSeo = Pick<
  LatestNewsItem,
  "title" | "description" | "web_thumbnail" | "published_date"
>;

interface ShortenLatestNews {
  id: string;
  title: string;
  slug: string;
}

export async function getLatestNews(params?: {
  page?: number;
  limit?: number;
  category_id?: number;
}) {
  const { data } = await api.get<ListResponse<LatestNewsItem>>(
    withQuery("/public/latest-news", params)
  );
  return data;
}

export async function getLatestNewsBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const { data } = await api.get<LatestNewsItem>(
    `/public/latest-news/slug/${decodedSlug}`
  );

  return data;
}

export async function getLatestNewsPerCategory(): Promise<
  Array<{
    category: { id: string; name: string; slug: string };
    news: LatestNewsItem[];
  }>
> {
  const { data } = await api.get<
    Array<{
      category: { id: string; name: string; slug: string };
      news: LatestNewsItem[];
    }>
  >("/public/latest-news/latest-news-per-category");
  return data;
}

export async function getLatestNewsSeoData(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const { data } = await api.get<LatestNewSeo>(
    `/public/latest-news/seo/${decodedSlug}`
  );
  return data;
}

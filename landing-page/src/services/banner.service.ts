import { api } from "@/lib/fetch";

export interface MediaObject {
  id: string;
  name: string;
  path: string;
  type: "image" | "video";
  size: number;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
  updated_at: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  link_url: string;
  sort_order: number;
  web_media: MediaObject;
  mobile_media: MediaObject;
}

export async function getBannerSlides(): Promise<BannerSlide[]> {
  const response = await api.get<BannerSlide[]>("/public/banners");
  return response.data;
}

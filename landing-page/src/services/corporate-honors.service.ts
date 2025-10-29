import { api } from "@/lib/fetch";
import { withQuery } from "@/lib/http";
import { MediaObject } from "@/services/banner.service";

export interface CorporateHonor {
  id: string;
  name: string;
  obtained_date: string;
  image: MediaObject | null;
}

export interface CorporateHonorsResponse {
  data: CorporateHonor[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export async function getCorporateHonors(params?: {
  page?: number;
  limit?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: "created_at" | "updated_at" | "obtained_date" | "sort_order";
  sort_order?: "asc" | "desc";
}): Promise<CorporateHonor[]> {
  const { data } = await api.get<CorporateHonor[]>(
    withQuery("/public/corporate-honors", params)
  );
  return data;
}

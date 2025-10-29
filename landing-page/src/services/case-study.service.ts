import { ResponseWithPagination } from "@/app/types";
import { api } from "@/lib/fetch";

import { MediaObject } from "./banner.service";
import { Category } from "./categories.service";

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  content: string;
  customer_name: string;
  key_highlights: string[];
  highlight_description: string;
  customer_feedback: string;
  category: Category;
  web_thumbnail: MediaObject;
  mobile_thumbnail: MediaObject;
  customer_logo: MediaObject;
}

const getCaseStudies = async () => {
  const res = await api.get<ResponseWithPagination<CaseStudy>>(
    "/public/case-studies"
  );
  return res.data;
};

const getListCaseStudies = async (caseStudyQuery: {
  page?: number;
  categoryId?: string;
  limit?: number;
}) => {
  const { page = 1, categoryId, limit = 15 } = caseStudyQuery;
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  if (categoryId) {
    queryParams.append("category_id", categoryId);
  }
  const res = await api.get<ResponseWithPagination<CaseStudy>>(
    `/public/case-studies?${queryParams.toString()}`
  );

  return res.data;
}

const getCaseStudy = async (slug: string) => {
  try {
    const res = await api.get<CaseStudy>(
      `/public/case-studies/slug/${slug}`
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export { getCaseStudies, getCaseStudy, getListCaseStudies };

import { api } from "@/lib/fetch";
import { withQuery } from "@/lib/http";

// 职位性质 - 常量
export const JOB_TYPES = {
  FULL_TIME: "full_time",
  INTERNSHIP: "internship",
} as const;

export const JOB_TYPE_LABELS: Record<string, string> = {
  [JOB_TYPES.FULL_TIME]: "全职",
  [JOB_TYPES.INTERNSHIP]: "实习",
};

// Public API response types (use exact field names from backend)

export interface RecruitmentPostTypePublic {
  id: string
  name: string
  slug: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface RecruitmentPostItem {
  id: string
  job_title: string
  slug: string
  job_description: string
  job_type: string
  status: string
  created_at: string
  updated_at: string
  recruitment_post_type: RecruitmentPostTypePublic
}

export interface RecruitmentPostsListResponse {
  data: RecruitmentPostItem[]
  total: number
  page: number
  limit: number
  pagination: {
    total_pages: number
    has_next?: boolean
    has_prev?: boolean
  }
}

// Submit resume application
export async function submitResumeApplication(params: {
  recruitment_post_id: string
  resume: File
}) {
  const form = new FormData()
  form.append("recruitment_post_id", params.recruitment_post_id)
  form.append("resume", params.resume)

  const { data } = await api.post<{ message: string; applicationId: string; jobTitle: string; jobType: string }>(
    "/public/resume-applications",
    form
  )
  return data
}

// Public API integration
export async function getJobs(params?: {
  page?: number;
  limit?: number;
  category_id?: number | number[]; // accept single or multiple -> CSV in recruitment_post_type_id
  type?: string;
  search?: string;
}) {
  const query = withQuery("/public/recruitment-posts", {
    page: params?.page,
    limit: params?.limit,
    recruitment_post_type_ids: Array.isArray(params?.category_id)
      ? params?.category_id.join(",")
      : params?.category_id,
    job_type: params?.type,
    job_title: params?.search,
  });

  const { data } = await api.get<RecruitmentPostsListResponse>(query)
  return data
}

export async function getJobBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const { data } = await api.get<RecruitmentPostItem>(`/public/recruitment-posts/slug/${decodedSlug}`)
  return data
}

export async function getJobById(id: string) {
  // For public site, id is the slug of the recruitment post
  return getJobBySlug(id);
}

// If needed later, SEO data can be derived at usage site directly from raw job payload

export async function getJobCategories() {
  const { data } = await api.get<RecruitmentPostTypePublic[]>("/public/recruitment-post-types")
  return data
}

export async function getLatestJobs(jobId: string, limit: number = 4) {
  const { data } = await api.get<RecruitmentPostItem[]>(withQuery(`/public/recruitment-posts/related-posts/${jobId}`, { limit }))
  return data
}

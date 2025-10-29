import { Metadata } from "next";

import { formatDateISO } from "@/lib/utils";
import { getJobBySlug } from "@/services/careers.service";

import JobDetailContent from "./page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const jobSlug = (await params).slug;
  try {
    const job = await getJobBySlug(jobSlug);

    if (!job) {
      return {
        title: "职位未找到 - 招聘信息",
        description: "您查看的职位不存在或已被删除。",
      };
    }

    // Generate JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.job_title,
      description: job.job_description,
      datePosted: formatDateISO(job.created_at),
      validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      employmentType: "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: "象导生涯",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.vianai.com"
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: "CN"
        }
      }
    };

    return {
      title: `${job.job_title} - 招聘信息`,
      description: job.job_description,
      openGraph: {
        title: job.job_title,
        type: "article",
        publishedTime: formatDateISO(job.created_at),
        description: job.job_description,
      },
      other: {
        "application/ld+json": JSON.stringify(jsonLd),
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return {
      title: "职位未找到 - 招聘信息",
      description: "您查看的职位不存在或已被删除。",
    };
  }
}

export default function JobDetailPage() {
  return <JobDetailContent />;
}

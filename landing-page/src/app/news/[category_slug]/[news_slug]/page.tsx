import { Metadata } from "next";

import { formatDateISO } from "@/lib/utils";
import { getLatestNewsSeoData } from "@/services/latest-news.service";

import NewsDetail from "./page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ news_slug: string }>;
}): Promise<Metadata> {
  const newsSlug = (await params).news_slug;
  try {
    const article = await getLatestNewsSeoData(newsSlug);

    if (!article) {
      return {
        title: "文章未找到 - 公司新闻",
        description: "您查看的文章不存在或已被删除。",
      };
    }

    // Generate JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      image: article.web_thumbnail?.path ? [article.web_thumbnail.path] : undefined,
      datePublished: formatDateISO(article.published_date),
      dateModified: formatDateISO(article.published_date),
      author: {
        "@type": "Organization",
        name: "象导生涯",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.vianai.com"
      },
      publisher: {
        "@type": "Organization",
        name: "象导生涯",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.vianai.com",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.vianai.com"}/logo.png`
        }
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.vianai.com"}/news/${newsSlug}`
      }
    };

    return {
      title: article.title,
      description: article.description,
      openGraph: {
        title: article.title,
        type: "article",
        publishedTime: formatDateISO(article.published_date),
        description: article.description,
        images: article.web_thumbnail.path
          ? [
            {
              url: article.web_thumbnail.path,
              width: 800,
              height: 600,
              alt: article.title,
            },
          ]
          : undefined,
      },
      other: {
        "application/ld+json": JSON.stringify(jsonLd),
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return {
      title: "文章未找到 - 公司新闻",
      description: "您查看的文章不存在或已被删除。",
    };
  }
}

export default function NewsDetailPage() {
  return <NewsDetail />;
}

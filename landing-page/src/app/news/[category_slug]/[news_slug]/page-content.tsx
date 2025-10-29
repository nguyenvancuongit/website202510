"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { NewsDetailFallback } from "@/components/news/news-detail-fallback";
import { NewsHero } from "@/components/news/news-hero";
import { formatDateISO } from "@/lib/utils";
import { getLatestNewsBySlug } from "@/services/latest-news.service";

export default function NewsDetail() {
  const params = useParams<{ category_slug: string; news_slug: string }>();
  const newsSlug = (params?.news_slug as string) || "";

  const {
    data: article,
    isLoading,
    isError,
    error,
    refetch: handleRetry,
  } = useQuery({
    queryKey: ["latest-news", "detail", newsSlug],
    queryFn: () => getLatestNewsBySlug(newsSlug),
    enabled: !!newsSlug,
  });

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-white select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <NewsDetailFallback />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div
        className="min-h-screen bg-white select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
            <div className="text-center py-20">
              <p className="text-gray-600">文章未找到或加载失败</p>
              {error && (
                <p className="text-sm text-red-500 mb-4">
                  Error: {(error as Error).message}
                </p>
              )}
              <div className="space-x-4">
                <button
                  onClick={() => handleRetry()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  重试
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  重新加载
                </button>
                <Link
                  href={`/news/${params?.category_slug}`}
                  className="text-[#1d8bf8] hover:underline mt-4 inline-block"
                >
                  返回列表页
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <NewsHero
        badgeLabel={article.category.name}
        date={formatDateISO(article.published_date)}
        title={article.title}
      />

      <article className="md:py-16 py-0">
        <div className="max-w-7xl mx-auto px-6 md:py-16 py-4 space-y-16">
          <div className="prose prose-lg max-w-none">
            {article.description && (
              <div
                className="mb-8"
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            )}
            <div className="my-8">
              <Image
                src={article.web_thumbnail.path}
                alt={article.title}
                width={600}
                height={400}
                className="w-full rounded-lg"
                priority
              />
            </div>
            <div
              className="text-gray-700 leading-relaxed prose prose-lg [&_img]:mx-auto max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
          <div className="flex flex-col gap-6 border-none sm:border-t border-[#D5D5D5] pt-0 sm:pt-9">
            {article.previous_post && (
              <Link
                href={`/news/${params?.category_slug}/${article.previous_post?.slug}`}
                className="flex-1 underline-offset-4 w-fit hover:underline hover:text-vibrant-blue text-medium-dark-blue-grey text-sm sm:text-xl visited:font-medium font-normal underline-none sm:underline decoration-white visited:text-charcoal visited:decoration-charcoal transition-colors"
              >
                上一篇 : {article.previous_post.title}
              </Link>
            )}
            {article.next_post && (
              <Link
                href={`/news/${params?.category_slug}/${article.next_post?.slug}`}
                className="flex-1 underline-offset-4 w-fit hover:underline hover:text-vibrant-blue text-medium-dark-blue-grey text-sm sm:text-xl visited:font-medium font-normal underline-none sm:underline decoration-white visited:text-charcoal visited:decoration-charcoal transition-colors"
              >
                下一篇: {article.next_post.title}
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

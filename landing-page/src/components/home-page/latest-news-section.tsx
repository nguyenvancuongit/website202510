"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useLatestNewsPerCategory } from "@/hooks/use-latest-news";
import { cn, formatDateISO } from "@/lib/utils";

import { GradientButton } from "../ui/gradient-button";

import SectionHeader from "./section-header";

export default function LatestNewsSection() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const {
    data: newsData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useLatestNewsPerCategory();

  // Extract all categories and add "all" option
  const newsCategories = [
    { id: "all", label: "全部新闻" },
    ...newsData.map((item) => ({
      id: item.category.id,
      label: item.category.name,
    })),
  ];

  // Filter articles based on active category
  const filteredArticles =
    activeCategory === "all"
      ? newsData
        .flatMap((item) => item.news)
        .sort((a, b) => {
          // First, prioritize featured articles
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;

          // Then, handle null published_date (put them at the end)
          if (!a.published_date && !b.published_date) return 0;
          if (!a.published_date) return 1;
          if (!b.published_date) return -1;

          // Finally, sort by published_date (newest first)
          return b.published_date.localeCompare(a.published_date);
        })
        .slice(0, 3)
      : newsData.find((item) => item.category.id === activeCategory)?.news ||
      [];

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#F4F9FF]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="最新动态"
            subtitle="象导生涯精彩活动及行业动态"
          />
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-500">加载中...</div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 bg-[#F4F9FF]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="最新动态"
            subtitle="象导生涯精彩活动及行业动态"
          />
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="text-lg text-red-500">
              {error instanceof Error ? error.message : "加载新闻时出错"}
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#F4F9FF]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="最新动态" subtitle="象导生涯精彩活动及行业动态" />
        {/* Header with tabs and button */}
        <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-12">
          <div className="flex overflow-x-auto gap-8 mb-6 lg:mb-0">
            {newsCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "text-sm md:text-[20px] cursor-pointer font-medium transition-colors duration-200 whitespace-nowrap",
                  activeCategory === category.id
                    ? "text-[#1C1919] pb-1 text-[20px] md:text-[30px]"
                    : "text-medium-dark-blue-grey hover:text-vibrant-blue"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          <GradientButton
            className="hidden md:flex"
            onClick={() => router.push("/news")}
          >
            查看更多
            <Image
              alt="system guide"
              src="/icons/system-guide-icon.svg"
              height={36}
              width={36}
              className="w-6 h-6"
            />
          </GradientButton>
        </div>

        {/* News articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link
                href={`/news/${article.category.slug}/${article.slug}`}
                key={article.id}
              >
                <article key={article.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4 md:mb-0">
                    <Image
                      src={article.web_thumbnail.path || "/placeholder.svg"}
                      alt={article.title}
                      width={400}
                      height={250}
                      className="w-full h-37 md:w-[527px] md:h-[396px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Mobile overlay with title */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 block md:hidden md:group-hover:block animate-in fade-in duration-300"
                      style={{
                        background:
                          "linear-gradient(0deg, #212326 11.9%, rgba(0, 50, 141, 0.00) 86.19%)",
                      }}
                    >
                      <h3 className="font-medium text-white line-clamp-2 align-bottom">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  {/* Article content - hidden on mobile, visible on desktop */}
                  <div className="space-y-2 mt-4">
                    <p
                      className="text-dark-blue-grey text-sm line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: article.description,
                      }}
                    />
                    <p className="text-gray-400 text-sm">
                      {formatDateISO(article.published_date)}
                    </p>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">暂无新闻内容</div>
            </div>
          )}
        </div>

        <GradientButton
          className="flex mx-auto mt-8 md:hidden"
          onClick={() => router.push("/news")}
        >
          查看更多
          <Image
            alt="system guide"
            src="/icons/system-guide-icon.svg"
            height={36}
            width={36}
            className="w-6 h-6"
          />
        </GradientButton>
      </div>
    </section>
  );
}

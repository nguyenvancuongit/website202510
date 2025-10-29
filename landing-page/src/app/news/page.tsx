"use client";

import { useQuery } from "@tanstack/react-query";

import { NewsCardFallback } from "@/components/news/news-card-fallback";
import { NewsHero } from "@/components/news/news-hero";
import { NewsSection } from "@/components/news/news-section";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useMedia } from "@/hooks/use-media";
import { getLatestNewsPerCategory } from "@/services/latest-news.service";

export default function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["latest-news", "per-category"],
    queryFn: () => getLatestNewsPerCategory(),
  });

  const { isMobile } = useMedia();

  return (
    <div className="min-h-fit sm:min-h-screen bg-[#ffffff]">
      <NewsHero
        title={"新闻中心"}
        description={
          <>
            <p>感谢您对纬英科技·象导生涯的关注！</p>
            <p>这里为将您呈现最新的企业新闻、品牌活动与产品动态</p>
          </>
        }
      />

      <div className="max-w-7xl mx-auto md:px-6 px-4 py-10 md:py-16 space-y-16">
        {isLoading ? (
          <div className="space-y-16">
            {Array.from({ length: 3 }).map((_, i) => (
              <NewsCardFallback key={i} variant="grid" items={isMobile ? 2 : 3} showTitle />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            details={(error as Error)?.message}
            actions={[
              { label: "重新加载", onClick: () => window.location.reload() },
            ]}
          />
        ) : data?.length === 0 ? (
          <EmptyState title="暂无数据" message="暂时没有可用的新闻分类" />
        ) : (
          data?.map((section) => (
            <NewsSection
              key={section.category.id}
              title={section.category.name}
              news={isMobile ? section.news.slice(0, 2) : section.news}
              isLoading={isLoading}
              isError={isError}
              moreLink={`/news/${section.category.slug}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

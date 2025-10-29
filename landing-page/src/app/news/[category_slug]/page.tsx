"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { NewsCardFallback } from "@/components/news/news-card-fallback";
import { NewsHero } from "@/components/news/news-hero";
import NewsListItem from "@/components/news/news-list-item";
import CompactPagination from "@/components/ui/compact-pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import usePage from "@/hooks/use-page";
import { type CategoryLite, getCategoryTitle } from "@/lib/news";
import { getCategories } from "@/services/categories.service";
import {
  getLatestNews,
  type LatestNewsItem,
} from "@/services/latest-news.service";

export default function CategoryNewsPage() {
  const params = useParams<{ category_slug: string }>();
  const categorySlug = decodeURIComponent(
    (params?.category_slug as string) || ""
  );
  const router = useRouter();
  const page = usePage();

  const { data: categoriesData = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories("latest-new"),
  });
  const categories: CategoryLite[] = categoriesData;
  const category = categories.find(
    (c) => c.slug === categorySlug || c.name === categorySlug
  );
  const categoryId = category?.id ? Number(category.id) : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ["latest-news", "by-category", categorySlug, page, categoryId],
    queryFn: () => getLatestNews({ page, limit: 10, category_id: categoryId }),
    enabled: !!categoryId,
  });

  const items: LatestNewsItem[] = data?.data || [];

  if (!categoriesLoading && !category) {
    return (
      <div className="min-h-fit sm:min-h-screen bg-white">
        <NewsHero title={"新闻中心"} description={"关注象导生涯最新资讯"} />
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="text-gray-500 text-lg mb-4">分类不存在</div>
            <Link
              href="/news"
              className="inline-block px-6 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              返回新闻首页
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-fit sm:min-h-screen bg-white">
      <NewsHero
        title={getCategoryTitle(category?.name, categories)}
        description={"关注象导生涯最新资讯"}
      />

        <section className="py-10 md:py-16">
          <div className="max-w-7xl mx-auto md:px-6 px-4 space-y-16">
          <h3 className="text-2xl hidden md:block font-medium text-charcoal">
            {getCategoryTitle(category?.name, categories)}
          </h3>

          <div className="md:space-y-20 space-y-5">
            {categoriesLoading || isLoading ? (
              <NewsCardFallback variant="list" items={6} />
            ) : error ? (
              <ErrorState
                details={(error as Error)?.message}
                actions={[
                  {
                    label: "重新加载",
                    onClick: () => window.location.reload(),
                  },
                ]}
              />
            ) : items.length === 0 ? (
              <EmptyState
                title="暂无数据"
                message="该分类下暂时没有新闻文章"
                actions={[{ label: "返回新闻首页", href: "/news" }]}
              />
            ) : (
              items.map((item) => (
                <NewsListItem
                  key={item.id}
                  item={item}
                  href={`/news/${encodeURIComponent(categorySlug)}/${item.slug
                    }`}
                />
              ))
            )}
          </div>

          {!isLoading &&
            !categoriesLoading &&
            !error &&
            items.length > 0 &&
            (data?.pagination?.total_pages || 1) > 1 && (
              <div className="flex justify-center mt-12">
                <CompactPagination
                  currentPage={page}
                  onPageChange={(p) =>
                    router.push(
                      `/news/${encodeURIComponent(categorySlug)}?page=${p}`
                    )
                  }
                  totalPages={data?.pagination?.total_pages || 1}
                />
              </div>
            )}
        </div>
      </section>
    </div>
  );
}

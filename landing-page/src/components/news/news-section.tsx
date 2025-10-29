import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { formatDateISO } from "@/lib/utils";
import { LatestNewsItem } from "@/services/latest-news.service";

interface NewsSectionProps {
  title: string;
  news: LatestNewsItem[];
  isLoading: boolean;
  isError: boolean | Error | null;
  moreLink?: string;
}

export function NewsSection({
  title,
  news,
  isLoading,
  isError,
  moreLink = "#",
}: NewsSectionProps) {
  if (isError) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h2
            className="text-3xl font-bold leading-none text-charcoal"
            style={{ fontFamily: "var(--font-source-han-sans-cn)" }}
          >
            {title}
          </h2>
          <Link
            href={moreLink}
            className="inline-flex items-center gap-2 text-medium-dark-blue-grey hover:text-vibrant-blue transition-colors"
          >
            <span>更多</span>
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M15.8027 13.4492C14.0671 11.3984 14.2449 7.69506 15.8027 5.19964C13.3678 6.86177 9.70055 6.95779 7.55315 5.19964"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.19727 15.806L14.6254 6.37791"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
        <div className="text-center py-8 text-[#4e5969]">
          加载失败，请稍后重试
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <h2
          className="text-lg md:text-3xl font-bold leading-none text-charcoal"
        >
          {title}
        </h2>
        <Link
          href={moreLink}
          className="inline-flex text-xs md:text-base items-center sm:gap-2 gap-1 text-medium-dark-blue-grey hover:text-vibrant-blue transition-colors"
        >
          <span>更多</span>
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 size-4 sm:size-5"
          >
            <path
              d="M15.8027 13.4492C14.0671 11.3984 14.2449 7.69506 15.8027 5.19964C13.3678 6.86177 9.70055 6.95779 7.55315 5.19964"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.19727 15.806L14.6254 6.37791"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="overflow-hidden animate-pulse py-0 rounded-3xl shadow-none h-full"
            >
              <div className="w-full h-48 bg-footer-text-light"></div>
              <CardContent className="px-4 pb-4">
                <div className="h-4 bg-footer-text-light rounded mb-2 w-20"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-footer-text-light rounded"></div>
                  <div className="h-4 bg-footer-text-light rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm">该分类下暂无新闻</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.category.slug}/${item.slug}`}
              className="block h-full"
            >
              <Card className="group overflow-hidden cursor-pointer py-0 rounded-md md:rounded-3xl shadow-none gap-0 h-full">
                <Image
                  src={
                    typeof item.web_thumbnail === "string"
                      ? item.web_thumbnail
                      : item.web_thumbnail?.path || "/placeholder.svg"
                  }
                  alt={item.title}
                  width={400}
                  height={280}
                  className="w-full h-28 md:h-[280px] object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
                <CardContent className="px-2 md:px-4 pb-2 md:pb-4 md:pt-4 pt-2 flex flex-col-reverse gap-1.5 md:gap-3 md:flex-col">
                  <p
                    className="text-dark-blue-grey text-[13px] md:text-base font-normal leading-none"
                  >
                    {formatDateISO(item.published_date)}
                  </p>
                  <h3
                    className="text-charcoal text-sm md:text-xl font-semibold md:font-medium leading-snug line-clamp-2 min-h-[2rem] md:min-h-[3.25rem]"
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

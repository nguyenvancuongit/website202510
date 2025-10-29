import type { ReactNode } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface NewsHeroProps {
  title?: string;
  description?: ReactNode;
  badgeLabel?: string;
  date?: string;
}

export function NewsHero({
  title,
  description,
  badgeLabel,
  date,
}: NewsHeroProps) {
  return (
    <section className="bg-gradient-to-r from-[#67A6FF] to-[#E7EEFF] h-[380px] py-10 sm:py-20 pt-20 sm:pt-30">
      <div className="max-w-7xl mx-auto relative md:px-6 px-4">
        <div className="flex items-center justify-between">
          <div className="overflow-hidden">
            {(badgeLabel || date) && (
              <div className="flex items-center gap-3 mb-6">
                {badgeLabel && (
                  <Button
                    className="inline-flex items-center px-3 py-1 rounded-3xl text-white text-sm"
                    style={{
                      background:
                        "linear-gradient(180deg, #1D2129 0%, #214881 100%)",
                    }}
                  >
                    {badgeLabel}
                  </Button>
                )}
                {date && <div className="text-charcoal text-sm md:text-xl">{date}</div>}
              </div>
            )}
            {title && (
              <h1 className="text-lg sm:text-4xl font-bold text-charcoal mb-4 relative z-10 ellipsis sm:truncate ">
                {title}
              </h1>
            )}
            <div className="text-charcoal text-xs sm:text-lg space-y-2 w-full">
              {typeof description === "string" ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>
          </div>
          <div className="flex justify-end items-center absolute right-0 sm:right-20 top-1/2 -translate-y-1/2">
            <Image
              src="/images/illustrations/news.svg"
              alt="News illustration"
              width={192}
              height={144}
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

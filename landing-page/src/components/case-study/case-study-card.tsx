"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import SystemGuideIcon from "@/assets/system-guide-icon";
import { useMedia } from "@/hooks/use-media";
import { cn } from "@/lib/utils";
import { CaseStudy } from "@/services/case-study.service";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

const CaseStudyCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMobile } = useMedia();

  const handleCardClick = (e: React.MouseEvent) => {
    // Only prevent navigation on mobile when card is not expanded
    if (isMobile && !isExpanded) {
      e.preventDefault();
      setIsExpanded(true);
    }
  };

  return (
    <Link
      href={`/case-study/${caseStudy.category.slug}/${caseStudy.slug}`}
      className="flex items-center justify-around rounded-xl"
      onClick={handleCardClick}
    >
      <Card
        className={`w-full max-w-[420px] h-[461px] p-0 rounded-xl border-transparent border-none md:border md:border-solid group shadow-none md:border-[#e1e7ee] md:hover:bg-[linear-gradient(180deg,rgba(3,129,255,1)_0%,rgba(103,179,255,1)_100%)] md:hover:border-transparent transition-all duration-500 ease-in-out relative overflow-hidden ${isExpanded ? "h-auto border-transparent" : ""
          }`}
      >
        {/* Default state - visible when not expanded on mobile, hidden on hover for desktop */}
        <CardContent
          className={`hidden md:flex absolute inset-0 px-8 py-2 md:pt-8 md:pb-11 flex-col gap-[23px] transition-opacity duration-200 ease-in-out ${isExpanded ? "opacity-0" : "opacity-100"
            } md:opacity-100 md:group-hover:opacity-0`}
        >
          <Image
            className="w-full h-[233px] object-cover rounded"
            alt="thumbnail"
            src={caseStudy.web_thumbnail.path}
            width={420}
            height={233}
          />
          <p
            className="text-medium-dark-blue-grey text-base line-clamp-3 leading-7 font-normal whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: caseStudy.highlight_description,
            }}
          />
          <div className="font-medium text-charcoal text-lg">
            {caseStudy.title}
          </div>
        </CardContent>

        {/* Expanded state for mobile - shows image on top with blue content below */}
        <CardContent
          className={cn(
            "md:hidden p-0 flex flex-col border-b-[1px] border-dashed h-100"
          )}
        >
          <div className="relative max-h-100 h-100">
            {/* image and description */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col gap-3 transition-opacity duration-200 ease-in-out",
                isExpanded ? "opacity-0" : "opacity-100"
              )}
            >
              <Image
                className="w-full object-cover rounded-xl h-[190px] flex-shrink-0"
                alt="thumbnail"
                src={caseStudy.web_thumbnail.path}
                width={420}
                height={190}
              />
              <p
                className="text-medium-dark-blue-grey text-base line-clamp-3 leading-7 font-normal whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: caseStudy.highlight_description,
                }}
              />
            </div>

            {/* Blue content section */}
            <div
              className={cn(
                "absolute inset-0 bg-[#4A8FE7] p-6 rounded-xl flex flex-col justify-between transition-opacity duration-500 ease-in-out overflow-auto",
                isExpanded ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-[25px]">
                  <div className="flex flex-col gap-6">
                    <div className="font-medium text-white text-2xl truncate">
                      核心亮点：xxxxxxxxxxxxxxxx
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {caseStudy.key_highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="font-normal text-white text-lg"
                        >
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-[11px]">
                  <div className="font-medium text-white text-2xl">
                    客户反馈
                  </div>

                  <p
                    className=" font-normal text-white text-lg leading-[29px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                    dangerouslySetInnerHTML={{
                      __html: caseStudy.customer_feedback,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Image on top */}
          <div className="flex justify-between items-center py-6 gap-4">
            <div className="font-medium text-charcoal text-lg">
              {caseStudy.title}
            </div>
            {/* Learn more button */}
            <Button
              variant="outline"
              className={cn(
                "h-auto cursor-pointer border border-[#1C88F9] bg-transparent hover:bg-white/10 text-[#1C88F9] hover:text-[#1C88F9] rounded-[21px] py-2 w-fit gap-1",
                isExpanded ? "flex" : "hidden"
              )}
            >
              <span className=" font-normal text-sm">了解更多</span>
              <SystemGuideIcon
                className={cn("text-[#1C88F9] [&_path]:stroke-[#1C88F9]")}
              />
            </Button>
          </div>
        </CardContent>

        {/* Desktop hover card - hidden on mobile */}
        <CardContent
          className={
            "hidden md:flex absolute inset-0 p-11 flex-col gap-[23px] transition-opacity duration-500 ease-in-out justify-between overflow-auto opacity-0 group-hover:opacity-100"
          }
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-[25px]">
              <div className="flex flex-col gap-6">
                <div className="font-medium text-white text-2xl truncate">
                  核心亮点：xxxxxxxxxxxxxxxx
                </div>

                <div className="flex flex-col gap-1.5 line-clamp-2">
                  {caseStudy.key_highlights.map((highlight, index) => (
                    <div key={index} className="font-normal text-white text-lg">
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-[11px]">
              <div className="font-medium text-white text-2xl">客户反馈</div>

              <p
                className=" font-normal text-white text-lg leading-[29px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                dangerouslySetInnerHTML={{
                  __html: caseStudy.customer_feedback,
                }}
              />
            </div>
          </div>

          <Button
            variant="outline"
            className="h-auto cursor-pointer border border-white bg-transparent hover:bg-white/10 text-white hover:text-white rounded-[21px] px-4 py-2 w-fit gap-1"
          >
            <span className=" font-normal text-sm">了解更多</span>
            <Image
              src="/icons/system-guide-icon.svg"
              alt="System Guide Icon"
              width={36}
              height={36}
              className="w-5 h-5"
            />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export const CaseStudyCardFallback = () => {
  return (
    <Card className="w-full max-w-[420px] h-[480px] rounded-xl border border-[#e1e7ee] animate-pulse">
      <CardContent className="p-6 flex flex-col gap-3">
        {/* Skeleton for image */}
        <div className="w-full h-[233px] bg-gray-200 rounded"></div>

        {/* Skeleton for description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Skeleton for title */}
        <div className="h-5 bg-gray-200 rounded w-2/3 mt-2"></div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;

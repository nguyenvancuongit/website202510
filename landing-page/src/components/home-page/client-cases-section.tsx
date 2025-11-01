"use client";

import { SVGProps, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMedia } from "@/hooks/use-media";
import { getTruncatedTextFromHtml } from "@/lib/string";
import { cn } from "@/lib/utils";
import { CaseStudy } from "@/services/case-study.service";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { GradientButton } from "../ui/gradient-button";

import SectionHeader from "./section-header";

interface Props {
  caseStudies: CaseStudy[];
}

const TopGradientIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1537"
      height="168"
      viewBox="0 0 1537 168"
      fill="none"
      {...props}
    >
      <path
        d="M1537 0H0C37.2363 55.9464 272.203 166.104 770 167.982C1216.2 169.665 1503.65 55.9464 1537 0Z"
        fill="url(#paint0_linear_1_25)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_25"
          x1="807.679"
          y1="53.9165"
          x2="808.544"
          y2="177.095"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.1" />
          <stop offset="1" stopColor="#D5F7FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const BottomGradientIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1912"
      height="248"
      viewBox="0 0 1912 248"
      fill="none"
      {...props}
    >
      <path
        d="M1912 0H-5C41.4424 84.7605 185.196 244.429 953.5 247.949C1690.23 251.325 1870.4 84.7605 1912 0Z"
        fill="url(#paint0_linear_1_24)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_24"
          x1="1010"
          y1="198.156"
          x2="1009.65"
          y2="253.846"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.1" />
          <stop offset="1" stopColor="#D3E8FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const ClientCasesSection = ({ caseStudies }: Props) => {
  const [hoveredItem, setHoveredItem] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();

  const { isMobile } = useMedia();
  const router = useRouter();
  const itemSizes = [
    "w-[197px] h-[290px] md:h-[434px] md:w-[295px]",
    "w-[176px] h-[244px] md:h-[365px] md:w-[264px]",
    "w-[258px] h-[345px] md:h-[517px] md:w-[386px]",
    "w-[216px] h-[281px] md:h-[421px] md:w-[325px]",
    "w-[226px] h-[345px] md:h-[517px] md:w-[339px]",
  ];

  const selectedItem = caseStudies[hoveredItem];

  useEffect(() => {
    if (!api || !isMobile) {
      return;
    }

    // Set initial active index
    setHoveredItem(api.selectedScrollSnap());

    // Listen to select events to update active index
    api.on("select", () => {
      setHoveredItem(api.selectedScrollSnap());
    });
  }, [api, isMobile]);

  return (
    <section className="max-w-7xl mx-auto md:px-6 py-20 md:py-20 bg-white ">
      <div className="relative pb-20 md:pb-50">
        <SectionHeader
          title="合作案例"
          subtitle="与我们一起，推动生涯教育数智化创新"
        />
        <TopGradientIcon className="w-full absolute top-2 md:top-10" />
        <BottomGradientIcon className="w-full absolute top-[-2] md:top-12" />
      </div>

      <div className="max-w-7xl mx-auto md:px-4">
        <div className="mb-12">
          <Carousel className="w-full" setApi={isMobile ? setApi : undefined}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {caseStudies?.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className="pl-2 md:pl-4 basis-auto flex flex-col justify-end"
                >
                  <div
                    className={cn(
                      "relative rounded-t-lg overflow-hidden cursor-pointer group",
                      itemSizes[index % 5]
                    )}
                    onMouseOver={() => setHoveredItem(index)}
                    onClick={() =>
                      router.push(
                        `/case-study/${item.category.slug}/${item.slug}`
                      )
                    }
                  >
                    <Image
                      src={item.web_thumbnail.path || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-115"
                    />

                    {/* Serial number on hover */}
                    {(hoveredItem === index || isMobile) && (
                      <>
                        {/* Gradient mask covering full width and 30% height from bottom */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-[30%] animate-in fade-in duration-300"
                          style={{
                            background:
                              "linear-gradient(0deg, #212326 11.9%, rgba(0, 50, 141, 0.00) 86.19%)",
                          }}
                        />
                        {/* Serial number */}
                        <div className="absolute bottom-4 left-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                          <span className="relative text-2xl md:text-5xl md:font-bold text-white z-10 font-meibei-he-he">
                            {index + 1 > 9 ? index + 1 : `0${index + 1}`}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Detail Section */}
        {!!selectedItem && (
          <div className="bg-white rounded-2xl md:p-8 max-w-5xl mx-auto px-5 h-[350px] md:h-[320px]">
            <div className="flex flex-col md:flex-row items-start md:gap-8">
              {/* Large number */}
              <div className="flex-shrink-0 flex md:block items-center gap-2">
                <span className="text-3xl md:w-auto text-center md:text-8xl md:font-bold leading-none pb-2 px-1.5 pt-1 md:p-0 bg-[#1D8BF8] md:bg-transparent text-white md:!text-charcoal font-meibei-he-he">
                  {hoveredItem + 1 > 9
                    ? hoveredItem + 1
                    : `0${hoveredItem + 1}`}
                </span>
                <h3 className="block md:hidden text-2xl md:font-bold text-dark-blue-grey leading-tight md:border-b md:border-charcoal w-fit">
                  {selectedItem.title}
                </h3>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="hidden md:block text-2xl md:font-bold text-dark-blue-grey pb-4 leading-tight border-b border-muted-foreground w-fit">
                  {selectedItem.title}
                </h3>
                <p className="text-medium-dark-blue-grey mt-4 leading-relaxed text-lg">
                  {getTruncatedTextFromHtml(selectedItem.customer_feedback, 150)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Link href="/case-study">
        <GradientButton className="mt-10 mx-auto">
          <span>更多案例</span>
          <Image
            alt="system guide"
            src="/icons/system-guide-icon.svg"
            height={36}
            width={36}
            className="w-6 h-6"
          />
        </GradientButton>
      </Link>
    </section>
  );
};

export default ClientCasesSection;

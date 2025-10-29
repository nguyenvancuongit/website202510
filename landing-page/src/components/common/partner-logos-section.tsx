"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface Partner {
  name: string;
  logo: string;
}

interface PartnerLogosSectionProps {
  title: string;
  partners: Partner[];
  className?: string;
  backgroundClassName?: string;
  gridCols?: string;
  logoSize?: number;
  gapX?: string;
  gapY?: string;
}

export default function PartnerLogosSection({
  title,
  partners,
  className = "",
  backgroundClassName = "bg-white",
  gridCols = "grid-cols-2 md:grid-cols-5",
  logoSize = 80,
  gapX = "sm:gap-x-12 gap-x-4",
  gapY = "sm:gap-y-16 gap-y-4",
}: PartnerLogosSectionProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Group partners into slides for mobile carousel (6 per slide - 3 rows x 2 columns)
  const partnersPerSlide = 6;
  const mobileSlides = [];
  for (let i = 0; i < partners.length; i += partnersPerSlide) {
    mobileSlides.push(partners.slice(i, i + partnersPerSlide));
  }
  return (
    <section className={`pb-20 md:pb-45 ${backgroundClassName} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-2xl md:text-[56px] font-bold text-[#1C1919] sm:mb-16 mb-10"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          {title}
        </motion.h2>

        {/* Mobile Carousel */}
        <div className="block sm:hidden">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {mobileSlides.map((slidePartners, slideIndex) => (
                <CarouselItem key={slideIndex} className="basis-full">
                  <div className="grid grid-cols-2 grid-rows-3 gap-4 px-0 sm:px-4">
                    {slidePartners.map((partner, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center py-2 px-4 gap-4 logo-item border border-[#D8E5EF] rounded-md"
                      >
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={logoSize}
                          height={logoSize}
                          className={`w-${logoSize / 4} h-${logoSize / 4
                            } rounded-full flex items-center justify-center overflow-hidden`}
                        />
                        <p className="text-xs font-normal text-[#000] text-center">
                          {partner.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Carousel Dots */}
          {mobileSlides.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {mobileSlides.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    current === index
                      ? "bg-[#96B3D5] w-6"
                      : "bg-[#D8E5EF]"
                  )}
                  onClick={() => carouselApi?.scrollTo(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:block">
          {/* Motion grid: logos animate on scroll with stagger (row by row) */}
          <motion.div
            className={cn("grid", gridCols, gapX, gapY)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            // container variants define staggerDirection: 1 ensures left-to-right order
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.8,
                },
              },
            }}
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center py-2 px-4 sm:p-0 gap-4 logo-item"
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={logoSize}
                  height={logoSize}
                  className={`w-${logoSize / 4} h-${logoSize / 4
                    } rounded-full flex items-center justify-center overflow-hidden`}
                />
                <p className="text-base font-normal text-[#000] text-center">
                  {partner.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface SolutionAdvantagesSectionProps {
  advantages: {
    title: string;
    description: string;
    image: string;
  }[];
}

// Animation variants
const advantagesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const advantageItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  }
};
const SolutionAdvantagesSection = ({
  advantages,
}: SolutionAdvantagesSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    // Set initial active index
    setActiveIndex(api.selectedScrollSnap());

    // Listen to select events to update active index
    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollToIndex = useCallback((index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  }, [api]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 lg:pb-50">
      <motion.h2
        className="font-bold text-charcoal text-2xl sm:text-4xl lg:text-[56px] md:text-[56px] tracking-[0] leading-normal mb-6 sm:mb-8 lg:mb-10"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      >
        方案优势
      </motion.h2>

      {/* Mobile View - Carousel on top, content below */}
      <div className="block lg:hidden">
        {/* Image Carousel */}
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          setApi={setApi}
          className="w-full mb-6"
        >
          <CarouselContent className="-ml-2">
            {advantages.map((advantage, index) => (
              <CarouselItem
                key={index}
                className="pl-2 basis-[70%]"
                onClick={() => scrollToIndex(index)}
              >
                <div className={cn(
                  "relative h-[250px] rounded-xl overflow-hidden transition-all duration-300",
                  activeIndex === index ? "scale-115" : "scale-85 opacity-60"
                )}>
                  <Image
                    alt={advantage.title}
                    src={advantage.image}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 75vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {advantages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all bg-[#C4D6F2E5] duration-300",
                activeIndex === index
                  ? "w-8"
                  : "w-2"
              )}
            />
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white text-center rounded-xl px-6 pt-6">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-xl text-charcoal mb-4">
              {advantages[activeIndex].title}
            </h3>
            <p className="font-normal text-medium-dark-blue-grey text-sm leading-6">
              {advantages[activeIndex].description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Desktop View - Original layout */}
      <div className="hidden lg:flex flex-row items-stretch gap-[31px]">
        <motion.div
          className="flex flex-col flex-shrink-0 w-1/2 items-start gap-8"
          variants={advantagesContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              className={
                "flex flex-col items-start gap-5 w-full py-6 rounded-lg cursor-pointer transition-shadow duration-300"
              }
              style={{
                boxShadow:
                  activeIndex === index ? "0 16px 48px -36px #1D8BF8" : "none",
              }}
              variants={advantageItemVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <h3
                className={`font-medium text-2xl tracking-[0] leading-[normal] transition-colors duration-300 ${activeIndex === index ? "text-[#1C88F9]" : "text-charcoal"
                  }`}
              >
                {advantage.title}
              </h3>
              <p className="font-normal text-medium-dark-blue-grey text-base text-justify tracking-[0] leading-8">
                {advantage.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex-1 w-full h-auto relative overflow-hidden rounded-sm"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
        >
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                {
                  "opacity-100": activeIndex === index,
                  "opacity-0": activeIndex !== index,
                }
              )}
            >
              <Image
                alt={advantage.title}
                src={advantage.image}
                className="object-cover"
                fill
                sizes="645px"
                priority={index === 0} // Prioritize first image for loading
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionAdvantagesSection;

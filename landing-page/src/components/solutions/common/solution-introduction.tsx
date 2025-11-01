"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface SolutionIntroductionProps {
  title: string;
  introductions: {
    title: string;
    description: string;
    image: string;
    className?: string;
    background?: string;
  }[];
  description?: string;
}

// Animation variants
const cardsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.8,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const SolutionIntroduction = ({
  title,
  introductions,
  description,
}: SolutionIntroductionProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-50 sm:pt-0 pt-2.5">
      <div className="mb-8.5 md:mb-30">
        <motion.h2
          className="font-bold text-charcoal text-2xl md:text-[56px] tracking-[0] leading-normal"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            className="text-sm md:text-xl leading-6 font-normal text-medium-dark-blue-grey mt-3.5 sm:mt-6 text-justify"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
          >
            {description}
          </motion.p>
        )}
      </div>
      <motion.div
        className="hidden md:grid grid-cols-3 gap-8 mt-10 md:mt-18"
        variants={cardsContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {introductions.map((solution, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            transition={{ duration: 1.0, ease: "easeOut" }}
          >
            <SolutionCard solution={solution} />
          </motion.div>
        ))}
      </motion.div>
      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
        className="w-full block md:hidden mt-10"
      >
        <CarouselContent>
          {introductions.map((solution) => (
            <CarouselItem key={solution.title} className="basis-[80%]">
              <SolutionCard solution={solution} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const SolutionCard = ({
  solution,
}: {
  solution: SolutionIntroductionProps["introductions"][0];
}) => {
  return (
    <Card
      className={cn("py-6 sm:py-10 border-0 rounded-3xl h-full shadow-none", solution.className)}
      style={{
        background: solution.background,
      }}
    >
      <CardContent className="flex flex-col gap-3 md:gap-8 h-full sm:px-6 px-5">
        <h3 className="font-medium text-[18px] md:text-[28px] text-charcoal">{solution.title}</h3>
        <p className="text-sm md:text-base leading-normal md:leading-8 font-normal text-dark-blue-grey flex-grow h-auto min-h-[60px]">
          {solution.description}
        </p>
        <Image
          src={solution.image}
          alt={solution.title}
          width={420}
          height={573}
          className="rounded-md w-full h-[240px] object-cover mt-2"
        />
      </CardContent>
    </Card>
  );
};

export default SolutionIntroduction;

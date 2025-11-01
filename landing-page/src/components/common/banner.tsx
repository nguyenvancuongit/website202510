"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

interface BannerProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  imageSrc: string;
  textColor?: "white" | "black";
  hasOverlay?: boolean;
  overlayColor?: string;
  showButton?: boolean;
  imgSize?: {
    width: number;
    height: number;
  }
  customClassNameText?: string;
  containerClassName?: string;
  className?: string;
  objectPosition?: string;
  customClassNameTextTitle?: string;
}

// Animation variants for fade in from left
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    }
  }
};

const slideInVariants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
    }
  }
};

export default function Banner({
  showButton = true,
  title,
  description,
  buttonText = "合作咨询",
  imageSrc,
  textColor = "black",
  hasOverlay = false,
  overlayColor = "linear-gradient(90deg, rgba(1, 14, 27, 0.80) 0.04%, rgba(0, 0, 0, 0.00) 60.39%)",
  imgSize = { width: 1920, height: 1080 },
  customClassNameText = "",
  containerClassName = "",
  className: innerClassName = "",
  objectPosition = "",
  customClassNameTextTitle = ""
}: BannerProps) {
  return (
    <section className="relative h-[466px] md:h-[660px]">
      <Image
        src={imageSrc}
        alt={title}
        width={imgSize.width}
        height={imgSize.height}
        className="absolute top-0 left-1/2 -translate-x-1/2 media inset-0 h-full object-cover object-[70%_10px] sm:object-[0]"
        style={{
          objectPosition: objectPosition,
        }}
      />
      {hasOverlay && (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: overlayColor,
          }}
        />
      )}
      <div className={cn("max-w-7xl h-full mx-auto box-border px-6 md:px-8 relative z-10 flex sm:items-center items-baseline", containerClassName)}>
        <motion.div
          className={cn("h-full flex flex-col justify-between md:justify-center max-w-3xl pb-15 pt-15 sm:py-20", innerClassName)}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={slideInVariants}>
            <motion.h1
              className={cn(
                "text-2xl md:text-4xl lg:text-6xl font-bold leading-tight text-balance mb-4 lg:mb-6",
                customClassNameText,
                customClassNameTextTitle,
                {
                  "text-white": textColor === "white",
                  "text-[#070F1B]": textColor === "black",
                }
              )}
              variants={slideInVariants}
            >
              {title}
            </motion.h1>
            <motion.p
              className={cn("text-sm sm:text-2xl leading-relaxed mb-2 md:mb-6 lg:mb-10", customClassNameText, {
                "text-white": textColor === "white",
                "text-[#251E1E]": textColor === "black",
              })}
              variants={slideInVariants}
            >
              {description}
            </motion.p>
          </motion.div>
          {showButton && (
            <motion.div
              className="mt-20 sm:mt-0"
              variants={slideInVariants}
            >
              <GradientButton size="default">
                <span className="text-sm sm:text-lg">{buttonText}</span>
                <Image
                  src="/icons/system-guide-icon.svg"
                  alt="System Guide Icon"
                  width={36}
                  height={36}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </GradientButton>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

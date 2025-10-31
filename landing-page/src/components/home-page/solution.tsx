"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { useMedia } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

import { GradientButton } from "../ui/gradient-button";

import SectionHeader from "./section-header";

const solutions = [
  {
    id: 1,
    title: "学生发展指导中心",
    description:
      "象导生涯为学校提供软硬件一体的学生发展指导中心一站式解决方案，助力其高效建成并投入运营。",
    image: "/images/solutions/solution-1.png",
    href: "/solutions/guidance-center",
  },
  {
    id: 2,
    title: "生涯课堂",
    description:
      "多元智能的数字生涯教育工具，赋能课堂创新，提升生涯教育实效与质量。",
    image: "/images/solutions/solution-2.png",
    href: "/solutions/classroom",
  },
  {
    id: 3,
    title: "大规模筛查",
    description: "开展大规模筛查，预警学生潜在心理风险与生涯发展滞后问题。",
    image: "/images/solutions/solution-3.jpg",
    href: "/solutions/university-city",
  },
  {
    id: 4,
    title: "教师生涯咨询指导",
    description: "丰富多元的生涯教学资源包，助力教师高效备课，驱动生涯教育高质量发展",
    image: "/images/solutions/solution-4.png",
    href: "/solutions/teacher-guidance",
  },
  {
    id: 5,
    title: "师资培训",
    description:
      "融合数字化与信息化的培养模式，助力生涯指导老师全面提升专业能力。",
    image: "/images/solutions/solution-5.png",
    size: "small",
    href: "/solutions/teacher-training",
  },
  {
    id: 6,
    title: "企业人才发展",
    description: "赋能企业数字化转型，提升运营与决策效率，降低企业发展阻力。",
    image: "/images/solutions/solution-6.png",
    size: "large",
    href: "/solutions/enterprise",
  },
];

const firstRowSolutions = solutions.slice(0, 3);
const secondRowSolutions = solutions.slice(3, 6);

export default function SolutionsSection() {
  const { isMobile, isTablet } = useMedia();
  const [firstRowHovered, setFirstRowHovered] = useState<number>(1); // Default to first card
  const [secondRowHovered, setSecondRowHovered] = useState<number>(6); // Default to first card of second row

  return (
    <section className="pb-25 md:pt-30 md:pb-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <SectionHeader
          title="适配多种场景的解决方案"
          subtitle="针对不同群体，提供个性化的生涯发展解决方案"
        />

        {isTablet || isMobile ? (
          <div className="grid grid-cols-1 gap-6 mb-20">
            {solutions.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                isExpanded={true}
                onHover={setFirstRowHovered}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {firstRowSolutions.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  isExpanded={firstRowHovered === solution.id}
                  onHover={setFirstRowHovered}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {secondRowSolutions.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  isExpanded={secondRowHovered === solution.id}
                  onHover={setSecondRowHovered}
                />
              ))}
            </div>
          </>
        )}

        {/* CTA Button */}
        <div className="text-center lg:mt-22">
          <GradientButton className="mx-auto">
            <span>定制专属方案</span>
            <Image
              alt="system guide"
              src="/icons/system-guide-icon.svg"
              height={36}
              width={36}
              className="w-6 h-6"
            />
          </GradientButton>
        </div>
      </div>
    </section>
  );
}

interface SolutionCardProps {
  solution: (typeof solutions)[0];
  isExpanded: boolean;
  onHover: (id: number) => void;
}

function SolutionCard({ solution, isExpanded, onHover }: SolutionCardProps) {
  const { isMobile } = useMedia();
  return (
    <Link
      href={solution.href}
      className={cn("block", isExpanded ? "lg:col-span-2" : "lg:col-span-1")}
    >
      <motion.div
        className="relative group cursor-pointer overflow-hidden rounded-2xl z-10 h-45 md:h-[369px]"
        style={{
          backgroundColor: "#1f2937",
        }}
        onMouseEnter={() => onHover(solution.id)}
        layout
        layoutId={`solution-${solution.id}`}
        initial={{ scale: 1 }}
        animate={{
          scale: isExpanded ? 1.02 : 1,
        }}
        whileHover={{
          scale: isExpanded ? 1.02 : 1.01,
          y: isExpanded ? 0 : -2,
        }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
          layout: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
        }}
      >
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${solution.image})`,
            backgroundColor: "#374151",
          }}
          animate={{
            scale: isExpanded ? 1.1 : 1,
          }}
          whileHover={{
            scale: isExpanded ? 1.12 : 1.05,
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />

        {/* Overlay - Only when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 z-10"
              initial={{
                opacity: 0,
                background:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)",
              }}
              animate={{
                opacity: 1,
                background: isMobile
                  ? "linear-gradient(90deg, #091D36 14.68%, rgba(0, 50, 141, 0.00) 64.55%)"
                  : "linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.05) 100%)",
              }}
              exit={{
                opacity: 0,
                background:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)",
              }}
              whileHover={{
                background:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.05) 100%)",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="absolute inset-0 px-5 py-4.5 md:px-7.5 md:py-11.5 flex flex-col justify-between text-white z-20">
          <motion.div
            animate={{
              x: isExpanded ? 8 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.h3
              className="font-bold mb-3 md:mb-[37px] flex-grow text-balance text-white text-base md:text-3xl"
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              {solution.title}
            </motion.h3>

            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.p
                  className="text-white max-w-[300px] leading-relaxed text-pretty text-xs md:text-base"
                  style={{
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                  }}
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: 0.1,
                  }}
                >
                  {solution.description}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: 0.2,
                }}
              >
                <GradientButton
                  size={isMobile ? "sm" : "lg"}
                  className="border-white border-[1px] hover:scale-105 transition-transform duration-200 pt-[5px] pr-[8px] pb-1.5 pl-3"
                  style={{
                    background:
                      "linear-gradient(86deg, rgba(255, 255, 255, 0.40) 8.78%, rgba(255, 255, 255, 0.04) 97.79%)",
                  }}
                >
                  了解详情 →
                </GradientButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Link>
  );
}

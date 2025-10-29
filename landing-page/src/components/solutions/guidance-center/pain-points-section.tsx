"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { useMedia } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

const paintPoints = [
  {
    title: "学校",
    description: "生涯师资匮乏",
    expandedDescription:
      "生涯指导领域的专业师资力量不足\n学生发展指导决策数据支撑不足\n生涯规划指导的连续性、连贯性不足",
    image: "/images/solutions/guidance-center/pain-points/pain-point-1.png",
    overlayColor:
      "linear-gradient(180deg, rgba(36, 145, 255, 0.10) 38.34%, #2491FF 85.08%)",
  },
  {
    title: "教师",
    description: "生涯指导能力不足",
    expandedDescription:
      "缺乏学生发展指导方面的科学方法和知识体系\n缺乏与标杆学校骨干教师交流学习的途径和机会\n缺乏高质量的学生发展指导资源(教案、课件等）",
    image: "/images/solutions/guidance-center/pain-points/pain-point-2.png",
    overlayColor:
      "linear-gradient(180deg, rgba(60, 210, 239, 0.10) 38.34%, #16C3E5 88.52%)",
  },
  {
    title: "学生",
    description: "自我认知不清晰",
    expandedDescription:
      "对高考选科感到迷茫\n不清楚自己的兴趣和优势\n不知道从哪里可以获得可靠的院校、专业及职业信息,",
    image: "/images/solutions/guidance-center/pain-points/pain-point-3.png",
    overlayColor:
      "linear-gradient(180deg, rgba(60, 210, 239, 0.10) 38.34%, #2162F9 88.52%)",
  },
  {
    title: "家长",
    description: "生涯教育意识薄弱",
    expandedDescription:
      "缺乏有关生涯规划的专业知识和资源\n对当下职业和教育的形式、要求和趋势了解有限\n自身期望与孩子的兴趣、能力不一致",
    image: "/images/solutions/guidance-center/pain-points/pain-point-4.png",
    overlayColor:
      "linear-gradient(180deg, rgba(125, 224, 174, 0.10) 38.34%, #7DE0AE 88.52%)",
  },
];
const PaintPointsSection = () => {
  const [hoverItem, setHoverItem] = useState<number>(3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };
  const { isMobile } = useMedia();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-50">
      <motion.h2
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="font-bold text-charcoal text-2xl md:text-[56px] tracking-[0] leading-normal mb-6.5 md:mb-30"
      >
        现状与痛点
      </motion.h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className="flex flex-col md:flex-row gap-6.5 md:gap-[30px]"
      >
        {paintPoints.map((paintPoint, index) => {
          const isExpanded = hoverItem === index;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              style={{
                flex: isExpanded ? "3 1 0%" : "1 1 0%",
              }}
              className="transition-all duration-700 ease-out"
            >
              {isMobile ? (
                <PaintPointsSectionMobile
                  paintPoint={paintPoint}
                  index={index}
                />
              ) : (
                <Card
                  onMouseEnter={() => setHoverItem(index)}
                  onClick={() => setHoverItem(index)}
                  className="hidden md:block relative h-auto md:h-[553px] border-0 rounded-lg overflow-hidden group cursor-pointer z-10 hover:z-20 transition-all duration-700 ease-out"
                >
                  {/* Background Image */}
                  <Image
                    src={paintPoint.image}
                    alt={paintPoint.title}
                    width={600}
                    height={400}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-out"
                    )}
                    style={{
                      background: isExpanded
                        ? "linear-gradient(270deg, rgba(181, 222, 255, 0.75) 0.05%, #D7EFFF 72.02%)"
                        : paintPoint.overlayColor,
                    }}
                  />

                  {/* Content */}
                  <CardContent className="relative md:absolute md:inset-0 p-4 md:p-6 text-white flex flex-col justify-end">
                    {/* Mobile: Always show expanded content */}
                    <div className="block md:hidden">
                      <div className="bg-black/50 p-4 rounded-lg">
                        <h3 className="text-xl font-bold mb-2">
                          {paintPoint.title}
                        </h3>
                        <p className="text-sm opacity-90 mb-3">
                          {paintPoint.description}
                        </p>
                        <div className="space-y-2">
                          {paintPoint.expandedDescription
                            .split("\n")
                            .map((line, lineIndex) => (
                              <p
                                key={lineIndex}
                                className="text-xs leading-relaxed opacity-80"
                              >
                                {line}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Default State Content */}
                    <div
                      className={`hidden md:block transition-opacity duration-500 ease-out ${isExpanded ? "opacity-0" : "group-hover:opacity-0"
                        }`}
                    >
                      <h3 className="text-2xl font-bold mb-2">
                        {paintPoint.title}
                      </h3>
                      <p className="text-base opacity-90">
                        {paintPoint.description}
                      </p>
                    </div>

                    {/* Desktop: Expanded State Content */}
                    <div
                      className={`hidden md:flex absolute inset-0 px-14 py-20 flex-col justify-start transition-opacity duration-500 ease-out ${isExpanded
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                        }`}
                    >
                      <h3 className="text-3xl font-bold mb-6 mt-4 text-charcoal">
                        {paintPoint.title}
                      </h3>
                      <div className="space-y-4">
                        {paintPoint.expandedDescription
                          .split("\n")
                          .map((line, lineIndex) => (
                            <p
                              key={lineIndex}
                              className="text-base text-dark-blue-grey leading-relaxed"
                            >
                              {line}
                            </p>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

const PaintPointsSectionMobile = ({
  paintPoint,
  index,
}: {
  paintPoint: (typeof paintPoints)[number];
  index: number;
}) => {
  return (
    <div
      className={cn("flex h-55", index % 2 === 0 ? "flex-row" : "flex-row-reverse")}
    >
      <div className="w-1/4 relative flex flex-col justify-end">
        <Image
          src={paintPoint.image}
          alt={paintPoint.title}
          width={600}
          height={400}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out"
          )}
          style={{
            background: paintPoint.overlayColor,
          }}
        />
        <div className="px-2 text-white">
          <h3 className="text-[16px] opacity-90 font-bold">
            {paintPoint.title}
          </h3>
          <p className="text-[12px] opacity-90 mb-2">
            {paintPoint.description}
          </p>
        </div>
      </div>
      <div className="w-3/4 relative text-charcoal flex flex-col ">
        <Image
          src={paintPoint.image}
          alt={paintPoint.title}
          width={600}
          height={400}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out w-full h-full object-cover"
        />
        <div
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out"
          )}
          style={{
            background:
              "linear-gradient(270deg, rgba(181, 222, 255, 0.75) 0.05%, #D7EFFF 72.02%)",
          }}
        />
        <div className="p-4">
          <h3 className="text-xl opacity-90 font-bold mb-2">
            {paintPoint.title}
          </h3>
          <p className="text-sm opacity-90 mb-3">{paintPoint.description}</p>
          <div className="space-y-2">
            {paintPoint.expandedDescription
              .split("\n")
              .map((line, lineIndex) => (
                <p
                  key={lineIndex}
                  className="text-xs leading-relaxed opacity-80"
                >
                  {line}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintPointsSection;

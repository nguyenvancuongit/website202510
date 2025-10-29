"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import ProductTabs from "@/components/common/product-tabs";

const tabs = [
  {
    icon: "/images/terminal/feature/icon1.svg",
    title: "自助式生涯探索机",
    image: "/images/products/three-features/feature1.svg",
  },
  {
    icon: "/images/terminal/feature/icon2.svg",
    title: "AI智能静音生涯探索舱",
    image: "/images/products/three-features/feature2.svg",
  },
  {
    icon: "/images/terminal/feature/icon3.svg",
    title: "一体化生涯探索放松椅",
    image: "/images/products/three-features/feature3.svg",
  },
];
const platforms = [
  {
    title: "自助式生涯探索机",
    description:
      "自助式生涯探索机面向初高中学生，搭载大屏幕触控体机，集成“测试探索、升学指导、职业规划”三大核心模块，借助AI与教育大数据，为学生生涯发展保驾护航，助力学校实现科学化管理。",
    image: "/images/terminal/feature/feature1.svg",
    imageMobile: "/images/products/three-features/feature1-mobile.svg",
  },
  {
    title: "AI智能静音生涯探索舱",
    description:
      "AI智能静音生涯探索舱面向中学生群体，将AI技术、智能设备、静音舱体的有机结合，形成学生专属的生涯指导空间，帮助学生在安静、私密的环境下沉浸式开展生涯探索和学业指导。",
    image: "/images/terminal/feature/feature2.svg",
    imageMobile: "/images/products/three-features/feature2-mobile.svg",
  },
  {
    title: "一体化生涯探索放松座椅",
    description:
      "AI智能静音生涯探索舱面向中学生群体，将AI技术、智能设备、静音舱体的有机结合，形成学生专属的生涯指导空间，帮助学生在安静、私密的环境下沉浸式开展生涯探索和学业指导。",
    image: "/images/terminal/feature/feature3.svg",
    imageMobile: "/images/products/three-features/feature3-mobile.svg",
  },
];

const features = [
  {
    icon: "/images/products/three-features/subicon1.svg",
    title: "AI生涯导师，全天候智慧服务",
    detailedTitle: "权威数据驱动，决策精准智能",
    description:
      "全量教育数据库内含3000+院校信息、覆盖800+本科及1100+专科高职专业，数百个热门职业、数据对接教育部、考试院等数据平台，由专业团队维护、动态更新。AI决策引擎综合历年录取分数和分段位次，输入选科与备考成绩即可提生成适配的院校和专业组别支撑数据。",
  },
  {
    icon: "/images/products/three-features/subicon2.svg",
    title: "私密环境 沉浸式探索指导",
    detailedTitle: "多场景部署，操作零门槛",
    description:
      "即插即用便捷32寸/43寸大屏幕输设一体机，方便学生远距离操作，帮扩学生视力。硬件设备即插即用，半小时内即可完成多场景部署自助式咨询是或多维测评、AI问答、可负化工具等功能。浏试后系统可自动生成数据分析报告，无需依赖教师指导使用，可实现7*24小时全天候自助查询。",
  },
  {
    icon: "/images/products/three-features/subicon3.svg",
    title: "使用环保材料，呵护学生健康",
    detailedTitle: "轻量化投入，办学效益倍增",
    description:
      "实现减负增效大幅提升建管效率，减轻教师工作负担，让教师能够有更多精力投入个性化辅导，并借助系统数据运营指导信息的准确性、也充实高回报率等本设备后可马上投入使用，无需培训训练者，同时还可助力学校招生宣传，增加报考申报优势。",
  },
];
export default function Feature() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveCard(activeCard === index ? null : index);
  };

  return (
    <section className="pt-0 pb-10 sm:py-12 md:py-14 lg:py-16 bg-white sm:bg-gradient-to-b sm:from-white/80 sm:to-[rgba(242,247,255,0.80)]">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ProductTabs with fade-in from top animation */}
        <motion.div
          className="hidden sm:block"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ProductTabs tabs={tabs} platforms={platforms} />
        </motion.div>
        <div className="sm:hidden flex flex-col gap-8">
          {platforms.map((platform, index) => (
            <div key={index}>
              <div
                style={{
                  background:
                    "radial-gradient(53.69% 53.69% at 49.86% 46.31%, #4A6F8C 0%, #283A4F 100%)",
                }}
                className="pb-4 min-h-[400px] relative"
              >
                <h2 className="text-white text-2xl pt-4 text-center">{platform.title}</h2>
                <Image
                  src={platform?.imageMobile || ""}
                  alt={platform.title}
                  width={224}
                  height={260}
                  className="w-1/2 h-auto object-cover mx-auto pb-4 pt-4"
                />
              </div>
              <p className="text-md text-dark-blue-grey mt-2">{platform.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile Layout - Icon and Text Side by Side */}
        <div className="block sm:hidden my-8">
          <motion.div
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.9,
                },
              },
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start py-3"
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  background: "linear-gradient(180deg, #FFF 0%, #F3F8FF 100%)",

                }}
              >
                {/* Icon */}
                <div className="w-12 flex items-center justify-cente m-auto">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={24}
                    height={24}
                    className="w-8 h-8"
                  />
                </div>
                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-base text-dark-blue-grey mb-2">
                    {feature.detailedTitle}
                  </h3>
                  <p className="text-[13px] text-medium-dark-blue-grey leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Feature cards grid with staggered entrance */}
        <motion.div
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 my-8 sm:my-10 md:my-11 lg:my-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.9,
              },
            },
          }}
        >
          {features.map((feature, index) => {
            const isActive = activeCard === index;
            return (
              <motion.div
                key={index}
                onClick={() => handleCardClick(index)}
                className="group relative transition-all duration-300 ease-in-out cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Default state - Icon with title */}
                <div
                  className={`flex flex-col items-center justify-center p-4 sm:p-5 md:p-5.5 lg:p-6 rounded-2xl transition-all duration-300 ${isActive
                    ? "opacity-0 scale-95"
                    : "lg:group-hover:opacity-0 lg:group-hover:scale-95"
                    }`}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-5.5 lg:mb-6">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={64}
                      height={64}
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-7.5 md:h-7.5 lg:w-8 lg:h-8"
                    />
                  </div>
                  <p className="text-base sm:text-lg md:text-lg lg:text-xl text-dark-blue-grey text-center font-normal leading-relaxed px-2">
                    {feature.title}
                  </p>
                </div>

                {/* Hover/Active state - Detailed card */}
                <div
                  className={`absolute inset-0 p-4 sm:p-5 md:p-6 lg:p-8 h-max lg:h-[280px] text-white shadow-lg transition-all duration-300 z-10 ${isActive
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none lg:group-hover:opacity-100 lg:group-hover:scale-100 lg:group-hover:pointer-events-auto"
                    }`}
                  style={{
                    background:
                      "linear-gradient(180deg, #0582FF 0%, #62B1FF 100%)",
                    borderRadius: "16px 16px 0 0",
                  }}
                >
                  <h3 className="text-base sm:text-lg md:text-lg lg:text-xl font-bold mb-3 sm:mb-3.5 md:mb-3.5 lg:mb-4 leading-relaxed">
                    {feature.detailedTitle}
                  </h3>
                  <p className="text-sm sm:text-sm md:text-sm lg:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import ProductTabs from "@/components/common/product-tabs";

const tabs = [
  {
    icon: "/images/terminal/feature/icon1.svg",
    title: "生涯自助探索一体机",
    image: "/images/products/three-features/feature1.svg",
  },
  {
    icon: "/images/terminal/feature/icon2.svg",
    title: "AI智能静音生涯探索舱",
    image: "/images/products/three-features/feature2.svg",
  },
  {
    icon: "/images/terminal/feature/icon3.svg",
    title: "卧式生涯自主探索终端",
    image: "/images/products/three-features/feature3.svg",
  },
];
const platforms = [
  {
    title: "生涯自助探索一体机",
    description:
      "生涯自助探索一体机面向初高中学生，搭载大屏幕触控体机，集成“测试探索、升学指导、职业规划”三大核心模块，借助AI与教育大数据，为学生生涯发展保驾护航，助力学校实现科学化管理。",
    image: "/images/terminal/feature/feature1.svg",
    imageMobile: "/images/products/three-features/feature1-mobile.svg",
    features : [
      {
        icon: "/images/products/three-features/sub-icon/icon1.svg",
        title: "权威数据驱动  决策精准智能",
        detailedTitle: "权威数据驱动，决策精准智能",
        description:
          "全量教育数据库内含3000+院校信息、覆盖800+本科及1100+专科高职专业，数百个热门职业、数据对接教育部、考试院等数据平台，由专业团队维护、动态更新。AI决策引擎综合历年录取分数和分段位次，输入选科与备考成绩即可提生成适配的院校和专业组别支撑数据。",
      },
      {
        icon: "/images/products/three-features/sub-icon/icon2.svg",
        title: "多场景部署，操作零门槛",
        detailedTitle: "多场景部署，操作零门槛",
        description:
          "即插即用便捷32寸/43寸大屏幕输设一体机，方便学生远距离操作，帮扩学生视力。硬件设备即插即用，半小时内即可完成多场景部署自助式咨询是或多维测评、AI问答、可负化工具等功能。浏试后系统可自动生成数据分析报告，无需依赖教师指导使用，可实现7*24小时全天候自助查询。",
      },
      {
        icon: "/images/products/three-features/sub-icon/icon3.svg",
        title: "轻量化投入，办学效益倍增",
        detailedTitle: "轻量化投入，办学效益倍增",
        description:
          "实现减负增效大幅提升建管效率，减轻教师工作负担，让教师能够有更多精力投入个性化辅导，并借助系统数据运营指导信息的准确性、也充实高回报率等本设备后可马上投入使用，无需培训训练者，同时还可助力学校招生宣传，增加报考申报优势。",
      },
    ]
  },
  {
    title: "AI智能静音生涯探索舱",
    description:
      "AI智能静音生涯探索舱面向中学生群体，将AI技术、智能设备、静音舱体的有机结合，形成学生专属的生涯指导空间，帮助学生在安静、私密的环境下沉浸式开展生涯探索和学业指导。",
    image: "/images/terminal/feature/feature2.svg",
    imageMobile: "/images/products/three-features/feature2-mobile.svg",
    features : [
      {
        icon: "/images/products/three-features/sub-icon/icon4.svg",
        title: "AI生涯导师，全天候智慧服务",
        detailedTitle: "AI生涯导师，全天候智慧服务",
        description:
          "搭载多模态AI交互系统，整合霍兰德职业测评，MBTI性格分析、新高考选科模型等权威量表，通过自然语言对话生成个性化成长路径和学业指导信息，助力学生冲刺学业目标:",
      },
      {
        icon: "/images/products/three-features/sub-icon/icon5.svg",
        title: "私密环境 沉浸式探索指导",
        detailedTitle: "私密环境，沉浸式探索指导",
        description:
          "私密探索空间，保护个人隐私。6层复合材料可有效吸收外部中高频噪音，屏蔽外界干扰，舱内比图书馆更安静。",
      },
      {
        icon: "/images/products/three-features/sub-icon/icon6.svg",
        title: "使用环保材料，呵护学生健康",
        detailedTitle: "使用环保材料，呵护学生健康",
        description:
          "模块化舱体，可快速拼装，不受场地限制;使用环保材料打造，无甲醛无异味，保护学生身体健康。舱内可接空调、配有可调光灯带，让学生能够在舒适静谧的环境下放松的开展生涯探索和学业指导。"
      },
    ]
  },
  {
    title: "一体化生涯探索放松座椅",
    description:
      "创新融合放松按摩放松与智能生涯探索功能，让学生在舒适的状态下完成职业测评、兴趣探索和学业规划。告别传统生涯探索的站立疲劳，让每一次思考都轻松愉悦。",
    image: "/images/terminal/feature/feature3.svg",
    imageMobile: "/images/products/three-features/feature3-mobile.svg",
    features : [
      {
        icon: "/images/products/three-features/sub-icon/icon7.svg",
        title: "舒适按摩、放松身心",
        detailedTitle: "舒适按摩，放松身心",
        description:
          "采用人体工学设计，支持身体多部位精准按摩，缓解身体疲劳，以放松的身心状态投入生涯探索和学业咨询。",
      },
      {
        icon: "/images/products/three-features/sub-icon/icon8.svg",
        title: "满足长时间探索需求",
        detailedTitle: "满足长时间探索需求",
        description:
          "搭载一体化生涯探索设备，通过舒适的坐姿设计，可支持30分钟以上深度探索，有效解决使用传统设备进行深度探索时长时间站立疲劳的痛点。",
      },
      {
        icon: "/images/products/three-features/sub-icon/icon9.svg",
        title: "多场景适配 灵活部署",
        detailedTitle: "多场景适配，灵活部署",
        description:
          "场景通用性强、部署灵活，可放置于生涯指导中心、心理辅导室、图书馆等场景，为学生提供多场景的舒适探索条件。",
      },
    ]
  },
];

export default function Feature() {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-white sm:bg-gradient-to-b sm:from-white/80 sm:to-[rgba(242,247,255,0.80)]">
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
          <ProductTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            platforms={platforms}
          />
        </motion.div>
        <div className="sm:hidden flex flex-col gap-8">
          {platforms.map((platform, index) => (
            <div key={index}>
              <div
                style={{
                  background:
                    "radial-gradient(53.69% 53.69% at 49.86% 46.31%, #4A6F8C 0%, #283A4F 100%)",
                }}
                className="pb-4 h-[412px] relative rounded-[2px]"
              >
                <h2 className="text-white text-2xl pt-7 text-center">
                  {platform.title}
                </h2>
                <Image
                  src={platform?.imageMobile || ""}
                  alt={platform.title}
                  width={224}
                  height={260}
                  className="w-1/2 h-fit sm:object-cover mx-auto absolute left-1/2 -translate-x-1/2 bottom-1/2 translate-y-1/2 object-scale-down"
                />
              </div>
              <p className="text-md text-medium-dark-blue-grey mt-4.5">
                {platform.description}
              </p>
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
            {platforms[activeTab].features.map((feature, index) => (
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
          {platforms[activeTab].features.map((feature, index) => {
            return (
              <motion.div
                key={index}
                className="group relative transition-all duration-300 ease-in-out cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Default state - Icon with title */}
                <div
                  className='lg:group-hover:opacity-0 lg:group-hover:scale-95 flex flex-col items-center justify-center p-4 sm:p-5 md:p-5.5 lg:p-6 rounded-2xl transition-all duration-300'
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
                  className="absolute inset-0 p-4 sm:p-5 md:p-6 lg:p-8 h-max lg:h-[280px] text-white shadow-lg transition-all duration-300 z-10 opacity-0 scale-95 pointer-events-none lg:group-hover:opacity-100 lg:group-hover:scale-100 lg:group-hover:pointer-events-auto"
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

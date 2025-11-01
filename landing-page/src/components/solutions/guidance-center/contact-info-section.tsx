"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const timelineData = [
  {
    year: "2022年",
    title: "纳入质量评价体系",
    description:
      "《普通高中学校办学质量评价指南》《义务教育质量评价指南》提出将学生发展指导水平、学生发展质量分别纳入普通高中学校办学质量评价指标和义务教育质量评价指标。",
    additionalTitle: "加强职业生涯教育",
    additionalDescription:
      "教育部学生服务与素质发展中心发布《关于开展高校职业生涯咨询特色工作室》的通知，要求加强高校职业生涯发展教育工作，开展个性化的职业发展咨询和指导，引导学生树立正确择业观和成才观。",
    background:
      "bg-[linear-gradient(180deg,rgba(210,213,252,1)_0%,rgba(210,213,252,0.2)_100%)]",
  },
  {
    year: "2019年",
    title: "推进育人方式改革",
    description:
      "《国务院办公厅关于新时代推进普通高中育人方式改革的指导意见》要求通过学科教学渗透、开设指导课程、开展职业体验等对学生进行指导，并构建家校社协同指导机制，加强对学生理想、心理、学习、生活、生涯规划等方面指导，帮助学生树立正确理想信念、正确认识自我，处理好个人兴趣特长与国家和社会需要的关系，提高选修课程、选考科目、报考专业和未来发展方向的自主选择能力。",
    background:
      "bg-[linear-gradient(180deg,rgba(158,208,255,1)_0%,rgba(158,208,255,0.2)_100%)]",
  },
  {
    year: "2014年",
    title: "全面深化课程改革",
    description:
      "《教育部关于全面深化课程改革落实立德树人根本任务的意见》提出建立普通高中学生发展指导制度，指导学生学会选择课程，做好生涯规划。",
    background:
      "bg-[linear-gradient(180deg,rgba(191,241,255,1)_0%,rgba(191,241,255,0.2)_100%)]",
  },
  {
    year: "2010年",
    title: "建立学生发展指导制度",
    description:
      "教育部首次提出建立学生发展指导制度，加强对学生的理想、心理、学业等多方面指导。",
    background:
      "bg-[linear-gradient(180deg,rgba(214,232,255,1)_0%,rgba(214,232,255,0.2)_100%)]",
  },
];

const ContactInformationSection = () => {
  const [activeMobileTab, setActiveMobileTab] = useState<number>(0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
      },
    },
  };

  return (
    <section className="mb-20 md:mb-[234px] min-h-[440px] mx-auto max-w-7xl md:px-10 px-4">
      <motion.h2
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="font-bold text-charcoal text-2xl md:text-[56px] tracking-[0] leading-normal mb-10 md:mb-[98px]"
      >
        学生发展指导中心的重要性
      </motion.h2>

      {/* Mobile Timeline View */}
      <div className="block md:hidden">
        <div className="flex gap-4">
          {/* Years Column */}
          <div className="flex flex-col gap-6 pt-2">
            {timelineData.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveMobileTab(index)}
                className={cn(
                  "text-left font-bold text-[20px] transition-colors duration-300 whitespace-nowrap",
                  activeMobileTab === index
                    ? "text-charcoal"
                    : "text-[#829AC5]"
                )}
              >
                {item.year}
              </button>
            ))}
          </div>

          {/* Content Column */}
          <div className={cn("flex-1 rounded-2xl p-6", timelineData[activeMobileTab].background)}>
            <motion.div
              key={activeMobileTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium text-charcoal">
                {timelineData[activeMobileTab].title}
              </h3>
              <p className="text-sm text-dark-blue-grey leading-6 text-justify">
                {timelineData[activeMobileTab].description}
              </p>
              {timelineData[activeMobileTab].additionalTitle && (
                <>
                  <h3 className="text-xl font-medium text-charcoal">
                    {timelineData[activeMobileTab].additionalTitle}
                  </h3>
                  <p className="text-sm text-dark-blue-grey leading-relaxed text-justify">
                    {timelineData[activeMobileTab].additionalDescription}
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Desktop Cards View */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 items-end gap-[29px] w-full"
      >
        {timelineData.map((item, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card
              className={`flex-1 group rounded-3xl border-0 transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl ${item.background} hover:bg-[linear-gradient(180deg,rgba(3,129,255,1)_0%,rgba(103,179,255,1)_100%)]`}
            >
              <CardContent className="flex flex-col items-start gap-10 px-8 py-12">
                <div className="flex flex-col items-start gap-3 w-full">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-bold text-charcoal group-hover:text-white text-[32px] tracking-[0] leading-[normal] transition-colors duration-300">
                      {item.year}
                    </h2>
                  </div>

                  <Separator className="h-px bg-[#668CEB] group-hover:bg-white transition-colors duration-300" />

                  <div className="flex items-center gap-2.5">
                    <h3 className="font-medium text-charcoal group-hover:text-white text-xl tracking-[0] leading-[normal] transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="justify-center flex items-center gap-2.5">
                  <p className="font-normal text-charcoal group-hover:text-white text-base text-justify tracking-[0] leading-7 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>

                {item.additionalTitle && item.additionalDescription && (
                  <div className="flex flex-col items-start gap-6 w-full">
                    <div className="flex flex-col items-start gap-3 w-full">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-medium text-charcoal group-hover:text-white text-xl tracking-[0] leading-[normal] transition-colors duration-300">
                          {item.additionalTitle}
                        </h3>
                      </div>
                    </div>

                    <div className="justify-center flex items-center gap-2.5">
                      <p className="font-normal text-charcoal group-hover:text-white text-base text-justify tracking-[0] leading-7 transition-colors duration-300">
                        {item.additionalDescription}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ContactInformationSection;

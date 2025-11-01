"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TeacherTrainingIntroductionSection = () => {
  const roles = [
    {
      icon: "/images/solutions/teacher-training/intro/icon-1.svg",
      text: "校长",
      iconClass: "w-[27.08px] h-8",
    },
    {
      icon: "/images/solutions/teacher-training/intro/icon-2.svg",
      text: "副校长",
      iconClass: "w-8 h-8",
    },
    {
      icon: "/images/solutions/teacher-training/intro/icon-3.svg",
      text: "德育处主任",
      iconClass: "w-8 h-[31.91px]",
    },
    {
      icon: "/images/solutions/teacher-training/intro/icon-4.svg",
      text: "班主任",
      iconClass: "w-8 h-8",
    },
    {
      icon: "/images/solutions/teacher-training/intro/icon-5.svg",
      text: "心理指导教师",
      iconClass: "w-8 h-8",
    },
    {
      icon: "/images/solutions/teacher-training/intro/icon-6.svg",
      text: "德育教师",
      iconClass: "w-8 h-8",
    },
  ];

  const verticalLines = [
    { left: "left-[20px]" },
    { left: "left-[216px]" },
    { left: "left-[454px]" },
    { left: "left-[580px]", top: "top-17" },
    { left: "left-[684px]" },
    { left: "left-[926px]" },
    { left: "left-[1190px]" },
  ];

  const badgeContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-50">
      <motion.h2
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="font-bold text-charcoal text-2xl md:text-[56px] tracking-[0] leading-normal mb-3.5 md:mb-9"
      >
        方案介绍
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
        className="text-sm sm:text-lg lg:text-xl text-medium-dark-blue-grey mb-8 sm:mb-12 lg:mb-18 leading-7 sm:leading-8 lg:leading-10.5"
      >
        象导生涯具备师资队伍培训认证资格，通过专家课程和线下讲座方式，从教案使用、量表解读、咨询流程、个案实操等多方面系统化的开展培训，通过理论与实操相结合的方式帮助教师掌握生涯教育的核心理论和指导技能，助力提升教师指导力，使其能够掌握并独立运用生涯咨询手段和辅导技术对学生开展发展指导工作，未来成为区域内生涯教育领域的中坚力量。
      </motion.p>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <motion.div className="text-center mb-6">
          <Badge className="gap-2 px-4 py-2 rounded-[30px] bg-[linear-gradient(180deg,rgba(53,208,238,1)_0%,rgba(28,136,249,1)_100%)] inline-flex items-center h-auto border-0">
            <span className="font-normal text-white text-lg">面向群体</span>
          </Badge>
        </motion.div>

        <ArrowDownIcon className="mx-auto mb-4" />

        <div
          className="flex flex-wrap gap-8 justify-center max-w-[400px] sm:max-h-[400px] rounded-full p-10 mx-auto"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #F5FAFF 0%, #DBECFF 100%)",
          }}
        >
          {roles.map((role, index) => (
            <div key={index}>
              <Badge className="gap-3 px-4 py-3 rounded-[20px] bg-[linear-gradient(180deg,rgba(53,208,238,1)_0%,rgba(28,136,249,1)_100%)] flex items-center h-auto border-0 justify-center w-full">
                <Image
                  className={cn("relative flex-shrink-0", role.iconClass)}
                  alt={role.text}
                  src={role.icon}
                  width={24}
                  height={24}
                />
                <span className="font-normal text-white text-base lg:text-lg">
                  {role.text}
                </span>
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <main className="hidden lg:block relative h-[190px]">
        <motion.div
          variants={badgeContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="gap-[66px] absolute top-[130px] left-[calc(50.00%_-_658px)] inline-flex items-center"
        >
          {roles.map((role, index) => (
            <motion.div key={index} variants={badgeVariants}>
              <Badge className="gap-2 px-6 py-3.5 flex-[0_0_auto] rounded-[30px] bg-[linear-gradient(180deg,rgba(53,208,238,1)_0%,rgba(28,136,249,1)_100%)] inline-flex items-center h-auto border-0 hover:bg-[linear-gradient(180deg,rgba(53,208,238,1)_0%,rgba(28,136,249,1)_100%)]">
                <Image
                  className={cn("relative", role.iconClass)}
                  alt={role.text}
                  src={role.icon}
                  width={32}
                  height={32}
                />
                <span className="relative w-fit mt-[-1.00px] font-normal text-white text-xl text-justify tracking-[0] leading-8 whitespace-nowrap">
                  {role.text}
                </span>
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="gap-2 px-6 py-3.5 absolute top-0 left-[calc(50.00%_-_90px)] rounded-[30px] bg-[linear-gradient(180deg,rgba(53,208,238,1)_0%,rgba(28,136,249,1)_100%)] inline-flex items-center"
        >
          <h1 className="relative w-fit mt-[-1.00px] font-normal text-white text-xl text-justify tracking-[0] leading-8 whitespace-nowrap">
            面向群体
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {verticalLines.map((line, index) => (
            <Image
              key={`vertical-${index}`}
              className={cn("absolute top-24 w-0.5 h-8", line.left, line.top)}
              alt="Vertical connector"
              src="/images/solutions/teacher-training/intro/vector-1844.svg"
              width={2}
              height={26}
            />
          ))}

          <Image
            className="absolute top-24 left-[20px] w-[1172px] h-0.5"
            alt="Horizontal connector"
            src="/images/solutions/teacher-training/intro/vector-1840.svg"
            width={1172}
            height={2}
          />
        </motion.div>
      </main>
    </section>
  );
};

const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="63"
      height="18"
      viewBox="0 0 63 18"
      fill="none"
      {...props}
    >
      <path
        d="M31.5 18C25.0344 9.91722 19.0814 5.8014 1.57361e-06 2.14411e-07L63 5.72205e-06C42.5057 5.86296 36.8077 9.97492 31.5 18Z"
        fill="url(#paint0_linear_2354_5258)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2354_5258"
          x1="31"
          y1="2.57143"
          x2="31.092"
          y2="18.0024"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#DEEDFF" stop-opacity="0" />
          <stop offset="1" stop-color="#C9E2FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TeacherTrainingIntroductionSection;

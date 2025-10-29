"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BannerService() {
  return (
    <section className="pb-20 md:pb-42.5 pt-14 md:pt-[118px] bg-white">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.h2
          className="font-bold text-charcoal text-2xl md:text-[56px] leading-normal mb-4"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          活动背景
        </motion.h2>
        <div className="relative sm:mt-16 mt-8 flex flex-col sm:flex-row justify-center gap-8">
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/images/assessment/banner-service.svg"
              alt="Service Triangle Diagram"
              className="w-full h-auto"
              width={1920}
              height={1080}
            />
          </motion.div>

          <motion.div
            className="text-dark-blue-grey leading-6 md:leading-normal sm:text-base text-sm font-normal max-w-xl"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
          >
            <p>
              在新高考背景下，“选择”成为青少年成长的核心能力。调查显示，多数中学生对职业的认知局限于父母的职业，选科、选专业存在盲目跟风的现象。随着教育从“分数导向”转向“成长导向”，生涯教育已成为基础教育的时代命题。
            </p>
            <br />
            <p>
              象导生涯以“沉浸式探索活动”突破传统课堂局限，通过多元化探索活动帮助学生建立“自我认知—职业探索—理性决策”的成长框架，让每个孩子在体验中发现自我，实现教育从“筛选”到“支持”的转变。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

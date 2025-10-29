"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const introData = [
  {
    title: "生涯规划",
    description: "帮助学生探索职业兴趣、科学选科、规划升学路径",
    image: "/images/solutions/guidance-center/intro/intro-1.svg",
  },
  {
    title: "心理健康",
    description: "提供心理测评、个体/团体辅导，预防心理危机",
    image: "/images/solutions/guidance-center/intro/intro-2.svg",
  },
  {
    title: "学业指导",
    description: "优化学习方法，提升学习动力，减少学业焦虑",
    image: "/images/solutions/guidance-center/intro/intro-3.svg",
  },
  {
    title: "素质提升",
    description: "培养社会适应力、领导力、创新思维",
    image: "/images/solutions/guidance-center/intro/intro-4.svg",
  },
  {
    title: "家校协同",
    description: "指导家长科学参与学生成长规划",
    image: "/images/solutions/guidance-center/intro/intro-5.svg",
  },
];

// Animation variants
const cardsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.6
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
  }
};

const GuidanceCenterIntroduction = () => {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-6 pb-20 md:pb-50">
      <motion.h2
        className="font-bold text-charcoal text-2xl md:text-[56px] tracking-[0] leading-normal mb-3.5 md:mb-10"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      >
        方案介绍
      </motion.h2>
      <motion.p
        className="text-sm md:text-xl text-[#1D2129] mb-9 md:mb-29"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
      >
        帮助学生实现个性化成长，提升生涯规划能力、心理健康水平和学业发展质量,适应新高考改革和未来社会需求
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={cardsContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {introData.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4 md:block rounded-sm md:rounded-2xl p-4 md:p-8 hover:shadow-md transition-shadow duration-300 text-center"
            style={{
              background: "linear-gradient(180deg, #ECF1FF 0%, #F3FCFF 100%)",
            }}
            variants={cardVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Icon */}
            <div
              className="min-w-12 md:min-w-0 h-12 w-12 md:mx-auto mb-0 md:mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(180deg, #1587FF 0%, #7DE9FF 100%)",
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={index === 0 || index === introData.length - 1 ? 36 : 24}
                height={index === 0 || index === introData.length - 1 ? 36 : 24}
                className="text-white"
              />
            </div>

            <div className="block text-start md:text-center">
              {/* Title */}
              <h3 className="text-base md:text-2xl font-medium md:font-bold text-charcoal mb-1.5 md:mb-4">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-medium-dark-blue-grey leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GuidanceCenterIntroduction;

"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

const advantages = [
  {
    title: "三位一体",
    description:
      "学生发展指导智慧平台支持教师、学生与家长三方角色共同使用，使其能尽可能收集与利用多方信息对孩子进行心理与生涯指导。",
    image: "/images/products/advantage1.svg",
  },
  {
    title: "多场景应用",
    description:
      "系统集成了测评计划、测评统计、心理预警、心理历程、生涯辅助、生涯历程、生涯课堂等功能，可实现平台数据一体化管理。",
    image: "/images/products/advantage2.svg",
  },
  {
    title: "轻模式部署",
    description:
      "学生发展指导智慧平台为一体化To B SaaS服务平台，学校可按需采购，统一维护，无需独立部署。",
    image: "/images/products/advantage3.svg",
  },
];

export default function CoreAdvantages() {
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-white py-10 sm:py-20 overflow-hidden sm:overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="font-bold text-charcoal text-2xl md:text-[56px] tracking-[0] leading-normal mb-16"
        >
          核心优势
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-3 sm:gap-20 gap-10"
        >
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-gradient-to-t from-[#F0F6FF] to-transparent rounded-2xl sm:p-8 p-4 flex sm:flex-col flex-row gap-3 sm:gap-0"
            >
              <div className="mb-0 sm:mb-6">
                <Image
                  width={224}
                  height={224}
                  src={advantage.image || "/placeholder.svg"}
                  alt={advantage.title}
                  className=" sm:w-50 sm:h-56 w-32 h-32 object-contain"
                />
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-base sm:text-xl font-medium text-charcoal mb-2 sm:mb-4">
                  {advantage.title}
                </h3>
                <p className="text-medium-dark-blue-grey font-normal text-[13px] sm:text-base leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="sm:mt-40 mt-10">
          <motion.h2
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="font-bold text-charcoal text-2xl md:text-[56px] tracking-[0] leading-normal mb-2"
          >
            生涯数据可视化看板
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
            className="text-dark-blue-grey text-sm sm:text-xl font-normal leading-relaxed mt-5 sm:mt-10"
            style={{ willChange: "opacity" }}
          >
            以&quot;数据&quot;为核心，用&quot;数据&quot;来说话，生涯数据可视化看板为全校学生发展指导工作的过程管理、进度和质量监督提供分析研判的依据。
          </motion.p>
        </div>
      </div>
    </section>
  );
}

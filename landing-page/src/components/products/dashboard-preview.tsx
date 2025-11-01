"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function DashboardPreview() {
  return (
    <section className="relative md:pb-10 sm:pb-0 pb-15 mx-0 md:mx-auto max-w-7xl">
      <Image
        src="/images/products/banner-dashboard.svg"
        alt="Dashboard Preview"
        width={1920}
        height={800}
        className="hidden md:block relative media inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-0 hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 md:flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              staggerChildren: 0.2,
              delayChildren: 0.2,
            }}
            className="w-full lg:w-1/2 flex flex-col items-center sm:items-start mt-5 sm:mt-0"
          >
            <motion.h3
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hidden md:block text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-b from-[#000F34] from-[17.61%] to-[#1C88F9] bg-clip-text text-transparent"
            >
              学生发展指导
            </motion.h3>
            <motion.h3
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="hidden md:block text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-b from-[#000F34] from-[17.61%] to-[#1C88F9] bg-clip-text text-transparent"
            >
              可视化数据系统
            </motion.h3>
            <motion.h3
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="block md:hidden text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-b from-[#000F34] from-[17.61%] to-[#1C88F9] bg-clip-text text-transparent"
            >
              学生发展指导可视化数据系统
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-medium-dark-blue-grey text-xs sm:text-lg leading-relaxed mt-6 lg:mt-8 sm:w-full w-2/3 text-center sm:text-left"
            >
              基于师生运用学生发展指导智慧平台的动态数据，全景展示学校生涯规划指导各模块的实时进展与成效。
            </motion.p>
          </motion.div>
        </div>
        <Image
          src="/images/products/banner-dashboard-mobile.svg"
          alt="Dashboard Preview"
          width={1920}
          height={800}
          className="absolute -top-5 left-1/2 -translate-x-1/2 block px-4 md:hidden w-full h-[500px] object-cover"
        />
      </div>


      <div className="block md:hidden mx-4 relative" style={{
        backgroundImage: "url('/images/products/dashboard-mobile.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "481px"
        // height: "800px"
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            staggerChildren: 0.2,
            delayChildren: 0.2,
          }}
          className="w-full lg:w-1/2 text-center pt-20 px-10"
        >
          <motion.h3
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-b from-[#000F34] from-[17.61%] to-[#1C88F9] bg-clip-text text-transparent"
          >
            学生发展指导可视化数据系统
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-medium-dark-blue-grey text-base sm:text-lg leading-relaxed mt-6 lg:mt-8"
          >
            基于师生运用学生发展指导智慧平台的动态数据，全景展示学校生涯规划指导各模块的实时进展与成效。
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

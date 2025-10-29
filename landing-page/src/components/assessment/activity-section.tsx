"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ActivitySection() {
  return (
    <section className="pb-20 md:pb-50 bg-white">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.h2
          className="font-bold text-charcoal text-2xl md:text-[56px] leading-normal mb-3 sm:mb-4"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          活动内容
        </motion.h2>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-5xl"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
        >
          生涯探索游园会以生涯规划中最著名的理论之一&ldquo;认知信息加工理论(CIP)&rdquo;为理论基础,结合生涯规划经典三大步骤设计了三个生涯探索体验区，包括&ldquo;内部探索区&rdquo;、&ldquo;外部探索区&rdquo;及&ldquo;挑战与展望&rdquo;三个分区。
        </motion.p>
        <div className="relative mt-8 sm:mt-12 md:mt-16 flex justify-center">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: 1, ease: "easeOut" }}
          >
            <Image
              src="/images/assessment/activity-section.svg"
              alt="Service Triangle Diagram"
              className="w-full h-auto max-w-full"
              width={1920}
              height={1080}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

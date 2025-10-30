"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { GradientButton } from "../ui/gradient-button";

import { CooperationFormModal } from "./cooperation-form-modal";

const HeroSection = () => {
  return (
    <div className="bg-vibrant-blue">
      <div className="px-6 pt-16 md:pt-0 text-center pb-20 md:pb-[200px] relative overflow-x-hidden bottom-0 md:bottom-[-100px] bg-vibrant-blue">
        {/* Title - fade in from right */}
        <motion.h2
          className="text-2xl sm:text-4xl md:text-5xl font-bold mb-[13px] md:mb-11 text-balance text-accent"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.2,
          }}
        >
          已经过200+学校验证 可为您定制专属解决方案
        </motion.h2>

        {/* Description - fade in from left */}
        <motion.p
          className="text-sm sm:text-lg md:text-3xl mb-[23px] md:mb-14 opacity-90 text-accent"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.4,
          }}
        >
          专属顾问一个工作日内为您解答
        </motion.p>

        {/* Button - fade in from bottom */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.6,
          }}
        >
          <CooperationFormModal>
            <GradientButton className="mx-auto cursor-pointer text-sm sm:text-lg">
              <span>立即咨询</span>
              <Image
                alt="system guide"
                src="/icons/system-guide-icon.svg"
                height={36}
                width={36}
                className="w-6 h-6"
              />
            </GradientButton>
          </CooperationFormModal>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;

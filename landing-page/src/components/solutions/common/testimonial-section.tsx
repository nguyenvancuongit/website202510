"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string[] | string;
  classNameText?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
  }
};



const TestimonialsSection = ({ title, description, classNameText = "" }: Props) => {
  return (
    <section className="relative py-10 md:p-0 md:mb-45 w-full flex flex-col items-center justify-center md:min-h-[600px]">
      <Image
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
        alt="Group"
        src="/images/solutions/guidance-center/testimonial-bg.png"
        width={1920}
        height={680}
      />
      <motion.div
        className="relative z-10 flex flex-col justify-center h-full px-4 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.h2
          className="font-bold text-charcoal text-2xl md:text-[56px] tracking-[0] leading-normal mb-[27px] md:mb-10"
          variants={itemVariants}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {title}
        </motion.h2>

        <motion.div
          className="text-medium-dark-blue-grey px-6 py-10 sm:py-9 md:p-0 text-sm md:text-xl flex flex-col gap-3 font-[350px] sm:font-normal tracking-[0] bg-[url('/images/solutions/guidance-center/testimonial-bg.svg')] sm:bg-[url('/images/solutions/guidance-center/testimonial-bg.png')] bg- bg-no-repeat md:bg-none"
          variants={itemVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          {Array.isArray(description) ? (
            description.map((desc, index) => (
              <motion.span
                className="leading-6 md:leading-9 block whitespace-pre-line sm:whitespace-normal"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
              >
                {desc}
              </motion.span>
            ))
          ) : (
            <motion.span
              className={cn("leading-6 md:leading-[56px]", classNameText)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {description}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;

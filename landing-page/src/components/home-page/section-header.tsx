"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export default function SectionHeader({
  title,
  subtitle,
  className = "",
}: Readonly<{
  title: string;
  subtitle: string;
  className?: string;
}>) {
  return (
    <motion.div
      className={cn("text-center space-y-6 mb-9 md:mb-16 px-12 md:px-0 md:max-w-7xl", className)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h1
        className="text-charcoal text-2xl sm:text-6xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: 0.1,
        }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {title}
      </motion.h1>
      <motion.h2
        className="text-dark-blue-grey sm:text-2xl text-sm"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: 0.3,
        }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {subtitle}
      </motion.h2>
    </motion.div>
  );
}

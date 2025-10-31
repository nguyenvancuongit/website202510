"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface Props {
  img: string,
  title: string,
  className?: string,
  customClassNameText?: string,
}
export default function BannerService({ img, title, className, customClassNameText }: Props) {
  return (
    <section className={cn("pb-20 md:pb-21.5 bg-white", className)}>
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.h2
          className={cn("font-bold text-charcoal text-left text-2xl md:text-3xl lg:text-[56px] leading-normal mb-8 sm:mb-4", customClassNameText)}
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          {title}
        </motion.h2>
        <div className="relative sm:mt-16 mt-8 flex justify-center">
          <motion.div
            className="relative w-full"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, delay: 1.1, ease: "easeOut" }}
          >
            <Image
              src={img}
              alt={title}
              className="w-full h-auto"
              width={1920}
              height={1080}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

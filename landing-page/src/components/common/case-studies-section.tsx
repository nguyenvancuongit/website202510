"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { GradientButton } from "@/components/ui/gradient-button";

export interface CaseStudyItem {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  slug: string;
  categorySlug: string;
}

interface CaseStudiesSectionProps {
  title: string;
  buttonText?: string;
  cases: CaseStudyItem[];
  className?: string;
  backgroundClassName?: string;
  showButton?: boolean;
}

export default function CaseStudiesSection({
  title,
  buttonText = "合作咨询",
  cases,
  className = "",
  backgroundClassName = "bg-white",
  showButton = true,
}: CaseStudiesSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section className={`${backgroundClassName} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-50">
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="font-bold text-charcoal text-2xl md:text-2xl md:text-[56px] leading-normal"
          >
            {title}
          </motion.h2>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}
              className="hidden sm:block"
            >
              <GradientButton onClick={() => {
                redirect("/case-study")
              }}>
                {buttonText}
                <Image
                  src="/icons/system-guide-icon.svg"
                  alt="System Guide Icon"
                  width={36}
                  height={36}
                  className="w-6 h-6"
                />
              </GradientButton>
            </motion.div>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {cases.map((caseItem, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Link href={`/case-study/${caseItem.categorySlug}/${caseItem.slug}`} className="bg-white overflow-hidden group block">
                <Image
                  src={caseItem.image}
                  alt={caseItem.imageAlt || caseItem.title}
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />

                <div className="pt-6">
                  <h3 className="sm:text-xl text-base font-bold text-gray-900 mb-3">
                    {caseItem.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{
                    __html: caseItem.description
                  }} />

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

export default function ProductTabs({
  tabs,
  platforms,
  keepTabs = false,
  activeTab,
  setActiveTab,
}: {
  tabs: { icon: string; title: string }[]
  platforms: {
    title: string
    description: string
    image: string
    imageMobile?: string
  }[]
  keepTabs?: boolean
  activeTab: number
  setActiveTab: (index: number) => void
}) {

  return (
    <>
      {/* Desktop Tabs */}
      <div className={cn("sm:block", !keepTabs && "hidden")}>
        <motion.div
          className="flex justify-center gap-3 sm:gap-4 mb-8 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveTab(index)}
              onMouseEnter={() => setActiveTab(index)}
              className={`flex items-center justify-center gap-2 px-4 bg-transparent sm:px-6 py-2 sm:py-3 transition-all duration-300 text-base sm:text-lg ${activeTab === index
                ? "text-vibrant-blue text-xl rounded-[44px] bg-white shadow-[2px_12px_16px_0_rgba(176,215,255,0.25)]"
                : "text-charcoal rounded-lg hover:bg-white/50"
                }`}
              variants={{
                hidden: { opacity: 0, y: -30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={tab.icon || ""}
                alt={tab.title}
                width={64}
                height={64}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
              />
              <span className="font-medium">{tab.title}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
          {/* Text Content - Staggered from left */}
          <motion.div
            className="space-y-4 sm:space-y-6 order-2 sm:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.6,
                },
              },
            }}
          >
            <motion.h2
              className="text-base sm:text-2xl md:text-[32px] font-bold text-gray-900 leading-tight"
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {platforms[activeTab].title}
            </motion.h2>
            <motion.div
              className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600 min-h-[60px] sm:min-h-[80px]"
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: platforms[activeTab].description,
                }}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <GradientButton className="mt-10 sm:mt-0">
                了解详情
                <Image
                  src="/icons/system-guide-icon.svg"
                  alt="System Guide Icon"
                  width={36}
                  height={36}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </GradientButton>
            </motion.div>
          </motion.div>

          {/* Image Content - Fade from right */}
          <motion.div
            className="relative w-full order-1 sm:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
          >
            <Image
              width={500}
              height={500}
              src={platforms[activeTab].image}
              alt={`${platforms[activeTab].title} Interface`}
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
      {/* Tabs Navigation - Staggered fade from top */}
      {/* Mobile Tabs */}
      {
        !keepTabs && <div className="sm:hidden flex flex-col gap-8">
          {platforms.map((platform, index) => (
            <div key={index}>
              <div
                style={{
                  background:
                    "radial-gradient(53.69% 53.69% at 49.86% 46.31%, #4A6F8C 0%, #283A4F 100%)",
                }}
                className="pb-4 min-h-[400px] relative"
              >
                <h2 className="text-white text-2xl pt-4 text-center">{platform.title}</h2>
                <Image
                  src={platform?.imageMobile || ""}
                  alt={platform.title}
                  width={224}
                  height={260}
                  className="w-1/2 h-auto object-cover mx-auto pb-4 pt-4"
                />
              </div>
              <p className="text-md text-dark-blue-grey mt-2" dangerouslySetInnerHTML={{
                __html: platform.description
              }} />
            </div>
          ))}
        </div>
      }
    </>
  )
}

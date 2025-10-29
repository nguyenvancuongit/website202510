"use client";

import { useRef, useState } from "react";
import CountUp from "react-countup";
import { AnimatePresence, motion } from "framer-motion";

interface StatisticProps {
  number: number;
  label: string;
  suffix?: string;
}

function Statistic({ number, label, suffix = "+" }: StatisticProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex gap-4 md:justify-between">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        onViewportEnter={() => setIsVisible(true)}
      >
        <AnimatePresence>
          <motion.div
            className="text-3xl md:text-7xl font-bold text-white md:mb-6 flex items-start"
            style={{
              transform: "scaleY(1.2)",
              lineHeight: "0.8",
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isVisible ? (
              <>
                <CountUp
                  start={0}
                  end={number}
                  duration={2.5}
                  separator=","
                  useEasing={true}
                  easingFn={(t, b, c, d) => {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                  }}
                  className="font-meibei-he-he"
                />
                <span className="text-3xl md:text-5xl relative -top-2 ml-1">
                  {suffix}
                </span>
              </>
            ) : (
              <>
                <span>0</span>
                <span className="text-3xl md:text-5xl relative -top-2 ml-1">
                  {suffix}
                </span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <motion.div
          className="text-sm md:text-xl text-white/90 font-medium"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {label}
        </motion.div>
      </motion.div>
      <div className="w-[1px] h-[18px] bg-white" />
    </div>
  );
}

export default function StatisticsBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={bannerRef}
      // className="relative md:min-h-[600px] flex flex-col px-10 md:px-[140px] py-20"
      style={{
        background: "linear-gradient(180deg, #0381FF 0%, #67B3FF 100%)",
      }}
    >
      {/* Header Text */}
      <div className="px-5 md:px-10 pt-[35px] md:pt-[131px] pb-4 md:pb-[103px] max-w-7xl mx-auto flex flex-col justify-between md:h-[900px]">
        <div className=" mb-10 md:mb-40 max-w-4xl overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-2xl md:text-6xl font-bold text-white mb-3.5 md:mb-7"
          >
            全方位覆盖生涯发展阶段
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-2xl md:text-6xl font-bold text-white mb-[59px]"
          >
            助力个人与组织成长
          </motion.h2>
        </div>

        {/* Statistics Grid */}
        <motion.div
          className="grid grid-cols-3 gap-7 md:gap-24 w-full max-w-7xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Statistic number={57} label="覆盖场景" />
            <div className="w-1.5 md:w-4 mt-[14px] md:mt-[70px] bg-white h-[1px]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Statistic number={300} label="合作组织" />
            <div className="w-1.5 md:w-4 mt-[14px] md:mt-[70px] bg-white h-[1px]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Statistic number={10500} label="终端用户" />
            <div className="w-1.5 md:w-4 mt-[14px] md:mt-[70px] bg-white h-[1px]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

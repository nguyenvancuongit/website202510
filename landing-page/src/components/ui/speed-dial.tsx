"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import ChatIcon from "@/assets/chat-icon";
import MessageIcon from "@/assets/message-icon";
import PhoneIcon from "@/assets/phone-icon";
import ScrollUpIcon from "@/assets/scroll-up-icon";
import { CooperationFormModal } from "@/components/home-page/cooperation-form-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMedia } from "@/hooks/use-media";

const speedDialItems = [
  {
    icon: (
      <PhoneIcon className="w-5 h-5 text-gray-600 group-hover:[&_path]:fill-vibrant-blue transition-colors" />
    ),
    label: "020-1234568",
  },
  {
    icon: (
      <MessageIcon className="w-5 h-5 text-gray-600 group-hover:[&_path]:fill-vibrant-blue transition-colors" />
    ),
    label: (
      <Image
        src="/images/qr/wechat.png"
        alt="微信二维码"
        width={92}
        height={92}
      />
    ),
  },
  {
    icon: (
      <ChatIcon className="w-5 h-5 text-gray-600 group-hover:[&_path]:fill-vibrant-blue transition-colors" />
    ),
    label: "合作咨询",
    isModal: true,
  },
];

export default function SpeedDial() {
  const [canScrollTop, setCanScrollTop] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);
  const { isMobile } = useMedia();

  useEffect(() => {
    const handleScroll = () => {
      setCanScrollTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (canScrollTop) {
      window.scrollTo({
        top: -100,
        behavior: "smooth",
      });
    }
  };

  const handleTooltipClick = (index: number) => {
    if (isMobile) {
      setOpenTooltip(openTooltip === index ? null : index);
    }
  };

  const handleClickOutside = () => {
    if (isMobile && openTooltip !== null) {
      setOpenTooltip(null);
    }
  };

  return (
    <TooltipProvider>
      <div
        className="fixed bottom-6 right-6 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Click outside overlay for mobile */}
        {isMobile && openTooltip !== null && (
          <div className="fixed inset-0 -z-10" onClick={handleClickOutside} />
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-4xl shadow-lg border border-gray-200 p-2 flex flex-col gap-1"
        >
          {/* Scroll to Top Button */}

          {speedDialItems.map((item, index) => (
            <div key={index} className="relative">
              {item.isModal ? (
                <CooperationFormModal>
                  <button>
                    <Tooltip
                      open={isMobile ? openTooltip === index : undefined}
                    >
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={() => handleTooltipClick(index)}
                          className="size-9 rounded-xl flex items-center justify-center transition-all duration-200 group"
                        >
                          {item.icon}
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-white text-dark-blue-grey shadow-lg border border-gray-200"
                        side="left"
                      >
                        <div className="flex items-center justify-center">
                          {item.label}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </CooperationFormModal>
              ) : (
                <Tooltip open={isMobile ? openTooltip === index : undefined}>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => handleTooltipClick(index)}
                      className="size-9 rounded-xl flex items-center justify-center transition-all duration-200 group"
                    >
                      {item.icon}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-white text-dark-blue-grey shadow-lg border border-gray-200 px-2.5"
                    side="left"
                  >
                    <div className="flex items-center justify-center">
                      {item.label}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={scrollToTop}
                disabled={!canScrollTop}
                className={`size-9 rounded-xl flex items-center justify-center transition-all duration-200 group ${canScrollTop ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
              >
                <ScrollUpIcon
                  className={`w-5 h-5 transition-colors ${canScrollTop
                    ? "group-hover:[&_path]:fill-vibrant-blue"
                    : "[&_path]:fill-[#C9CDD4]"
                    }`}
                />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white text-dark-blue-grey shadow-lg border border-gray-200"
              side="left"
            >
              <p>
                {canScrollTop
                  ? isMobile
                    ? "双击回到顶部"
                    : "回到顶部"
                  : "已在顶部"}
              </p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}

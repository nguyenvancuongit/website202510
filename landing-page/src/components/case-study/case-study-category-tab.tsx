"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface CaseStudyCategoryTabProps {
  tabs: { name: string; id: string; slug: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
  isLoading: boolean;
}

const CaseStudyCategoryTab: React.FC<CaseStudyCategoryTabProps> = ({
  tabs,
  activeTab = 0,
  onTabChange,
  className,
  isLoading,
}) => {
  const [selectedTab, setSelectedTab] = useState(activeTab);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const activeTabElement = tabRefs.current[selectedTab] ?? tabRefs.current[tabs[0].slug];
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [selectedTab, tabs]);

  const handleTabClick = (id: string) => {
    setSelectedTab(id);
    onTabChange(id);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex flex-nowrap overflow-x-auto border-b border-b-[#DEEAFF] items-center gap-[68px] mx-1">
        {isLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="pb-4 pt-4">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            {tabs.map((tab, index) => (
              <button
                key={index}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={(el) => (tabRefs.current[tab.slug] = el) as any}
                onClick={() => handleTabClick(tab.slug)}
                className={cn(
                  "pb-4 pt-4 text-sm whitespace-nowrap md:text-[18px] font-medium transition-colors duration-200 cursor-pointer text-charcoal hover:text-vibrant-blue",
                  selectedTab === tab.slug && "text-base md:text-2xl",
                )}
              >
                {tab.name}
              </button>
            ))}
            <div
              className="absolute rounded-[2px] md:rounded-none bottom-0 h-1 md:h-0.5  bg-[#1C88F9] transition-all duration-300 ease-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CaseStudyCategoryTab;

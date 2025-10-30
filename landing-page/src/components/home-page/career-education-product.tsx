"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import SectionHeader from "@/components/home-page/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { CareerEducationConfig } from "@/services/career-education.service";

type ServiceCategory = {
  id: string;
  icon: string;
  title: string;
};

type ProductSystem = {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  image: string;
  alt: string;
};

const serviceCategories: ServiceCategory[] = [
  {
    id: "platform",
    icon: "/images/career-education/cloud.svg",
    title: "学生发展指导智慧平台",
  },
  {
    id: "consulting",
    icon: "/images/career-education/card.svg",
    title: "企业数字化咨询服务",
  },
  {
    id: "training",
    icon: "/images/career-education/home.svg",
    title: "生涯培训与活动",
  },
  {
    id: "device",
    icon: "/images/career-education/smart.svg",
    title: "生涯探索智能设备",
  },
];

// Product systems data grouped by category
const productSystemsByCategory: Record<string, ProductSystem[]> = {
  platform: [
    {
      id: "platform-1",
      title: "学生测评与发展指导系统",
      description:
        "学生通过PC端完成生涯课堂作业、开展自由测评练习，查询职业、院校信息库，让学生了解自我、认知世界、模拟高考志愿填报。",
      bgColor: "linear-gradient(180deg, #D6E8FF 7.09%, #FFF 53.53%)",
      image: "/images/career-education/platform/image1.png",
      alt: "Career Guidance System Interface",
    },
    {
      id: "platform-2",
      title: "生涯教师咨询辅助系统",
      description:
        "应个体咨询辅导不同阶段的需求，精选科学权威的量表、工具，覆盖中学阶段生涯教育资源包，辅助教师高效开展个性化指导。",
      bgColor: "linear-gradient(180deg, #BFF1FF 6.88%, #FFF 54.69%)",
      image: "/images/career-education/platform/image2.png",
      alt: "Career Consulting System Interface",
    },
    {
      id: "platform-3",
      title: "生涯课堂系统",
      description:
        "智能化软硬件组合，内置不同侧重点的测评量表和生涯探索工具，教学模式灵活调用，帮助教师优化发展指导教学内容。",
      bgColor: "linear-gradient(180deg, #9ED0FF 6.88%, #FFF 54.69%)",
      image: "/images/career-education/platform/image3.png",
      alt: "Career Course System Interface",
    },
    {
      id: "platform-4",
      title: "生涯数据可视化看板",
      description:
        "汇集师生运用学生发展指导智慧平台所获得的过程数据和结果数据，实时展示学生生涯规划指导的各版块工作进展。",
      bgColor: "linear-gradient(180deg, #BCFBE7 6.88%, #FFF 54.69%)",
      image: "/images/career-education/platform/image4.png",
      alt: "Career Visualization Dashboard Interface",
    },
  ],
  device: [
    {
      id: "device-1",
      title: "生涯自助探索一体机",
      description:
        "集合了“测试探索、升学指导、职业规划”三大核心模块，多场景灵活部署，助力学校减负增效，弥补专业指导老师缺口。",
      bgColor: "linear-gradient(180deg, #D6E8FF 7.09%, #FFF 53.53%)",
      image: "/images/career-education/device/image1.png",
      alt: "Smart Terminal",
    },
    {
      id: "device-2",
      title: "AI智能静音生涯探索舱",
      description:
        "环保静音舱体，内置生涯教师咨询辅助系统，可结合学生的兴趣、个性和职业倾向等进行专业测评，开展学业发展辅导。",
      bgColor: "linear-gradient(180deg, #9ED0FF 6.88%, #FFF 54.69%)",
      image: "/images/career-education/device/image2.png",
      alt: "Self-service Device",
    },
    {
      id: "device-3",
      title: "卧式生涯自助探索终端",
      description:
        "融合放松按摩与智能生涯探索的功能，为学生营造轻松舒缓的探索环境，便于进行深度的兴趣发掘、职业测评与学业规划。",
      bgColor: "linear-gradient(180deg, #BCFBE7 6.88%, #FFF 54.69%)",
      image: "/images/career-education/device/image3.png",
      alt: "Self-service Device",
    },
    {
      id: "device-4",
      title: "元宇宙兴趣岛探索终端",
      description:
        "借助元宇宙技术，构建妙趣横生的虚拟兴趣岛，搭配VR眼镜，让学生沉浸式挖掘兴趣爱好，唤醒其探索世界的意识。",
      bgColor: "linear-gradient(180deg, #D2D5FC 6.88%, #FFF 54.69%)",
      image: "/images/career-education/device/image4.png",
      alt: "Self-service Device",
    },
  ],
  training: [
    {
      id: "training-1",
      title: "生涯游园会活动",
      description:
        "以生涯规划著名理论“认知信息加工理论（CIP）”为基础，设置三大生涯探索体验区，让学生了解自己性格、兴趣及能力等。",
      bgColor: "linear-gradient(180deg, #D6E8FF 7.09%, #FFF 53.53%)",
      image: "/images/career-education/training/image1.png",
      alt: "Teacher Training",
    },
    {
      id: "training-2",
      title: "校园科技节活动",
      description:
        "深度融合数字科技与生涯规划理论，联合学校共同打造沉浸式生涯探索体验，助力学生从多个维度认识自我、了解世界。",
      bgColor: "linear-gradient(180deg, #BFF1FF 6.88%, #FFF 54.69%)",
      image: "/images/career-education/training/image2.png",
      alt: "Student Camp",
    },
    {
      id: "training-3",
      title: "职业大讲堂活动",
      description:
        "邀请各行各业的从业者，以讲座、互动问答等形式，分享职业日常、成长路径与行业前景，帮助学生初步建立职业认知。",
      bgColor: "linear-gradient(180deg, #BCFBE7 6.88%, #FFF 54.69%)",
      image: "/images/career-education/training/image3.png",
      alt: "Student Camp",
    },
    {
      id: "training-4",
      title: "企业参访活动",
      description:
        "组织学生前往各行业、企业进行实地观察、了解未来就业方向、岗位职责、薪资水平等，帮助学生进一步明晰生涯发展方向。",
      bgColor: "linear-gradient(180deg, #9ED0FF 6.88%, #FFF 54.69%)",
      image: "/images/career-education/training/image4.png",
      alt: "Student Camp",
    },
    {
      id: "training-5",
      title: "生涯指导老师高级研修班",
      description:
        "通过案例研讨、实操训练、生涯指导工具运用等形式，聚焦理论更新、技能优化、课程设计等内容，提升教师专业素养。",
      bgColor: "linear-gradient(180deg, #D2D5FC 6.88%, #FFF 54.69%)",
      image: "/images/career-education/training/image5.png",
      alt: "Student Camp",
    },
    {
      id: "training-6",
      title: "生涯指导老师A/B/C证培训",
      description:
        "象导生涯以师资培训解决方案为支撑，以打造专业的生涯教育指导教师为目标，推出的多层次培训课程和资质认证体系。",
      bgColor: "linear-gradient(180deg, #F9E9DF 6.88%, #FFF 55.83%)",
      image: "/images/career-education/training/image6.png",
      alt: "Student Camp",
    },
  ],
  consulting: [
    {
      id: "consulting-1",
      title: "企业人才发展咨询服务",
      description:
        "为企业量身定制的人才培养与发展的方案，提供全周期、一站式的人才发展咨询服务，提升核心人才的能力，驱动企业快速发展。",
      bgColor: "linear-gradient(180deg, #D6E8FF 7.09%, #FFF 53.53%)",
      image: "/images/career-education/consulting/image1.png",
      alt: "Student Camp",
    },
    {
      id: "consulting-2",
      title: "数智化转型咨询服务",
      description:
        "赋能企业数字化转型，梳理生产流程、客户开发、组织决策等关键环节的问题，重组优化原有业务流程，提升运营与决策效率。",
      bgColor: "linear-gradient(180deg, #BFF1FF 6.88%, #FFF 54.69%)",
      image: "/images/career-education/consulting/image2.png",
      alt: "Student Camp",
    },
  ],
};

export default function CareerEducationProduct({
  config,
}: {
  config: CareerEducationConfig;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter and sort categories and items based on backend configuration
  const { filteredCategories, filteredProducts } = useMemo(() => {
    if (!config) {
      // Fallback to all data if config not loaded yet
      return {
        filteredCategories: serviceCategories,
        filteredProducts: productSystemsByCategory,
      };
    }

    const categoryKeys = [
      "platform",
      "device",
      "training",
      "consulting",
    ] as const;

    // Get enabled categories and sort by order
    const enabledCategories = categoryKeys
      .filter((key) => config[key]?.enabled)
      .sort((a, b) => (config[a]?.order || 0) - (config[b]?.order || 0))
      .map((key) => {
        const original = serviceCategories.find((cat) => cat.id === key);
        return {
          ...original!,
          title: config[key]?.name || original!.title,
          icon: config[key]?.icon || original!.icon,
        };
      });

    // Filter and sort items within each category
    const enabledProducts: Record<string, ProductSystem[]> = {};

    categoryKeys.forEach((categoryKey) => {
      if (config[categoryKey]?.enabled) {
        const categoryConfig = config[categoryKey];
        const allItems = productSystemsByCategory[categoryKey] || [];

        // Get enabled item IDs from config
        interface ConfigItem {
          id: string;
          enabled: boolean;
          order: number;
        }

        const enabledItemIds = new Set(
          (categoryConfig.items as ConfigItem[])
            ?.filter((item) => item.enabled)
            .map((item) => item.id) || []
        );

        // Filter hardcoded items by enabled IDs and sort by config order
        const items = allItems
          .filter((item) => enabledItemIds.has(item.id))
          .sort((a, b) => {
            const orderA =
              (categoryConfig.items as ConfigItem[])?.find((i) => i.id === a.id)
                ?.order || 0;
            const orderB =
              (categoryConfig.items as ConfigItem[])?.find((i) => i.id === b.id)
                ?.order || 0;
            return orderA - orderB;
          });

        enabledProducts[categoryKey] = items;
      }
    });

    return {
      filteredCategories: enabledCategories,
      filteredProducts: enabledProducts,
    };
  }, [config]);

  // Build tabs from filtered categories
  const tabs = filteredCategories.map((cat, index) => ({
    id: index,
    iconPath: cat.icon,
    title: cat.title,
    // simple color presets per index for UI accent
    textColor:
      ["text-blue-600", "text-cyan-600", "text-purple-600", "text-indigo-600"][
        index
      ] || "text-blue-600",
    categoryId: cat.id,
  }));

  const currentCategoryId = tabs[activeTab]?.categoryId;
  const currentCards: ProductSystem[] = useMemo(() => {
    return currentCategoryId ? filteredProducts[currentCategoryId] || [] : [];
  }, [currentCategoryId, filteredProducts]);

  // Active pill highlight measurements
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({ left: 0, top: 0, width: 0, height: 0 });
  const [dirClass, setDirClass] = useState<
    "animate-tab-right" | "animate-tab-left" | ""
  >("");

  useEffect(() => {
    const container = tabsContainerRef.current;
    const el = tabRefs.current[activeTab];
    if (!container || !el) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setPillStyle({
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
    });
  }, [activeTab, isLoaded]);

  const handleTabChange = (tabIndex: number) => {
    if (tabIndex !== activeTab) {
      setDirClass(
        tabIndex > activeTab ? "animate-tab-right" : "animate-tab-left"
      );
      setActiveTab(tabIndex);
      setAnimationKey((prev) => prev + 1);
    }
  };

  return (
    <div className="md:min-h-screen px-4 md:px-6 pt-19 pb-[68px] md:pt-30 md:pb-40 relative">
      <Image
        src="/images/career-education/Ellipse1.svg"
        alt="bg1"
        width={1547}
        height={926}
        className="absolute top-1/3 md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 md:-translate-y-1/2 max-h-full"
      />
      <Image
        src="/images/career-education/Ellipse2.svg"
        alt="bg2"
        width={1880}
        height={915}
        className="absolute top-1/3 md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  md:-translate-y-1/2 max-h-full"
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          title="全场景生涯教育产品体系"
          subtitle="软硬件结合、虚实联动，打造“数据采集-自主探索-沉浸体验-校企联动”完整业务闭环"
        />

        {/* Tab Navigation */}
        <div
          ref={tabsContainerRef}
          className={`relative flex sm:flex-wrap sm:justify-center gap-3 md:gap-4 mb-10 md:mb-16 transition-all duration-1000 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Moving active pill */}
          <div
            className={`absolute rounded-md md:rounded-full bg-white border-none border-gray-200 transition-all duration-300 ease-out pointer-events-none ${dirClass}`}
            style={{
              left: pillStyle.left,
              top: pillStyle.top,
              width: pillStyle.width,
              height: pillStyle.height,
              zIndex: 0,
            }}
          />
          {tabs.map((tab, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onMouseEnter={() => handleTabChange(index)}
                className={cn(
                  "group relative flex flex-col md:flex-row items-center md:gap-2  p-3 md:py-4 md:px-8 rounded-full font-medium transition-all duration-500 transform hover:scale-105 z-[1]",
                  isActive
                    ? "text-gray-700"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Image
                  src={tab.iconPath}
                  alt={tab.title}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span
                  className={`text-sm md:text-xl ${
                    isActive ? "text-[#1C88F9]" : "text-[#1D2129]"
                  }`}
                >
                  {tab.title}
                </span>
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 bg-white transition-all duration-300" />
              </button>
            );
          })}
        </div>

        {/* Cards Carousel */}
        <div key={animationKey} className="relative">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent
              className={cn({
                "flex justify-start md:justify-center": currentCards.length < 4,
              })}
            >
              {currentCards.map((card, index) => (
                <CarouselItem
                  key={`${activeTab}-${index}`}
                  className="basis-auto"
                >
                  <div
                    className="group rounded-2xl p-6 md:py-12 md:px-8 border-none shadow-none transition-all duration-500 cursor-pointer transform opacity-0 animate-slide-in-right h-full w-[267px] md:w-[378px]"
                    style={{
                      background: card.bgColor,
                      animationFillMode: "forwards",
                      borderColor: "rgba(0,0,0,0.06)",
                    }}
                  >
                    <h3 className="text-lg md:text-2xl font-medium text-dark-blue-grey mb-3 md:mb-6">
                      {card.title}
                    </h3>
                    <p className="text-medium-dark-blue-grey text-sm md:text-base leading-relaxed mb-6 md:mb-12 text-justify">
                      {card.description}
                    </p>
                    <div className="w-full h-40 sm:h-48 md:h-52 rounded-xl overflow-hidden bg-white/50 border border-white/60">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-300" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

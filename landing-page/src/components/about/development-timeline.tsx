"use client";
import { Fragment, useEffect, useRef, useState } from "react";

import TimelineContent from "./timeline-content";
import TimelineMarker from "./timeline-marker";

const ROW_CADENCE_MS = 900;

const timelineRows = [
  {
    right: { date: "2019.08", text: "纬英数字科技（广州）有限公司成立" },
    left: {
      date: "2022.08",
      text: "纬英学生发展研究院成立",
    },
  },
  {
    right: {
      date: "2023.03",
      text: "学生发展指导智慧平台教师端上线、可实现大规模普查、一对一咨询等各类咨询服务",
    },
    left: {
      date: "2023.06",
      text: "院校信息库功能上线、学生可通过平台自助查询院校、专业、职业等信息",
    },
  },
  {
    right: {
      date: "2023.08",
      text: "首次利用学生发展指导智慧平台助力开展广东省生涯教师指导培训",
    },
    left: {
      date: "2023.09",
      text: "生涯课堂系统上线，教师可以利用智能平板进行互动式生涯课堂教学",
    },
  },
  {
    right: {
      date: "2024.01",
      text: "智能选科功能上线，学生可以根据院校与专业的要求，了解选科组合的匹配度和专业的选科限制",
    },
    left: {
      date: "2024.03",
      text: "推出第一代自助式智能生涯探索机，学生可以在校园里通过自助探索设备查询生涯信息,",
    },
  },
  {
    right: {
      date: "2024.12",
      text: "生涯测评小程序上线，学生可通过小程序进行量表的测评，随时随地查看心理与生涯报告",
    },
    left: {
      date: "2025.03",
      text: "“生涯探索游园会”走进华附、佛山市南海中学等多所广东中学名校，陆续举办数十场生涯探索活动",
    },
  },
  {
    right: {
      date: "2025.09",
      text: "纬英科技推出聚焦于生涯教育领域的全新品牌“象导生涯”，更专注于生涯教育的服务与发展",
    },
  },
]

export default function DevelopmentTimeline() {
  const [isVisible, setIsVisible] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false)
  const timelineRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Flatten timeline data for mobile and reverse order (newest first)
  const mobileTimelineData: { date: string; text: string; index: number }[] = [];
  timelineRows.forEach((row, i) => {
    if (row.right) {
      mobileTimelineData.push({
        date: row.right.date,
        text: row.right.text,
        index: i * 2,
      });
    }
    if (row.left) {
      mobileTimelineData.push({
        date: row.left.date,
        text: row.left.text,
        index: i * 2 + 1,
      });
    }
  });

  // Reverse the array to show newest items first
  mobileTimelineData.reverse()

  return (
    <section className="py-8 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-6xl font-bold text-charcoal mb-3 md:mb-4">
          发展历程
        </h2>
        <p className="text-sm md:text-base text-dark-blue-grey mb-8 md:mb-12">
          象导生涯深耕数字技术领域，赋能全场景生涯教育和企业人才发展，构建全人化人才培养体系。
        </p>

        <div
          ref={timelineRef}
          className="relative max-w-4xl mx-auto"
        >
          {/* Mobile Timeline */}
          <div className="md:hidden relative">
            {/* Main vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-vibrant-blue to-blue-600"></div>

            <div className="space-y-8">
              {(showAllItems
                ? mobileTimelineData
                : mobileTimelineData.slice(0, 4)
              ).map((item, i) => (
                <div
                  key={i}
                  className="relative flex items-start"
                >
                  <TimelineMarker
                    delay={i * 400}
                    className="w-4 h-4 p-1 box-content absolute !left-[25px] top-1/2 translate-none bg-white flex items-center rounded-none"
                  />
                  {/* Marker */}
                  <div
                    className="relative z-10 w-12 h-12 rounded-full bg-white border-4 border-vibrant-blue flex items-center justify-center shadow-lg"
                    style={{
                      opacity: 0,
                      transform: "scale(0)",
                      animationName: isVisible ? "pulseMarker" : "none",
                      animationDuration: isVisible ? "1s" : "0s",
                      animationTimingFunction: "ease-out",
                      animationFillMode: "forwards",
                      animationIterationCount: isVisible ? "infinite" : "1",
                      animationDelay: isVisible ? `${i * 200}ms` : "0ms",
                    }}
                  >
                    {/* <div className="w-4 h-4 rounded-full bg-vibrant-blue"></div> */}
                  </div>

                  {/* Content Card */}
                  <div
                    className="ml-1 flex-1"
                    style={{
                      opacity: 0,
                      transform: "translateY(20px)",
                      animationName: isVisible ? "slideInUp" : "none",
                      animationDuration: isVisible ? "300ms" : "0ms",
                      animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      animationFillMode: "forwards",
                      animationDelay: isVisible ? `${i * 200 + 100}ms` : "0ms",
                    }}
                  >
                    <div className="bg-light-blue-bg rounded-xl px-6 py-2.5 border border-[#CED8FF] duration-300">
                      <div className="flex items-center mb-2">
                        <div className="text-vibrant-blue-hover font-bold text-lg tracking-wide">
                          {item.date}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {item.text}
                      </p>
                    </div>

                    {/* Connecting line to main timeline */}
                    <div
                      className="absolute left-6 w-6 h-0.5 bg-blue-400 top-6"
                      style={{
                        opacity: 0,
                        transform: "scaleX(0)",
                        transformOrigin: "left",
                        animationName: isVisible ? "growX" : "none",
                        animationDuration: isVisible ? "200ms" : "0ms",
                        animationTimingFunction: "ease-out",
                        animationFillMode: "forwards",
                        animationDelay: isVisible
                          ? `${i * 200 + 50}ms`
                          : "0ms",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {!showAllItems && mobileTimelineData.length > 4 && (
              <div
                onClick={() => setShowAllItems(true)}
                className="mt-10 flex justify-center absolute -bottom-0 w-full h-20"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.00) -35.33%, #FFF 42.67%)",
                }}
              >
                <button className="flex flex-col items-center justify-end gap-2 text-vibrant-blue hover:text-blue-600 transition-colors duration-200">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20.7513 3.45461C21.1239 3.22961 21.5903 3.2343 21.9583 3.46164C22.3286 3.69133 22.5372 4.10617 22.5044 4.53976C22.4692 4.97336 22.195 5.3507 21.7942 5.51711L12.5224 10.1554C12.1942 10.3218 11.8075 10.3218 11.4794 10.1554L2.20517 5.51711C1.80438 5.3507 1.53017 4.97336 1.49501 4.53976C1.45985 4.10617 1.67079 3.69133 2.0411 3.46164C2.41142 3.23195 2.87782 3.22961 3.24814 3.45461L11.9997 7.8257L20.7513 3.45461ZM20.7513 12.8866C21.1239 12.6616 21.5903 12.6663 21.9583 12.8937C22.3286 13.1234 22.5372 13.5382 22.5044 13.9718C22.4692 14.4054 22.195 14.7827 21.7942 14.9491L12.5224 19.5874C12.1942 19.7538 11.8075 19.7538 11.4794 19.5874L2.20517 14.9515C1.68485 14.6374 1.49501 13.9765 1.76923 13.4351C2.04345 12.8937 2.68798 12.6546 3.24814 12.889L11.9997 17.2577L20.7513 12.8866Z"
                        fill="#96B3D5"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-[#96B3D5] font-medium">
                    查看更多
                  </span>
                </button>
              </div>
            )}

            {/* End decoration */}
            <div className="mt-8 flex justify-center">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-r from-vibrant-blue to-purple-600 shadow-lg"
                style={{
                  opacity: 0,
                  transform: "scale(0)",
                  animationName: isVisible ? "pulseMarker" : "none",
                  animationDuration: isVisible ? "1s" : "0ms",
                  animationTimingFunction: "ease-out",
                  animationFillMode: "forwards",
                  animationDelay: isVisible
                    ? `${(showAllItems ? mobileTimelineData : mobileTimelineData.slice(0, 4)).length * 200}ms`
                    : "0ms",
                }}
              ></div>
            </div>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:flex flex-col">
            {timelineRows.map((row, i) => (
              <Fragment key={`row-${i}`}>
                {row.right && (
                  <div key={`r-${i}`} className="flex md:contents">
                    <div className="col-start-5 col-end-6 md:mx-auto relative">
                      <div className="h-[300px] w-6 flex items-center justify-center relative">
                        <div
                          className="absolute left-1/2 w-0.5 bg-vibrant-blue z-10"
                          style={{
                            top: 0,
                            height: "50%",
                            transform: "translateX(-50%) scaleY(0)",
                            transformOrigin: "top",
                            animationName: isVisible ? "growY" : "none",
                            animationDuration: isVisible ? "300ms" : "0ms",
                            animationTimingFunction: isVisible
                              ? "ease-in-out"
                              : "ease",
                            animationFillMode: isVisible ? "forwards" : "none",
                            animationDelay: isVisible
                              ? `${i * ROW_CADENCE_MS}ms`
                              : "0ms",
                          }}
                        />
                        <div
                          className="absolute left-1/2 w-0.5 bg-vibrant-blue z-10"
                          style={{
                            top: "50%",
                            height: "50%",
                            transform: "translateX(-50%) scaleY(0)",
                            transformOrigin: "top",
                            animationName: isVisible ? "growY" : "none",
                            animationDuration: isVisible ? "300ms" : "0ms",
                            animationTimingFunction: isVisible
                              ? "ease-in-out"
                              : "ease",
                            animationFillMode: isVisible ? "forwards" : "none",
                            animationDelay: isVisible
                              ? `${i * ROW_CADENCE_MS + 600}ms`
                              : "0ms",
                          }}
                        />
                      </div>

                      <TimelineMarker
                        delay={i * ROW_CADENCE_MS + 300}
                        isVisible={isVisible}
                      />

                      <div
                        className="absolute top-1/2 left-1/2 -translate-y-1/2 origin-left w-[160px] h-0.5 bg-vibrant-blue z-20"
                        style={{
                          transform: "scaleX(0)",
                          animationName: isVisible ? "growX" : "none",
                          animationDuration: isVisible ? "300ms" : "0ms",
                          animationTimingFunction: isVisible
                            ? "ease-in-out"
                            : "ease",
                          animationFillMode: isVisible ? "forwards" : "none",
                          animationDelay: isVisible
                            ? `${i * ROW_CADENCE_MS + 350}ms`
                            : "0ms",
                        }}
                      />

                      <TimelineContent
                        date={row.right.date}
                        text={row.right.text}
                        delay={i * ROW_CADENCE_MS + 450}
                        direction="right"
                        isVisible={isVisible}
                      />

                      <div
                        className="absolute top-1/2 translate-y-1/4 left-[180px] w-4 h-4 rounded-full bg-vibrant-blue flex justify-center items-center z-30"
                        style={{
                          opacity: 0,
                          transform: "translateY(-50%) scale(0)",
                          animationName: isVisible ? "fadeInScale" : "none",
                          animationDuration: isVisible ? "300ms" : "0ms",
                          animationTimingFunction: isVisible
                            ? "ease-out"
                            : "ease",
                          animationFillMode: isVisible ? "forwards" : "none",
                          animationDelay: isVisible
                            ? `${i * ROW_CADENCE_MS + 550}ms`
                            : "0ms",
                        }}
                      />
                    </div>
                  </div>
                )}

                {row.left && (
                  <div
                    key={`l-${i}`}
                    className="flex flex-row-reverse md:contents"
                  >
                    <div className="col-start-5 col-end-6 md:mx-auto relative">
                      <div className="h-full w-6 flex items-center justify-center relative" />

                      <TimelineMarker
                        delay={i * ROW_CADENCE_MS + 900}
                        isVisible={isVisible}
                      />

                      <div
                        className="absolute top-1/2 right-1/2 -translate-y-1/2 origin-right w-[160px] h-0.5 bg-vibrant-blue z-20"
                        style={{
                          transform: "scaleX(0)",
                          animationName: isVisible ? "growX" : "none",
                          animationDuration: isVisible ? "300ms" : "0ms",
                          animationTimingFunction: isVisible
                            ? "ease-in-out"
                            : "ease",
                          animationFillMode: isVisible ? "forwards" : "none",
                          animationDelay: isVisible
                            ? `${i * ROW_CADENCE_MS + 950}ms`
                            : "0ms",
                        }}
                      />

                      <TimelineContent
                        date={row.left.date}
                        text={row.left.text}
                        delay={i * ROW_CADENCE_MS + 1050}
                        direction="left"
                        isVisible={isVisible}
                      />

                      <div
                        className="absolute top-1/2 translate-y-1/4 right-[160px] w-4 h-4 rounded-full bg-vibrant-blue flex justify-center items-center z-30"
                        style={{
                          opacity: 0,
                          transform: "translateY(-50%) scale(0)",
                          animationName: isVisible ? "fadeInScale" : "none",
                          animationDuration: isVisible ? "300ms" : "0ms",
                          animationTimingFunction: isVisible
                            ? "ease-out"
                            : "ease",
                          animationFillMode: isVisible ? "forwards" : "none",
                          animationDelay: isVisible
                            ? `${i * ROW_CADENCE_MS + 1150}ms`
                            : "0ms",
                        }}
                      />
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

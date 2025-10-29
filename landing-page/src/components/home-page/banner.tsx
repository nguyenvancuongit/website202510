"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { GradientButton } from "@/components/ui/gradient-button";
import { useMedia } from "@/hooks/use-media";
import { BannerSlide } from "@/services/banner.service";

interface BannerProps {
  bannerSlides: BannerSlide[];
}

const Banner = ({ bannerSlides }: BannerProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { isMobile } = useMedia();

  useEffect(() => {
    if (!carouselApi || bannerSlides.length === 0) {
      return;
    }

    // Auto-scroll with 4 seconds delay
    const timer = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);

    // Update current slide index
    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });

    return () => {
      clearInterval(timer);
    };
  }, [carouselApi, bannerSlides.length]);

  // Helper function to get responsive media
  const getMediaForDevice = (slide: BannerSlide) => {
    return isMobile ? slide.mobile_media : slide.web_media;
  };

  // Helper function to render background media
  const renderBackgroundMedia = (slide: BannerSlide) => {
    const media = getMediaForDevice(slide);

    if (media.type === "video") {
      return (
        <video
          key={media.id}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={media.path} type="video/mp4" />
        </video>
      );
    } else {
      return (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${media.path})`,
          }}
        />
      );
    }
  };

  return (
    <div className="relative md:min-h-screen overflow-hidden">
      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: true,
          duration: 20, // Slower carousel transition (default is 10)
        }}
        className="w-full h-full"
      >
        <CarouselContent>
          {bannerSlides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative flex items-center min-h-100 md:min-h-screen px-8 md:px-16 lg:px-24 overflow-hidden">
                {/* Background Media (Image or Video) */}
                {renderBackgroundMedia(slide)}
                <div className="max-w-4xl z-30 relative">
                  <AnimatePresence>
                    {current === index && (
                      <motion.div
                        key={`title-${slide.id}`}
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 60, opacity: 0 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.4, 0, 0.2, 1],
                          delay: 0.3,
                        }}
                      >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent-foreground mb-4 leading-tight">
                          <span className="block">{slide.title}</span>
                        </h1>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {current === index && (
                      <motion.div
                        key={`button-${slide.id}`}
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 60, opacity: 0 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.4, 0, 0.2, 1],
                          delay: 0.6,
                        }}
                        className="cursor-pointer"
                      >
                        <GradientButton
                          onClick={() => {
                            if (slide.link_url && slide.link_url !== "#") {
                              window.open(slide.link_url, "_blank");
                            }
                          }}
                        >
                          <span>了解详情</span>
                          <Image
                            alt="system guide"
                            src="/icons/system-guide-icon.svg"
                            height={36}
                            width={36}
                            className="w-6 h-6"
                          />
                        </GradientButton>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
          {bannerSlides.map((_, index) => (
            <motion.button
              key={index}
              className={`h-2 rounded-full ${
                current === index
                  ? "bg-white/90"
                  : "bg-white/75 hover:bg-white/80"
              }`}
              animate={{
                width: current === index ? 24 : 8,
                scale: current === index ? 1.1 : 1,
              }}
              whileHover={{ scale: current === index ? 1.1 : 1.05 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => carouselApi?.scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";

import { useMedia } from "@/hooks/use-media";
import { BannerSlide } from "@/services/banner.service";

import "./MosaicSlider.css";

interface BannerProps {
  bannerSlides: BannerSlide[];
}

const MosaicSliderBanner: React.FC<BannerProps> = ({ bannerSlides }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cols = 2;
  const rows = 3;
  const pieceGap = 0;
  const { isMobile } = useMedia();

  // Helper function to get responsive media
  const getMediaForDevice = React.useCallback(
    (slide: BannerSlide) => {
      return isMobile ? slide.mobile_media : slide.web_media;
    },
    [isMobile]
  );

  // Helper function to check if slide contains video
  const isVideoSlide = React.useCallback(
    (index: number) => {
      if (index < 0 || index >= bannerSlides.length) {
        return false;
      }
      const slide = bannerSlides[index];
      const media = getMediaForDevice(slide);
      return media.type === "video";
    },
    [getMediaForDevice, bannerSlides]
  );

  // Helper function to render background media
  const renderBackgroundMedia = (slide: BannerSlide) => {
    const media = getMediaForDevice(slide);

    if (media.type === "video") {
      return (
        <video
          className="media absolute inset-0 w-full h-full object-cover"
          key={media.id}
          autoPlay
          muted
          loop={false} // Don't loop so we can detect when video ends
          playsInline
          preload="metadata" // Preload metadata to get duration
        >
          <source src={media.path} type="video/mp4" />
        </video>
      );
    } else {
      return (
        // not using Next.js Image too keep the original image quality for pieces
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="media absolute inset-0 w-full h-full object-cover"
          alt={`slide-${slide.id}`}
          src={media.path}
          width={1200}
          height={800}
        />
      );
    }
  };

  // Build pieces for a slide (only for images)
  const buildPiecesForSlide = (
    slideEl: HTMLElement,
    mediaEl: HTMLImageElement
  ) => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }
    const w = slider.clientWidth;
    const h = slider.clientHeight;
    const pieceW = Math.ceil((w - (cols - 1) * pieceGap) / cols);
    const pieceH = Math.ceil((h - (rows - 1) * pieceGap) / rows);

    const piecesEl = slideEl.querySelector(".pieces") as HTMLElement;
    if (!piecesEl) {
      return;
    }
    piecesEl.innerHTML = "";
    piecesEl.style.width = `${w}px`;
    piecesEl.style.height = `${h}px`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * pieceW + c * pieceGap;
        const y = r * pieceH + r * pieceGap;

        const piece = document.createElement("div");
        piece.className = "piece";
        piece.style.width = pieceW + "px";
        piece.style.height = pieceH + "px";
        piece.style.left = x + "px";
        piece.style.top = y + "px";
        piece.style.overflow = "hidden";
        piece.style.position = "absolute";

        // Only handle images for pieces
        const imgSrc = mediaEl.src;
        piece.style.backgroundImage = `url('${imgSrc}')`;
        const percX = Math.round((x / (w - pieceW)) * 100);
        const percY = Math.round((y / (h - pieceH)) * 100);
        piece.style.backgroundPosition = `${percX}% ${percY}%`;
        piece.style.backgroundSize = `${w}px ${h}px`;

        piecesEl.appendChild(piece);
      }
    }

    // Mark slide as having pieces built
    slideEl.classList.add("has-pieces");
  };

  const animateInSlide = (idx: number) => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }
    const slides = slider.querySelectorAll(".slide");
    const sl = slides[idx] as HTMLElement;
    const pieces = Array.from(sl.querySelectorAll(".piece"));

    slides.forEach((s) => ((s as HTMLElement).style.zIndex = "0"));
    sl.style.zIndex = "3";
    sl.style.opacity = "1";
    (sl.querySelector(".pieces") as HTMLElement).style.opacity = "1";

    pieces.forEach((p) => {
      const dx = (Math.random() - 0.5) * slider.clientWidth * 1.6;
      const dy = (Math.random() - 0.5) * slider.clientHeight * 1.6;
      const rot = (Math.random() - 0.5) * 90;
      gsap.set(p, { x: dx, y: dy, rotation: rot, opacity: 0 });
    });

    setAnimating(true);

    gsap.to(pieces, {
      duration: 1.0,
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      ease: "power4.out",
      stagger: { from: "random", amount: 0.9, grid: [rows, cols] },
      onComplete: () => {
        slides.forEach((s) => ((s as HTMLElement).style.zIndex = "0"));
        sl.style.zIndex = "2";
        setAnimating(false);
      },
    });
  };

  // Animate video fade in
  const animateVideoIn = (idx: number) => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }
    const slides = slider.querySelectorAll(".slide");
    const sl = slides[idx] as HTMLElement;
    const video = sl.querySelector(".media") as HTMLVideoElement;

    slides.forEach((s) => ((s as HTMLElement).style.zIndex = "0"));
    sl.style.zIndex = "3";

    if (video) {
      video.currentTime = 0;
      video.load();
    }

    setAnimating(true);

    gsap.fromTo(
      sl,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.0,
        ease: "power2.inOut",
        onStart: () => {
          if (video) {
            setTimeout(() => {
              video.play().catch(() => { });
            }, 200);
          }
        },
        onComplete: () => {
          slides.forEach((s) => ((s as HTMLElement).style.zIndex = "0"));
          sl.style.zIndex = "2";
          setAnimating(false);
        },
      }
    );
  };

  const animateOutSlide = (idx: number) => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }
    const slides = slider.querySelectorAll(".slide");
    const sl = slides[idx] as HTMLElement;
    const isVideo = isVideoSlide(idx);

    if (isVideo) {
      // For video slides, simple fade out
      const video = sl.querySelector(".media") as HTMLVideoElement;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      gsap.to(sl, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          sl.style.zIndex = "0";
        },
      });
    } else {
      // For image slides, use mosaic pieces animation
      const pieces = Array.from(sl.querySelectorAll(".piece"));
      gsap.to(pieces, {
        duration: 0.8,
        x: () =>
          (Math.random() > 0.5 ? 1 : -1) *
          (slider.clientWidth * (0.8 + Math.random())),
        y: () =>
          (Math.random() - 0.5) * (slider.clientHeight * (0.8 + Math.random())),
        rotation: () => (Math.random() - 0.5) * 100,
        opacity: 0,
        ease: "power2.in",
        stagger: { from: "random", amount: 0.6 },
      });
    }
  };

  const goTo = useCallback(
    (idx: number) => {
      if (animating || bannerSlides.length <= 1) {
        return;
      }

      const newIdx = (idx + bannerSlides.length) % bannerSlides.length;
      if (newIdx === current) {
        return;
      }

      const old = current;
      setCurrent(newIdx);

      // Animate out the old slide
      animateOutSlide(old);

      const slider = sliderRef.current;
      if (!slider) {
        return;
      }

      // Check if new slide is video
      if (isVideoSlide(newIdx)) {
        // Fade in video
        setTimeout(() => animateVideoIn(newIdx), 180);
      } else {
        // Mosaic animation for image
        const sl = slider.querySelectorAll(".slide")[newIdx] as HTMLElement;
        const mediaEl = sl.querySelector(".media") as HTMLImageElement;

        const buildAndAnimate = () => {
          buildPiecesForSlide(sl, mediaEl);
          setTimeout(() => animateInSlide(newIdx), 180);
        };

        // Check if image is loaded
        if (mediaEl.complete && mediaEl.naturalHeight !== 0) {
          buildAndAnimate();
        } else {
          // Wait for image to load
          const handleLoad = () => {
            buildAndAnimate();
            mediaEl.removeEventListener("load", handleLoad);
          };
          mediaEl.addEventListener("load", handleLoad);

          // Fallback timeout
          setTimeout(() => {
            mediaEl.removeEventListener("load", handleLoad);
            buildAndAnimate();
          }, 500);
        }
      }
    },
    [animating, current, bannerSlides, isVideoSlide]
  );

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }
    const slides = slider.querySelectorAll(".slide");

    slides.forEach((sl) => {
      const mediaEl = sl.querySelector(".media") as
        | HTMLImageElement
        | HTMLVideoElement;

      if (mediaEl && mediaEl.tagName.toLowerCase() === "img") {
        // Build pieces for images only
        const img = mediaEl as HTMLImageElement;
        img.onload = () => buildPiecesForSlide(sl as HTMLElement, img);
        img.onerror = () => buildPiecesForSlide(sl as HTMLElement, img);
      }
    });

    // initial build for loaded content (images only)
    const handleWindowLoad = () => {
      slides.forEach((sl) => {
        const mediaEl = sl.querySelector(".media") as
          | HTMLImageElement
          | HTMLVideoElement;
        if (mediaEl && mediaEl.tagName.toLowerCase() === "img") {
          buildPiecesForSlide(sl as HTMLElement, mediaEl as HTMLImageElement);
        }
      });
    };
    window.addEventListener("load", handleWindowLoad);

    // resize handler (images only)
    const resizeHandler = () => {
      slides.forEach((sl) => {
        const mediaEl = sl.querySelector(".media") as
          | HTMLImageElement
          | HTMLVideoElement;
        if (mediaEl && mediaEl.tagName.toLowerCase() === "img") {
          buildPiecesForSlide(sl as HTMLElement, mediaEl as HTMLImageElement);
        }
      });
    };
    window.addEventListener("resize", resizeHandler);

    // Smart autoplay that waits for videos to complete
    const startAutoplay = () => {
      // Clear any existing timer
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }

      // Get the current slide element
      const currentSlide = slides[current] as HTMLElement;
      if (!currentSlide) {
        return;
      }

      const currentVideo = currentSlide.querySelector("video");

      if (currentVideo) {
        // It's a video slide
        let hasTransitioned = false;

        const handleVideoEnd = () => {
          if (!hasTransitioned && !animating) {
            hasTransitioned = true;
            goTo(current + 1);
          }
          currentVideo.removeEventListener("ended", handleVideoEnd);
        };

        // Add ended event listener
        currentVideo.addEventListener("ended", handleVideoEnd);

        // Wait for video metadata to load to get accurate duration
        const setupVideoTimeout = () => {
          const videoDuration = currentVideo.duration;

          if (isFinite(videoDuration) && videoDuration > 0) {
            // Video duration is available, use it
            const timeout = videoDuration * 1000 + 1000; // Add 1 second buffer

            autoplayTimerRef.current = setTimeout(() => {
              currentVideo.removeEventListener("ended", handleVideoEnd);
              if (!hasTransitioned && !animating) {
                hasTransitioned = true;
                goTo(current + 1);
              }
            }, timeout);
          } else {
            // Duration not available yet, use default
            autoplayTimerRef.current = setTimeout(() => {
              currentVideo.removeEventListener("ended", handleVideoEnd);
              if (!hasTransitioned && !animating) {
                hasTransitioned = true;
                goTo(current + 1);
              }
            }, 15000); // Default 15 seconds
          }
        };

        // If video metadata is already loaded, set timeout immediately
        if (currentVideo.readyState >= 1) {
          setupVideoTimeout();
        } else {
          // Wait for metadata to load
          const handleLoadedMetadata = () => {
            setupVideoTimeout();
            currentVideo.removeEventListener(
              "loadedmetadata",
              handleLoadedMetadata
            );
          };
          currentVideo.addEventListener("loadedmetadata", handleLoadedMetadata);

          // Fallback in case loadedmetadata doesn't fire
          setTimeout(() => {
            currentVideo.removeEventListener(
              "loadedmetadata",
              handleLoadedMetadata
            );
            setupVideoTimeout();
          }, 1000);
        }
      } else {
        // For images, use standard timing
        autoplayTimerRef.current = setTimeout(() => {
          if (!animating) {
            goTo(current + 1);
          }
        }, 4500);
      }
    };

    startAutoplay();

    return () => {
      window.removeEventListener("load", handleWindowLoad);
      window.removeEventListener("resize", resizeHandler);
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [current, animating, goTo]);

  const handleClickBanner = () => {
    if (
      bannerSlides[current].link_url &&
      bannerSlides[current].link_url !== "#"
    ) {
      window.open(bannerSlides[current].link_url, "_blank");
    }
  };

  return (
    <div
      className="wrap relative h-[60vh] md:min-h-screen overflow-hidden"
      onClick={handleClickBanner}
    >
      <div className="slider" ref={sliderRef}>
        {bannerSlides.map((banner, i) => (
          <div
            key={i}
            className="slide"
            style={{
              zIndex: i === 0 ? 2 : 0,
              opacity: i === 0 ? 1 : 0,
            }}
          >
            {renderBackgroundMedia(banner)}
            <div
              className="pieces"
              style={{
                opacity: i === 0 ? 1 : 0,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center max-w-7xl mx-auto md:mx-[160px] px-8 lg:px-0 z-40">
        <div className="max-w-4xl">
          <AnimatePresence>
            {bannerSlides[current] && (
              <motion.div
                key={`title-${bannerSlides[current].id}`}
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{
                  x: 60,
                  opacity: 0,
                  transition: {
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0,
                  },
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 1.4,
                }}
                className="mb-10 md:mb-20"
              >
                {bannerSlides[current].title && <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-accent-foreground mb-4 leading-tight">
                  <span className="block">{bannerSlides[current].title}</span>
                </h1>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation buttons - visible on hover */}
      <div
        className="absolute inset-0 hidden md:flex items-center justify-between opacity-0 hover:opacity-100 group transition-colors duration-300 px-4 lg:px-12 z-41"
        style={{ height: "346px", top: "50%", transform: "translateY(-50%)" }}
      >
        {/* Left button */}
        <button
          className="flex p-[29px] items-center justify-center rounded-full bg-white/20 cursor-pointer "
          onClick={(e) => {
            e.stopPropagation();
            goTo(current - 1);
          }}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M30 8L14.7071 23.2929C14.3166 23.6834 14.3166 24.3166 14.7071 24.7071L30 40" stroke="#8EAACB" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Right button */}
        <button
          className="flex p-[29px] items-center justify-center rounded-full bg-white/20 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            goTo(current + 1);
          }}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M18 40L33.2929 24.7071C33.6834 24.3166 33.6834 23.6834 33.2929 23.2929L18 8" stroke="#8EAACB" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-49">
        {bannerSlides.map((_, index) => (
          <motion.button
            key={index}
            className={`h-2 rounded-full ${current === index
              ? "bg-white/90"
              : "bg-white/75 hover:bg-white/80"
              }`}
            animate={{
              width: current === index ? 24 : 8,
              scale: current === index ? 1.1 : 1,
            }}
            whileHover={{ scale: current === index ? 1.1 : 1.05 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => {
              e.stopPropagation();
              goTo(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MosaicSliderBanner;

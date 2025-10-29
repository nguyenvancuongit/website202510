"use client";

import { useEffect, useState } from "react";

interface UseMediaOptions {
  mobileBreakpoint?: number;
}

/**
 * Custom hook for responsive media queries
 * @param options - Configuration options for the hook
 * @param options.mobileBreakpoint - The breakpoint in pixels for mobile detection (default: 768)
 * @returns Object containing responsive state information
 */
export function useMedia(options: UseMediaOptions = {}) {
  const { mobileBreakpoint = 768 } = options;

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;

      setIsMobile(width < mobileBreakpoint);
      setIsTablet(width >= mobileBreakpoint && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [mobileBreakpoint]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 0,
  };
}

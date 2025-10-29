"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layouts/footer";
import { useMedia } from "@/hooks/use-media";

// Configuration for pages that should hide footer
const FOOTER_CONFIG = {
  // Pages that should hide footer completely
  hideFooter: [
    // Add pages here that should hide footer on all devices
    // Example: '/some-page'
  ],
  
  // Pages that should hide footer only on mobile
  hideFooterMobile: [
    "/careers/[slug]", // Job detail pages - hide only on mobile
    // Add pages here that should hide footer only on mobile
    // Example: '/some-page'
  ],
} as const;

export function ConditionalFooter() {
  const pathname = usePathname();
  const { isMobile } = useMedia();
  
  // Check if current page should hide footer completely
  const shouldHideFooter = FOOTER_CONFIG.hideFooter.some((pattern: string) => {
    if (pattern.includes("[slug]")) {
      // Handle dynamic routes like /careers/[slug]
      const basePath = pattern.replace("/[slug]", "");
      return pathname?.startsWith(basePath + "/") && pathname !== basePath;
    }
    return pathname === pattern;
  });
  
  // Check if current page should hide footer only on mobile
  const shouldHideFooterMobile = FOOTER_CONFIG.hideFooterMobile.some(pattern => {
    if (pattern.includes("[slug]")) {
      const basePath = pattern.replace("/[slug]", "");
      return pathname?.startsWith(basePath + "/") && pathname !== basePath;
    }
    return pathname === pattern;
  });
  
  // Hide footer if conditions are met
  if (shouldHideFooter || (shouldHideFooterMobile && isMobile)) {
    return null;
  }
  
  return <Footer />;
}

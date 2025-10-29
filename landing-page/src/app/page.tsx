import { connection } from "next/server";

import CareerEducationProduct from "@/components/home-page/career-education-product";
import ClientCasesSection from "@/components/home-page/client-cases-section";
import HeroSection from "@/components/home-page/hero-section";
import LatestNewsSection from "@/components/home-page/latest-news-section";
import MemberSection from "@/components/home-page/members";
import MosaicSliderBanner from "@/components/home-page/mosaic-slider-banner";
import SolutionsSection from "@/components/home-page/solution";
import StatisticsBanner from "@/components/home-page/staticstic";
import SpeedDial from "@/components/ui/speed-dial";
import { tryCatch } from "@/lib/utils";
import { getBannerSlides } from "@/services/banner.service";
import { getCareerEducationConfig } from "@/services/career-education.service";
import { getCaseStudies } from "@/services/case-study.service";

export default async function Home() {
  await connection();
  const [bannerSlides] = await tryCatch(getBannerSlides());
  const [caseStudies] = await tryCatch(getCaseStudies());
  const [careerEducationProductConfig] = await tryCatch(getCareerEducationConfig());

  return (
    <div className="pt-20 md:pt-0">
      <MosaicSliderBanner bannerSlides={bannerSlides ?? []} />
      <StatisticsBanner />
      <CareerEducationProduct config={careerEducationProductConfig ?? {}} />
      <SolutionsSection />
      <MemberSection />
      <ClientCasesSection caseStudies={caseStudies?.data ?? []} />
      <LatestNewsSection />
      <HeroSection />
      <SpeedDial />
    </div>
  );
}

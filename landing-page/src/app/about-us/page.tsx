import BrandIntroduction from "@/components/about/brand-introduction";
import CorporateHonors from "@/components/about/corporate-honors";
import DevelopmentTimeline from "@/components/about/development-timeline";
import HeroSection from "@/components/about/hero-section";
import HomeHeroSection from "@/components/home-page/hero-section";
import MemberSection from "@/components/home-page/members";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <HeroSection />
      <BrandIntroduction />
      <DevelopmentTimeline />
      <MemberSection />
      <CorporateHonors />
      <HomeHeroSection />
    </div>
  );
}

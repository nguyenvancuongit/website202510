import Banner from "@/components/common/banner";
import HomeHeroSection from "@/components/home-page/hero-section";
import CaseStudies from "@/components/products/case-studies";
import BannerService from "@/components/products/common/banner-service";
import { ProductPageGuard } from "@/components/products/common/product-page-guard";
import CoreAdvantages from "@/components/products/core-advantages";
import DashboardPreview from "@/components/products/dashboard-preview";
import PartnerLogos from "@/components/products/partner-logos";
import ThreeFeatures from "@/components/products/three-features";

export default function CloudPlatformPage() {
  return (
    <ProductPageGuard pageKey="cloud-platform">
      <div className="min-h-screen bg-white pt-20 overflow-x-hidden md:overflow-visible" >
        <Banner
          className="justify-start"
          imageSrc="/images/products/hero-section.svg"
          title="学生发展指导智慧平台"
          buttonText="合作咨询"
          description="「学生发展指导智慧平台」是纬英科技自主研发的SaaS服务平台，旨在用数字化方式解决学生发展指导工作中的挑战性难题、赋能教育生态圈关键主体"
        />
        <BannerService
          img="/images/products/service.svg"
          title="一站式服务全方位解决学校、家长、学生痛点"
          className="pt-10 md:pt-[118px] pb-10 md:pb-50"
        />
        <ThreeFeatures />
        <CoreAdvantages />
        <DashboardPreview />
        <CaseStudies />
        <PartnerLogos />
        <HomeHeroSection />
      </div>
    </ProductPageGuard>
  );
}


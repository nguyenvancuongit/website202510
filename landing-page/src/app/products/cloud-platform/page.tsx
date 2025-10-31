import Banner from "@/components/common/banner";
import PartnerLogosSection from "@/components/common/partner-logos-section";
import HomeHeroSection from "@/components/home-page/hero-section";
import CaseStudies from "@/components/products/case-studies";
import BannerService from "@/components/products/common/banner-service";
import { ProductPageGuard } from "@/components/products/common/product-page-guard";
import CoreAdvantages from "@/components/products/core-advantages";
import DashboardPreview from "@/components/products/dashboard-preview";
import ThreeFeatures from "@/components/products/three-features";


const partners = [
  {
    name: "华南师范大学附属中学",
    logo: "/images/products/partners/logo1.svg",
  },
  {
    name: "广州中学",
    logo: "/images/products/partners/logo2.svg",
  },
  {
    name: "广州市白云艺术中学",
    logo: "/images/products/partners/logo3.svg",
  },
  {
    name: "广州市真光中学",
    logo: "/images/products/partners/logo4.svg",
  },
  {
    name: "罗湖高级中学",
    logo: "/images/products/partners/logo5.svg",
  },
  {
    name: "深圳市翠园中学高中部",
    logo: "/images/products/partners/logo6.svg",
  },
  {
    name: "湛江市寸金培才中学",
    logo: "/images/products/partners/logo7.svg",
  },
  {
    name: "丰顺县第一中学",
    logo: "/images/products/partners/logo8.svg",
  },
  {
    name: "新丰县第一中学",
    logo: "/images/products/partners/logo9.svg",
  },
  {
    name: "四会市四会中学",
    logo: "/images/products/partners/logo10.svg",
  },
  {
    name: "广州市美术高级中学",
    logo: "/images/products/partners/logo11.svg",
  },
  {
    name: "佛山市南海区桂城高级中学",
    logo: "/images/products/partners/logo12.svg",
  },
  {
    name: "深圳中学高中园",
    logo: "/images/products/partners/logo13.svg",
  },
  {
    name: "中山纪念中学",
    logo: "/images/products/partners/logo14.svg",
  },
];

export default function CloudPlatformPage() {
  return (
    <ProductPageGuard pageKey="cloud-platform">
      <div className="min-h-screen bg-white pt-20 overflow-x-hidden md:overflow-visible" >
        <Banner
          className="justify-start"
          imageSrc="/images/products/hero-section.svg"
          title="学生发展指导智慧平台"
          buttonText="合作咨询"
          description="学生发展指导智慧平台”是纬英科技自主研发的SaaS服务平台，旨在用数字化方式解决学生发展指导工作中的挑战性难题、赋能教育生态圈关键主体"
          objectPosition="35%"
          customClassNameText="sm:w-full w-4/5"
        />
        <BannerService
          img="/images/products/service.svg"
          title="一站式服务全方位解决学校、家长、学生痛点"
          className="pt-10 md:pt-[118px] pb-10 md:pb-50"
          customClassNameText="text-left sm:text-[56px] text-2xl"
        />
        <ThreeFeatures />
        <CoreAdvantages />
        <DashboardPreview />
        <CaseStudies />
        <PartnerLogosSection title="合作客户" partners={partners} className="!pt-0" />;
        <HomeHeroSection />
      </div>
    </ProductPageGuard>
  );
}


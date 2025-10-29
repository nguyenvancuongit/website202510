import { connection } from "next/server";

import Banner from "@/components/common/banner";
import CaseStudiesSection from "@/components/common/case-studies-section";
import PartnerLogosSection from "@/components/common/partner-logos-section";
import HomeHeroSection from "@/components/home-page/hero-section";
import BannerService from "@/components/products/common/banner-service";
import { ProductPageGuard } from "@/components/products/common/product-page-guard";
import Feature from "@/components/terminal/feature";
import { tryCatch } from "@/lib/utils";
import { getListCaseStudies } from "@/services/case-study.service";

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
    name: "广州市真光中学",
    logo: "/images/products/partners/logo4.svg",
  },
  {
    name: "新丰县第一中学",
    logo: "/images/products/partners/logo9.svg",
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

export default async function TerminalPage() {
  await connection();

  const [caseStudiesRes] = await tryCatch(getListCaseStudies({ limit: 4 }));
  const caseStudies =
    caseStudiesRes?.data.map((caseStudy) => ({
      description: caseStudy.highlight_description,
      title: caseStudy.title,
      image: caseStudy.web_thumbnail.path,
      slug: caseStudy.slug,
      categorySlug: caseStudy.category.slug,
    })) ?? [];

  return (
    <ProductPageGuard pageKey="terminal">
      <div className="min-h-screen bg-white pt-20">
        <Banner
          imageSrc="/images/terminal/banner.svg"
          title="智慧生涯自助探索终端"
          description="多元化的产品体系，搭载智能生涯探索系统，为学生打造操作便捷、可满足多场景使用的生涯探索工具。"
          buttonText="合作咨询"
          customClassNameText="!text-[#070F1B] sm:!text-white"
          className="justify-start"
        />
        <BannerService
          title="自助终端设备总览"
          img="/images/terminal/banner-service.svg"
          className="pt-10 md:pt-[118px] pb-10 md:pb-50"
        />
        <Feature />
        <CaseStudiesSection
          title="合作案例"
          buttonText="合作咨询"
          cases={caseStudies}
        />
        <PartnerLogosSection title="合作客户" partners={partners} />
        <HomeHeroSection />
      </div>
    </ProductPageGuard>
  );
}

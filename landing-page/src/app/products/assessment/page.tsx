import { connection } from "next/server";

import ActivitySection from "@/components/assessment/activity-section";
import BannerService from "@/components/assessment/banner-service";
import Banner from "@/components/common/banner";
import CaseStudiesSection from "@/components/common/case-studies-section";
import PartnerLogosSection from "@/components/common/partner-logos-section";
import { ProductPageGuard } from "@/components/products/common/product-page-guard";
import SolutionAdvantagesSection from "@/components/solutions/common/advantage-section";
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
    name: "广州市第三中学",
    logo: "/images/products/partners/logo4.svg",
  },
  {
    name: "罗湖高级中学",
    logo: "/images/products/partners/logo5.svg",
  },

  {
    name: "新丰县第一中学",
    logo: "/images/products/partners/logo9.svg",
  },
  {
    name: "广州华美英语实验学校",
    logo: "/images/products/partners/logo11.svg",
  },
  {
    name: "广州天省实验学校",
    logo: "/images/products/partners/logo15.svg",
  },
  {
    name: "广东广雅中学",
    logo: "/images/products/partners/logo16.svg",
  },
  {
    name: "佛山南海外国语高级中学",
    logo: "/images/products/partners/logo12.svg",
  },
  {
    name: "广州市香江中学",
    logo: "/images/products/partners/logo17.svg",
  },
  {
    name: "佛山市第二中学",
    logo: "/images/products/partners/logo18.svg",
  },
  {
    name: "广州市第一一三中学",
    logo: "/images/products/partners/logo19.svg",
  },
  {
    name: "佛山市南海区南海中学",
    logo: "/images/products/partners/logo20.svg",
  },
  {
    name: "中山纪念中学",
    logo: "/images/products/partners/logo14.svg",
  },
];

const advantages = [
  {
    title: "游戏化设计，学生参与度",
    description: "心理学线上线下游戏，从玩乐中启迪智慧",
    image: "/images/products/advantages/advantages-1.svg",
  },
  {
    title: "科技赋能，执行效率高",
    description: "智能终端+数字化测评，单场活动支持约3000人",
    image: "/images/products/advantages/advantages-2.svg",
  },
  {
    title: "经验丰富，教育效果显著",
    description: "已举办近百场活动，具有成熟的活动体系，受到广泛好评。",
    image: "/images/products/advantages/advantages-3.png",
  },
];

export default async function AssessmentPage() {
  await connection();
  const [caseStudiesRes] = await tryCatch(getListCaseStudies({ limit: 4 }));
  const caseStudies = caseStudiesRes?.data.map((caseStudy) => ({
    description: caseStudy.highlight_description,
    title: caseStudy.title,
    image: caseStudy.web_thumbnail.path,
    slug: caseStudy.slug,
    categorySlug: caseStudy.category.slug,
  })) ?? []

  return (
    <ProductPageGuard pageKey="assessment">
      <div className="min-h-screen bg-white pt-20 overflow-x-hidden md:overflow-visible">
        <Banner
          className="justify-start"
          imageSrc="/images/assessment/banner.svg"
          title="生涯探索游园会"
          description="数字科技让生涯课堂“动起来”"
          buttonText="了解详情"
        />
        <BannerService />
        <ActivitySection />
        <SolutionAdvantagesSection title="活动优势" advantages={advantages} />
        <CaseStudiesSection
          title="合作案例"
          buttonText="合作咨询"
          cases={caseStudies}
        />
        <PartnerLogosSection title="合作客户" partners={partners} />
      </div>
    </ProductPageGuard>
  );
}

import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

import CaseStudyIcon from "@/assets/site-map/case-study-icon";
import CompanyIcon from "@/assets/site-map/company-icon";
import HomeIcon from "@/assets/site-map/home-icon";
import NewsIcon from "@/assets/site-map/news-icon";
import ProductIcon from "@/assets/site-map/product-icon";
import SolutionIcon from "@/assets/site-map/solution-icon";
import {
  staticProductMapping,
  staticSolutionMapping,
} from "@/components/layouts/constants";
import { getCategories } from "@/services/categories.service";
import {
  type ProductPageConfig,
  productPagesService,
} from "@/services/product-pages.service";
import { solutionPagesService } from "@/services/solution-pages.service";

type SitemapItem = {
  label: string;
  href: string;
};

type SitemapSection = {
  title: string;
  cols: 1 | 2 | 3 | 4;
  items: SitemapItem[];
  icon: React.ReactNode;
};

function getStaticSections(
  productItems: SitemapItem[],
  solutionItems: SitemapItem[]
): SitemapSection[] {
  return [
    {
      title: "首页",
      cols: 1,
      items: [{ label: "网站首页", href: "/" }],
      icon: <HomeIcon />
    },
    {
      title: "产品",
      cols: 4,
      items: productItems,
      icon: <ProductIcon />
    },
    {
      title: "解决方案",
      cols: 3,
      items: solutionItems,
      icon: <SolutionIcon />
    },
    {
      title: "关于我们",
      cols: 2,
      items: [
        { label: "公司介绍", href: "/about-us" },
        { label: "加入我们", href: "/careers" },
      ],
      icon: <CompanyIcon />
    },
  ];
}

export const metadata = {
  title: "网站地图",
  description:
    "VIAN官方网站网站地图：快速索引全站页面，包含产品、解决方案、新闻、资源、关于我们与联系方式，助您高效找到所需内容。",
  keywords: "网站地图, 象导生涯, 导航",
};

export default async function SitemapPage() {
  await connection();

  const [
    productPagesData,
    solutionPagesData,
    newsCategoriesData,
    caseStudyCategoriesData,
  ] = await Promise.all([
    productPagesService.getEnabledPages().catch(() => null),
    solutionPagesService.getEnabledPages().catch(() => null),
    getCategories("latest-new").catch(() => []),
    getCategories("case-study").catch(() => []),
  ]);

  const productItems: SitemapItem[] = productPagesData
    ? Object.values(productPagesData)
      .sort((a: ProductPageConfig, b: ProductPageConfig) => a.order - b.order)
      .map((product: ProductPageConfig) => staticProductMapping[product.slug])
      .filter(Boolean)
    : [];

  const solutionItems: SitemapItem[] = solutionPagesData
    ? Object.entries(solutionPagesData)
      .sort(([_, a], [__, b]) => a.order - b.order)
      .map(([_, solution]) => staticSolutionMapping[solution.slug])
      .filter(Boolean)
    : [];

  const newsCategories: SitemapItem[] = newsCategoriesData.map((category) => ({
    label: category.name,
    href: `/news/${category.slug}`,
  }));

  const caseStudyCategories: SitemapItem[] = caseStudyCategoriesData.map(
    (category) => ({
      label: category.name,
      href: `/case-study/${category.slug}`,
    })
  );

  const staticSections = getStaticSections(productItems, solutionItems);
  const sections: SitemapSection[] = [
    ...staticSections.slice(0, 3), // First 3 sections (首页, 产品, 解决方案)
    {
      title: "客户案例",
      cols: 3,
      icon: <CaseStudyIcon />,
      items: caseStudyCategories,
    },
    {
      title: "最新动态",
      cols: 4,
      icon: <NewsIcon />,
      items: newsCategories,
    },
    ...staticSections.slice(3), // Remaining sections (关于我们)
  ];

  return (
    <div className="min-h-screen relative pt-20">
      <Image
        src='/images/sitemap/bg.svg'
        alt='logo'
        width={100}
        height={100}
        className='hidden md:block absolute top-[80px] left-1/2 -translate-x-1/2 z-0 w-full'
      />
      <div className="container mx-auto md:px-8 relative z-10 md:py-20">
        <div className="bg-[linear-gradient(180deg,#C1E3FF_1.25%,#E1F8FF_9.83%,#FFF_20.08%,#FFF_100%)] md:!bg-[linear-gradient(180deg,#FFF)] md:rounded-lg shadow-lg px-5 py-6 md:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-lg hidden md:block">
            <div className="text-medium-light-blue-grey">
              <Link href="/" className="hover:text-[#1C88F9]">
                首页
              </Link>
              〉 <span className="text-charcoal">网站地图</span>
            </div>
          </div>

          <p className="text-charcoal mb-8 text-2xl font-medium">网站地图</p>

          {sections.map((section) => {
            return (
              <>
                {/* desktop */}
                <div key={section.title} className="hidden md:block mb-8">
                  <h2 className="text-base font-medium text-charcoal mb-4 bg-gradient-to-r from-[#EAF4FF] to-white px-4 py-2 rounded">
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-y-6 gap-y-4 lg:gap-x-8 gap-x-4 px-4 w-full">
                    {section.items.map((item) => (
                      <Link
                        key={`${section.title}-${item.label}`}
                        href={item.href}
                        className="text-dark-blue-grey lg:w-[220px] w-full text-center font-normal hover:text-[#1C88F9] hover:border-[#1C88F9] cursor-pointer border rounded-lg border-[#D9E1EC] py-3 px-2.5"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* mobile */}
                <div className="md:hidden block mb-10">
                  <div className="flex items-center gap-1 mb-4">
                    {section.icon}
                    <h2 className="text-base font-medium text-charcoal rounded">
                      {section.title}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {section.items.map((item) => (
                      <Link
                        key={`${section.title}-${item.label}`}
                        href={item.href}
                        className="text-dark-blue-grey text-center text-[13px] font-normal border rounded-sm border-[#D9E1EC] px-2.5 py-1.5"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

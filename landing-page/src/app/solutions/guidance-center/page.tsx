import Banner from "@/components/common/banner";
import HeroSection from "@/components/home-page/hero-section";
import CaseStudies from "@/components/products/case-studies";
import SolutionAdvantagesSection from "@/components/solutions/common/advantage-section";
import { SolutionPageGuard } from "@/components/solutions/common/solution-page-guard";
import TestimonialsSection from "@/components/solutions/common/testimonial-section";
import ContactInformationSection from "@/components/solutions/guidance-center/contact-info-section";
import GuidanceCenterIntroduction from "@/components/solutions/guidance-center/introduction-section";
import PaintPointsSection from "@/components/solutions/guidance-center/pain-points-section";

const advantages = [
  {
    title: "权威经验",
    description:
      "象导生涯联合华南师范大学、华师附中、广州中学等国内知名学校开展《科技赋能学生发展指导智慧平台的构建》研究，为技术赋能学生发展指导工作提供实证支撑。",
    image: "/images/solutions/guidance-center/advantages/advantages-1.png",
  },
  {
    title: "配套健全",
    description:
      "象导生涯可为学校提供一站式解决方案，包括中心所需的三端一体化指导平台、自助探索设备、生涯课堂等产品和服务。",
    image: "/images/solutions/guidance-center/advantages/advantages-2.png",
  },
  {
    title: "服务完善",
    description:
      "象导生涯配备专属运营保障团队，协助校方排除故障、升级系统，确保平台运行稳定流畅，并可为学校教师提供专业的理论知识和操作培训。",
    image: "/images/solutions/guidance-center/advantages/advantages-3.png",
  },
];

export default function GuidanceCenterPage() {
  return (
    <SolutionPageGuard pageKey="guidance-center">
      <div className="min-h-screen overflow-x-hidden md:overflow-visible">
        <Banner
          title="学生发展指导中心解决方案"
          description={"科技赋能，助力学生自我探索、拓展视野，实现“家校共育”"}
          imageSrc="/images/solutions/guidance-center/banner.svg"
          customClassNameText="sm:!text-white !text-[#070F1B]"
        />
        <TestimonialsSection
          classNameText="leading-[34px]"
          title="方案背景"
          description={
            "根据2024年调研数据显示，高达83%的中学缺乏系统化发展指导体系，；新高考选科盲选率达61%，学校硬件投入与软件服务相割裂。而本方案旨在帮助学校研究梳理生涯教育中存在的问题，补足缺位环节，提升学校的发展指导能力，打造学生发展指导中心，形成具有本校特色的生涯指导体系。"
          }
        />
        <ContactInformationSection />
        <PaintPointsSection />
        <GuidanceCenterIntroduction />
        <SolutionAdvantagesSection advantages={advantages} />
        <CaseStudies className="pb-20 md:pb-50" />
        <HeroSection />
      </div>
    </SolutionPageGuard>
  );
}

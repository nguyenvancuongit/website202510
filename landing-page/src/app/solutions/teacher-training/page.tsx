import Banner from "@/components/common/banner";
import CaseStudies from "@/components/products/case-studies";
import BannerService from "@/components/products/common/banner-service";
import SolutionAdvantagesSection from "@/components/solutions/common/advantage-section";
import { SolutionPageGuard } from "@/components/solutions/common/solution-page-guard";
import TestimonialsSection from "@/components/solutions/common/testimonial-section";
import TeacherTrainingIntroductionSection from "@/components/solutions/teacher-training/introduction-section";

const advantages = [
  {
    title: "认证体系",
    description: "领先的认证体系，独创能力评估模型",
    image: "/images/solutions/teacher-training/advantages/advantages-1.png",
  },
  {
    title: "课程体系",
    description: "完善的课程体系，涵盖生涯教育各个领域",
    image: "/images/solutions/teacher-training/advantages/advantages-2.png",
  },
  {
    title: "师资力量",
    description: "资深的师资力量，拥有丰富的教学经验",
    image: "/images/solutions/teacher-training/advantages/advantages-3.png",
  },
];

export default function TeacherTrainingPage() {
  return (
    <SolutionPageGuard pageKey="teacher-training">
      <div className="min-h-screen overflow-x-hidden md:overflow-visible">
        <Banner
          title="教师培训解决方案"
          description="助力教师高效提升学生发展指导胜任力"
          textColor="white"
          hasOverlay
          imageSrc="/images/solutions/teacher-training/banner.png"
        />
        <TestimonialsSection
          title="方案背景"
          description={[
            "国家新高考改革推动生涯教育成为刚需，然而全国中学专职生涯教师的师生比例仅为1:1200，远低于1:300的国际标准。部分县域中学具备专业资质的指导老师覆盖率不足20%，优质师资供给不足制约教育现代化进程。",
          ]}
        />
        <TeacherTrainingIntroductionSection />
        <BannerService title="培训模式" img="/images/solutions/teacher-training/training-mode.png" />
        <SolutionAdvantagesSection advantages={advantages} />
        <CaseStudies />
      </div>
    </SolutionPageGuard>
  );
}

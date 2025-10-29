import Banner from "@/components/common/banner";
import CaseStudies from "@/components/products/case-studies";
import SolutionAdvantagesSection, {
  SolutionAdvantagesSectionProps,
} from "@/components/solutions/common/advantage-section";
import SolutionIntroduction, {
  SolutionIntroductionProps,
} from "@/components/solutions/common/solution-introduction";
import { SolutionPageGuard } from "@/components/solutions/common/solution-page-guard";
import TestimonialsSection from "@/components/solutions/common/testimonial-section";

const intros: SolutionIntroductionProps["introductions"] = [
  {
    title: "生涯课堂",
    description:
      "智能化软硬件组合，帮助教师优化发展指导教学内容呈现，增进师生和生生之间的课堂协作、互动和分享",
    image: "/images/solutions/teacher-guidance/intro/intro-1.png",
    className: "bg-[linear-gradient(180deg,#D6E8FF_7.09%,rgba(214,232,255,0.20)_53.53%)]",
  },
  {
    title: "个体咨询",
    description:
      "因应咨询辅导不同阶段的需求，平台为教师匹配相应的数字化量表和工具辅助教师高效开展生涯教育指导",
    image: "/images/solutions/teacher-guidance/intro/intro-2.png",
    className: "bg-[linear-gradient(180deg,#BFF1FF_6.88%,rgba(191,241,255,0.20)_54.69%)]",
  },
  {
    title: "学业指导",
    description:
      "多种生涯探索测评量表，生涯决策工具，院校、专业和职业信息库，帮助学生更好地认识自我，认识外部世界，作出合理的生涯决策",
    image: "/images/solutions/teacher-guidance/intro/intro-3.png",
    className: "bg-[linear-gradient(180deg,#9ED0FF_6.88%,rgba(158,208,255,0.20)_54.69%)]",
  },
];

const advantages: SolutionAdvantagesSectionProps["advantages"] = [
  {
    title: "提升教师专业素养",
    description:
      "通过系统的培训和资源支持，提升教师的生涯教育理论知识和实践能力。",
    image: "/images/solutions/teacher-guidance/advantages/advantages-1.png",
  },
  {
    title: "减轻教师工作负担",
    description:
      "提供便捷的工具和资源，帮助教师高效开展生涯指导工作，减轻工作压力。",
    image: "/images/solutions/teacher-guidance/advantages/advantages-2.png",
  },
  {
    title: "促进学生全面发展",
    description:
      "帮助学生认识自我、规划未来，促进其学业、职业和个人的全面发展。",
    image: "/images/solutions/teacher-guidance/advantages/advantages-3.png",
  },
];

const TeacherGuidancePage = () => {
  return (
    <SolutionPageGuard pageKey="teacher-guidance">
      <div className="min-h-screen">
        <Banner
          title="教师生涯辅助解决方案"
          description="内置生涯测评量表和工具，为教师提供“导航式”指引"
          imageSrc="/images/solutions/teacher-guidance/banner.jpg"
          objectPosition="40%"
          customClassNameText="sm:w-full w-[240px]"
        />
        <TestimonialsSection
          title="方案背景"
          description={"随着新高考改革进程的深入发展，催生学生的发展指导需求爆发式增长，根据中国青少年研究中心调研数据、78%的高中生要求获得基于大数据分析的精准指导方案。而部分学校缺乏专职生涯指导教师、生涯教师数量不足导致工作负荷繁重，无法满足学生发展指导需要。亟需更高效、更丰富的生涯指导辅助方案来帮助教师展开工作。"}
        />
        <SolutionIntroduction
          title="方案介绍"
          description="象导生涯教师生涯辅助解决方案，依托国内外生涯教育专家顾问团队，精选科学权威的量表、工具，整合全国院校信息库等多元资讯，打造覆盖中学阶段生涯教育资源包，帮助教师快速理解生涯教育理论、理解实践案例、掌握量表工具使用。教师可利用平台上的课件资源针对本校实际情况、不同教育阶段和任务开展多元化生涯课程，也可面向个体学生进行针对性测评和指导，帮助学生做好符合其自身特质的生涯规划和学业指导工作。"
          introductions={intros}
        />
        <SolutionAdvantagesSection advantages={advantages} />
        <CaseStudies />
      </div>
    </SolutionPageGuard>
  );
};

export default TeacherGuidancePage;

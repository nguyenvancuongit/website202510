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
    title: "科学权威的量表工具",
    description:
      "精选科学权威的量表工具，涵盖职业兴趣、性格类型、价值观等维度，帮助教师全面了解学生特质。",
    image: "/images/solutions/teacher-guidance/intro/intro-1.png",
    background:
      "linear-gradient(180deg, #D6E8FF 7.09%, rgba(214, 232, 255, 0.20) 53.53%)",
  },
  {
    title: "丰富的课程资源",
    description:
      "提供覆盖中学阶段的生涯教育课程资源包，帮助教师设计和实施多元化的生涯课程。",
    image: "/images/solutions/teacher-guidance/intro/intro-2.png",
    background:
      "linear-gradient(180deg, #BFF1FF 6.88%, rgba(191, 241, 255, 0.20) 54.69%)",
  },
  {
    title: "个性化指导方案",
    description:
      "根据学生的个性特征和发展需求，提供量身定制的生涯指导方案，帮助教师更好地支持学生的成长。",
    image: "/images/solutions/teacher-guidance/intro/intro-3.png",
    background:
      "linear-gradient(180deg, #9ED0FF 6.88%, rgba(158, 208, 255, 0.20) 54.69%)",
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

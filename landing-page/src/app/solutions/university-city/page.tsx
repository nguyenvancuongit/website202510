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
    title: "心理筛查",
    description:
      "采用国际标准化量表通过学生端APP/PC端完成测评象导生涯提供多维度筛查体系，自动生成心理风险等级，辅助预警。",
    image: "/images/solutions/university-city/intro/intro-1.png",
    background:
      "linear-gradient(180deg, #D6E8FF 7.09%, rgba(214, 232, 255, 0.20) 53.53%)",
  },
  {
    title: "生涯成熟度评估",
    description:
      "于生涯理论设计测评模块，评估职业兴趣、决策能力、未来取向等维度，识别生涯迷茫或发展滞后学生",
    image: "/images/solutions/university-city/intro/intro-2.png",
    background:
      "linear-gradient(180deg, #BFF1FF 6.88%, rgba(191, 241, 255, 0.20) 54.69%)",
  },
  {
    title: "数据分析",
    description:
      "1000人学校仅需1小时即可完成筛查过程，教育局/校级管理员可查看区域/班级级数据聚合报告(如心理高危比例、生涯决策困难分布)。",
    image: "/images/solutions/university-city/intro/intro-3.png",
    background:
      "linear-gradient(180deg, #9ED0FF 6.88%, rgba(158, 208, 255, 0.20) 54.69%)",
  },
];

const advantages: SolutionAdvantagesSectionProps["advantages"] = [
  {
    title: "筛查效率高",
    description:
      "传统筛查模式效率低、耗时长，量表数据统计工作量大，象导生涯1小时即可完成1000人筛查。",
    image: "/images/solutions/university-city/advantages/advantages-1.png",
  },
  {
    title: "科学权威",
    description:
      "可对接现有校园管理体系(如学籍信息)，支持PC端、手机端联动实现学生课后筛查数据同步。",
    image: "/images/solutions/university-city/advantages/advantages-2.png",
  },
  {
    title: "数据驱动",
    description:
      "基于象导生涯学生发展指导智慧平台SaaS模式，政策更新时测评模块可快速迭代，学校无需维护服务器，无后期运营成本。",
    image: "/images/solutions/university-city/advantages/advantages-3.png",
  },
];

export default function UniversityCityPage() {
  return (
    <SolutionPageGuard pageKey="university-city">
      <div className="min-h-screen">
        <Banner
          title="大规模筛查解决方案"
          description="识别潜在的心理危机和生涯成熟问题"
          imageSrc="/images/solutions/university-city/banner.jpg"
        />
        <TestimonialsSection
          title="方案背景"
          description={[
            "随着《健康中国行动——儿童青少年心理健康行动方案》等政策推进，学校需建立常态化心理筛查与生涯指导机制。当前教育痛点在于:",
            "·数据割裂：心理与生涯数据分散，难以形成学生成长全景视图；",
            "·预警滞后：传统人工筛查效率低，难以及时识别高风险个体；",
            "·干预脱节：家校协同不足，缺乏动态跟踪工具。",
          ]}
        />
        <SolutionIntroduction title="方案介绍" introductions={intros} />
        <SolutionAdvantagesSection advantages={advantages} />
        <CaseStudies />
      </div>
    </SolutionPageGuard>
  );
}

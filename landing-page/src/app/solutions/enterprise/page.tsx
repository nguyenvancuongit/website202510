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
    title: "岗位胜任力模型",
    description: "为企业提供科学的人才评估与发展规划标准。",
    image: "/images/solutions/enterprise/intro/intro-1.png",
    className: "bg-[linear-gradient(180deg,#D6E8FF_7.09%,rgba(214,232,255,0.20)_53.53%)]",
  },
  {
    title: "人岗匹配",
    description: "帮助企业在选人、用人、培养全流程中精准四配员工潜能与岗位需求",
    image: "/images/solutions/enterprise/intro/intro-2.png",
    className: "bg-[linear-gradient(180deg,#BFF1FF_6.88%,rgba(191,241,255,0.20)_54.69%)]",
  },
  {
    title: "人才培养",
    description:
      "识别高潜人才，设计个性化培养方案，实现人才梯队的高效建设与长期发展。",
    image: "/images/solutions/enterprise/intro/intro-3.png",
    className: "bg-[linear-gradient(180deg,#9ED0FF_6.88%,rgba(158,208,255,0.20)_54.69%)]",
  },
];

const advantages: SolutionAdvantagesSectionProps["advantages"] = [
  {
    title: "科学测评体系",
    description: "基于数百万+学生及职场样本数据，确保评估信效度",
    image: "/images/solutions/enterprise/advantages/advantages-1.png",
  },
  {
    title: "动态追踪能力",
    description: "员工成长数据实时更新，支持长期发展监测。",
    image: "/images/solutions/enterprise/advantages/advantages-2.png",
  },
  {
    title: "AI智能匹配",
    description: "算法推荐人岗适配方案，减少主观决策偏差。",
    image: "/images/solutions/enterprise/advantages/advantages-3.png",
  },
  {
    title: "行业定制化",
    description: "可适配零售、科技、制造等不同领域人才标准",
    image: "/images/solutions/enterprise/advantages/advantages-4.png",
  },
  {
    title: "员工幸福感提升",
    description: "找到职业认同感，降低主动离职率。",
    image: "/images/solutions/enterprise/advantages/advantages-5.png",
  },
];

export default function EnterprisePage() {
  return (
    <SolutionPageGuard pageKey="enterprise">
      <div className="min-h-screen overflow-x-hidden md:overflow-visible">
        <Banner
          title="企业人才发展解决方案"
          description="数字科技让生涯课堂“动起来”"
          textColor="white"
          hasOverlay
          imageSrc="/images/solutions/enterprise/banner.png"
        />
        <TestimonialsSection
          title="方案背景"
          description={[
            "新高考改革：选科组合达12-20种，学生需提前了解专业与职业关联（如物理+化学+生物对应医学/工程类）。",
            "《国家中长期教育改革纲要》：明确要求高中阶段开展生涯教育，2025年前实现全国普及。",
            "核心素养培养：生涯规划能力被纳入“中国学生发展核心素养”中的自主发展维度。",
            "然而在现实情况中，往往存在学生不清楚大学专业与未来职业的关系，选科盲目导致高考志愿填报失误的情况；而在学校端，由于教师缺乏系统化课程资源，备课耗时、传统“填鸭式”生涯讲座效果差，学生参与度极低。",
          ]}
        />
        <SolutionIntroduction
          title="方案介绍"
          description="象导生涯企业人才发展解决方案整合职业测评、能力评估、发展建议三大模块，通过智能系统生成员工多维发展报告，包括职业兴趣(如霍兰德代码)、核心结合企业岗位需求，系统可自动推荐适配岗位或定制成长计划(如轮岗建议、培训课程)。能力(如领导力、创新思维)、价值观匹配度等关键指标。此外，方案支持团队分析功能，帮助管理者优化团队配置，识别潜在离职风险，并提供针对性干预策略(如职业锚定辅导、关键人才保留计划)。"
          introductions={intros}
        />
        <SolutionAdvantagesSection advantages={advantages} />
        <CaseStudies />
      </div>
    </SolutionPageGuard>
  );
}

import Banner from "@/components/common/banner";
import CaseStudies from "@/components/products/case-studies";
import SolutionAdvantagesSection from "@/components/solutions/common/advantage-section";
import SolutionIntroduction from "@/components/solutions/common/solution-introduction";
import { SolutionPageGuard } from "@/components/solutions/common/solution-page-guard";
import TestimonialsSection from "@/components/solutions/common/testimonial-section";

const advantages = [
  {
    title: "数字化工具，增进发展指导课堂互动",
    description:
      "智慧生涯课堂打破传统生涯指导课的模式，教师和学生之间、学生和学生之间通过平板电脑进行多维互动，教师实时掌握学生的学习成果和测评结果，为进一步调整授课方法，引导孩子思考生涯、规划生涯提供技术支撑。",
    image: "/images/solutions/classroom/advantages/advantages-1.png",
  },
  {
    title: "聚焦个性化需求，提供精细化发展指导",
    description:
      "教师可通过学生发展指导智慧平台安排心理健康/生涯适应力测评任务。学生完成测评后，平台根据量表常模自动生成个体评估报告，帮助教师了解班级学生情况，有针对性地提供心理/生涯指导此外，平台会筛选出现心理危机预警或生涯适应力较低的学生名单，以便教师及时进行干预和辅导。",
    image: "/images/solutions/classroom/advantages/advantages-2.png",
  },
  {
    title: "实时采集课堂数据，提升教学效率与质量",
    description: "为教师提供学生发展指导的具体思路和工具，帮助教师们轻装上阵，让学生发展指导的实施主体从学生发展指导中心的教师拓展到全校教师，向着\"教师人人是导师”的育人格局迈进。",
    image: "/images/solutions/classroom/advantages/advantages-3.png",
  },
  {
    title: "一站式工具包，多种教学模式",
    description:
      "通过数字化方式实现指导记录留痕，有助于教师更好地跟踪学生的生涯发展进程，对比学生在不同阶段的变化和成长，确保生涯指导的精准性和连贯性。",
    image: "/images/solutions/classroom/advantages/advantages-4.png",
  },
];

const introductions = [
  {
    title: "生涯课堂",
    description:
      "以“认知自我一探索职业一规划路径”为主线，融合学科知识、职业体验和决策工具的实践性课程体系。象导生涯利用智能教具、生涯游戏、线上信息库、大数据等数字化资源破解生涯教育困局，为学校打造工具实践课程、情景模拟课程、学科融合课程，帮助学生在真实场景中建立生涯决策能力。",
    image: "/images/solutions/classroom/intro/intro-1.png",
    className: "bg-[linear-gradient(180deg,#D6E8FF_7.09%,#FFF_53.53%)] sm:bg-[linear-gradient(180deg,#D6E8FF_7.09%,rgba(214,232,255,0.20)_53.53%)]",
  },
  {
    title: "生涯课堂平板",
    description:
      "内置不同侧重点的测评量表和数字化生涯探索工具，增进生涯课堂师生和生生互动。学生的量表测评数据/生涯探索工具使用结果实时同步至教师端，并记录到学生的生涯成长档案为个性化生涯指导提供参考集成信息库、智能选科、量表和工具等功能，适应认识自我、认识外部世界、决策与行动等不同阶段的学生发展需水。",
    image: "/images/solutions/classroom/intro/intro-2.png",
    className: "bg-[linear-gradient(180deg,#BFF1FF_6.88%,#FFF_54.69%)] sm:bg-[linear-gradient(180deg,#BFF1FF_6.88%,rgba(191,241,255,0.20)_54.69%)]",
  },
  {
    title: "元宇宙探索系统",
    description:
      "创新地将科技融入兴趣测评工具，依托虚拟现实与元宇宙技术，构建妙趣横生的“虚拟兴趣岛”。学生可沉浸式发掘自身兴趣，有效激发探索世界的内在动力",
    image: "/images/solutions/classroom/intro/intro-3.png",
    className: "bg-[linear-gradient(180deg,#9ED0FF_6.88%,rgba(158,208,255,0.20)_54.69%)] sm:bg-[linear-gradient(180deg,#9ED0FF_6.88%,rgba(158,208,255,0.20)_54.69%)]",
  },
];

export default function ClassroomPage() {
  return (
    <SolutionPageGuard pageKey="classroom">
      <div className="min-h-screen">
        <Banner
          imageSrc="/images/solutions/classroom/banner.png"
          title="生涯课堂解决方案"
          description="数字科技让生涯课堂'动起来'"
          textColor="white"
          hasOverlay
        />
        <TestimonialsSection
          title="方案背景"
          description={[
            "新高考改革：选科组合达12-20种，学生需提前了解专业与职业关联(如物理+化学+生物对应医学/工程类)。",
            "《国家中长期教育改革纲要》明确要求高中阶段开展生涯教育，2025年前实现全国普及。",
            "核心素养培养：生涯规划能力被纳入'中国学生发展核心素养'中的自主发展维度。",
            "在现实情况中，往往存在学生不清楚大学专业与未来职业的关系，选科盲目导致高考志愿填报失误的情况；而在学校端，由于教师缺乏系统化课程资源备课耗时、传统'填鸭式'生涯讲座效果差，学生参与度极低。",
          ]}
        />
        <SolutionIntroduction title="方案介绍" introductions={introductions} />
        <SolutionAdvantagesSection advantages={advantages} />
        <CaseStudies className="pb-20" />
      </div>
    </SolutionPageGuard>
  );
}

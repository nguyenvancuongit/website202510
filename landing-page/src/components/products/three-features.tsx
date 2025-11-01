import ProductTabs from "@/components/common/product-tabs";

const tabs = [
  {
    icon: "/images/products/three-features/icon1.svg",
    title: "学生端",
    image: "/images/products/three-features/feature-1.png",
  },
  {
    icon: "/images/products/three-features/icon2.svg",
    title: "教师端",
    image: "/images/products/three-features/feature-2.png",
  },
  {
    icon: "/images/products/three-features/icon3.svg",
    title: "管理端",
    image: "/images/products/three-features/feature-3.png",
  },
];
const platforms = [
  {
    title: "提供多样化工具，引导学生主动探索、自主成长",
    description:
     `建立涵盖院校信息、专业介绍、职业发展等详实数据的  <br />  <br />
     “生涯信息库”，通过智能化引导，帮助学生主动探索自我，  <br />  <br />
     实现自主成长，建立自己的生涯成长档案。  <br />  <br />  `,
    image: "/images/products/three-features/feature-1.png",
    imageMobile: "/images/products/three-features/feature1-mobile.svg",
  },
  {
    title: "数字化助力“读懂孩子”，推动全员导师制落地见效",
    description: `提供包含生涯理论知识、实践操作指南、专业测评工具等在内的"生涯工具箱"  <br />  <br />
     基于多维度数据采集与分析，构建学生成长追踪系统 <br />  <br />
     提供个性化发展需求分析，实现精准化指导  <br />  <br />
     支持课堂教学设计、个体辅导、普查评估等工作的数字化开展  <br />  <br />
    助力学校全员导师制有效实施
     `,
    image: "/images/products/three-features/feature2.svg",
    imageMobile: "/images/products/three-features/feature2-mobile.svg",
  },
  {
    title: "释放数据价值，实现学生发展指导精细化管理",
    description: `自动化处理测评分析、进度跟踪、档案整理等基础工作  <br />  <br />
     通过数据可视化实现指导工作的精细化管理  <br />  <br />
     减轻教师事务性负担，聚焦核心指导工作  <br />  <br />  `,
    image: "/images/products/three-features/feature-3.png",
    imageMobile: "/images/products/three-features/feature3-mobile.svg",
  },
];
export default function ThreeFeatures() {
  return (
    <section className="py-10 sm:py-16 bg-white sm:bg-gradient-to-b from-white to-[#F0F9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductTabs tabs={tabs} platforms={platforms} keepTabs />
      </div>
    </section>
  );
}

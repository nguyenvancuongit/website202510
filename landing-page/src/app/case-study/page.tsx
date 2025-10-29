import CaseStudyList from "@/components/case-study/case-study-list";
import Banner from "@/components/common/banner";

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <Banner
        imageSrc="/images/case-study/banner.jpg"
        title="客户案例"
        description="这是客户案例页面的描述"
        hasOverlay
        overlayColor="linear-gradient(90deg, rgba(15, 85, 207, 0.80) 0.04%, rgba(87, 176, 253, 0.00) 99.95%)"
        textColor="white"
      />
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        <p className="text-3xl md:text-6xl text-black font-bold text-center">
          已帮助<span className="text-vibrant-blue">100+</span>学校成功实现生涯教育数智化
        </p>
        <CaseStudyList initialCategory="all" />
      </div>
    </div>
  );
}

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const brandValues = [
  { title: "品牌使命", content: "科技赋能育人，护成长，筑未来" },
  { title: "品牌口号", content: "发现自我，成长有象" },
  { title: "品牌主张", content: "成长有光 适应成功" },
  { title: "品牌价值观", content: "科学为本 温度优先" },
];

const features = [
  {
    title: "科学权威的底层体系",
    description:
      "象导生涯联合华南师范大学、广州中学、华南师范大学附属中学、广州市第二中学、广州市第三中学等国内顶级基础教育学校，为学生发展指导智慧平台提供理论研究。",
    image: "/images/abouts/feature1.png",
    gradient: "linear-gradient(180deg, #D6E8FF 7.09%, #FFFFFF 53.53%)",
  },
  {
    title: "四位一体服务矩阵",
    description:
      "象导生涯拥有智能硬件、SaaS平台、课程活动和师资培训四大核心板块。各大板块相互支撑、形成了覆盖硬件建设、软件支持、教学实施和人才培养的完整生态链，确保生涯教育高效落地。",
    image: "/images/abouts/feature2.png",
    gradient: "linear-gradient(180deg, #BFF1FF 6.88%, #FFFFFF 54.69%)",
  },
  {
    title: "经验丰富的研发团队",
    description:
      "象导生涯团队拥有专业前沿的教研经验，资历深厚的人才队伍，在中国、英国等国家设立教育科学、生涯规划、数据平台的学术研究、产品研发及服务。",
    image: "/images/abouts/feature3.png",
    gradient: "linear-gradient(180deg, #9ED0FF 6.88%, #FFFFFF 54.69%)",
  },
]

export default function BrandIntroduction() {
  return (
    <section className="sm:py-20 py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-6xl font-bold text-dark-blue-grey mb-6 sm:mb-14">
          品牌介绍
        </h2>
        <div className="mb-14 space-y-4">
          <p className="text-dark-blue-grey leading-relaxed text-sm md:text-base">
            &ldquo;象导生涯&rdquo;隶属于纬英数字科技(广州)有限公司(简称为纬英科技)，公司成立于2019年，总部位于广州，是国内领先的学生发展指导与生涯教育整体解决方案服务商。公司业务覆盖生涯教育咨询与规划服务、综合素质教育、国际教育咨询服务、海外教育服务等领域。
          </p>
          <p className="text-dark-blue-grey leading-relaxed text-sm md:text-base">
            象导生涯致力于运用数据科学的力量赋能生涯教育的发展，为教育管理者、学校、老师、学生与家长提供全方位的优质服务。象导生涯专注于为学校、教育机构及企业提供&ldquo;测评一课程一活动一咨询&rdquo;全链条服务，构筑了从工具、平台到内容的多元化教育生态，以满足从小学到大学，以及大学以后各年龄段人群的个性化学习需求，致力于用科技赋能生涯教育，助力每个学生找到个性化成长路径。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 mb-10 sm:mb-16">
          {brandValues.map((value, index) => (
            <Button
              key={index}
              className="bg-[#1d8bf8] text-white min-h-24 sm:min-h-36 py px-6 sm:px-12 hover:bg-[#066bf0] items-start rounded-sx text-lg flex flex-col justify-center"
            >
              <div className="font-bold text-lg sm:text-2xl">{value.title}</div>
              <div className="text-base sm:text-xl font-normal mt-1">
                {value.content}
              </div>
            </Button>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        <Carousel
          className="block md:hidden"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {features.map((feature, index) => (
              <CarouselItem key={index} className="basis-[80%]">
                <FeatureCard key={index} feature={feature} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

const FeatureCard = ({ feature }: { feature: (typeof features)[number] }) => {
  return (
    <Card
      className="border-none shadow-none rounded-3xl group"
      style={{ background: feature.gradient }}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-lg md:text-2xl text-charcoal mb-7">
            {feature.title}
          </h3>
          <p className="text-dark-blue-grey text-base leading-relaxed">
            {feature.description}
          </p>
        </div>
        <div className="mt-auto h-48 relative overflow-hidden">
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            className={
              "transition-transform duration-300 ease-out group-hover:scale-110 cursor-zoom-in p-0 object-fill"
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

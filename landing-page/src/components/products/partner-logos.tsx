import PartnerLogosSection from "@/components/common/partner-logos-section";

const partners = [
  {
    name: "华南师范大学附属中学",
    logo: "/images/products/partners/logo1.svg",
  },
  {
    name: "广州中学",
    logo: "/images/products/partners/logo2.svg",
  },
  {
    name: "广州市白云艺术中学",
    logo: "/images/products/partners/logo3.svg",
  },
  {
    name: "广州市真光中学",
    logo: "/images/products/partners/logo4.svg",
  },
  {
    name: "罗湖高级中学",
    logo: "/images/products/partners/logo5.svg",
  },
  {
    name: "深圳市翠园中学高中部",
    logo: "/images/products/partners/logo6.svg",
  },
  {
    name: "湛江市寸金培才中学",
    logo: "/images/products/partners/logo7.svg",
  },
  {
    name: "丰顺县第一中学",
    logo: "/images/products/partners/logo8.svg",
  },
  {
    name: "新丰县第一中学",
    logo: "/images/products/partners/logo9.svg",
  },
  {
    name: "四会市四会中学",
    logo: "/images/products/partners/logo10.svg",
  },
  {
    name: "广州市美术高级中学",
    logo: "/images/products/partners/logo11.svg",
  },
  {
    name: "佛山市南海区桂城高级中学",
    logo: "/images/products/partners/logo12.svg",
  },
  {
    name: "深圳中学高中园",
    logo: "/images/products/partners/logo13.svg",
  },
  {
    name: "中山纪念中学",
    logo: "/images/products/partners/logo14.svg",
  },
];

export default function PartnerLogos() {
  return <PartnerLogosSection title="合作客户" partners={partners} />;
}

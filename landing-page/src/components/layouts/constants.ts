import { MenuItemProps } from "./header";

export const staticProductMapping: Record<string, MenuItemProps> = {
  "cloud-platform": {
    label: "学生发展指导智慧云平台",
    href: "/products/cloud-platform",
    subtitle: "赋能生涯教育数智化建设",
    image: "/icons/header/product/sass.svg",
  },
  "terminal": {
    label: "智能生涯自助探索终端",
    href: "/products/terminal",
    subtitle: "助力学生课余自助探索",
    image: "/icons/header/product/terminal.svg",
  },
  games: {
    label: "生涯活动与服务",
    href: "/products/games",
    subtitle: "校园大型生涯探索活动",
    image: "/icons/header/product/career.svg",
  },
  assessment: {
    label: "企业人才发展与数智化服务",
    href: "/products/assessment",
    subtitle: "人才体系建设咨询与服务",
    image: "/icons/header/product/user.svg",
  },
};

export const staticSolutionMapping: Record<string, MenuItemProps> = {
  "guidance-center": {
    label: "学生发展指导中心解决方案",
    href: "/solutions/guidance-center",
    image: "/icons/header/solution/solution-header-1.png",
  },
  classroom: {
    label: "生涯课堂解决方案",
    href: "/solutions/classroom",
    image: "/icons/header/solution/solution-header-2.png",
  },
  "university-city": {
    label: "大规模筛查解决方案",
    href: "/solutions/university-city",
    image: "/icons/header/solution/solution-header-3.png",
  },
  "teacher-guidance": {
    label: "教师生涯咨询指导解决方案",
    href: "/solutions/teacher-guidance",
    image: "/icons/header/solution/solution-header-4.png",
  },
  "teacher-training": {
    label: "师资培训解决方案",
    href: "/solutions/teacher-training",
    image: "/icons/header/solution/solution-header-5.png",
  },
  enterprise: {
    label: "企业人才发展解决方案",
    href: "/solutions/enterprise",
    image: "/icons/header/solution/solution-header-6.png",
  },
};

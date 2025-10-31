import { MemberCloud } from "./member-could";
import SectionHeader from "./section-header";

const sampleMembers = [
  {
    id: 0,
    name: "吴颖民   校长",
    bio: "象导生涯专家委员会名誉主任\n中国教育学会副会长\n国务院特殊津贴专家\n首任广州中学校长\n曾任华南师范大学副校长\n曾任华南师范大学附属中学校长",
    image: "/images/members/member-1.jpg",
  },
  {
    id: 1,
    name: "Dr. Steve Bailey",
    bio: "象导生涯英国区合伙人\n英国著名教育学、历史学家\n斯坦福大学、伯明翰大学客座教授\n曾任英国九大公学-温彻斯特公学院长\n曾任英国九大公学-威斯敏斯特公学校长\n英国私校联盟主席\n南安普顿大学哲学及教育学荣誉博士",
    image: "/images/members/member-2.png",
  },
  {
    id: 2,
    name: "陈礴院士",
    bio: "象导生涯专家委员会首席专家\n诺贝尔经济学奖提名者\n英国社会科学院院士\n华威大学运筹学首席教授\n清华大学讲座教授\n剑桥大学、斯坦福大学客座教授",
    image: "/images/members/member-3.jpg",
  },
  {
    id: 3,
    name: "张卫   教授",
    bio: "象导生涯专家委员会委员\n广东省社会心理学会会长\n华南师范大学人文社会科学高等研究院常务副院长",
    image: "/images/members/member-4.jpg",
  },
  {
    id: 4,
    name: "刘会金",
    bio: "象导生涯专家委员会委员\n中国关工委生涯教育专委会副秘书长\n广东省生涯教育专委会副秘书长\n深圳市生涯规划与发展协会创会副会长\n中国数学奥林匹克高级教练\n广州大学硕士生导师",
    image: "",
  },
  {
    id: 5,
    name: "刘学兰",
    bio: "象导生涯专家委员会委员\n中国心理学会理论心理与心理学史专业委员会委员、心理学质性研究专业委员会委员\n广东省本科高校心理学类专业教学指导委员会秘书长\n华南师范大学心理学院副院长、教授\n广东省“特支计划”教学名师",
    image: "/images/members/member-6.jpg",
  },
  {
    id: 6,
    name: "李之宁",
    bio: "象导生涯专家委员会委员\n教育部学生发展指导专家助理\n广东省中小学校长联合会副秘书长\n全球职业规划师\n华南师范大学教育与发展心理学博士",
    image: "/images/members/member-7.jpg",
  },
  {
    id: 7,
    name: "黄星维",
    bio: "象导生涯中国区合伙人\n广东省心理健康与生涯教育研究院副院长\n广东省社会心理学会发展指导专委会常务理事\n英国皇家注册统计学家\n牛津大学数学博士",
    image: "/images/members/member-8.jpg",
  },
  {
    id: 8,
    name: "陈启山",
    bio: "象导生涯测量学专家\n广东省心理学会职业心理专委会常务理事\n广东省人力资源研究会理事\n华南师范大学副教授\n香港中文大学哲学博士",
    image: "/images/members/member-9.jpg",
  },
  {
    id: 9,
    name: "Parkinson",
    bio: "象导生涯专家委员会委员\n担任温彻斯特公学经济系教学主任\n牛津大学哲学、政治学及经济学(PPE)一等荣誉学士学位",
    image: "/images/members/member-10.jpg",
  },
  {
    id: 10,
    name: "Chris Yates",
    bio: "象导生涯专家委员会委员\n曾担任温彻斯特公学生涯规划中心主任",
    image: "/images/members/member-11.jpg",
  },
  {
    id: 11,
    name: "陈彩琦",
    bio: "象导生涯专家委员会委员\n广东省心理学会秘书长\n华南师范大学心理学院副教授\n华南师范大学应用心理硕士（MAP）中心副主任",
    image: "/images/members/member-12.jpg",
  },
  {
    id: 12,
    name: "李青",
    bio: "象导生涯专家委员会委员\n广东省中小学校长联合会生涯教育专委会副秘书长\n广东省人力资源学会生涯规划教育特邀专家\n国际生涯规划师、国际生涯发展咨询师（NCDA）\n高考志愿填报规划师（高级）",
    image: "",
  },
  {
    id: 13,
    name: "Didem",
    bio: "象导生涯合伙人\n现任高盛集团资产管理与生成AI部门顾问\n曾任微软应用战略、数据与人工智能部门CDO办公室负责人\n曾任施耐德人工智能战略与创新部门副总裁\n曾任埃森哲(Accenture)欧洲地区数据与人工智能部门总经理\n美国哥伦比亚大学工商管理学硕士",
    image: "",
  },
  {
    id: 14,
    name: "吴俊青",
    bio: "象导生涯CTO\n现任沃尔玛首席数据官\n曾任微软数据科学家",
    image: "",
  },
  {
    id: 15,
    name: "林熙",
    bio: "象导生涯AI数据科学家\n现任Apple公司AI数据科学家",
    image: "",
  },
  {
    id: 16,
    name: "Ricardo Castro\n",
    bio: "象导生涯AI数据专家\n现任微软首席数据科学经理\n比利时鲁汶大学人工智能硕士\n比利时鲁汶大学电气工程博士",
    image: "/images/members/member-17.png",
  },
  {
    id: 17,
    name: "彭宏伟",
    bio: "象导生涯AI数据专家\n伦敦玛丽女王大学商业管理博士\n伦敦大学学院统计科学硕士",
    image: "/images/members/member-18.jpg",
  },
  {
    id: 18,
    name: "朱未",
    bio: "象导生涯AI数据专家\n荷兰格罗宁根大学计量经济与金融系副教授\n利物浦大学数学博士",
    image: "/images/members/member-19.jpg",
  },
  {
    id: 19,
    name: "孔令未",
    bio: "象导生涯AI数据专家\n荷兰格罗宁根大学计量经济与金融系副教授\n丁伯根研究所与阿姆斯特丹大学经济学博士",
    image: "/images/members/member-20.jpg",
  },
  {
    id: 20,
    name: "肖勇",
    bio: "象导生涯AI伦理合规顾问\n金杜律师事务所国际合伙人",
    image: "",
  },
  {
    id: 21,
    name: "常春",
    bio: "象导生涯AI伦理合规顾问\n铭盾律师事务所合伙人\n北京大学博士",
    image: "",
  },
  {
    id: 22,
    name: "黄颖心",
    bio: "象导生涯AI教育研究顾问\n普华永道会计师事务所审计师\n伦敦政治经济学院硕士",
    image: "/images/members/member-23.jpg",
  },
];

const MemberSection = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:mt-50">
        <SectionHeader
          title="象导生涯研究院"
          subtitle="专家顾问团队——引领生涯教育学术高地"
        />
      </div>
      <div
        className="flex flex-col items-center space-y-4 p-4 sm:p-8 w-full sm:h-auto h-[500px]"
        style={{
          backgroundImage: 'url("/images/members-bg.png")',
        }}
      >
        <div className="w-full max-w-4xl">
          <MemberCloud
            members={sampleMembers}
            size={800}
            images={sampleMembers.map((member) => member.image)}
          />
        </div>
      </div>
    </>
  );
};

export default MemberSection;

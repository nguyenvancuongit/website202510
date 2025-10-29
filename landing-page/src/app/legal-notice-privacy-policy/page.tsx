export const metadata = {
  title: "法律声明与隐私政策",
}

import Image from "next/image"
import Link from "next/link"

export default function LegalNoticePrivacyPolicyPage() {
  return (
    <div className='min-h-screen relative'>
      <Image
        src='/images/terms-and-policy/background.svg'
        alt='background'
        className='absolute top-[80px] left-1/2 -translate-x-1/2 z-0 w-full'
        width={100}
        height={100}
      />
      <div className='container mx-auto px-4 sm:px-8 relative z-10 pt-30 sm:pt-40 py-4'>
        <div className=' bg-transparent sm:bg-white rounded-xl p-0 sm:p-8 max-w-6xl mx-auto'>
          {/* Breadcrumb */}
          <nav className='hidden sm:block text-lg text-gray-500 mb-6'>
            <Link
              href='/'
              className='hover:text-charcoal'
            >
              首页 〉
            </Link>
            <span className='text-charcoal'>法律声明与隐私政策</span>
          </nav>

          {/* Card */}
          <div className='rounded-2xl p-0 sm:p-4 md:p-8'>
            <h1 className='text-2xl sm:text-xl text-[#000] font-semibold text-left sm:text-center mb-6'>
              法律声明与隐私政策
            </h1>

            <div className='prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed'>
              <p className='text-[#000] font-semibold text-base mt-8'>
                1. 服务性质界定
              </p>
              <p>
                本网站（以下简称&quot;本站&quot;）由象导生涯（以下简称&quot;我们&quot;）独立运营。作为全场景生涯教育整体解决方案服务商，我们通过学生发展指导智慧平台、智能生涯自助探索终端、生涯活动等多元化服务（以下统称&quot;服务&quot;），为学生的生涯教育和全面发展提供专业、科学的支持。
              </p>

              <p className='text-[#000] font-semibold text-base mt-8'>
                2. 法律合规承诺
              </p>
              <p>
                在智能系统研发、生涯工具开发及生涯科研项目推进的全过程中，我们严格遵循《中华人民共和国民法典》《中华人民共和国网络安全法》《中华人民共和国数据安全法》《中华人民共和国个人信息保护法》等法律法规的规范要求。我们将合规性置于运营的首位，通过完善的数据治理体系确保用户数据安全与个人信息权益得到充分保障。
              </p>

              <p className='text-[#000] font-semibold text-base mt-8'>
                3. 知识产权保护
              </p>
              <p>
                （1）本网站发布的生涯理论、生涯工具、课程体系，均以行业权威专家的理论成果为基础，结合实际需求独立研发而成的，具备原创性、科学性与实用性，其知识产权归本网站独家所有，未经授权不得擅自使用或仿制。
              </p>
              <p>
                （2）凡注明&quot;来源：象导生涯&quot;的所有文字、图片、音视频等资料，其知识产权均归象导生涯独家所有。
              </p>
              <p>
                （3）任何未经本网站授权的转载、复制、修改或商业使用行为均被严格禁止。
              </p>
              <p>
                （4）对于任何侵权行为，我们将依法采取必要措施维护自身合法权益。
              </p>

              <p className='text-[#000] font-semibold text-base mt-8'>
                4. 隐私保护机制
              </p>
              <p>
                我们遵循&quot;目的明确、最小必要&quot;原则，仅收集为实现服务所必需的用户信息，并在收集前完整告知使用用途。未经用户明确授权，我们不会将个人信息用于任何未声明的目的，也不会与任何第三方共享用户数据，法律法规另有规定的除外。
              </p>

              <p className='text-[#000] font-semibold text-base mt-8'>
                5. 伦理责任担当
              </p>
              <p>
                作为专业的生涯教育服务提供者，我们始终秉持伦理优先原则，以社会责任为导向，推动行业健康发展。
              </p>
              <p>
                （1）所有测评工具、行业报告及课程体系均经过专家团队的严格审核，确保其科学性与专业性。
              </p>
              <p>
                （2）我们尊重每位学生的独特性，平台设计坚持以&quot;辅助探索&quot;为宗旨，反对以算法结果定义学生的发展路径。
              </p>
              <p>
                （3）我们建立完善的技术伦理审查机制，确保产品设计符合积极健康的教育理念，并持续投身于生涯教育的公益事业中。
              </p>

              <p className='text-[#000] font-semibold text-base mt-8'>
                6. 责任边界声明
              </p>
              <p>
                我们始终致力于确保网站内容的准确性和时效性，但对因信息更新延迟或技术原因可能出现的疏漏不承担法律责任。本站可能包含的第三方网站链接仅为便利用户而提供，我们对链接网站的内容及隐私政策不承担任何监督责任。
              </p>

              <p className='text-[#000] font-semibold text-base mt-8'>
                7. 最终解释权
              </p>
              <p>
                本网站所呈现的全部内容或服务的最终解释权归象导生涯所有。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

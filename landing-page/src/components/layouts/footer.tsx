"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useFriendLinks } from "@/hooks/use-friend-links";
import { useMedia } from "@/hooks/use-media";
import { useProductPages } from "@/hooks/use-product-pages";
import { useSolutionPages } from "@/hooks/use-solution-pages";
import { cn } from "@/lib/utils";

import { Separator } from "../ui/separator";

import { staticProductMapping, staticSolutionMapping } from "./constants";

export function Footer() {
  const { data: friendLinks = [] } = useFriendLinks();
  const { data: productPages = [] } = useProductPages();
  const { config: solutionPages = [], checkVisibleSolutionPages } = useSolutionPages();
  const pathname = usePathname();
  const { isMobile } = useMedia();

  // Generate dynamic footer sections
  const getFooterSections = () => {

    // Create dynamic product items
    const productItems = productPages.map((product) => staticProductMapping[product.key]).filter(Boolean);

    // Create dynamic solution items (already sorted by the hook)
    const solutionItems = solutionPages
      .map((solution) => staticSolutionMapping[solution.key])
      .filter(Boolean);

    return [
      {
        title: "关于象导",
        key: "mix",
        items: [
          { label: "公司介绍", href: "/about-us" },
          { label: "合作案例", href: "/case-study" },
          { label: "最新动态", href: "/news" },
          { label: "加入我们", href: "/careers" },
        ],
      },
      {
        title: "产品体系",
        key: "product",
        items: productItems,
      },
      {
        title: "解决方案",
        key: "solution",
        items: solutionItems,
      },
    ];
  };

  const footerSections = getFooterSections();

  return (
    <footer className="relative w-full bg-footer-bg text-white py-16 md:rounded-t-[96px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Company Info
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/icons/phone.svg"
                  alt="phone"
                  width={18}
                  height={18}
                />
                <span>020-87318866</span>
              </div>
            */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Image
                src="/images/logos/logo.svg"
                alt="象导生涯"
                width={32}
                height={32}
              />
              <span className="text-white font-semibold text-lg">象导生涯</span>
            </div>
            <div className="hidden md:block space-y-3 text-white">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/icons/mail.svg"
                  alt="mail"
                  width={18}
                  height={15}
                />
                <span>Business@vianstats.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/icons/address.svg"
                  alt="location"
                  width={18}
                  height={18}
                />
                <span>
                  Room 501, Building 4, Nanfang Tongchuanghui, 289 Guangzhou
                  Avenue Middle, Yuexiu District, Guangzhou, Guangdong Province
                </span>
              </div>
            </div>

            <div className="flex md:hidden space-y-3 gap-[26px] text-sm text-white">
              {footerSections[0].items.map((item, itemIndex) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={cn(
                      " cursor-pointer transition-colors block",
                      {
                      "font-medium":
                        isActive,
                      }
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <Separator className="mt-6 block md:hidden bg-footer-border" />
          </div>

          {/* Desktop Dynamic Links Columns */}
          {!isMobile &&
            footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-white font-medium mb-[26px]">
                  {section.title}
                </h4>
                <div className="space-y-3 text-footer-blue text-sm">
                  {section.items.map((item, itemIndex) => {
                    const isActive = pathname.startsWith(item.href);
                    if (section.key === "solution") {
                      // For solution pages, use the custom check function
                      if (!checkVisibleSolutionPages(item.href)) {
                        return null; // Skip rendering this item if not visible
                      }
                    }
                    return (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className={cn(
                          "hover:text-white cursor-pointer transition-colors block ",
                          {
                            "text-white font-medium border-l-2 border-white pl-2":
                              isActive,
                          }
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Mobile Dynamic Links Grid */}
          <div className="md:hidden grid grid-cols-2 gap-8">
            {footerSections.slice(1).map((section, index) => (
              <div key={index}>
                <h4 className="text-[#EBF2FF] text-base font-bold mb-[26px]">
                  {section.title}
                </h4>
                <div className="space-y-3 text-white text-sm">
                  {section.items.map((item, itemIndex) => {
                    const isActive = pathname.startsWith(item.href);
                    if (section.key === "solution") {
                      // For solution pages, use the custom check function
                      if (!checkVisibleSolutionPages(item.href)) {
                        return null; // Skip rendering this item if not visible
                      }
                    }
                    return (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className={cn(
                          "text-sm cursor-pointer transition-colors block ",
                          {
                            "text-white font-medium":
                              isActive,
                          }
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Separator className="block md:hidden bg-footer-border" />

          {/* Mobile Contact Information */}
          <p className="block md:hidden text-white font-medium text-lg">联系我们</p>
          <div className="block md:hidden space-y-5 text-white">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/icons/phone.svg"
                alt="phone"
                width={18}
                height={18}
              />
              <span>020-87318866</span>
            </div>
            <div className="flex items-center space-x-2">
              <Image
                src="/images/icons/mail.svg"
                alt="mail"
                width={18}
                height={15}
              />
              <span>support@myfellas.net</span>
            </div>
            <div className="flex items-center space-x-2">
              <Image
                src="/images/icons/address.svg"
                alt="location"
                width={18}
                height={18}
              />
              <span>
                广州市越秀区广州大道中289号南方间创汇4号生产综合楼501室
              </span>
            </div>
          </div>

          {/* Follow Us Section with QR Codes */}
          <div>
            <h4 className="hidden md:block text-white font-medium mb-4">关注我们</h4>
            <div className="flex space-x-4">
              <div className="text-center">
                <Image
                  src="/images/qr/wechat.png"
                  alt="官方公众号"
                  width={100}
                  height={100}
                />
                <p className="text-white text-xs">官方公众号</p>
              </div>
              <div className="text-center">
                <Image
                  src="/images/qr/xiaohongshu.png"
                  alt="官方小红书"
                  width={100}
                  height={100}
                />
                <p className="text-white text-xs">官方小红书</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="md:mt-12 pt-8">
          <div className="hidden md:flex flex-wrap md:text-footer-blue p-3 gap-6 lg:gap-x-18 gap-y-6 text-sm mb-11 border-b border-t border-footer-border">
            <span>友情链接：</span>
            {friendLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* desktop bottom links */}
          <div className="hidden md:flex justify-between items-center">
            <p className="text-footer-border text-sm text-center">
              版权所有：广东数字工程研究院有限公司 | ICP备案：000000000号
            </p>

            <p className="text-footer-border text-sm text-center">
              粤ICP备：00000000号
            </p>
            <div className="flex gap-2 items-center">
              <Link
                className="hover:text-white text-footer-border text-sm text-center"
                href="/legal-notice-privacy-policy"
              >
                法律声明与隐私政策
              </Link>
              <Separator className="bg-footer-border h-3" orientation="vertical" />
              <Link
                className="hover:text-white text-footer-border text-sm text-center"
                href="/sitemap"
              >
                网站地图
              </Link>
            </div>
          </div>

          <Separator className="mb-6 md:hidden bg-footer-border" />

          {/* mobile bottom links */}
          <div className="flex md:hidden flex-col items-center">
            <div className="flex gap-2 items-center">
              <Link
                className="hover:text-white text-footer-border text-sm text-center"
                href="/legal-notice-privacy-policy"
              >
                法律声明与隐私政策
              </Link>
              <Separator className="bg-footer-border h-3" orientation="vertical" />
              <Link
                className="hover:text-white text-footer-border text-sm text-center"
                href="/sitemap"
              >
                网站地图
              </Link>
            </div>
            <p className="text-footer-border text-sm text-center mt-7">
              版权所有：纬英数字科技（广州）有限公司
            </p>
            <p className="text-footer-border text-sm text-center">
              ICP备案：000000000号
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

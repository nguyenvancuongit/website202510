"use client";

import { AnchorHTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { Menu, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ArrowDown from "@/assets/arrow-down";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProductPages } from "@/hooks/use-product-pages";
import { useSolutionPages } from "@/hooks/use-solution-pages";
import { cn } from "@/lib/utils";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

import { staticProductMapping, staticSolutionMapping } from "./constants";

export interface MenuItemProps {
  label: string;
  href: string;
  subtitle?: string;
  image?: string;
  hasSubmenu?: boolean;
  submenu?: MenuItemProps[];
}


export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { config: solutionPages = [], loading: isSolutionLoading, checkVisibleSolutionPages } = useSolutionPages();
  const { data: productPages, isLoading: _isProductLoading } = useProductPages();

  const ref = useRef<HTMLElement>(null);

  // Generate dynamic products submenu based on configuration
  const getProductsSubmenu = () => {
    if (!productPages) return [];

    return productPages
      .map((product) => staticProductMapping[product.key])
      .filter(Boolean);
  };

  // Generate dynamic solutions submenu based on configuration
  const getSolutionsSubmenu = () => {
    if (!solutionPages || solutionPages.length === 0) return [];

    // The solutionPages are already sorted by order from the hook
    return solutionPages
      .map((solution) => staticSolutionMapping[solution.key])
      .filter(Boolean);
  };

  // Generate dynamic menu items
  const dynamicMenuItems = useMemo<MenuItemProps[]>(() => {
    const productsSubmenu = getProductsSubmenu();
    const solutionsSubmenu = getSolutionsSubmenu();

    return [
      {
        label: "产品",
        href: "/products",
        hasSubmenu: productsSubmenu.length > 0,
        submenu: productsSubmenu,
      },
      {
        label: "解决方案",
        href: "/solutions",
        hasSubmenu: solutionsSubmenu.length > 0,
        submenu: solutionsSubmenu,
      },
      { label: "客户案例", href: "/case-study", hasSubmenu: false },
      { label: "最新动态", href: "/news", hasSubmenu: false },
      {
        label: "关于我们",
        href: "/about",
        hasSubmenu: true,
        submenu: [
          { label: "公司简介", href: "/about-us", image: "/icons/header/about/about-us.svg" },
          { label: "加入我们", href: "/careers", image: "/icons/header/about/career.svg" },
        ],
      },
    ];
  }, [productPages, solutionPages]);

  // Check if a menu item is active based on current path
  const isActive = (href: string) => {
    if (href === "/news") {
      return pathname === "/news" || pathname.startsWith("/news/");
    }
    if (href === "/about") {
      return pathname === "/careers" || pathname.startsWith("/careers/") || pathname.startsWith("/about-us")
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isSubitemActive = (href: string) => {
    return pathname.startsWith(href);
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const headerHeight = ref.current?.clientHeight ?? 0;
      setIsScrolled(scrollTop > headerHeight);
    };

    handleScroll()

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={ref}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 hover:!bg-white",
        {
          "bg-white": isScrolled || pathname !== "/",
          "bg-transparent": !isScrolled && pathname === "/",
        }
      )}
    >
      <div className="mx-auto px-4.5 lg:px-20 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"} className="flex items-center space-x-2">
            <Image
              src="/images/logos/logo.svg"
              alt="象导生涯"
              width={32}
              height={32}
            />
            <span className="font-semibold text-lg text-charcoal">
              象导生涯
            </span>
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden lg:flex" viewport={false}>
            <NavigationMenuList className={cn("flex items-center space-x-8 xl:space-x-16 gap-0 p-0")}>
              {dynamicMenuItems.map((item) => (
                <NavigationMenuItem
                  className="!bg-transparent"
                  key={item.label}
                >
                  {item.hasSubmenu ? (
                    <>
                      <NavigationMenuTrigger
                        className="!bg-transparent text-base xl:text-lg text-charcoal data-[state=open]:bg-transparent data-[state=open]:text-vibrant-blue focus:bg-transparent focus:text-vibrant-blue h-auto p-0 font-normal group/trigger [&>svg]:hidden"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <span className="flex items-center cursor-default select-none">
                          <span
                            className={cn(
                              "transition-colors group-data-[state=open]/trigger:text-vibrant-blue",
                              isActive(item.href)
                                ? "text-vibrant-blue font-medium"
                                : "text-charcoal hover:text-vibrant-blue"
                            )}
                          >
                            {item.label}
                          </span>
                          <ArrowDown
                            className={cn(
                              "ml-1 w-3 h-3 transition-transform group-data-[state=open]/trigger:rotate-180 group-data-[state=open]/trigger:[&_path]:stroke-[var(--color-vibrant-blue)]",
                              isActive(item.href) &&
                              "[&_path]:stroke-[var(--color-vibrant-blue)]"
                            )}
                          />
                        </span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="absolute left-1/2 -translate-x-1/2 p-0 w-auto bg-white !rounded-none border-none shadow-none z-50">
                        <div
                          className={cn(
                            "grid grid-col-1 w-max gap-6 p-3",
                            {
                              "px-10 py-8": item.href !== "/about",
                              "grid-cols-2": ["/products"].includes(item.href),
                              "grid-cols-3": item.href === "/solutions",
                            }
                          )}
                        >
                          {item.submenu?.map((subItem, index) => (
                            <NavigationMenuLink
                              key={index}
                              asChild
                              className="!bg-transparent"
                            >
                              {item.href === "/products" ? (
                                <ProductCard
                                  label={subItem.label}
                                  image={subItem.image || ""}
                                  subtitle={subItem.subtitle || ""}
                                  href={subItem.href}
                                  isActive={isSubitemActive(subItem.href)}
                                />
                              ) : item.href === "/solutions" ? (
                                checkVisibleSolutionPages(subItem.href) && (
                                  <SolutionCard
                                    loading={isSolutionLoading}
                                    label={subItem.label}
                                    image={
                                      subItem.image ||
                                      "/icons/header/solution/solution-header-1.png"
                                    }
                                    href={subItem.href}
                                    isActive={isSubitemActive(subItem.href)}
                                  />
                                )
                              ) : item.href === "/about" ? (
                                <AboutCard
                                  label={subItem.label}
                                  image={
                                    subItem.image ||
                                    "/icons/header/about/about-header-1.png"
                                  }
                                  href={subItem.href}
                                  isActive={isSubitemActive(subItem.href)}
                                />
                              ) : (
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    "block px-4 py-2 text-sm transition-colors whitespace-nowrap",
                                    isActive(subItem.href)
                                      ? "text-vibrant-blue font-medium"
                                      : "text-charcoal hover:text-vibrant-blue"
                                  )}
                                >
                                  {subItem.label}
                                </Link>
                              )}
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "text-base xl:text-lg text-charcoal hover:text-vibrant-blue transition-colors",
                        isActive(item.href)
                          ? "text-vibrant-blue font-medium"
                          : "text-charcoal hover:text-vibrant-blue"
                      )}
                    >
                      <span>{item.label}</span>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile/Tablet Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-charcoal hover:text-vibrant-blue"
              >
                <Menu className="size-7" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" showCloseButton={false} className="bg-white w-full gap-2 overflow-auto h-full mb-20">
              <SheetHeader className="pb-0">
                <SheetTitle className="text-left font-semibold text-lg text-charcoal flex items-center justify-between">
                  <Link href={"/"} className="flex items-center space-x-2">
                    <Image
                      src="/images/logos/logo.svg"
                      alt="象导生涯"
                      width={32}
                      height={32}
                    />
                    <span className="font-semibold text-lg text-charcoal">
                      象导生涯
                    </span>
                  </Link>
                  <Button variant={"ghost"} size="icon" className="text-charcoal hover:text-vibrant-blue" onClick={() => setIsMobileMenuOpen(false)}>
                    <XIcon className="size-6 text-charcoal" />
                  </Button>
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 pt-6 px-6" style={{
                background: "linear-gradient(180deg, #C1E3FF 0.02%, #E1F8FF 8.7%, #FFF 19.08%, #FFF 99.98%)"
              }}>
                <Accordion type="multiple"
                  className="w-full"
                  defaultValue={[]}
                >
                  {dynamicMenuItems.map((item) => (
                    <div key={item.label}>
                      {item.hasSubmenu ? (
                        <AccordionItem value={item.href}>
                          <AccordionTrigger className="flex items-center justify-between w-full text-left">
                            <span
                              className={cn(
                                "text-lg transition-colors",
                                isActive(item.href)
                                  ? "text-vibrant-blue font-medium"
                                  : "text-charcoal hover:text-vibrant-blue"
                              )}
                            >
                              {item.label}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className={cn("mt-3 space-y-2", item.href === "/solutions" && "grid grid-cols-2 gap-4")}>
                            {item.submenu?.map((subItem) => (
                              ["/products", "/about"].includes(item.href) ? (
                                <ProductCard
                                  key={subItem.label}
                                  label={subItem.label}
                                  image={subItem.image || ""}
                                  subtitle={subItem.subtitle || ""}
                                  href={subItem.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                />
                              ) : item.href === "/solutions" ? (
                                checkVisibleSolutionPages(subItem.href) && (
                                  <SolutionCard
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    loading={isSolutionLoading}
                                    label={subItem.label}
                                    image={
                                      subItem.image ||
                                      "/icons/header/solution/solution-header-1.png"
                                    }
                                    href={subItem.href}
                                  />
                                )
                              ) : null
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "block text-lg transition-colors py-4",
                            isActive(item.href)
                              ? "text-vibrant-blue font-medium"
                              : "text-charcoal hover:text-vibrant-blue"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </Accordion>

              </div>
            </SheetContent>
          </Sheet>

          {/* CTA Button - Hidden on mobile/tablet */}
          <Button className="hidden lg:flex px-4 xl:px-6 bg-charcoal hover:bg-dark-blue-grey text-white transition-colors items-center rounded-[21px] h-10.5 text-sm xl:text-base">
            <span>合作咨询</span>
            <Image
              src="/images/icons/icon-guides.svg"
              alt="arrow"
              width={21}
              height={21}
            />
          </Button>
        </div>
      </div>
    </header>
  );
}

interface CardWrapperProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
  isActive?: boolean;
}
const CardWrapper = ({
  href,
  children,
  className,
  isActive,
  ...props
}: CardWrapperProps) => {

  return (
    <Link
      href={href}
      className={cn(
        "md:border-[1px] md:border-[#EBF0FA] md:border-solid hover:border-[#177FFF] rounded-sm transition-colors",
        className,
        isActive && "md:border-[#177FFF]"
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
const ProductCard = ({
  label,
  href,
  subtitle,
  image,
  ...props
}: Omit<CardWrapperProps, "children"> & {
  label: string;
  href: string;
  subtitle: string;
  image: string;
}) => {
  return (
    <CardWrapper href={href} className="p-3 flex flex-row gap-2 items-center md:block" {...props}>
      <Image
        src={image}
        alt={label}
        width={20}
        height={20}
        className="flex-shrink-0 mb-1.5"
      />
      <div>
        <p className="text-sm font-medium text-dark-blue-grey">{label}</p>
        <p className="text-xs text-medium-dark-blue-grey mt-1 hidden md:block">{subtitle}</p>
      </div>
    </CardWrapper>
  );
};

const SolutionCard = ({
  label,
  href,
  image,
  loading,
  ...props
}: Omit<CardWrapperProps, "children"> & {
  label: string;
  href: string;
  image: string;
  loading?: boolean;
}) => {
  if (loading) {
    return (
      <div className="border-[1px] border-[#EBF0FA] border-solid rounded-sm p-4">
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
        <div className="w-[192px] h-[72px] bg-gray-200 rounded-sm animate-pulse"></div>
      </div>
    );
  }

  return (
    <CardWrapper href={href} className="md:p-4 flex flex-col-reverse gap-2 md:gap-0 md:flex-col justify-between mb-0" {...props}>
      <p className="md:my-4 flex-grow font-medium text-dark-blue-grey">{label}</p>
      <Image
        loading="eager"
        src={image}
        alt={label}
        width={192}
        height={72}
        className="rounded-sm h-[72px] object-cover"
      />
    </CardWrapper>
  );
};

const AboutCard = ({
  label,
  href,
  image,
  isActive,
  ...props
}: Omit<CardWrapperProps, "children"> & {
  label: string;
  href: string;
  image: string;
}) => {
  return (
    <CardWrapper href={href} {...props} className="flex items-center !border-0 gap-3 p-2 group/about-card" >
      <Image
        src={image}
        alt={label}
        width={20}
        height={20}
        className="flex-shrink-0"
      />
      <p className={cn("text-sm font-medium text-dark-blue-grey group-hover/about-card:text-vibrant-blue", isActive && "text-vibrant-blue")}>{label}</p>
    </CardWrapper>
  )
}
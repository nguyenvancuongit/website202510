"use client";

import { useState } from "react";
import {
  Award,
  ChevronDown,
  FileText,
  History,
  Image as ImageIcon,
  Link2,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Permission, PermissionType } from "@/types/permissions";

interface SidebarNavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions?: PermissionType[];
  children?: {
    title: string;
    href: string;
    icon?: string;
    permissions?: PermissionType[];
  }[];
}

const navItems: SidebarNavItem[] = [
  // {
  //   title: "数据用点分析",
  //   href: "/dashboard",
  //   icon: LayoutDashboard,
  //   permissions: [Permission.MANAGE_DATA],
  // },
  {
    title: "Banner管理",
    icon: ImageIcon,
    permissions: [Permission.MANAGE_BANNERS],
    children: [
      {
        title: "Banner信息列表",
        href: "/banners",
        permissions: [Permission.MANAGE_BANNERS],
      },
    ],
  },
  {
    title: "资讯管理",
    icon: Newspaper,
    permissions: [Permission.MANAGE_LATEST_NEWS],
    children: [
      {
        title: "最新资讯分类管理",
        href: "/latest-news/categories",
        permissions: [Permission.MANAGE_LATEST_NEWS],
      },
      {
        title: "最新资讯文章管理",
        href: "/latest-news/posts",
        permissions: [Permission.MANAGE_LATEST_NEWS],
      },
    ],
  },
  {
    title: "客户案例管理",
    icon: FileText,
    permissions: [Permission.MANAGE_CASE_STUDIES],
    children: [
      {
        title: "案例分类管理",
        href: "/case-studies/categories",
        permissions: [Permission.MANAGE_CASE_STUDIES],
      },
      {
        title: "客户案例文章管理",
        href: "/case-studies/posts",
        permissions: [Permission.MANAGE_CASE_STUDIES],
      },
    ],
  },
  // {
  //   title: "产品管理",
  //   icon: FileText,
  //   permissions: [Permission.MANAGE_DATA], // Assuming products are part of data management
  //   children: [
  //     {
  //       title: "产品分类管理",
  //       href: "/products/categories",
  //       permissions: [Permission.MANAGE_DATA],
  //     },
  //     {
  //       title: "产品文章管理",
  //       href: "/products/posts",
  //       permissions: [Permission.MANAGE_DATA],
  //     },
  //   ],
  // },
  {
    title: "企业荣誉管理",
    icon: Award,
    permissions: [Permission.MANAGE_CORPORATE_HONORS],
    children: [
      {
        title: "企业荣誉管理",
        href: "/corporate-honors",
        permissions: [Permission.MANAGE_CORPORATE_HONORS],
      },
    ],
  },
  {
    title: "客户管理",
    href: "/customers",
    icon: UserCheck,
    permissions: [Permission.MANAGE_DATA], // Assuming customers are part of data management
  },
  {
    title: "友情链接",
    href: "/friend-links",
    icon: Link2,
    permissions: [Permission.MANAGE_FRIENDLY_LINKS],
  },
  {
    title: "招聘管理",
    icon: Users,
    permissions: [Permission.MANAGE_RECRUITMENTS],
    children: [
      {
        title: "职位类型管理",
        href: "/recruitment/post-types",
        permissions: [Permission.MANAGE_RECRUITMENTS],
      },
      {
        title: "职位管理",
        href: "/recruitment/posts",
        permissions: [Permission.MANAGE_RECRUITMENTS],
      },
      {
        title: "投递记录",
        href: "/recruitment/applications",
        permissions: [Permission.MANAGE_RECRUITMENTS],
      },
    ],
  },
  {
    title: "用户管理",
    icon: Users,
    permissions: [Permission.MANAGE_USERS],
    children: [
      {
        title: "后台用户权限管理",
        href: "/users",
        permissions: [Permission.MANAGE_USERS],
      },
      // {
      //   title: "应聘投递用户列表",
      //   href: "/clients",
      // },
    ],
  },
  {
    title: "系统设置",
    icon: Settings,
    permissions: [Permission.MANAGE_SYSTEM_SETTINGS],
    children: [
      {
        title: "解决方案页面配置",
        href: "/settings/solutions",
        permissions: [Permission.MANAGE_SYSTEM_SETTINGS],
      },
      {
        title: "产品页面配置",
        href: "/settings/products",
        permissions: [Permission.MANAGE_SYSTEM_SETTINGS],
      },
      {
        title: "生涯教育产品配置",
        href: "/settings/career-education",
        permissions: [Permission.MANAGE_SYSTEM_SETTINGS],
      },
    ],
  },
  {
    title: "操作记录",
    icon: History,
    permissions: [Permission.MANAGE_OPERATION_LOGS],
    children: [
      {
        title: "后台用户操作记录",
        href: "/operation-logs",
        permissions: [Permission.MANAGE_OPERATION_LOGS],
      },
    ],
  },
];

interface AdminSidebarProps {
  className?: string;
}

// Sidebar content component
function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { hasPermission } = usePermissions();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  // Filter navigation items based on user permissions
  const getFilteredNavItems = () => {
    return navItems
      .filter((item) => {
        // If no permissions required, show the item
        if (!item.permissions || item.permissions.length === 0) {
          return true;
        }

        // Check if user has any of the required permissions
        const hasItemPermission = hasPermission(item.permissions);

        // If item has children, also check if user has access to any children
        if (item.children && !hasItemPermission) {
          const hasChildPermission = item.children.some((child) => {
            if (!child.permissions || child.permissions.length === 0) {
              return true;
            }
            return hasPermission(child.permissions);
          });
          return hasChildPermission;
        }

        return hasItemPermission;
      })
      .map((item) => {
        // Filter children based on permissions
        if (item.children) {
          const filteredChildren = item.children.filter((child) => {
            if (!child.permissions || child.permissions.length === 0) {
              return true;
            }
            return hasPermission(child.permissions);
          });

          return {
            ...item,
            children: filteredChildren,
          };
        }

        return item;
      });
  };

  const filteredNavItems = getFilteredNavItems();

  // Auto expand if current path matches any children
  const isItemExpanded = (item: SidebarNavItem) => {
    if (!item.children) { return false; }
    const isCurrentPathInChildren = item.children.some((child) => {
      // Check for exact match and sub-routes
      return pathname === child.href || pathname.startsWith(child.href + "/");
    });
    // Also check if current path matches parent href
    const matchesParent = item.href && pathname.startsWith(item.href);
    return (
      expandedItems.includes(item.title) ||
      isCurrentPathInChildren ||
      matchesParent
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 h-[68px]">
        {!collapsed && (
          <>
            <h2 className="text-lg font-semibold text-white flex-1 text-center flex items-center justify-center gap-2">
              <Image src="/logo.svg" alt="Logo" width={24} height={24} />
              管理面板
            </h2>
            <div className="w-5" /> {/* Spacer for centering */}
          </>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">A</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;

            // If item has children (submenu)
            if (item.children) {
              const isExpanded = isItemExpanded(item);
              const hasActiveChild = item.children.some(
                (child) =>
                  pathname === child.href ||
                  pathname.startsWith(child.href + "/")
              );
              // Check if parent href is active
              const isParentActive =
                item.href && pathname.startsWith(item.href);

              return (
                <div key={item.title}>
                  {/* Parent Item */}
                  <Button
                    variant={
                      hasActiveChild || isParentActive ? "secondary" : "ghost"
                    }
                    className={cn(
                      "w-full justify-start transition-colors text-gray-300 hover:text-white hover:bg-gray-800",
                      collapsed ? "px-2" : "px-3",
                      (hasActiveChild || isParentActive) &&
                      "bg-blue-900 text-blue-300 border border-blue-700"
                    )}
                    onClick={() => !collapsed && toggleExpanded(item.title)}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        collapsed ? "" : "mr-3"
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="truncate">{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform ml-auto",
                            isExpanded ? "rotate-180" : ""
                          )}
                        />
                      </>
                    )}
                  </Button>

                  {/* Children Items */}
                  {!collapsed && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => {
                        // Check for exact match and sub-routes
                        const isChildActive =
                          pathname === child.href ||
                          pathname.startsWith(child.href + "/");
                        return (
                          <Link key={child.href} href={child.href}>
                            <Button
                              variant={isChildActive ? "secondary" : "ghost"}
                              size="sm"
                              className={cn(
                                "w-full justify-start pl-6 text-gray-400 hover:text-white hover:bg-gray-800",
                                isChildActive && "bg-blue-900 text-blue-300"
                              )}
                            >
                              <span className="text-sm">{child.title}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular item without children
            const isActive =
              pathname === item.href || pathname.startsWith(item.href! + "/");
            return (
              <Link key={item.href} href={item.href!}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-colors text-gray-300 hover:text-white hover:bg-gray-800",
                    collapsed ? "px-2" : "px-3",
                    isActive &&
                    "bg-blue-900 text-blue-300 border border-blue-700"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      collapsed ? "" : "mr-3"
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="p-3 border-t border-gray-700 bg-gray-800">
        {!collapsed ? (
          <div className="space-y-3">
            {/* User Info */}

            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>退出登录</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Collapsed User Avatar */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <User className="h-4 w-4 text-white" />
            </div>

            {/* Collapsed Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, _setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-300 h-full",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        <SidebarContent collapsed={collapsed} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-gray-900">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

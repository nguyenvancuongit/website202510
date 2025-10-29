"use client";

import { Clock,Eye, FileText, Users } from "lucide-react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { DeviceStats } from "@/components/admin/device-stats";
import { LocationStats } from "@/components/admin/location-stats";
import { PopularPages } from "@/components/admin/popular-pages";
import { RecentActivity } from "@/components/admin/recent-activity";
import { StatsCard } from "@/components/admin/stats-card";
import { TrafficAnalytics } from "@/components/admin/traffic-analytics";
import { VisitAnalytics } from "@/components/admin/visit-analytics";
import { withPermission } from "@/components/auth/withPermission";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";
import { useAuthStore } from "@/store/auth-store";

const DashboardPage = () => {
  const { user } = useAuthStore();

  // Set breadcrumbs for dashboard (no additional breadcrumbs needed as it's the home page)
  useBreadcrumbEffect([]);

  return (
    <AdminPageLayout
      title="数据用点分析"
      subtitle={`欢迎回来，${user?.username || "管理员"}`}
      actions={
        <p className="text-sm text-gray-500">
          最后更新：{new Date().toLocaleString("zh-CN")}
        </p>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="总访问量"
          value="166,789"
          change="+18.2%"
          icon={Eye}
          trend="up"
        />
        <StatsCard
          title="独立访客"
          value="24,234"
          change="+4.7%"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="在线用户数"
          value="345,678"
          change="+8.2%"
          icon={FileText}
          trend="up"
        />
        <StatsCard
          title="平均会话时长"
          value="3:42"
          change="-2.1%"
          icon={Clock}
          trend="down"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <VisitAnalytics />
        <TrafficAnalytics />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="md:col-span-2 xl:col-span-1">
          <PopularPages />
        </div>
        <DeviceStats />
        <LocationStats />
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <RecentActivity />
      </div>
    </AdminPageLayout>
  );
};

export default withPermission(DashboardPage, {
  permissions: ["manage_data"],
  isShowAccessDeniedPage: true,
});

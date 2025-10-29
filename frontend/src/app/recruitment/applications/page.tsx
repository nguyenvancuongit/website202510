"use client";

import { useEffect,useRef } from "react";
import { Download } from "lucide-react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { ResumeApplicationsTable, ResumeApplicationsTableRef } from "@/components/admin/resume-applications/resume-applications-table";
import { Button } from "@/components/ui/button";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function ResumeApplicationsPage() {
  const tableRef = useRef<ResumeApplicationsTableRef>(null);
  const { setBreadcrumbs } = useBreadcrumbStore();

  // Set breadcrumbs for this page
  useEffect(() => {
    setBreadcrumbs([
      { label: "招聘管理", href: "/recruitment" },
      { label: "简历管理" },
    ]);
  }, [setBreadcrumbs]);

  const actions = (
    <Button onClick={() => tableRef.current?.handleExport()}>
      <Download className="h-4 w-4 mr-2" />
      导出记录
    </Button>
  );

  return (
    <AdminPageLayout
      title="简历管理"
      subtitle="管理求职者投递的简历，包括查看、下载和状态管理"
      actions={actions}
    >
      <ResumeApplicationsTable ref={tableRef} />
    </AdminPageLayout>
  );
}

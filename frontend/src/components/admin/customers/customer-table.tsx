"use client";

import { Edit } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  COOPERATION_REQUIREMENT,
  COOPERATION_TYPE,
  CUSTOMER_STATUS,
  SUBMIT_SOURCE,
} from "@/config/constants";
import { Customer } from "@/hooks/api/use-customers";
import { formatDateTimeWithTZ } from "@/lib/datetime-utils";
import { Column, SortConfig } from "@/types/data-table.types";

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  onViewDetail: (customer: Customer) => void;
  sortConfig?: SortConfig | null;
  onSort?: (config: SortConfig | null) => void;
}

export default function CustomerTable({
  customers,
  loading,
  onViewDetail,
  sortConfig,
  onSort,
}: CustomerTableProps) {
  const getStatusBadge = (status: number) => {
    const statusConfig =
      CUSTOMER_STATUS[status as keyof typeof CUSTOMER_STATUS];
    if (!statusConfig) {
      return <Badge variant="secondary">未知状态</Badge>;
    }
    return (
      <Badge variant="secondary" className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  const getCooperationTypeBadge = (cooperationType: number) => {
    const typeConfig =
      COOPERATION_TYPE[cooperationType as keyof typeof COOPERATION_TYPE];
    if (!typeConfig) {
      return <Badge variant="secondary">未知类型</Badge>;
    }
    return (
      <Badge variant="secondary" className={typeConfig.color}>
        {typeConfig.label}
      </Badge>
    );
  };

  const getCooperationRequirementBadge = (cooperationRequirement: number) => {
    const requirementConfig =
      COOPERATION_REQUIREMENT[
      cooperationRequirement as keyof typeof COOPERATION_REQUIREMENT
      ];
    if (!requirementConfig) {
      return <Badge variant="secondary">未知需求</Badge>;
    }
    return (
      <Badge variant="secondary" className={requirementConfig.color}>
        {requirementConfig.label}
      </Badge>
    );
  };

  const getSubmitSource = (submitSource: number) => {
    const sourceConfig =
      SUBMIT_SOURCE[submitSource as keyof typeof SUBMIT_SOURCE];
    if (!sourceConfig) {
      return <Badge variant="secondary">未知来源</Badge>;
    }
    return (
      <Badge variant="secondary" className={sourceConfig.color}>
        {sourceConfig.label}
      </Badge>
    );
  };

  const columns: Column<Customer>[] = [
    {
      id: "cooperation_types",
      header: "合作类型",
      accessorKey: "cooperation_types",
      cell: (_value, row) =>
        row.cooperation_types?.map((type) => getCooperationTypeBadge(type)),
      width: "160px",
    },
    {
      id: "region",
      header: "所在地区",
      accessorKey: "address",
      cell: (_value, row) => (
        <div className="text-sm text-gray-500">{row.address || "-"}</div>
      ),
    },
    {
      id: "unit_name",
      header: "单位名称",
      accessorKey: "company",
      cell: (_value, row) => (
        <div className="space-y-1">
          <div className="font-medium">{row.company || "-"}</div>
        </div>
      ),
    },
    {
      id: "title",
      header: "职务",
      accessorKey: "title",
      cell: (_value, row) => <div className="text-sm">{row.title || "-"}</div>,
      width: "140px",
    },
    {
      id: "contact_name",
      header: "联系人称呼",
      accessorKey: "name",
      cell: (_value, row) => <div className="text-sm">{row.name || "-"}</div>,
      width: "140px",
    },
    {
      id: "contact_number",
      header: "联系电话",
      accessorKey: "phone",
      cell: (_value, row) => <div className="text-sm">{row.phone || "-"}</div>,
      width: "140px",
    },
    {
      id: "email",
      header: "邮箱",
      accessorKey: "email",
      cell: (_value, row) => <div className="text-sm">{row.email || "-"}</div>,
      width: "140px",
    },
    {
      id: "needs",
      header: "合作需求",
      accessorKey: "cooperation_requirements",
      cell: (_value, row) => {
        const requirements = row.cooperation_requirements || [];
        const displayRequirements = requirements.slice(0, 3);
        const hasMore = requirements.length > 3;

        return (
          <div className="flex flex-wrap gap-1 items-center">
            {displayRequirements.map((requirement) =>
              getCooperationRequirementBadge(requirement)
            )}
            {hasMore && (
              <span className="text-sm text-gray-500 ml-1">...</span>
            )}
          </div>
        );
      },
    },
    {
      id: "remarks",
      header: "备注信息",
      accessorKey: "request_note",
      cell: (_value, row) => (
        <div
          className="text-sm max-w-[320px] truncate"
          title={row.request_note || ""}
        >
          {row.request_note || "-"}
        </div>
      ),
    },
    {
      id: "source",
      header: "提交来源",
      accessorKey: "submit_source",
      cell: (_value, row) => getSubmitSource(row.submit_source ?? 0),
      width: "120px",
    },
    {
      id: "status",
      header: "状态",
      accessorKey: "status",
      cell: (_value, row) => getStatusBadge(row.status ?? 0),
      sortable: true,
      width: "120px",
    },
    {
      id: "created_at",
      header: "提交时间",
      accessorKey: "created_at",
      cell: (_value, row) => (
        <div className="text-sm">
          {formatDateTimeWithTZ(row.created_at, "yyyy-MM-dd HH:mm")}
        </div>
      ),
      sortable: true,
      width: "170px",
    },
    {
      id: "actions",
      header: "操作",
      accessorKey: "id",
      cell: (_val, row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onViewDetail(row)}>
            <span className="sr-only">编辑</span>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
      width: "0px",
    },
  ];

  return (
    <DataTable
      data={customers}
      columns={columns}
      draggable={false}
      loading={loading}
      emptyMessage="暂无数据"
      sortConfig={sortConfig}
      onSort={onSort}
      serverSide={true}
    />
  );
}

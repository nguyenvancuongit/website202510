"use client"

import { useState } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  COOPERATION_REQUIREMENT,
  COOPERATION_TYPE,
  CUSTOMER_STATUS,
} from "@/config/constants"
import { Customer } from "@/hooks/api/use-customers"
import { formatDateWithFallback } from "@/lib/datetime-utils"

interface CustomerDetailModalProps {
  customer: Customer
  open: boolean
  onClose: () => void
  onUpdateStatus: (customerId: string, status: number) => void
}

const getDisplayValue = (value: string | null | undefined, fallback = "未提供") => {
  return value && value.trim() ? value : fallback
}

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
}

export default function CustomerDetailModal({
  customer,
  open,
  onClose,
  onUpdateStatus,
}: CustomerDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<number>(customer.status ?? 0)

  const statusConfig = CUSTOMER_STATUS[customer.status as keyof typeof CUSTOMER_STATUS]
  const cooperationConfig = COOPERATION_TYPE[customer.cooperation_types[0] as keyof typeof COOPERATION_TYPE]

  const formatDate = (dateString: string) => {
    return formatDateWithFallback(
      dateString,
      (date) => format(date, "yyyy年MM月dd日 HH:mm", { locale: zhCN }),
      "无效日期"
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            客户详情
            <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>
              {statusConfig?.label || "未知状态"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">客户姓名</Label>
              <p className="mt-1 text-sm text-gray-900">{getDisplayValue(customer.name, "未知姓名")}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">邮箱地址</Label>
              <p className="mt-1 text-sm text-gray-900">{getDisplayValue(customer.email, "未知邮箱")}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">联系电话</Label>
              <p className="mt-1 text-sm text-gray-900">{getDisplayValue(customer.phone)}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">公司名称</Label>
              <p className="mt-1 text-sm text-gray-900">{getDisplayValue(customer.company)}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">所在地区</Label>
              <p className="mt-1 text-sm text-gray-900">{getDisplayValue(customer.address)}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">职位头衔</Label>
              <p className="mt-1 text-sm text-gray-900">{getDisplayValue(customer.title)}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">合作类型</Label>
              <div className="mt-1">
                <Badge className={cooperationConfig?.color || "bg-gray-100 text-gray-800"}>
                  {cooperationConfig?.label || "未知类型"}
                </Badge>
              </div>
            </div>
          </div>

          {/* 合作需求 */}
          {customer.cooperation_requirements && customer.cooperation_requirements.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700">合作需求</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {customer.cooperation_requirements.map((requirement, index) => (
                  <div key={index}>
                    {getCooperationRequirementBadge(requirement)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 请求备注 */}
          {getDisplayValue(customer.request_note) !== "未提供" && (
            <div>
              <Label className="text-sm font-medium text-gray-700">请求备注</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {customer.request_note}
                </p>
              </div>
            </div>
          )}

          {/* 时间信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label className="text-sm font-medium text-gray-700">创建时间</Label>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(customer.created_at)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">更新时间</Label>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(customer.updated_at ?? customer.created_at)}
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">更改状态</Label>
              <Select value={String(selectedStatus)} onValueChange={(v) => setSelectedStatus(parseInt(v))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CUSTOMER_STATUS).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => onUpdateStatus(customer.id, selectedStatus)}>
                更新状态
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client";

import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MODULE_TYPE_LABELS,
  OPERATION_STATUS_CONFIG,
} from "@/config/constants";
import { OperationLog } from "@/hooks/api";

interface OperationLogDetailModalProps {
  log: OperationLog | null;
  open: boolean;
  onClose: () => void;
}

export function OperationLogDetailModal({
  log,
  open,
  onClose,
}: OperationLogDetailModalProps) {
  if (!log) return null;

  const getStatusBadge = (status: string) => {
    const config =
      OPERATION_STATUS_CONFIG[status as keyof typeof OPERATION_STATUS_CONFIG];
    if (!config) {
      return <span className="text-sm text-gray-600">{status}</span>;
    }

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return format(date, "yyyy-MM-dd HH:mm:ss", { locale: zhCN });
    } catch {
      return "-";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              操作日志详情
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                基本信息
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    操作内容
                  </label>
                  <p className="text-sm text-gray-900">
                    {log.operation_desc || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    系统模块
                  </label>
                  <p className="text-sm text-gray-900">
                    {MODULE_TYPE_LABELS[
                      log.module as keyof typeof MODULE_TYPE_LABELS
                    ] || log.module}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    操作结果
                  </label>
                  <div>{getStatusBadge(log.status)}</div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    操作时间
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(log.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                用户信息
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    用户名称
                  </label>
                  <p className="text-sm text-gray-900">
                    {log.user?.username || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    手机号
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {log.user?.phone || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    用户ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {log.user_id || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Request Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                请求信息
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    IP地址
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {log.ip_address || "-"}
                  </p>
                </div>

                {log.request_params && (
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      请求参数
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words font-mono">
                        {JSON.stringify(log.request_params, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

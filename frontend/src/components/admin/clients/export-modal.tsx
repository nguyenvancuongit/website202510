import { useState } from "react";

import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CLIENT_MANAGEMENT } from "@/config/constants";
import { ExportFilters } from "@/hooks/api/use-clients";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filters: ExportFilters) => void;
  isLoading?: boolean;
}

export function ExportModal({ isOpen, onClose, onExport, isLoading }: ExportModalProps) {
  const [filters, setFilters] = useState<ExportFilters>({});

  const handleExport = () => {
    onExport(filters);
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>导出客户数据</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label>状态筛选</Label>
            <Select 
              value={filters.status || "all"} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                status: value === "all" ? undefined : value as typeof CLIENT_MANAGEMENT.STATUS.PENDING | typeof CLIENT_MANAGEMENT.STATUS.ACTIVE | typeof CLIENT_MANAGEMENT.STATUS.DISABLED
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {CLIENT_MANAGEMENT.FILTER_STATUS_OPTIONS.slice(1).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>创建时间范围</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm text-gray-600">开始日期</Label>
                <Input
                  type="date"
                  value={filters.start_date || ""}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    start_date: e.target.value || undefined 
                  }))}
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">结束日期</Label>
                <Input
                  type="date"
                  value={filters.end_date || ""}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    end_date: e.target.value || undefined 
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            重置
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleExport} disabled={isLoading}>
              {isLoading ? "导出中..." : "导出CSV"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

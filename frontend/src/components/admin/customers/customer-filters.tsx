"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CUSTOMER_CONFIG } from "@/config/constants";
import { CustomerQuery } from "@/hooks/api/use-customers";
import { useDebounce } from "@/hooks/use-debounce";

interface CustomerFiltersProps {
  filters: CustomerQuery;
  onFilterChange: (filters: Partial<CustomerQuery>) => void;
  onReset: () => void;
  rightActions?: React.ReactNode;
}

export default function CustomerFilters({
  filters,
  onFilterChange,
  onReset,
  rightActions,
}: CustomerFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    cooperationType: filters.cooperation_type?.toString() || "all",
    region: "all",
    needs: "all",
    status: filters.status?.toString() || "all",
    cooperationRequirement:
      filters.cooperation_requirement?.toString() || "all",
    phone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setLocalFilters({
      cooperationType: "all",
      region: "all",
      needs: "all",
      status: "all",
      cooperationRequirement: "all",
      phone: "",
    });
    onReset();
  };

  // Debounce only phone to avoid excessive queries while typing
  const debouncedPhone = useDebounce(localFilters.phone, 400);

  useEffect(() => {
    onFilterChange({
      cooperation_type:
        localFilters.cooperationType && localFilters.cooperationType !== "all"
          ? parseInt(localFilters.cooperationType)
          : undefined,
      cooperation_requirement:
        localFilters.cooperationRequirement &&
          localFilters.cooperationRequirement !== "all"
          ? parseInt(localFilters.cooperationRequirement)
          : undefined,
      status:
        localFilters.status && localFilters.status !== "all"
          ? parseInt(localFilters.status)
          : undefined,
      search:
        [
          localFilters.region !== "all" ? localFilters.region : "",
          localFilters.needs !== "all" ? localFilters.needs : "",
          debouncedPhone,
        ]
          .filter((v) => v && (v as string).length > 0)
          .join(" ")
          .trim() || undefined,
    });
  }, [
    localFilters.cooperationType,
    localFilters.region,
    localFilters.needs,
    localFilters.status,
    localFilters.cooperationRequirement,
    debouncedPhone,
  ]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="cooperationType" className="whitespace-nowrap">
              合作类型：
            </Label>
            <Select
              value={localFilters.cooperationType}
              onValueChange={(value) =>
                handleInputChange("cooperationType", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择合作类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {CUSTOMER_CONFIG.COOPERATION_TYPE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label
              htmlFor="cooperationRequirement"
              className="whitespace-nowrap"
            >
              合作需求：
            </Label>
            <Select
              value={localFilters.cooperationRequirement}
              onValueChange={(value) =>
                handleInputChange("cooperationRequirement", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {CUSTOMER_CONFIG.COOPERATION_REQUIREMENT_OPTIONS?.map(
                  (option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="status" className="whitespace-nowrap">
              状态：
            </Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {CUSTOMER_CONFIG.CUSTOMER_STATUS_OPTIONS?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="phone" className="whitespace-nowrap">
              联系电话：
            </Label>
            <Input
              id="phone"
              placeholder="请输入联系电话"
              value={localFilters.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
        </div>
        {/* Right aligned actions (Reset button and Export) */}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            重置筛选
          </Button>
          {rightActions && rightActions}
        </div>
      </div>
    </div>
  );
}

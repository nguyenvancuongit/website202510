"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HASHTAG_CONFIG } from "@/config/constants"
import { HashtagQuery } from "@/services/api"

interface HashtagFiltersProps {
  filters: HashtagQuery
  onFilterChange: (filters: Partial<HashtagQuery>) => void
  onReset: () => void
}

export default function HashtagFilters({
  filters,
  onFilterChange,
  onReset,
}: HashtagFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || "",
    status: filters.status?.toString() || "all",
  })

  const handleInputChange = (field: string, value: string) => {
    const newFilters = { ...localFilters, [field]: value }
    setLocalFilters(newFilters)
  }

  const handleApplyFilters = () => {
    const appliedFilters: Partial<HashtagQuery> = {
      page: 1, // Reset to first page when applying filters
    }
    
    if (localFilters.search) {
      appliedFilters.search = localFilters.search
    } else {
      appliedFilters.search = undefined
    }
    
    if (localFilters.status !== "all") {
      appliedFilters.status = parseInt(localFilters.status)
    } else {
      appliedFilters.status = undefined
    }

    onFilterChange(appliedFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      search: "",
      status: "all",
    }
    setLocalFilters(resetFilters)
    onReset()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">搜索标签</Label>
            <Input
              id="search"
              placeholder="输入标签名称..."
              value={localFilters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {HASHTAG_CONFIG.HASHTAG_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            重置
          </Button>
          <Button onClick={handleApplyFilters}>
            应用筛选
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

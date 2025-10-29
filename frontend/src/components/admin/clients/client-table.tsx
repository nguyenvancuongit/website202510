"use client";

import { useState } from "react";
import { FileDown,Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CLIENT_MANAGEMENT } from "@/config/constants";
import { ClientsFilter, ExportFilters,useClients, useExportClients, useUpdateClientStatus } from "@/hooks/api/use-clients";

import { ExportModal } from "./export-modal";
import { StatusDropdown } from "./status-dropdown";

export function ClientTable() {
  const [filters, setFilters] = useState<ClientsFilter>({
    page_size: CLIENT_MANAGEMENT.PAGINATION.DEFAULT_PAGE_SIZE,
  });
  
  // Separate state for form inputs (not applied yet)
  const [filterInputs, setFilterInputs] = useState({
    phone_number: "",
    email: "",
    status: "all",
  });
  
  // Key to force re-render of Select component
  const [selectKey, setSelectKey] = useState(0);
  
  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const { data: clientsData, isLoading } = useClients(filters);
  const updateStatusMutation = useUpdateClientStatus();
  const exportMutation = useExportClients();

  const handleUpdateStatus = async (clientId: string, newStatus: typeof CLIENT_MANAGEMENT.STATUS.PENDING | typeof CLIENT_MANAGEMENT.STATUS.ACTIVE | typeof CLIENT_MANAGEMENT.STATUS.DISABLED) => {
    if (confirm("确定要更改此用户的状态吗？")) {
      try {
        await updateStatusMutation.mutateAsync({ 
          id: clientId, 
          data: { status: newStatus } 
        });
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleExport = (exportFilters: ExportFilters) => {
    exportMutation.mutate(exportFilters, {
      onSuccess: () => {
        setIsExportModalOpen(false);
      }
    });
  };

  const handleFilterChange = (key: keyof typeof filterInputs, value: any) => {
    setFilterInputs(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilter = () => {
    setFilters(prev => ({
      ...prev,
      // Map the UI fields to API fields
      phone_number: filterInputs.phone_number || undefined,
      email: filterInputs.email || undefined,
      status: filterInputs.status === "all" ? undefined : (filterInputs.status as typeof CLIENT_MANAGEMENT.STATUS.PENDING | typeof CLIENT_MANAGEMENT.STATUS.ACTIVE | typeof CLIENT_MANAGEMENT.STATUS.DISABLED),
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleResetFilter = () => {
    setFilterInputs({
      phone_number: "",
      email: "",
      status: "all",
    });
    setFilters({
      page_size: CLIENT_MANAGEMENT.PAGINATION.DEFAULT_PAGE_SIZE,
    });
    // Force re-render of Select component
    setSelectKey(prev => prev + 1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {return "-";}
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const generateClientId = (id: string, index: number) => {
    // Use actual ID if available, otherwise generate User000001 format
    return id ? id.toUpperCase() : `USER${String(index + 1).padStart(6, "0")}`;
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">应聘投递用户列表</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="手机号"
            value={filterInputs.phone_number}
            onChange={(e) => handleFilterChange("phone_number", e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="邮箱"
            value={filterInputs.email}
            onChange={(e) => handleFilterChange("email", e.target.value)}
            className="pl-10"
          />
        </div>
        <div>
          <Select 
            key={selectKey} 
            value={filterInputs.status} 
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              {CLIENT_MANAGEMENT.FILTER_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleApplyFilter} className="flex-1">
            搜索
          </Button>
          <Button onClick={handleResetFilter} variant="outline" className="flex-1">
            重置
          </Button>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsExportModalOpen(true)}
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <FileDown className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-center w-[100px]">
                用户ID
              </TableHead>
              <TableHead className="text-center w-[150px]">
                手机号
              </TableHead>
              <TableHead className="text-center w-[200px]">
                邮箱
              </TableHead>
              <TableHead className="text-center w-[120px]">
                状态
              </TableHead>
              <TableHead className="text-center w-[180px]">
                最近登录时间
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : !clientsData?.data?.length ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              clientsData.data.map((client, index) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell className="text-center">
                    {generateClientId(client.id, index)}
                  </TableCell>
                  <TableCell className="text-center">
                    {client.phone_number || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {client.email}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusDropdown
                      client={client}
                      onStatusChange={handleUpdateStatus}
                      disabled={updateStatusMutation.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(client.last_login_time)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination would go here if needed */}
      {clientsData?.pagination && clientsData.pagination.total_pages > 1 && (
        <div className="flex justify-center space-x-2">
          {/* Add pagination component here if needed */}
        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        isLoading={exportMutation.isPending}
      />
    </div>
  );
}

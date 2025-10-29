"use client";

import { useState } from "react";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import CustomerDetailModal from "@/components/admin/customers/customer-detail-modal";
import CustomerFilters from "@/components/admin/customers/customer-filters";
import CustomerTable from "@/components/admin/customers/customer-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Pagination from "@/components/ui/pagination";
import { CUSTOMER_CONFIG } from "@/config/constants";
import { Customer, customerApi, CustomerQuery, useCustomers, useUpdateCustomerStatus } from "@/hooks/api";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";

export default function CustomersPage() {

  // Set breadcrumbs for this page
  useBreadcrumbEffect([{ label: "客户请求管理" }]);

  const [filters, setFilters] = useState<CustomerQuery>({
    page: 1,
    limit: CUSTOMER_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // React Query hooks
  const {
    data: customersResponse,
    isLoading,
    error,
  } = useCustomers(filters);
  const updateCustomerStatusMutation = useUpdateCustomerStatus();

  // Extract data from React Query response
  const customers = customersResponse?.data || [];
  const pagination = customersResponse?.pagination || {
    page: 1,
    limit: CUSTOMER_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
    total_pages: 0,
  };

  const exportToCSV = async () => {
    customerApi.exportToCSV(filters);
  };

  const handleFilterChange = (newFilters: Partial<CustomerQuery>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({
      ...prev,
      limit: pageSize,
      page: 1, // Reset to first page when changing page size
    }));
  };

  const handleSort = (sortConfig: { key: string; direction: "asc" | "desc" } | null) => {
    if (sortConfig) {
      setFilters((prev) => ({
        ...prev,
        sort_by: sortConfig.key,
        sort_order: sortConfig.direction,
        page: 1, // Reset to first page when sorting changes
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        sort_by: "created_at",
        sort_order: "desc",
        page: 1,
      }));
    }
  };

  const handleStatusUpdate = (customerId: string, newStatus: number) => {
    // Validate status transition
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) {
      return;
    }

    updateCustomerStatusMutation.mutate(
      { id: customerId, status: newStatus },
      {
        onSuccess: () => {
          setIsDetailModalOpen(false);
          setSelectedCustomer(null);
        },
      }
    );
  };

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCustomer(null);
  };

  if (error)
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            加载失败，请刷新页面重试
          </div>
        </CardContent>
      </Card>
    );

  return (
    <AdminPageLayout title="咨询表单数据列表">
      <CustomerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() =>
          setFilters({
            page: 1,
            limit: CUSTOMER_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
            sort_by: "created_at",
            sort_order: "desc",
          })
        }
        rightActions={<Button onClick={exportToCSV}>导出</Button>}
      />

      <CustomerTable
        customers={customers}
        loading={isLoading}
        onViewDetail={handleViewDetail}
        sortConfig={filters.sort_by && filters.sort_order ? {
          key: filters.sort_by,
          direction: filters.sort_order
        } : null}
        onSort={handleSort}
      />

      {/* Pagination */}
      <Pagination
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        totalPages={pagination.total_pages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={CUSTOMER_CONFIG.PAGINATION.PAGE_SIZE_OPTIONS}
        loading={isLoading}
        itemsName="条客户请求"
      />

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </AdminPageLayout>
  );
}

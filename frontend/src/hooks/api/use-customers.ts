import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpClient } from "@/lib/http-client";
import { authenticatedFetch, downloadFile, getFilenameFromResponse } from "@/lib/utils";

// Types
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
    cooperation_types: number[];
    cooperation_requirements: number[];
    submit_source?: number;
    title?: string;
    request_note?: string;
    status: number;
    created_at: string;
    updated_at?: string;
}

export interface CustomerListResponse {
    data: Customer[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface CustomerQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
    cooperation_type?: number;
    cooperation_requirement?: number;
    start_date?: string;
    end_date?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
}

// Query Keys
export const customerKeys = {
    all: ["customers"] as const,
    lists: () => [...customerKeys.all, "list"] as const,
    list: (params: CustomerQuery) => [...customerKeys.lists(), params] as const,
    details: () => [...customerKeys.all, "detail"] as const,
    detail: (id: string) => [...customerKeys.details(), id] as const,
};

// API Functions
export const customerApi = {
    getList: async (params?: CustomerQuery): Promise<CustomerListResponse> => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
        }
        const queryString = searchParams.toString();
        const endpoint = queryString ? `/customers?${queryString}` : "/customers";
        return httpClient.get<CustomerListResponse>(endpoint);
    },

    getById: async (id: string): Promise<Customer> => {
        return httpClient.get<Customer>(`/customers/${id}`);
    },

    updateStatus: async (id: string, status: number): Promise<Customer> => {
        return httpClient.patch<Customer>(`/customers/${id}/status`, { status });
    },
    exportToCSV: async (params?: CustomerQuery) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && key !== "limit") {
                    searchParams.append(key, String(value));
                }
            });
        }
        const queryString = searchParams.toString();
        const endpoint = queryString ? `/customers/export/csv?${queryString}` : "/customers/export";
        const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
            method: "GET",
            headers: {
                Accept: "text/csv",
            },
        });
        if (!response.ok) {
            throw new Error(`Error exporting customers: ${response.statusText}`);
        }
        console.log("res.header: ", response.headers.values().toArray());

        const filename = getFilenameFromResponse(response) || `customers-${new Date().toISOString().split("T")[0]}.csv`;

        return downloadFile(await response.blob(), filename);
    }
};

// Hooks
export function useCustomers(params?: CustomerQuery) {
    return useQuery({
        queryKey: customerKeys.list(params || {}),
        queryFn: () => customerApi.getList(params),
        retry: (failureCount, error) => {
            // Don't retry on authentication errors
            if (error instanceof Error) {
                if (error.message.includes("401") || error.message.includes("403")) {
                    return false;
                }
            }
            return failureCount < 3;
        },
    });
}

export function useCustomer(id: string) {
    return useQuery({
        queryKey: customerKeys.detail(id),
        queryFn: () => customerApi.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useUpdateCustomerStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: number }) =>
            customerApi.updateStatus(id, status),
        onSuccess: (updatedCustomer, { id }) => {
            // Update the specific customer in the cache
            queryClient.setQueryData(customerKeys.detail(id), updatedCustomer);

            // Invalidate and refetch customer lists
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });

            toast.success("状态更新成功");
        },
        onError: (error) => {
            if (error instanceof Error) {
                if (error.message.includes("Cannot change status")) {
                    toast.error("不能更改已关闭或已取消的客户请求状态");
                } else if (error.message.includes("Invalid status transition")) {
                    toast.error("无效的状态转换");
                } else {
                    toast.error(error.message || "状态更新失败");
                }
            } else {
                toast.error("状态更新失败");
            }
        },
    });
}


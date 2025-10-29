import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { CLIENT_MANAGEMENT } from "@/config/constants";
import { httpClient } from "@/lib/http-client";

// Type definitions
type ClientStatus =
  | typeof CLIENT_MANAGEMENT.STATUS.PENDING
  | typeof CLIENT_MANAGEMENT.STATUS.ACTIVE
  | typeof CLIENT_MANAGEMENT.STATUS.DISABLED;
type SortBy =
  | "email"
  | "full_name"
  | "phone_number"
  | "created_at"
  | "updated_at"
  | "last_login_time";
type SortOrder = "asc" | "desc";

// Interface definitions
export interface Client {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
  last_login_time?: string;
  email_verification_code?: string;
  email_verification_expires?: string;
  password_hash?: string;
  success_count?: number;
}

export interface ClientsResponse {
  data: Client[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface ClientResponse {
  data: Client;
}

export interface UpdateClientStatusData {
  status: ClientStatus;
}

export interface UpdateClientStatusResponse {
  message: string;
  data: Client;
}

export interface ClientsFilter {
  page?: number;
  page_size?: number;
  email?: string;
  phone_number?: string;
  status?: ClientStatus;
  search?: string;
  sort_by?: SortBy;
  sort_order?: SortOrder;
}

export interface ExportFilters {
  status?: ClientStatus;
  start_date?: string;
  end_date?: string;
}

// Query Keys
export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (filters: ClientsFilter) => [...clientKeys.lists(), filters] as const,
  details: () => [...clientKeys.all, "detail"] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

// API Functions
const clientApi = {
  getList: async (filters: ClientsFilter = {}): Promise<ClientsResponse> => {
    const params = new URLSearchParams();

    if (filters.page) {params.append("page", filters.page.toString());}
    if (filters.page_size)
      {params.append("page_size", filters.page_size.toString());}
    if (filters.email) {params.append("email", filters.email);}
    if (filters.phone_number)
      {params.append("phone_number", filters.phone_number);}
    if (filters.status) {params.append("status", filters.status);}
    if (filters.search) {params.append("search", filters.search);}
    if (filters.sort_by) {params.append("sort_by", filters.sort_by);}
    if (filters.sort_order) {params.append("sort_order", filters.sort_order);}

    const queryString = params.toString();
    const endpoint = queryString ? `/clients?${queryString}` : "/clients";
    return httpClient.get<ClientsResponse>(endpoint);
  },

  getById: async (id: string): Promise<ClientResponse> => {
    return httpClient.get<ClientResponse>(`/clients/${id}`);
  },

  updateStatus: async (
    id: string,
    data: UpdateClientStatusData
  ): Promise<UpdateClientStatusResponse> => {
    return httpClient.patch<UpdateClientStatusResponse>(
      `/clients/${id}/status`,
      data
    );
  },

  exportToCsv: async (filters: ExportFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams();

    if (filters.status) {params.append("status", filters.status);}
    if (filters.start_date) {params.append("start_date", filters.start_date);}
    if (filters.end_date) {params.append("end_date", filters.end_date);}

    const queryString = params.toString();
    const endpoint = queryString
      ? `/clients/export?${queryString}`
      : "/clients/export";

    // Get token for authorization
    const getToken = (): string | null => {
      if (typeof window === "undefined") {return null;}
      try {
        const authStorage = localStorage.getItem("auth-storage");
        if (!authStorage) {return null;}
        const parsed = JSON.parse(authStorage);
        return parsed?.state?.token || null;
      } catch {
        return null;
      }
    };

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        const { useAuthStore } = await import("@/store/auth-store");
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = "/login";
      }
      throw new Error("Export failed");
    }

    return response.blob();
  },
};

// Custom Hooks
export function useClients(filters: ClientsFilter = {}) {
  return useQuery({
    queryKey: clientKeys.list(filters),
    queryFn: () => clientApi.getList(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientApi.getById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientStatusData }) =>
      clientApi.updateStatus(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success(data.message || "客户状态更新成功！");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "更新客户状态失败";
      toast.error(message);
    },
  });
}

export function useExportClients() {
  return useMutation({
    mutationFn: (filters: ExportFilters) => clientApi.exportToCsv(filters),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clients_export_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("客户数据导出成功！");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "导出失败";
      toast.error(message);
    },
  });
}

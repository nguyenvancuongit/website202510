import { useQuery } from "@tanstack/react-query";

import { httpClient } from "@/lib/http-client";

export interface OperationLog {
  id: number;
  user_id: number;
  operation_desc: string;
  module: string;
  operation_type: string;
  status: string;
  ip_address?: string;
  request_params?: Record<string, any>;
  user: {
    id: number;
    username: string;
    phone?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface GetOperationLogsParams {
  page?: number;
  limit?: number;
  username?: string;
  phone_number?: string;
  module?: string;
  operation_type?: string;
  status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface OperationLogsResponse {
  data: OperationLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

// Standalone function for getting operation logs
export const getOperationLogs = async (params: GetOperationLogsParams = {}): Promise<OperationLogsResponse> => {
  const searchParams = new URLSearchParams();

  // Add all non-empty params to search params
  Object.entries({
    page: params.page || 1,
    limit: params.limit || 20,
    username: params.username,
    phone_number: params.phone_number,
    module: params.module,
    operation_type: params.operation_type,
    status: params.status,
    sort_by: params.sort_by || "created_at",
    sort_order: params.sort_order || "desc",
  }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/operation-logs?${queryString}` : "/operation-logs";

  return httpClient.get<OperationLogsResponse>(endpoint);
};

export const useOperationLogs = (params: GetOperationLogsParams = {}) => {
  return useQuery({
    queryKey: ["operation-logs", params],
    queryFn: () => getOperationLogs(params),
  });
};

export const exportOperationLogs = async (params: Omit<GetOperationLogsParams, "page" | "limit">) => {
  const searchParams = new URLSearchParams();

  // Add all non-empty params to search params (excluding pagination)
  Object.entries({
    username: params.username,
    phone_number: params.phone_number,
    module: params.module,
    operation_type: params.operation_type,
    status: params.status,
    sort_by: params.sort_by || "created_at",
    sort_order: params.sort_order || "desc",
  }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/operation-logs/export?${queryString}` : "/operation-logs/export";

  // Get token from httpClient's pattern
  const getToken = (): string | null => {
    if (typeof window === "undefined") { return null; }
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) { return null; }
      const parsed = JSON.parse(authStorage);
      return parsed?.state?.token || null;
    } catch {
      return null;
    }
  };

  const token = getToken();
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  try {
    // Use same pattern as httpClient but for blob response
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `operation_logs_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, "")}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};

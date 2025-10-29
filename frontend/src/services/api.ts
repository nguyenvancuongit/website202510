// this file is a legacy file contains API service methods for authentication, uploads, system settings, hashtags, and operation logs.
// do not modify this file unless absolutely necessary.
// adding new API methods should be done in dedicated service files or hooks.

import { API_CONFIG } from "@/config/constants";
import { Permission } from "@/types/permissions";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: number;
    status: string;
    phone: string;
    permissions: Permission[];
  };
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  type: string;
  created_at: string;
  updated_at: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const token =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.token
        : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();

      if (error?.message) {
        throw new Error(error.message);
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<LoginResponse["user"]> {
    return this.request<LoginResponse["user"]>("/auth/profile");
  }

  // Upload API
  async uploadImage(
    file: File,
    token: string
  ): Promise<{ data: { url: string } }> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/uploads/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  }

  async uploadVideo(
    file: File,
    token: string
  ): Promise<{ data: { url: string; duration?: number } }> {
    const formData = new FormData();
    formData.append("video", file);

    const response = await fetch(`${API_BASE_URL}/uploads/videos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  }

  // System Settings API methods
  async toggleViewMore(
    categoryType: number,
    token: string
  ): Promise<{ data: SystemSetting }> {
    return this.request<{ data: SystemSetting }>(
      `/system-settings/view-more/${categoryType}/toggle`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async getViewMoreStatus(
    categoryType: number
  ): Promise<{ data: SystemSetting }> {
    return this.request<{ data: SystemSetting }>(
      `/system-settings/view-more/${categoryType}`
    );
  }


  // Hashtag methods
  async getHashtags(query?: HashtagQuery): Promise<HashtagListResponse> {
    const params = new URLSearchParams();

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = `/hashtags${params.toString() ? `?${params.toString()}` : ""}`;
    return this.request<HashtagListResponse>(url);
  }

  async getHashtagById(id: string): Promise<Hashtag> {
    return this.request<Hashtag>(`/hashtags/${id}`);
  }

  async createHashtag(
    data: Omit<Hashtag, "id" | "created_at" | "updated_at" | "usageCount">,
    token: string
  ): Promise<Hashtag> {
    return this.request<Hashtag>("/hashtags", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateHashtag(
    id: string,
    data: Partial<Hashtag>,
    token: string
  ): Promise<Hashtag> {
    return this.request<Hashtag>(`/hashtags/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateHashtagStatus(
    id: string,
    status: number,
    token: string
  ): Promise<Hashtag> {
    return this.request<Hashtag>(`/hashtags/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteHashtag(id: string, token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/hashtags/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();

// Specific API services
export const authAPI = {
  login: (credentials: LoginRequest) => apiService.login(credentials),
  getCurrentUser: () => apiService.getCurrentUser(),
};

export const uploadAPI = {
  uploadImage: (file: File, token: string) =>
    apiService.uploadImage(file, token),
  uploadVideo: (file: File, token: string) =>
    apiService.uploadVideo(file, token),
};

export const systemSettingsAPI = {
  toggleViewMore: (categoryType: number, token: string) =>
    apiService.toggleViewMore(categoryType, token),
  getViewMoreStatus: (categoryType: number) =>
    apiService.getViewMoreStatus(categoryType),
};

export const hashtagAPI = {
  getAll: (query?: HashtagQuery) => apiService.getHashtags(query),
  getById: (id: number) => apiService.getHashtagById(id.toString()),
  create: (
    data: Omit<Hashtag, "id" | "created_at" | "updated_at" | "usageCount">,
    token: string
  ) => apiService.createHashtag(data, token),
  update: (id: number, data: Partial<Hashtag>, token: string) =>
    apiService.updateHashtag(id.toString(), data, token),
  updateStatus: (id: number, status: number, token: string) =>
    apiService.updateHashtagStatus(id.toString(), status, token),
  delete: (id: number, token: string) =>
    apiService.deleteHashtag(id.toString(), token),
};

// Hashtag interfaces
export interface Hashtag {
  id: string;
  name: string;
  status: number;
  usageCount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface HashtagQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface HashtagListResponse {
  data: Hashtag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Operation Log interfaces (legacy - prefer use-operation-logs hook)
export interface OperationLog {
  id: string;
  userId: string;
  operationType: string;
  module: string;
  operationDesc: string;
  targetType: string;
  targetId?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone?: string;
  };
}

export interface OperationLogQuery {
  page?: number;
  limit?: number;
  userName?: string;
  phoneNumber?: string;
  module?: string;
  operationType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface OperationLogListResponse {
  data: OperationLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

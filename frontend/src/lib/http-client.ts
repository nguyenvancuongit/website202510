import { API_CONFIG } from "@/config/constants";

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

const getAuthStore = async () => {
  const { useAuthStore } = await import("@/store/auth-store");
  return useAuthStore;
};

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) {
        return null;
      }

      const parsed = JSON.parse(authStorage);
      return parsed?.state?.token || null;
    } catch {
      return null;
    }
  }

  private async handleUnauthorized(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const useAuthStore = await getAuthStore();
      const { logout } = useAuthStore.getState();

      // Logout user
      logout();

      // Redirect to login page
      window.location.href = "/login";
       
    } catch (_) {
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "An error occurred" };
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        await this.handleUnauthorized();
        const apiError: ApiError = {
          message: "Unauthorized - redirecting to login",
          status: response.status,
          data: errorData,
        };
        throw apiError;
      }

      const apiError: ApiError = {
        message: errorData?.message || `HTTP ${response.status}`,
        status: response.status,
        data: errorData,
      };

      throw apiError;
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  // Special method for file uploads
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      ...((options?.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      ...options,
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Upload failed" };
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        await this.handleUnauthorized();
        const apiError: ApiError = {
          message: "Unauthorized - redirecting to login",
          status: response.status,
          data: errorData,
        };
        throw apiError;
      }

      const apiError: ApiError = {
        message: errorData?.message || `HTTP ${response.status}`,
        status: response.status,
        data: errorData,
      };

      throw apiError;
    }

    return response.json();
  }
}

export const httpClient = new HttpClient(API_CONFIG.BASE_URL);

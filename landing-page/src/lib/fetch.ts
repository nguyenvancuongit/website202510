/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryFunctionContext } from "@tanstack/react-query";

// Types
export interface FetchJsonResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
}

type FetchParams = Parameters<typeof fetch>;

export type FetchInputType = FetchParams[0];
export type FetchOptionType = FetchParams[1];

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    // Server-side
    return process.env.API_URL || "http://localhost:3003";
  } else {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";
  }
};

const wrapperFetchJsonResponse = async <T>(
  response: Response
): Promise<FetchJsonResponse<T>> => {
  try {
    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "Unknown error occurred. Please try again."
      );
    }

    return {
      data: data,
      success: true,
      message: data?.message || "Request successful",
      status: response.status,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error occurred. Please try again."
    );
  }
};

export const fetchApi = async <T>(
  url: string,
  options?: FetchOptionType
): Promise<FetchJsonResponse<T>> => {
  let headers: HeadersInit = {};

  if (!(options?.body instanceof FormData)) {
    headers = {
      ...headers,
      "Content-Type": "application/json",
    };
  }

  // Serialize body if it's an object (except FormData)
  let body = options?.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    body,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  return await wrapperFetchJsonResponse<T>(response);
};

// API methods
export const api = {
  get<T>(
    url: string,
    options?: Omit<FetchOptionType, "method">
  ): Promise<FetchJsonResponse<T>> {
    return fetchApi<T>(url, { ...options, method: "GET" });
  },

  post<T>(
    url: string,
    body?: any,
    options?: Omit<FetchOptionType, "method" | "body">
  ): Promise<FetchJsonResponse<T>> {
    return fetchApi<T>(url, { ...options, method: "POST", body });
  },

  put<T>(
    url: string,
    body?: any,
    options?: Omit<FetchOptionType, "method" | "body">
  ): Promise<FetchJsonResponse<T>> {
    return fetchApi<T>(url, { ...options, method: "PUT", body });
  },

  patch<T>(
    url: string,
    body?: any,
    options?: Omit<FetchOptionType, "method" | "body">
  ): Promise<FetchJsonResponse<T>> {
    return fetchApi<T>(url, { ...options, method: "PATCH", body });
  },

  delete<T>(
    url: string,
    options?: Omit<FetchOptionType, "method">
  ): Promise<FetchJsonResponse<T>> {
    return fetchApi<T>(url, { ...options, method: "DELETE" });
  },
};

export const customFetcher = <T>(
  url: string,
  options?: Omit<FetchOptionType, "method">
) => {
  return (queryContext: QueryFunctionContext) => {
    return api.get<T>(url, {
      ...options,
      signal: queryContext.signal,
    });
  };
};

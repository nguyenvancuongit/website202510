import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Helper function to get token (same as httpClient)
const getToken = (): string | null => {
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
};

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export function getFilenameFromResponse(response: any): string | null {
  const contentDisposition =
    response.headers?.get?.("content-disposition") ||
    response.headers?.["content-disposition"] ||
    null;

  if (!contentDisposition) return null;

  const filenameRegex = /filename\*?=(?:UTF-8''|")?([^\";]+)/i;
  const match = contentDisposition.match(filenameRegex);

  if (!match || !match[1]) return null;

  let filename = match[1].trim();

  try {
    filename = decodeURIComponent(filename);
  } catch {
    // ignore decoding errors
  }

  return filename;
}
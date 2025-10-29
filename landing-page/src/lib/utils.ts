import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateISO(dateInput?: string | Date): string {
  try {
    const d = dateInput ? new Date(dateInput) : new Date();
    return format(d, "yyyy-MM-dd");
  } catch {
    return format(new Date(), "yyyy-MM-dd");
  }
}

export type ImageValue = string | { path?: string | null } | null | undefined;

export function getImageSrc(
  value: ImageValue,
  fallback: string = "/placeholder.svg"
): string {
  if (!value) {
    return fallback;
  }
  if (typeof value === "string") {
    return value;
  }
  const p = value.path;
  return typeof p === "string" && p.trim().length > 0 ? p : fallback;
}

export const chinesePhoneRegExp = /^(?:1[3-9]\d{9}|0\d{2,3}-?\d{7,8})$/;

export const tryCatch = async <T>(promise: Promise<T>): Promise<[T | null, Error | null]> => {
  try {
    const result = await promise;
    return [result, null] as const;
  } catch (error) {
    if (error instanceof Error) {
      return [null, error] as const;
    }
    return [null, new Error("Unknown error")] as const;
  }
};
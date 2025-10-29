/**
 * Datetime and timezone utility functions
 * These functions handle conversion between local time and UTC for API communication
 */

import { TZDate } from "@date-fns/tz"
import { format } from "date-fns"


/**
 * Format a date string for display with fallback
 * @param dateString - Date string to format
 * @param format - Format function (e.g., from date-fns)
 * @param fallback - Fallback text when date is invalid
 * @returns Formatted date string or fallback
 */
export const formatDateWithFallback = (
  dateString: string,
  formatFn: (date: Date) => string,
  fallback: string = "无效日期"
): string => {
  if (!dateString) { return fallback }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return fallback
    }
    return formatFn(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return fallback
  }
}

/**
 * Check if a date string is valid
 * @param dateString - Date string to validate
 * @returns True if valid, false otherwise
 */
export const isValidDateString = (dateString: string): boolean => {
  if (!dateString) { return false }

  try {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
}

export function formatDateTimeWithTZ(
  date: Date | string | number,
  formatStr: string = "yyyy-MM-dd HH:mm",
  timeZone: string = "Asia/Shanghai",
): string {
  // Convert to Date object
  const parsedDate = typeof date === "string" || typeof date === "number"
    ? new Date(date)
    : date;

  // Convert UTC date to target timezone
  const zonedDate = new TZDate(parsedDate, timeZone);

  // Format date in that timezone
  return format(zonedDate, formatStr);
}
/**
 * Extract error message from API response
 * @param error - Error object from API
 * @param defaultMessage - Default message if no specific message found
 * @returns Formatted error message string
 */
export function getErrorMessage(error: any, defaultMessage: string = "操作失败"): string {
  // Check if error has response data (axios error)
  const errorData = error?.response?.data || error?.data || error

  // Check if there's a message field
  if (errorData?.message) {
    const message = errorData.message

    // If message is an array, join them with line breaks
    if (Array.isArray(message)) {
      return message.join("\n")
    }

    // If message is a string, return it
    if (typeof message === "string") {
      return message
    }
  }

  // Check if there's an error field as fallback
  if (errorData?.error && typeof errorData.error === "string") {
    return errorData.error
  }

  // Handle fetch API errors where error might be in text format
  if (error instanceof Response) {
    return `HTTP ${error.status}: ${error.statusText}`
  }

  // If error is a string itself
  if (typeof error === "string") {
    return error
  }

  // If error has a message property directly
  if (error?.message && typeof error.message === "string") {
    return error.message
  }

  // Return default message as last resort
  return defaultMessage
}

/**
 * Display error message in toast
 * @param error - Error object from API
 * @param defaultMessage - Default message if no specific message found
 */
export function showErrorToast(error: any, defaultMessage: string = "操作失败") {
  const { toast } = require("sonner")
  const message = getErrorMessage(error, defaultMessage)
  toast.error(message)
}

import { Request } from 'express';

/**
 * Extract the real IP address from the request
 * Handles various proxy configurations
 */
export function getClientIp(req: Request): string {
  // Check for various proxy headers in order of preference
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const cfConnectingIp = req.headers['cf-connecting-ip']; // Cloudflare
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',');
    return ips[0].trim();
  }
  
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }
  
  if (cfConnectingIp) {
    return Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;
  }
  
  // Fall back to socket address
  return req.socket.remoteAddress || 'unknown';
}

/**
 * Sanitize request parameters to remove sensitive data
 */
export function sanitizeRequestParams(params: any): Record<string, any> {
  if (!params || typeof params !== 'object') {
    return {};
  }

  const sanitized = { ...params };
  const sensitiveKeys = [
    'password',
    'passwordHash',
    'password_hash',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'api_key',
    'authorization',
  ];

  // Remove sensitive fields
  for (const key of sensitiveKeys) {
    if (key in sanitized) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Get relevant request parameters for logging
 */
export function getRequestParams(req: Request): Record<string, any> {
  const params: Record<string, any> = {};

  // Include query parameters
  if (req.query && Object.keys(req.query).length > 0) {
    params.query = sanitizeRequestParams(req.query);
  }

  // Include body parameters (sanitized)
  if (req.body && Object.keys(req.body).length > 0) {
    params.body = sanitizeRequestParams(req.body);
  }

  // Include route parameters
  if (req.params && Object.keys(req.params).length > 0) {
    params.params = req.params;
  }

  // Include method and path
  params.method = req.method;
  params.path = req.path;

  return params;
}

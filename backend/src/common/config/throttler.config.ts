export const throttlerConfig = [
  {
    name: 'short',
    ttl: 1000, // 1 second
    limit: 20, // 20 requests per second
  },
  {
    name: 'medium',
    ttl: 10000, // 10 seconds
    limit: 100, // 100 requests per 10 seconds
  },
  {
    name: 'long',
    ttl: 60000, // 1 minute
    limit: 1000, // 1000 requests per minute
  },
];

export const publicApiThrottler = {
  ttl: 60000, // 1 minute
  limit: 1000, // 1000 requests per minute for public APIs
};

export const detailApiThrottler = {
  ttl: 60000, // 1 minute
  limit: 600, // 600 requests per minute for detail APIs
};

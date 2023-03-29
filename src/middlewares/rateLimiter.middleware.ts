import rateLimiter from 'express-rate-limiter';

const authLimiter = rateLimiter({
  windowsMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});

export default authLimiter;

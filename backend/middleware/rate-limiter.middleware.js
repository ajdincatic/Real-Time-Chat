import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Maximum number of requests allowed per 1 minute
  message: 'Too many requests, please try again later.',
});

export { limiter };

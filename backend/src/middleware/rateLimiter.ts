import { Request, Response, NextFunction } from 'express';

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

export const createRateLimiter = (options: RateLimitOptions) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.user?.walletAddress || req.ip || 'unknown';
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, { count: 1, resetTime: now + options.windowMs });
    } else {
      const requestData = requests.get(key)!;
      
      if (now > requestData.resetTime) {
        requestData.count = 1;
        requestData.resetTime = now + options.windowMs;
      } else {
        requestData.count++;
      }
      
      if (requestData.count > options.max) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: options.message,
          retryAfter: Math.ceil((requestData.resetTime - now) / 1000),
        });
      }
    }
    
    next();
  };
};
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include user (EXACTLY matching auth.ts)
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        walletAddress: string;
        role: string;
      };
    }
  }
}

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error occurred:', err);
  
  // Log error details
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    userAddress: req.user?.walletAddress,
    userRole: req.user?.role,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params
  };
  
  console.error('Error details:', JSON.stringify(errorDetails, null, 2));
  
  // Send error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
};

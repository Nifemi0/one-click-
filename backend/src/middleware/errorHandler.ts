// Error handler middleware for centralized error handling

import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Async handler wrapper to catch async errors
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error handler middleware
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', error);

  // Default error values
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const isOperational = error.isOperational !== false;

  // Log error details
  console.error({
    error: {
      message: error.message,
      stack: error.stack,
      statusCode,
      isOperational,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
    },
  });

  // Don't send error details in production
  if (process.env.NODE_ENV === 'production' && !isOperational) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Send error response
  res.status(statusCode).json({
    error: error.name || 'Error',
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error,
    }),
  });
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
};

// Validation error handler
export const validationErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: error.details || error.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  next(error);
};

// Database error handler
export const databaseErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error.code === '23505') { // Unique constraint violation
    res.status(409).json({
      error: 'Conflict',
      message: 'Resource already exists',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  if (error.code === '23503') { // Foreign key constraint violation
    res.status(400).json({
      error: 'Bad Request',
      message: 'Referenced resource does not exist',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  if (error.code === '42P01') { // Undefined table
    res.status(500).json({
      error: 'Database Error',
      message: 'Database schema error',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  next(error);
};

// JWT error handler
export const jwtErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid Token',
      message: 'Token is invalid',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token Expired',
      message: 'Token has expired',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  next(error);
};
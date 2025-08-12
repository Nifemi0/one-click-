// Error handler middleware for centralized error handling

import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message, code } = error;

  // Log error details
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
    code,
    stack: error.stack,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.walletAddress,
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'SyntaxError' && 'body' in error) {
    statusCode = 400;
    message = 'Invalid JSON format';
  }

  // Handle database errors
  if (error.code === '23505') { // Unique constraint violation
    statusCode = 409;
    message = 'Resource already exists';
  } else if (error.code === '23503') { // Foreign key constraint violation
    statusCode = 400;
    message = 'Referenced resource does not exist';
  } else if (error.code === '42P01') { // Undefined table
    statusCode = 500;
    message = 'Database configuration error';
  }

  // Handle network errors
  if (error.message?.includes('ECONNREFUSED')) {
    statusCode = 503;
    message = 'Service temporarily unavailable';
  } else if (error.message?.includes('ETIMEDOUT')) {
    statusCode = 504;
    message = 'Request timeout';
  }

  // Handle blockchain errors
  if (error.message?.includes('insufficient funds')) {
    statusCode = 400;
    message = 'Insufficient funds for transaction';
  } else if (error.message?.includes('nonce too low')) {
    statusCode = 400;
    message = 'Invalid transaction nonce';
  } else if (error.message?.includes('gas limit exceeded')) {
    statusCode = 400;
    message = 'Gas limit exceeded';
  }

  // Ensure message is a string
  if (typeof message !== 'string') {
    message = 'An unexpected error occurred';
  }

  // Don't leak internal error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  // Send error response
  res.status(statusCode).json({
    error: getErrorType(statusCode),
    message,
    code,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error.message,
    }),
  });
};

// Helper function to get error type based on status code
function getErrorType(statusCode: number): string {
  if (statusCode >= 500) return 'Internal Server Error';
  if (statusCode === 404) return 'Not Found';
  if (statusCode === 403) return 'Forbidden';
  if (statusCode === 401) return 'Unauthorized';
  if (statusCode === 400) return 'Bad Request';
  if (statusCode === 409) return 'Conflict';
  if (statusCode === 422) return 'Unprocessable Entity';
  if (statusCode === 429) return 'Too Many Requests';
  if (statusCode === 503) return 'Service Unavailable';
  if (statusCode === 504) return 'Gateway Timeout';
  
  return 'Error';
}

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    method: req.method,
  });
};

// Method not allowed handler
export const methodNotAllowedHandler = (req: Request, res: Response): void => {
  res.status(405).json({
    error: 'Method Not Allowed',
    message: `Method ${req.method} not allowed for ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
};

// Request timeout handler
export const timeoutHandler = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          error: 'Request Timeout',
          message: 'Request timed out',
          timestamp: new Date().toISOString(),
        });
      }
    }, timeoutMs);

    res.on('finish', () => {
      clearTimeout(timeout);
    });

    next();
  };
};

// Request size limit handler
export const requestSizeHandler = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSizeBytes = parseSize(maxSize);

    if (contentLength > maxSizeBytes) {
      res.status(413).json({
        error: 'Payload Too Large',
        message: `Request body exceeds maximum size of ${maxSize}`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};

// Helper function to parse size strings (e.g., "10mb" -> 10485760)
function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) return 1024 * 1024; // Default to 1MB

  const [, value, unit] = match;
  return Math.floor(parseFloat(value) * units[unit]);
}

// Validation error handler
export const validationErrorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map((err: any) => err.message);
    
    res.status(400).json({
      error: 'Validation Error',
      message: 'Validation failed',
      details: validationErrors,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next(error);
};

// Database connection error handler
export const databaseErrorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next(error);
};
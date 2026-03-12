import { Request, Response, NextFunction } from "express";

// Add accessibility headers to all responses
export const accessibilityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Add accessibility-related headers
  res.setHeader('Accessibility-Enabled', 'true');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
};

// Error handler with accessible error messages
export const accessibleErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    error: {
      message: err.message || 'An error occurred',
      code: err.code || 'INTERNAL_ERROR',
      accessible: true,
      suggestion: getAccessibleSuggestion(err)
    }
  });
};

function getAccessibleSuggestion(err: any): string {
  const suggestions: Record<string, string> = {
    'ValidationError': 'Please check the information you entered and try again.',
    'NotFoundError': 'The item you are looking for could not be found.',
    'UnauthorizedError': 'Please log in to access this feature.',
    'default': 'Please try again or contact support if the problem persists.'
  };
  
  return suggestions[err.name] || suggestions.default;
}
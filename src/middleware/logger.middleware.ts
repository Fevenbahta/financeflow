import { Request, Response, NextFunction } from "express";

// Simple console logger (since winston might not be installed)
export const logger = {
  info: (message: any) => console.log(`[INFO]`, message),
  warn: (message: any) => console.warn(`[WARN]`, message),
  error: (message: any) => console.error(`[ERROR]`, message),
  log: (level: string, message: any) => console.log(`[${level.toUpperCase()}]`, message)
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  logger.info({
    type: 'request',
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: (req as any).userId || 'anonymous',
    userAgent: req.get('user-agent')
  });

  // Log response after completion
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.log(res.statusCode >= 400 ? 'warn' : 'info', {
      type: 'response',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as any).userId || 'anonymous'
    });
  });

  next();
};

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    if (duration > 1000) {
      logger.warn({
        type: 'performance',
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        threshold: 'exceeded'
      });
    }
  });

  next();
};

// Monitoring endpoints setup
export const setupMonitoring = (app: any) => {
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  });

  app.get('/metrics', (req: Request, res: Response) => {
    res.json({
      requests: {
        total: 0,
        byEndpoint: {}
      },
      errors: {
        count: 0,
        byType: {}
      },
      performance: {
        averageResponseTime: '0ms',
        slowRequests: 0
      }
    });
  });
};
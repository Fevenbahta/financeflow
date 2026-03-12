"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMonitoring = exports.performanceMonitor = exports.requestLogger = exports.logger = void 0;
// Simple console logger (since winston might not be installed)
exports.logger = {
    info: (message) => console.log(`[INFO]`, message),
    warn: (message) => console.warn(`[WARN]`, message),
    error: (message) => console.error(`[ERROR]`, message),
    log: (level, message) => console.log(`[${level.toUpperCase()}]`, message)
};
// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Log request
    exports.logger.info({
        type: 'request',
        method: req.method,
        url: req.url,
        ip: req.ip,
        userId: req.userId || 'anonymous',
        userAgent: req.get('user-agent')
    });
    // Log response after completion
    res.on('finish', () => {
        const duration = Date.now() - start;
        exports.logger.log(res.statusCode >= 400 ? 'warn' : 'info', {
            type: 'response',
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.userId || 'anonymous'
        });
    });
    next();
};
exports.requestLogger = requestLogger;
// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000;
        if (duration > 1000) {
            exports.logger.warn({
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
exports.performanceMonitor = performanceMonitor;
// Monitoring endpoints setup
const setupMonitoring = (app) => {
    app.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    });
    app.get('/metrics', (req, res) => {
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
exports.setupMonitoring = setupMonitoring;

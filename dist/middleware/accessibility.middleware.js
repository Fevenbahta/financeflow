"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessibleErrorHandler = exports.accessibilityHeaders = void 0;
// Add accessibility headers to all responses
const accessibilityHeaders = (req, res, next) => {
    // Add accessibility-related headers
    res.setHeader('Accessibility-Enabled', 'true');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
};
exports.accessibilityHeaders = accessibilityHeaders;
// Error handler with accessible error messages
const accessibleErrorHandler = (err, req, res, next) => {
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
exports.accessibleErrorHandler = accessibleErrorHandler;
function getAccessibleSuggestion(err) {
    const suggestions = {
        'ValidationError': 'Please check the information you entered and try again.',
        'NotFoundError': 'The item you are looking for could not be found.',
        'UnauthorizedError': 'Please log in to access this feature.',
        'default': 'Please try again or contact support if the problem persists.'
    };
    return suggestions[err.name] || suggestions.default;
}

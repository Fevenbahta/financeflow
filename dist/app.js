"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const account_route_1 = __importDefault(require("./modules/account/account.route"));
const transaction_route_1 = __importDefault(require("./modules/transaction/transaction.route"));
const goal_route_1 = __importDefault(require("./modules/goal/goal.route"));
const budget_route_1 = __importDefault(require("./modules/budget/budget.route"));
const notification_route_1 = __importDefault(require("./modules/notification/notification.route"));
const ai_route_1 = __importDefault(require("./modules/ai/ai.route"));
const logger_middleware_1 = require("./middleware/logger.middleware");
const accessibility_middleware_1 = require("./middleware/accessibility.middleware");
const app = (0, express_1.default)();
// Apply middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(logger_middleware_1.requestLogger);
app.use(logger_middleware_1.performanceMonitor);
app.use(accessibility_middleware_1.accessibilityHeaders);
// Setup monitoring endpoints
(0, logger_middleware_1.setupMonitoring)(app);
// Routes
app.use("/api/ai", ai_route_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/accounts", account_route_1.default);
app.use("/api/transactions", transaction_route_1.default);
app.use("/api/goals", goal_route_1.default);
app.use("/api/budgets", budget_route_1.default);
app.use("/api/notifications", notification_route_1.default);
// Error handling (should be last)
app.use(accessibility_middleware_1.accessibleErrorHandler);
// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
exports.default = app;

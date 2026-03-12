import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.routes";
import accountRoutes from "./modules/account/account.route";
import transactionRoutes from "./modules/transaction/transaction.route";
import goalRoutes from "./modules/goal/goal.route";
import budgetRoutes from "./modules/budget/budget.route";
import notificationRoutes from "./modules/notification/notification.route";
import aiRoutes from "./modules/ai/ai.route";
import { requestLogger, performanceMonitor, setupMonitoring } from "./middleware/logger.middleware";
import { accessibilityHeaders, accessibleErrorHandler } from "./middleware/accessibility.middleware";

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(performanceMonitor);
app.use(accessibilityHeaders);

// Setup monitoring endpoints
setupMonitoring(app);

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handling (should be last)
app.use(accessibleErrorHandler);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
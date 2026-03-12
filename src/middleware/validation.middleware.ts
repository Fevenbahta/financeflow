import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

// User schemas
export const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email format"),
  monthlyIncome: z.number().nonnegative().optional()
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format")
});

// Account schema
export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100),
  type: z.enum(["checking", "savings", "credit", "investment", "cash"]),
  balance: z.number().default(0),
  currency: z.string().default("USD")
});

// Transaction schema
export const transactionSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  category: z.string().optional(),
  description: z.string().max(500, "Description too long").optional(),
  transactionDate: z.string().datetime().optional().transform(val => val ? new Date(val) : new Date())
});

// Goal schema
export const goalSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().nonnegative().optional().default(0),
  targetDate: z.string().datetime("Invalid date format").transform(val => new Date(val))
});

export const goalProgressSchema = z.object({
  amount: z.number().positive("Progress amount must be positive")
});

// Budget schema
export const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  percentage: z.number().min(0, "Percentage must be between 0 and 100").max(100),
  recommendedPercentage: z.number().min(0).max(100).optional(),
  aiAdjusted: z.boolean().optional().default(false)
});

export const purchaseCheckSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  category: z.string().optional()
});

// Notification schema
export const notificationSchema = z.object({
  message: z.string().min(1, "Message is required").max(500),
  email: z.string().email().optional(),
  type: z.string().optional()
});

// Validation middleware factory
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors?.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message
        })) || error.message
      });
    }
  };
};
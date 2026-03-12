// src/modules/budget/budget.validation.ts
import { z } from 'zod';

export const createBudgetSchema = z.object({
  body: z.object({
    category: z.string()
      .min(2, 'Category must be at least 2 characters')
      .max(50, 'Category cannot exceed 50 characters'),
    percentage: z.number()
      .min(0, 'Percentage cannot be negative')
      .max(100, 'Percentage cannot exceed 100'),
    recommendedPercentage: z.number()
      .min(0, 'Recommended percentage cannot be negative')
      .max(100, 'Recommended percentage cannot exceed 100')
      .nullable()
      .optional(),
    aiAdjusted: z.boolean().optional()
  })
});

export const updateBudgetSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid budget ID format')
  }),
  body: z.object({
    percentage: z.number()
      .min(0, 'Percentage cannot be negative')
      .max(100, 'Percentage cannot exceed 100')
  })
});

export const checkPurchaseSchema = z.object({
  body: z.object({
    amount: z.number()
      .positive('Amount must be positive')
      .min(0.01, 'Amount must be at least 0.01'),
    category: z.string().optional()
  })
});
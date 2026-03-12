// src/modules/goal/goal.validation.ts
import { z } from 'zod';

export const createGoalSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title cannot exceed 100 characters'),
    targetAmount: z.number()
      .positive('Target amount must be positive')
      .min(1, 'Target amount must be at least 1'),
    currentAmount: z.number()
      .min(0, 'Current amount cannot be negative')
      .optional(),
    targetDate: z.string()
      .datetime()
      .refine(date => new Date(date) > new Date(), {
        message: 'Target date must be in the future'
      })
  })
});

export const updateGoalSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid goal ID format')
  }),
  body: z.object({
    amount: z.number()
      .positive('Amount must be positive')
      .min(0.01, 'Amount must be at least 0.01')
  })
});

export const goalIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid goal ID format')
  })
});
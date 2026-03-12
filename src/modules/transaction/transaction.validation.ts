// src/modules/transaction/transaction.validation.ts
import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    accountId: z.string().min(1, 'Account ID is required'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['income', 'expense']),
    category: z.string().optional(),
    description: z.string().max(255, 'Description too long').optional(),
    transactionDate: z.string().datetime().optional()
  })
});

export const updateTransactionSchema = z.object({
  body: z.object({
    accountId: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().optional(),
    description: z.string().max(255).optional()
  }),
  params: z.object({
    id: z.string().min(1)
  })
});
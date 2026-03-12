// src/modules/user/user.validation.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string()
      .email('Invalid email format')
      .max(100, 'Email cannot exceed 100 characters'),
    monthlyIncome: z.number()
      .min(0, 'Monthly income cannot be negative')
      .max(1000000, 'Monthly income cannot exceed 1,000,000')
      .optional()
  })
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format')
  })
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format')
  })
});
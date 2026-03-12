"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPurchaseSchema = exports.updateBudgetSchema = exports.createBudgetSchema = void 0;
// src/modules/budget/budget.validation.ts
const zod_1 = require("zod");
exports.createBudgetSchema = zod_1.z.object({
    body: zod_1.z.object({
        category: zod_1.z.string()
            .min(2, 'Category must be at least 2 characters')
            .max(50, 'Category cannot exceed 50 characters'),
        percentage: zod_1.z.number()
            .min(0, 'Percentage cannot be negative')
            .max(100, 'Percentage cannot exceed 100'),
        recommendedPercentage: zod_1.z.number()
            .min(0, 'Recommended percentage cannot be negative')
            .max(100, 'Recommended percentage cannot exceed 100')
            .nullable()
            .optional(),
        aiAdjusted: zod_1.z.boolean().optional()
    })
});
exports.updateBudgetSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid budget ID format')
    }),
    body: zod_1.z.object({
        percentage: zod_1.z.number()
            .min(0, 'Percentage cannot be negative')
            .max(100, 'Percentage cannot exceed 100')
    })
});
exports.checkPurchaseSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number()
            .positive('Amount must be positive')
            .min(0.01, 'Amount must be at least 0.01'),
        category: zod_1.z.string().optional()
    })
});

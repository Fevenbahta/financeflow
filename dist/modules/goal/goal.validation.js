"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalIdSchema = exports.updateGoalSchema = exports.createGoalSchema = void 0;
// src/modules/goal/goal.validation.ts
const zod_1 = require("zod");
exports.createGoalSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string()
            .min(3, 'Title must be at least 3 characters')
            .max(100, 'Title cannot exceed 100 characters'),
        targetAmount: zod_1.z.number()
            .positive('Target amount must be positive')
            .min(1, 'Target amount must be at least 1'),
        currentAmount: zod_1.z.number()
            .min(0, 'Current amount cannot be negative')
            .optional(),
        targetDate: zod_1.z.string()
            .datetime()
            .refine(date => new Date(date) > new Date(), {
            message: 'Target date must be in the future'
        })
    })
});
exports.updateGoalSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid goal ID format')
    }),
    body: zod_1.z.object({
        amount: zod_1.z.number()
            .positive('Amount must be positive')
            .min(0.01, 'Amount must be at least 0.01')
    })
});
exports.goalIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid goal ID format')
    })
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
// src/modules/transaction/transaction.validation.ts
const zod_1 = require("zod");
exports.createTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        accountId: zod_1.z.string().min(1, 'Account ID is required'),
        amount: zod_1.z.number().positive('Amount must be positive'),
        type: zod_1.z.enum(['income', 'expense']),
        category: zod_1.z.string().optional(),
        description: zod_1.z.string().max(255, 'Description too long').optional(),
        transactionDate: zod_1.z.string().datetime().optional()
    })
});
exports.updateTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        accountId: zod_1.z.string().min(1).optional(),
        amount: zod_1.z.number().positive().optional(),
        type: zod_1.z.enum(['income', 'expense']).optional(),
        category: zod_1.z.string().optional(),
        description: zod_1.z.string().max(255).optional()
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1)
    })
});

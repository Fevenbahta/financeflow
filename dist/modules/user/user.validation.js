"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.loginUserSchema = exports.createUserSchema = void 0;
// src/modules/user/user.validation.ts
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string()
            .min(3, 'Username must be at least 3 characters')
            .max(30, 'Username cannot exceed 30 characters')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
        email: zod_1.z.string()
            .email('Invalid email format')
            .max(100, 'Email cannot exceed 100 characters'),
        monthlyIncome: zod_1.z.number()
            .min(0, 'Monthly income cannot be negative')
            .max(1000000, 'Monthly income cannot exceed 1,000,000')
            .optional()
    })
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format')
    })
});
exports.userIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user ID format')
    })
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.notificationSchema = exports.purchaseCheckSchema = exports.budgetSchema = exports.goalProgressSchema = exports.goalSchema = exports.transactionSchema = exports.accountSchema = exports.loginSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
// User schemas
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be at least 3 characters").max(50),
    email: zod_1.z.string().email("Invalid email format"),
    monthlyIncome: zod_1.z.number().nonnegative().optional()
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format")
});
// Account schema
exports.accountSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Account name is required").max(100),
    type: zod_1.z.enum(["checking", "savings", "credit", "investment", "cash"]),
    balance: zod_1.z.number().default(0),
    currency: zod_1.z.string().default("USD")
});
// Transaction schema
exports.transactionSchema = zod_1.z.object({
    accountId: zod_1.z.string().min(1, "Account ID is required"),
    amount: zod_1.z.number().positive("Amount must be positive"),
    type: zod_1.z.enum(["income", "expense"]),
    category: zod_1.z.string().optional(),
    description: zod_1.z.string().max(500, "Description too long").optional(),
    transactionDate: zod_1.z.string().datetime().optional().transform(val => val ? new Date(val) : new Date())
});
// Goal schema
exports.goalSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(100),
    targetAmount: zod_1.z.number().positive("Target amount must be positive"),
    currentAmount: zod_1.z.number().nonnegative().optional().default(0),
    targetDate: zod_1.z.string().datetime("Invalid date format").transform(val => new Date(val))
});
exports.goalProgressSchema = zod_1.z.object({
    amount: zod_1.z.number().positive("Progress amount must be positive")
});
// Budget schema
exports.budgetSchema = zod_1.z.object({
    category: zod_1.z.string().min(1, "Category is required"),
    percentage: zod_1.z.number().min(0, "Percentage must be between 0 and 100").max(100),
    recommendedPercentage: zod_1.z.number().min(0).max(100).optional(),
    aiAdjusted: zod_1.z.boolean().optional().default(false)
});
exports.purchaseCheckSchema = zod_1.z.object({
    amount: zod_1.z.number().positive("Amount must be positive"),
    category: zod_1.z.string().optional()
});
// Notification schema
exports.notificationSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, "Message is required").max(500),
    email: zod_1.z.string().email().optional(),
    type: zod_1.z.string().optional()
});
// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated;
            next();
        }
        catch (error) {
            res.status(400).json({
                message: "Validation failed",
                errors: error.errors?.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message
                })) || error.message
            });
        }
    };
};
exports.validate = validate;

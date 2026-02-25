"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudgetRepo = exports.updateBudgetRepo = exports.getBudgetsByUserRepo = exports.createBudgetRepo = void 0;
// src/modules/budget/budget.repository.ts
const prisma_1 = __importDefault(require("../../config/prisma"));
const date_fns_1 = require("date-fns");
const createBudgetRepo = async (data) => {
    const currentMonth = (0, date_fns_1.startOfMonth)(new Date());
    console.log("Creating budget with data:", {
        ...data,
        month: currentMonth
    });
    try {
        // First, ensure a MonthlyBudget exists for this user and month
        const monthlyBudget = await prisma_1.default.monthlyBudget.upsert({
            where: {
                userId_month: {
                    userId: data.userId,
                    month: currentMonth
                }
            },
            update: {}, // Don't update anything if it exists
            create: {
                userId: data.userId,
                month: currentMonth,
                totalIncome: 0,
                totalExpenses: 0,
                netSavings: 0
            }
        });
        console.log("Monthly budget ensured:", monthlyBudget);
        // Now create the budget allocation
        const budget = await prisma_1.default.budgetAllocation.create({
            data: {
                userId: data.userId,
                month: currentMonth,
                category: data.category,
                percentage: data.percentage,
                recommendedPercentage: data.recommendedPercentage ?? null,
                aiAdjusted: data.aiAdjusted ?? false,
            },
        });
        console.log("Budget created:", budget);
        return budget;
    }
    catch (error) {
        console.error("Error creating budget:", error);
        throw error;
    }
};
exports.createBudgetRepo = createBudgetRepo;
const getBudgetsByUserRepo = (userId) => prisma_1.default.budgetAllocation.findMany({ where: { userId } });
exports.getBudgetsByUserRepo = getBudgetsByUserRepo;
const updateBudgetRepo = (id, percentage) => prisma_1.default.budgetAllocation.update({
    where: { id },
    data: { percentage },
});
exports.updateBudgetRepo = updateBudgetRepo;
const deleteBudgetRepo = (id) => prisma_1.default.budgetAllocation.delete({ where: { id } });
exports.deleteBudgetRepo = deleteBudgetRepo;

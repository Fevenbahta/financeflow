"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoalByIdRepo = exports.deleteGoalRepo = exports.updateGoalProgressRepo = exports.getGoalsByUserRepo = exports.createGoalRepo = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * Create a new goal
 * @param data - goal data
 */
const createGoalRepo = (data) => {
    // Ensure targetDate is a JS Date object
    const targetDate = typeof data.targetDate === "string" ? new Date(data.targetDate) : data.targetDate;
    return prisma_1.default.goal.create({
        data: {
            userId: data.userId,
            title: data.title,
            targetAmount: data.targetAmount,
            currentAmount: data.currentAmount ?? 0, // default to 0 if missing
            targetDate,
        },
    });
};
exports.createGoalRepo = createGoalRepo;
/**
 * Get all goals for a specific user
 * @param userId - ID of the user
 */
const getGoalsByUserRepo = (userId) => prisma_1.default.goal.findMany({
    where: { userId },
    orderBy: { targetDate: "asc" }, // optional: sort by targetDate
});
exports.getGoalsByUserRepo = getGoalsByUserRepo;
/**
 * Increment the currentAmount of a goal
 * @param id - goal ID
 * @param amount - amount to add to currentAmount
 */
const updateGoalProgressRepo = (id, amount) => prisma_1.default.goal.update({
    where: { id },
    data: { currentAmount: { increment: amount } },
});
exports.updateGoalProgressRepo = updateGoalProgressRepo;
/**
 * Delete a goal by ID
 * @param id - goal ID
 */
const deleteGoalRepo = (id) => prisma_1.default.goal.delete({ where: { id } });
exports.deleteGoalRepo = deleteGoalRepo;
/**
 * Optionally: get a single goal by ID
 * @param id - goal ID
 */
const getGoalByIdRepo = (id) => prisma_1.default.goal.findUnique({ where: { id } });
exports.getGoalByIdRepo = getGoalByIdRepo;

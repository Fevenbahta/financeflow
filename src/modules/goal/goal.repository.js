"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoalByIdRepo = exports.deleteGoalRepo = exports.updateGoalProgressRepo = exports.getGoalsByUserRepo = exports.createGoalRepo = void 0;
var prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * Create a new goal
 * @param data - goal data
 */
var createGoalRepo = function (data) {
    var _a;
    // Ensure targetDate is a JS Date object
    var targetDate = typeof data.targetDate === "string" ? new Date(data.targetDate) : data.targetDate;
    return prisma_1.default.goal.create({
        data: {
            userId: data.userId,
            title: data.title,
            targetAmount: data.targetAmount,
            currentAmount: (_a = data.currentAmount) !== null && _a !== void 0 ? _a : 0, // default to 0 if missing
            targetDate: targetDate,
        },
    });
};
exports.createGoalRepo = createGoalRepo;
/**
 * Get all goals for a specific user
 * @param userId - ID of the user
 */
var getGoalsByUserRepo = function (userId) {
    return prisma_1.default.goal.findMany({
        where: { userId: userId },
        orderBy: { targetDate: "asc" }, // optional: sort by targetDate
    });
};
exports.getGoalsByUserRepo = getGoalsByUserRepo;
/**
 * Increment the currentAmount of a goal
 * @param id - goal ID
 * @param amount - amount to add to currentAmount
 */
var updateGoalProgressRepo = function (id, amount) {
    return prisma_1.default.goal.update({
        where: { id: id },
        data: { currentAmount: { increment: amount } },
    });
};
exports.updateGoalProgressRepo = updateGoalProgressRepo;
/**
 * Delete a goal by ID
 * @param id - goal ID
 */
var deleteGoalRepo = function (id) {
    return prisma_1.default.goal.delete({ where: { id: id } });
};
exports.deleteGoalRepo = deleteGoalRepo;
/**
 * Optionally: get a single goal by ID
 * @param id - goal ID
 */
var getGoalByIdRepo = function (id) {
    return prisma_1.default.goal.findUnique({ where: { id: id } });
};
exports.getGoalByIdRepo = getGoalByIdRepo;

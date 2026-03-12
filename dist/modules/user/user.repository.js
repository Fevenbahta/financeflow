"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
// src/modules/user/user.repository.ts
const prisma_1 = __importDefault(require("../../config/prisma"));
class UserRepository {
    async create(data) {
        return prisma_1.default.user.create({
            data: {
                username: data.username,
                email: data.email,
                monthlyIncome: data.monthlyIncome ?? 0,
            },
        });
    }
    async findById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
            include: {
                accounts: true,
                goals: true,
                transactions: {
                    orderBy: { transactionDate: 'desc' },
                    take: 50
                },
                budgets: true,
                notifications: {
                    where: { isRead: false },
                    orderBy: { createdAt: 'desc' }
                },
                aiInsights: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
            },
        });
    }
    async findByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: { email },
        });
    }
    async update(id, data) {
        return prisma_1.default.user.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.default.user.delete({
            where: { id },
        });
    }
}
exports.UserRepository = UserRepository;

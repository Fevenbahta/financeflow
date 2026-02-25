"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class UserRepository {
    // ✅ Create a user safely
    async create(data) {
        return prisma_1.default.user.create({
            data: {
                username: data.username, // required
                email: data.email, // required
                monthlyIncome: data.monthlyIncome ?? 0, // optional, defaults to 0
            },
        });
    }
    // ✅ Find by ID with accounts and goals included
    async findById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
            include: {
                accounts: true,
                goals: true,
                transactions: true, // optional: include more relations if needed
                budgets: true,
                notifications: true,
                aiInsights: true,
            },
        });
    }
    // ✅ Find by email
    async findByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: { email },
        });
    }
}
exports.UserRepository = UserRepository;

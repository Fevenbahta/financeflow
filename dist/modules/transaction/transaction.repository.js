"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class TransactionRepository {
    async create(data) {
        // Check if the user exists
        const user = await prisma_1.default.user.findUnique({ where: { id: data.userId } });
        if (!user)
            throw new Error("User not found");
        // Check if the account exists
        const account = await prisma_1.default.account.findUnique({ where: { id: data.accountId } });
        if (!account)
            throw new Error("Account not found");
        // Create the transaction
        return prisma_1.default.transaction.create({
            data: {
                userId: data.userId,
                accountId: data.accountId,
                amount: data.amount,
                type: data.type,
                category: data.category,
                description: data.description,
                transactionDate: data.transactionDate ?? new Date(),
            },
        });
    }
    async findByUser(userId) {
        return prisma_1.default.transaction.findMany({
            where: { userId },
        });
    }
    async delete(id) {
        return prisma_1.default.transaction.delete({
            where: { id },
        });
    }
    async update(id, data) {
        // Optionally, check if transaction exists first
        const transaction = await prisma_1.default.transaction.findUnique({ where: { id } });
        if (!transaction)
            throw new Error("Transaction not found");
        // If accountId is being updated, verify the account exists
        if (data.accountId) {
            const account = await prisma_1.default.account.findUnique({ where: { id: data.accountId } });
            if (!account)
                throw new Error("Account not found");
        }
        return prisma_1.default.transaction.update({
            where: { id },
            data,
        });
    }
}
exports.TransactionRepository = TransactionRepository;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const transaction_repository_1 = require("./transaction.repository");
class TransactionService {
    constructor() {
        this.repo = new transaction_repository_1.TransactionRepository();
    }
    async createTransaction(data) {
        const transaction = await this.repo.create(data);
        if (data.type === "income") {
            await prisma_1.default.account.update({
                where: { id: data.accountId },
                data: { balance: { increment: data.amount } }
            });
        }
        if (data.type === "expense") {
            await prisma_1.default.account.update({
                where: { id: data.accountId },
                data: { balance: { decrement: data.amount } }
            });
        }
        return transaction;
    }
    async getTransactions(userId) {
        return this.repo.findByUser(userId);
    }
    async deleteTransaction(id) {
        return this.repo.delete(id);
    }
    async updateTransaction(id, data) {
        return this.repo.update(id, data);
    }
}
exports.TransactionService = TransactionService;

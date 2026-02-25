"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class AccountRepository {
    async create(data) {
        return prisma_1.default.account.create({ data });
    }
    async findByUser(userId) {
        return prisma_1.default.account.findMany({
            where: { userId }
        });
    }
    async updateBalance(accountId, amount) {
        return prisma_1.default.account.update({
            where: { id: accountId },
            data: { balance: amount }
        });
    }
}
exports.AccountRepository = AccountRepository;

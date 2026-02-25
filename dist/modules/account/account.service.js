"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const account_repository_1 = require("./account.repository");
class AccountService {
    constructor() {
        this.repo = new account_repository_1.AccountRepository();
    }
    async createAccount(data) {
        return this.repo.create(data);
    }
    async getAccounts(userId) {
        return this.repo.findByUser(userId);
    }
}
exports.AccountService = AccountService;

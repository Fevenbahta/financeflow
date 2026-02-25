"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccounts = exports.createAccount = void 0;
const account_service_1 = require("./account.service");
const service = new account_service_1.AccountService();
const createAccount = async (req, res, next) => {
    try {
        const userId = req.userId; // from token
        const account = await service.createAccount({ ...req.body, userId });
        res.status(201).json(account);
    }
    catch (err) {
        next(err);
    }
};
exports.createAccount = createAccount;
const getAccounts = async (req, res, next) => {
    try {
        const userId = req.userId;
        const accounts = await service.getAccounts(userId);
        res.json(accounts);
    }
    catch (err) {
        next(err);
    }
};
exports.getAccounts = getAccounts;

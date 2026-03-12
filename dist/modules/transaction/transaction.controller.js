"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransaction = exports.deleteTransaction = exports.getTransactions = exports.createTransaction = void 0;
const transaction_service_1 = require("./transaction.service");
const service = new transaction_service_1.TransactionService();
const createTransaction = async (req, res) => {
    try {
        const userId = req.userId;
        // Manual validation for complex cases
        if (!req.body.accountId) {
            return res.status(400).json({ message: "Account ID is required" });
        }
        const transaction = await service.createTransaction({
            ...req.body,
            userId,
            transactionDate: req.body.transactionDate ? new Date(req.body.transactionDate) : new Date()
        });
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createTransaction = createTransaction;
const getTransactions = async (req, res) => {
    try {
        const userId = req.userId;
        const transactions = await service.getTransactions(userId);
        res.json(transactions);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getTransactions = getTransactions;
const deleteTransaction = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id)
            return res.status(400).json({ message: "Transaction ID is required" });
        await service.deleteTransaction(id);
        res.json({ message: "Deleted" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteTransaction = deleteTransaction;
const updateTransaction = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id)
            return res.status(400).json({ message: "Transaction ID is required" });
        const updatedTransaction = await service.updateTransaction(id, req.body);
        res.json(updatedTransaction);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateTransaction = updateTransaction;

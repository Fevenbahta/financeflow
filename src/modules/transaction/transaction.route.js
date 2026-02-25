"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var transaction_controller_1 = require("./transaction.controller");
var auth_middleware_1 = require("../../middleware/auth.middleware");
var router = (0, express_1.Router)();
// Create a new transaction
router.post("/", auth_middleware_1.authenticate, transaction_controller_1.createTransaction);
// Get all transactions for a user
// Example URL: /transactions/user/123
router.get("/user/:userId", auth_middleware_1.authenticate, transaction_controller_1.getTransactions);
// Delete a transaction by ID
// Example URL: /transactions/123
router.delete("/:id", auth_middleware_1.authenticate, transaction_controller_1.deleteTransaction);
// Update a transaction by ID
// Example URL: /transactions/123
router.put("/:id", auth_middleware_1.authenticate, transaction_controller_1.updateTransaction);
exports.default = router;

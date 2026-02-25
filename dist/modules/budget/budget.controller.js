"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBudget = exports.deleteBudget = exports.checkPurchase = exports.analyze = exports.getBudgets = exports.createBudget = void 0;
const service = __importStar(require("./budget.service"));
const budget_ai_service_1 = require("../ai/budget-ai.service");
const aiService = new budget_ai_service_1.BudgetAIService();
const createBudget = async (req, res, next) => {
    try {
        const userId = req.userId;
        const budget = await service.createBudget({ ...req.body, userId });
        res.status(201).json(budget);
    }
    catch (err) {
        next(err);
    }
};
exports.createBudget = createBudget;
const getBudgets = async (req, res, next) => {
    try {
        const userId = req.userId;
        const budgets = await service.getBudgets(userId);
        res.json(budgets);
    }
    catch (err) {
        next(err);
    }
};
exports.getBudgets = getBudgets;
const analyze = async (req, res, next) => {
    try {
        const userId = req.userId;
        const analysis = await aiService.analyzeMonthlyBudget(userId, new Date());
        res.json(analysis);
    }
    catch (err) {
        next(err);
    }
};
exports.analyze = analyze;
const checkPurchase = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { amount, category } = req.body; // ← Include category
        console.log('Purchase check:', { userId, amount, category });
        const advice = await aiService.canAffordPurchase(userId, amount, category); // ← Pass category to service
        res.json(advice);
    }
    catch (err) {
        console.error('Purchase check error:', err);
        next(err);
    }
};
exports.checkPurchase = checkPurchase;
const deleteBudget = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id)
            return res.status(400).json({ message: "Budget ID is required" });
        await service.deleteBudget(id);
        res.json({ message: "Deleted" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteBudget = deleteBudget;
const updateBudget = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id)
            return res.status(400).json({ message: "Budget ID is required" });
        // Extract the percentage from the request body
        const { percentage } = req.body;
        if (percentage === undefined) {
            return res.status(400).json({ message: "Percentage is required" });
        }
        // Pass just the percentage value, not the whole body
        const updatedBudget = await service.updateBudget(id, percentage);
        res.json(updatedBudget);
    }
    catch (error) {
        console.error("Error updating budget:", error);
        res.status(400).json({ message: error.message });
    }
};
exports.updateBudget = updateBudget;

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
exports.deleteGoal = exports.updateGoal = exports.getGoals = exports.createGoal = void 0;
const service = __importStar(require("./goal.service"));
const createGoal = async (req, res, next) => {
    try {
        const userId = req.userId;
        const goal = await service.createGoal({ ...req.body, userId });
        res.status(201).json(goal);
    }
    catch (err) {
        next(err);
    }
};
exports.createGoal = createGoal;
const getGoals = async (req, res, next) => {
    try {
        const userId = req.userId;
        const goals = await service.getGoalsByUser(userId);
        res.json(goals);
    }
    catch (err) {
        next(err);
    }
};
exports.getGoals = getGoals;
const updateGoal = async (req, res, next) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id)
            return res.status(400).json({ message: "Goal ID is required" });
        const amount = Number(req.body.amount);
        if (isNaN(amount))
            return res.status(400).json({ message: "Amount must be a number" });
        const updated = await service.updateGoalProgress(id, amount);
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
};
exports.updateGoal = updateGoal;
const deleteGoal = async (req, res, next) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id)
            return res.status(400).json({ message: "Goal ID is required" });
        await service.deleteGoal(id);
        res.json({ message: "Goal deleted" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteGoal = deleteGoal;

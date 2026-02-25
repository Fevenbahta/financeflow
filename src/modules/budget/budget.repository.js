"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudgetRepo = exports.updateBudgetRepo = exports.getBudgetsByUserRepo = exports.createBudgetRepo = void 0;
// src/modules/budget/budget.repository.ts
var prisma_1 = __importDefault(require("../../config/prisma"));
var date_fns_1 = require("date-fns");
var createBudgetRepo = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var currentMonth, monthlyBudget, budget, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                currentMonth = (0, date_fns_1.startOfMonth)(new Date());
                console.log("Creating budget with data:", __assign(__assign({}, data), { month: currentMonth }));
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_1.default.monthlyBudget.upsert({
                        where: {
                            userId_month: {
                                userId: data.userId,
                                month: currentMonth
                            }
                        },
                        update: {}, // Don't update anything if it exists
                        create: {
                            userId: data.userId,
                            month: currentMonth,
                            totalIncome: 0,
                            totalExpenses: 0,
                            netSavings: 0
                        }
                    })];
            case 2:
                monthlyBudget = _c.sent();
                console.log("Monthly budget ensured:", monthlyBudget);
                return [4 /*yield*/, prisma_1.default.budgetAllocation.create({
                        data: {
                            userId: data.userId,
                            month: currentMonth,
                            category: data.category,
                            percentage: data.percentage,
                            recommendedPercentage: (_a = data.recommendedPercentage) !== null && _a !== void 0 ? _a : null,
                            aiAdjusted: (_b = data.aiAdjusted) !== null && _b !== void 0 ? _b : false,
                        },
                    })];
            case 3:
                budget = _c.sent();
                console.log("Budget created:", budget);
                return [2 /*return*/, budget];
            case 4:
                error_1 = _c.sent();
                console.error("Error creating budget:", error_1);
                throw error_1;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createBudgetRepo = createBudgetRepo;
var getBudgetsByUserRepo = function (userId) {
    return prisma_1.default.budgetAllocation.findMany({ where: { userId: userId } });
};
exports.getBudgetsByUserRepo = getBudgetsByUserRepo;
var updateBudgetRepo = function (id, percentage) {
    return prisma_1.default.budgetAllocation.update({
        where: { id: id },
        data: { percentage: percentage },
    });
};
exports.updateBudgetRepo = updateBudgetRepo;
var deleteBudgetRepo = function (id) {
    return prisma_1.default.budgetAllocation.delete({ where: { id: id } });
};
exports.deleteBudgetRepo = deleteBudgetRepo;

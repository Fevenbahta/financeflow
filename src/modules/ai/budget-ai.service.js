"use strict";
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
exports.BudgetAIService = void 0;
// src/modules/ai/budget-ai-simplified.service.ts
var prisma_1 = __importDefault(require("../../config/prisma"));
var date_fns_1 = require("date-fns");
var BudgetAIService = /** @class */ (function () {
    function BudgetAIService() {
    }
    BudgetAIService.prototype.analyzeMonthlyBudget = function (userId, month) {
        return __awaiter(this, void 0, void 0, function () {
            var monthStart, monthEnd, transactions, threeMonthsAgo, historicalTransactions, totalIncome, expensesByCategory, totalExpenses, savings, historicalAverages, recommendations, insights, disposableIncome, savingsOpportunities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        monthStart = (0, date_fns_1.startOfMonth)(month);
                        monthEnd = (0, date_fns_1.endOfMonth)(month);
                        return [4 /*yield*/, prisma_1.default.transaction.findMany({
                                where: {
                                    userId: userId,
                                    transactionDate: {
                                        gte: monthStart,
                                        lte: monthEnd
                                    }
                                }
                            })];
                    case 1:
                        transactions = _a.sent();
                        threeMonthsAgo = (0, date_fns_1.subMonths)(monthStart, 3);
                        return [4 /*yield*/, prisma_1.default.transaction.findMany({
                                where: {
                                    userId: userId,
                                    transactionDate: {
                                        gte: threeMonthsAgo,
                                        lt: monthStart
                                    }
                                }
                            })];
                    case 2:
                        historicalTransactions = _a.sent();
                        totalIncome = transactions
                            .filter(function (t) { return t.type === 'income'; })
                            .reduce(function (sum, t) { return sum + t.amount; }, 0);
                        expensesByCategory = transactions
                            .filter(function (t) { return t.type === 'expense'; })
                            .reduce(function (acc, t) {
                            var cat = t.category || 'Other';
                            acc[cat] = (acc[cat] || 0) + t.amount;
                            return acc;
                        }, {});
                        totalExpenses = Object.values(expensesByCategory).reduce(function (a, b) { return a + b; }, 0);
                        savings = totalIncome - totalExpenses;
                        historicalAverages = this.calculateHistoricalAverages(historicalTransactions);
                        recommendations = this.generateRecommendations(totalIncome, expensesByCategory, historicalAverages);
                        insights = this.generateInsights(totalIncome, expensesByCategory, savings, historicalAverages);
                        disposableIncome = this.calculateDisposableIncome(expensesByCategory, totalIncome);
                        savingsOpportunities = this.findSavingsOpportunities(expensesByCategory, historicalAverages);
                        // Store insights in AIInsight table (which exists in your schema)
                        return [4 /*yield*/, this.storeInsights(userId, insights)];
                    case 3:
                        // Store insights in AIInsight table (which exists in your schema)
                        _a.sent();
                        return [2 /*return*/, {
                                recommendations: recommendations,
                                insights: insights,
                                disposableIncome: disposableIncome,
                                savingsOpportunities: savingsOpportunities,
                                summary: {
                                    totalIncome: totalIncome,
                                    totalExpenses: totalExpenses,
                                    savings: savings,
                                    savingsRate: totalIncome > 0 ? (savings / totalIncome) * 100 : 0
                                }
                            }];
                }
            });
        });
    };
    BudgetAIService.prototype.generateRecommendations = function (monthlyIncome, currentExpenses, historicalAverages) {
        var recommendations = [];
        var categoryGuidelines = {
            'Rent': { min: 25, max: 35, essential: true },
            'Grocery': { min: 10, max: 15, essential: true },
            'Transport': { min: 5, max: 10, essential: true },
            'Utilities': { min: 5, max: 10, essential: true },
            'Savings': { min: 15, max: 25, essential: false },
            'Investment': { min: 10, max: 20, essential: false },
            'Dining': { min: 5, max: 10, essential: false },
            'Entertainment': { min: 5, max: 10, essential: false },
        };
        for (var _i = 0, _a = Object.entries(currentExpenses); _i < _a.length; _i++) {
            var _b = _a[_i], category = _b[0], spent = _b[1];
            if (monthlyIncome === 0)
                continue;
            var spentPercentage = (spent / monthlyIncome) * 100;
            var guideline = categoryGuidelines[category];
            if (guideline) {
                if (spentPercentage > guideline.max) {
                    var suggestedAmount = (monthlyIncome * guideline.max) / 100;
                    recommendations.push({
                        category: category,
                        recommendedPercentage: guideline.max,
                        currentPercentage: spentPercentage,
                        suggestedAmount: suggestedAmount,
                        reasoning: "You're spending ".concat((spentPercentage - guideline.max).toFixed(1), "% above the recommended ").concat(guideline.max, "% on ").concat(category, "."),
                        priority: guideline.essential ? "HIGH" : "MEDIUM"
                    });
                }
            }
            // Compare with historical average
            var historicalAvg = historicalAverages[category] || 0;
            if (historicalAvg > 0) {
                var change = ((spent - historicalAvg) / historicalAvg) * 100;
                if (Math.abs(change) > 20) {
                    recommendations.push({
                        category: category,
                        recommendedPercentage: (historicalAvg / monthlyIncome) * 100,
                        currentPercentage: spentPercentage,
                        suggestedAmount: historicalAvg,
                        reasoning: "Your ".concat(category, " spending ").concat(change > 0 ? 'increased' : 'decreased', " by ").concat(Math.abs(change).toFixed(0), "% compared to your average."),
                        priority: change > 0 ? "MEDIUM" : "LOW"
                    });
                }
            }
        }
        // Add savings recommendation if none exists
        if (!currentExpenses['Savings'] && monthlyIncome > 0) {
            recommendations.push({
                category: 'Savings',
                recommendedPercentage: 20,
                currentPercentage: 0,
                suggestedAmount: monthlyIncome * 0.2,
                reasoning: "You haven't allocated any savings. Aim to save at least 20% of your income.",
                priority: "HIGH"
            });
        }
        return recommendations;
    };
    BudgetAIService.prototype.generateInsights = function (income, expenses, savings, historicalAverages) {
        var insights = [];
        if (income === 0) {
            insights.push({
                type: "SUGGESTION",
                title: "No Income Recorded",
                description: "Add your income transactions to get personalized budget insights.",
            });
            return insights;
        }
        var savingsRate = (savings / income) * 100;
        if (savingsRate < 10) {
            insights.push({
                type: "WARNING",
                title: "Low Savings Rate",
                description: "You're only saving ".concat(savingsRate.toFixed(1), "% of your income. Aim for at least 20%."),
                impact: income * 0.2 - savings,
                action: {
                    type: "INCREASE_SAVINGS",
                    description: "Try to save an extra $".concat((income * 0.2 - savings).toFixed(0), " this month"),
                    potentialSavings: income * 0.2 - savings
                }
            });
        }
        var disposableIncome = this.calculateDisposableIncome(expenses, income);
        if (disposableIncome > 100) {
            var treatAmount = Math.min(disposableIncome * 0.2, 2000);
            insights.push({
                type: "SUGGESTION",
                title: "You Deserve a Treat! 🎁",
                description: "You have $".concat(disposableIncome.toFixed(0), " in disposable income. Consider treating yourself up to $").concat(treatAmount.toFixed(0), "!"),
                impact: treatAmount,
                action: {
                    type: "TREAT_YOURSELF",
                    description: "You can afford that $".concat(treatAmount.toFixed(0), " purchase!"),
                    potentialSavings: treatAmount
                }
            });
        }
        return insights;
    };
    BudgetAIService.prototype.calculateDisposableIncome = function (expenses, income) {
        var essentialCategories = ['Rent', 'Grocery', 'Transport', 'Utilities', 'Insurance'];
        var essentialExpenses = Object.entries(expenses)
            .filter(function (_a) {
            var cat = _a[0];
            return essentialCategories.includes(cat);
        })
            .reduce(function (sum, _a) {
            var amount = _a[1];
            return sum + amount;
        }, 0);
        return Math.max(0, income - essentialExpenses);
    };
    BudgetAIService.prototype.findSavingsOpportunities = function (expenses, historicalAverages) {
        var total = 0;
        for (var _i = 0, _a = Object.entries(expenses); _i < _a.length; _i++) {
            var _b = _a[_i], category = _b[0], amount = _b[1];
            var historicalAvg = historicalAverages[category] || amount;
            if (amount > historicalAvg * 1.2) {
                total += amount - historicalAvg;
            }
        }
        return total;
    };
    BudgetAIService.prototype.calculateHistoricalAverages = function (transactions) {
        var categoryTotals = {};
        transactions.forEach(function (t) {
            if (t.type !== 'expense')
                return;
            var category = t.category || 'Other';
            if (!categoryTotals[category]) {
                categoryTotals[category] = { sum: 0, count: 0 };
            }
            categoryTotals[category].sum += t.amount;
            categoryTotals[category].count += 1;
        });
        return Object.entries(categoryTotals).reduce(function (acc, _a) {
            var cat = _a[0], _b = _a[1], sum = _b.sum, count = _b.count;
            acc[cat] = count > 0 ? sum / count : 0;
            return acc;
        }, {});
    };
    BudgetAIService.prototype.storeInsights = function (userId, insights) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, insights_1, insight;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, insights_1 = insights;
                        _a.label = 1;
                    case 1:
                        if (!(_i < insights_1.length)) return [3 /*break*/, 4];
                        insight = insights_1[_i];
                        return [4 /*yield*/, prisma_1.default.aIInsight.create({
                                data: {
                                    userId: userId,
                                    insightText: "".concat(insight.title, ": ").concat(insight.description),
                                    type: insight.type
                                }
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BudgetAIService.prototype.getUserBudgets = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, budgets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = (0, date_fns_1.startOfMonth)(new Date());
                        endDate = (0, date_fns_1.endOfMonth)(new Date());
                        return [4 /*yield*/, prisma_1.default.budgetAllocation.findMany({
                                where: {
                                    userId: userId,
                                    month: {
                                        gte: startDate,
                                        lte: endDate
                                    }
                                }
                            })];
                    case 1:
                        budgets = _a.sent();
                        return [2 /*return*/, budgets];
                }
            });
        });
    };
    // Get amount spent in a specific category for current month
    BudgetAIService.prototype.getSpentInCategory = function (userId, category) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = (0, date_fns_1.startOfMonth)(new Date());
                        endDate = (0, date_fns_1.endOfMonth)(new Date());
                        return [4 /*yield*/, prisma_1.default.transaction.findMany({
                                where: {
                                    userId: userId,
                                    category: category,
                                    type: 'expense',
                                    transactionDate: {
                                        gte: startDate,
                                        lte: endDate
                                    }
                                }
                            })];
                    case 1:
                        transactions = _a.sent();
                        return [2 /*return*/, transactions.reduce(function (sum, t) { return sum + t.amount; }, 0)];
                }
            });
        });
    };
    // Get days remaining in current month
    BudgetAIService.prototype.getDaysRemainingInMonth = function () {
        var now = new Date();
        var endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return (0, date_fns_1.differenceInDays)(endOfMonth, now);
    };
    // Get total income for current month
    BudgetAIService.prototype.getMonthlyIncome = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = (0, date_fns_1.startOfMonth)(new Date());
                        endDate = (0, date_fns_1.endOfMonth)(new Date());
                        return [4 /*yield*/, prisma_1.default.transaction.findMany({
                                where: {
                                    userId: userId,
                                    type: 'income',
                                    transactionDate: {
                                        gte: startDate,
                                        lte: endDate
                                    }
                                }
                            })];
                    case 1:
                        transactions = _a.sent();
                        return [2 /*return*/, transactions.reduce(function (sum, t) { return sum + t.amount; }, 0)];
                }
            });
        });
    };
    // Main method to check if user can afford a purchase
    BudgetAIService.prototype.canAffordPurchase = function (userId, amount, category) {
        return __awaiter(this, void 0, void 0, function () {
            var budgets, monthlyIncome_1, categoryBudget, budgetedAmount, spentInCategory, remaining, totalBudgeted, totalSpent, totalRemaining, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        console.log('💰 Checking purchase:', { userId: userId, amount: amount, category: category });
                        return [4 /*yield*/, this.getUserBudgets(userId)];
                    case 1:
                        budgets = _a.sent();
                        return [4 /*yield*/, this.getMonthlyIncome(userId)];
                    case 2:
                        monthlyIncome_1 = _a.sent();
                        // If no budgets exist
                        if (budgets.length === 0) {
                            return [2 /*return*/, {
                                    allowed: false,
                                    remainingBudget: 0,
                                    suggestions: [
                                        "You haven't set up any budgets yet. Create budgets to track your spending.",
                                        "Start by creating a budget for essential categories like Rent, Groceries, etc."
                                    ],
                                    impact: {
                                        daysRemaining: this.getDaysRemainingInMonth(),
                                        recommendedAmount: monthlyIncome_1 > 0 ? monthlyIncome_1 / 30 : 0,
                                        willExceed: true,
                                        newPercentage: 0
                                    }
                                }];
                        }
                        if (!category) return [3 /*break*/, 5];
                        categoryBudget = budgets.find(function (b) { return b.category === category; });
                        if (!categoryBudget) return [3 /*break*/, 4];
                        budgetedAmount = (categoryBudget.percentage / 100) * monthlyIncome_1;
                        return [4 /*yield*/, this.getSpentInCategory(userId, category)];
                    case 3:
                        spentInCategory = _a.sent();
                        remaining = budgetedAmount - spentInCategory;
                        console.log("Category ".concat(category, ":"), { budgetedAmount: budgetedAmount, spentInCategory: spentInCategory, remaining: remaining });
                        if (amount <= remaining) {
                            return [2 /*return*/, {
                                    allowed: true,
                                    remainingBudget: remaining - amount,
                                    category: category,
                                    suggestions: [
                                        "\u2713 This purchase fits within your ".concat(category, " budget."),
                                        "You'll have $".concat((remaining - amount).toFixed(2), " left in this category.")
                                    ],
                                    impact: {
                                        willExceed: false,
                                        newPercentage: ((spentInCategory + amount) / budgetedAmount) * 100,
                                        daysRemaining: this.getDaysRemainingInMonth(),
                                        recommendedAmount: remaining / this.getDaysRemainingInMonth()
                                    }
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    allowed: false,
                                    remainingBudget: remaining,
                                    category: category,
                                    suggestions: [
                                        "\u2717 This would exceed your ".concat(category, " budget by $").concat((amount - remaining).toFixed(2), "."),
                                        "You only have $".concat(remaining.toFixed(2), " left in this category."),
                                        "Consider waiting until next month or reallocating from another category."
                                    ],
                                    impact: {
                                        willExceed: true,
                                        newPercentage: ((spentInCategory + amount) / budgetedAmount) * 100,
                                        daysRemaining: this.getDaysRemainingInMonth(),
                                        recommendedAmount: remaining / this.getDaysRemainingInMonth()
                                    }
                                }];
                        }
                        return [3 /*break*/, 5];
                    case 4: 
                    // Category not found in budgets
                    return [2 /*return*/, {
                            allowed: false,
                            remainingBudget: 0,
                            category: category,
                            suggestions: [
                                "You don't have a budget set for ".concat(category, "."),
                                "Consider creating a budget for this category to track your spending."
                            ],
                            impact: {
                                daysRemaining: this.getDaysRemainingInMonth(),
                                recommendedAmount: monthlyIncome_1 > 0 ? monthlyIncome_1 / 30 : 0,
                                willExceed: true,
                                newPercentage: 0
                            }
                        }];
                    case 5:
                        totalBudgeted = budgets.reduce(function (sum, b) {
                            return sum + ((b.percentage / 100) * monthlyIncome_1);
                        }, 0);
                        return [4 /*yield*/, this.getTotalSpentThisMonth(userId)];
                    case 6:
                        totalSpent = _a.sent();
                        totalRemaining = totalBudgeted - totalSpent;
                        if (amount <= totalRemaining) {
                            return [2 /*return*/, {
                                    allowed: true,
                                    remainingBudget: totalRemaining - amount,
                                    suggestions: [
                                        "\u2713 This purchase fits within your overall budget.",
                                        "You have $".concat((totalRemaining - amount).toFixed(2), " remaining across all categories.")
                                    ],
                                    impact: {
                                        willExceed: false,
                                        newPercentage: ((totalSpent + amount) / totalBudgeted) * 100,
                                        daysRemaining: this.getDaysRemainingInMonth(),
                                        recommendedAmount: totalRemaining / this.getDaysRemainingInMonth()
                                    }
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    allowed: false,
                                    remainingBudget: totalRemaining,
                                    suggestions: [
                                        "\u2717 This would exceed your overall budget by $".concat((amount - totalRemaining).toFixed(2), "."),
                                        "You have $".concat(totalRemaining.toFixed(2), " remaining across all categories."),
                                        "Consider which category you can reduce spending in."
                                    ],
                                    impact: {
                                        willExceed: true,
                                        newPercentage: ((totalSpent + amount) / totalBudgeted) * 100,
                                        daysRemaining: this.getDaysRemainingInMonth(),
                                        recommendedAmount: totalRemaining / this.getDaysRemainingInMonth()
                                    }
                                }];
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        console.error('Error in canAffordPurchase:', error_1);
                        return [2 /*return*/, {
                                allowed: false,
                                remainingBudget: 0,
                                suggestions: ["Unable to check purchase at this time. Please try again later."],
                                impact: {
                                    daysRemaining: this.getDaysRemainingInMonth(),
                                    recommendedAmount: 0,
                                    willExceed: true,
                                    newPercentage: 0
                                }
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // Helper method to get total spent this month
    BudgetAIService.prototype.getTotalSpentThisMonth = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = (0, date_fns_1.startOfMonth)(new Date());
                        endDate = (0, date_fns_1.endOfMonth)(new Date());
                        return [4 /*yield*/, prisma_1.default.transaction.findMany({
                                where: {
                                    userId: userId,
                                    type: 'expense',
                                    transactionDate: {
                                        gte: startDate,
                                        lte: endDate
                                    }
                                }
                            })];
                    case 1:
                        transactions = _a.sent();
                        return [2 /*return*/, transactions.reduce(function (sum, t) { return sum + t.amount; }, 0)];
                }
            });
        });
    };
    return BudgetAIService;
}());
exports.BudgetAIService = BudgetAIService;

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
exports.analyzeUserFinances = void 0;
// services/aiService.ts
var prisma_1 = __importDefault(require("../../config/prisma"));
var date_fns_1 = require("date-fns");
var analyzeUserFinances = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, budgets, goals, transactions, user, currentMonth, lastMonth, threeMonthsAgo, categorySpending, anomalies, budgetHealth, savingsOpportunities, cashFlowForecast, insight;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, Promise.all([
                    prisma_1.default.budgetAllocation.findMany({
                        where: { userId: userId }
                    }),
                    prisma_1.default.goal.findMany({
                        where: { userId: userId }
                        // Removed status filter since it doesn't exist in schema
                    }),
                    prisma_1.default.transaction.findMany({
                        where: { userId: userId },
                        orderBy: { transactionDate: 'desc' }, // Fixed: using transactionDate instead of date
                        take: 500
                    }),
                    prisma_1.default.user.findUnique({
                        where: { id: userId },
                        include: { accounts: true }
                    })
                ])];
            case 1:
                _a = _b.sent(), budgets = _a[0], goals = _a[1], transactions = _a[2], user = _a[3];
                currentMonth = new Date();
                lastMonth = (0, date_fns_1.subMonths)(currentMonth, 1);
                threeMonthsAgo = (0, date_fns_1.subMonths)(currentMonth, 3);
                categorySpending = analyzeCategorySpending(transactions, lastMonth, threeMonthsAgo);
                anomalies = detectAnomalies(transactions);
                budgetHealth = calculateBudgetHealth(budgets, transactions, currentMonth);
                savingsOpportunities = findSavingsOpportunities(transactions, budgets, goals);
                cashFlowForecast = forecastCashFlow(transactions, (user === null || user === void 0 ? void 0 : user.accounts) || []);
                insight = generateNaturalLanguageInsight({
                    categorySpending: categorySpending,
                    anomalies: anomalies,
                    budgetHealth: budgetHealth,
                    savingsOpportunities: savingsOpportunities,
                    cashFlowForecast: cashFlowForecast,
                    goals: goals
                });
                // Store the analysis results in AIInsight model
                return [4 /*yield*/, prisma_1.default.aIInsight.create({
                        data: {
                            userId: userId,
                            insightText: insight,
                            type: 'COMPREHENSIVE_ANALYSIS'
                        }
                    })];
            case 2:
                // Store the analysis results in AIInsight model
                _b.sent();
                // Create notifications for important findings
                return [4 /*yield*/, createInsightNotifications(userId, {
                        anomalies: anomalies,
                        budgetHealth: budgetHealth,
                        cashFlowForecast: cashFlowForecast
                    })];
            case 3:
                // Create notifications for important findings
                _b.sent();
                return [2 /*return*/, {
                        insight: insight,
                        spendingAnalysis: categorySpending,
                        anomalies: anomalies,
                        budgetHealth: budgetHealth,
                        savingsOpportunities: savingsOpportunities,
                        cashFlowForecast: cashFlowForecast
                    }];
        }
    });
}); };
exports.analyzeUserFinances = analyzeUserFinances;
// Helper functions
var analyzeCategorySpending = function (transactions, lastMonth, threeMonthsAgo) {
    var categories = new Map();
    transactions.forEach(function (t) {
        var category = t.category || 'Uncategorized';
        if (!categories.has(category)) {
            categories.set(category, {
                current: 0,
                previous: 0,
                threeMonthAvg: 0
            });
        }
        var categoryData = categories.get(category);
        var amount = t.amount;
        var transactionDate = new Date(t.transactionDate);
        if (transactionDate >= lastMonth) {
            categoryData.current += amount;
        }
        else if (transactionDate >= threeMonthsAgo) {
            categoryData.previous += amount;
        }
        // Rolling average for last 3 months
        if (transactionDate >= threeMonthsAgo) {
            categoryData.threeMonthAvg += amount / 3;
        }
    });
    return Array.from(categories.entries()).map(function (_a) {
        var category = _a[0], data = _a[1];
        var percentageChange = data.previous ?
            ((data.current - data.previous) / data.previous) * 100 : 0;
        var trend = 'stable';
        if (percentageChange > 10)
            trend = 'up';
        if (percentageChange < -10)
            trend = 'down';
        var recommendation = '';
        if (trend === 'up' && data.current > data.threeMonthAvg * 1.2) {
            recommendation = "Your ".concat(category, " spending is significantly higher than usual. Consider reviewing these expenses.");
        }
        else if (trend === 'down' && data.current < data.threeMonthAvg * 0.8) {
            recommendation = "Great job reducing ".concat(category, " spending! Keep up the good work.");
        }
        return {
            category: category,
            trend: trend,
            percentageChange: Math.round(percentageChange * 100) / 100,
            recommendation: recommendation
        };
    });
};
var detectAnomalies = function (transactions) {
    // Statistical anomaly detection using standard deviation
    var amounts = transactions.map(function (t) { return t.amount; });
    if (amounts.length === 0)
        return [];
    var mean = amounts.reduce(function (a, b) { return a + b; }, 0) / amounts.length;
    var variance = amounts.reduce(function (a, b) { return a + Math.pow(b - mean, 2); }, 0) / amounts.length;
    var stdDev = Math.sqrt(variance);
    var anomalies = transactions.filter(function (t) {
        return Math.abs(t.amount - mean) > 2.5 * stdDev;
    }).map(function (t) { return ({
        id: t.id,
        date: t.transactionDate,
        amount: t.amount,
        category: t.category,
        description: t.description,
        reason: Math.abs(t.amount - mean) > 3 * stdDev ?
            'Unusually large transaction' : 'Potential outlier'
    }); });
    return anomalies.slice(0, 5);
};
var calculateBudgetHealth = function (budgets, transactions, currentMonth) {
    var monthStart = (0, date_fns_1.startOfMonth)(currentMonth);
    var monthEnd = (0, date_fns_1.endOfMonth)(currentMonth);
    var monthTransactions = transactions.filter(function (t) {
        return new Date(t.transactionDate) >= monthStart &&
            new Date(t.transactionDate) <= monthEnd &&
            t.type === 'EXPENSE';
    });
    // Group budgets by category
    var budgetMap = new Map();
    budgets.forEach(function (budget) {
        if (!budgetMap.has(budget.category)) {
            budgetMap.set(budget.category, {
                budgeted: 0,
                percentage: 0
            });
        }
        var existing = budgetMap.get(budget.category);
        existing.budgeted += budget.percentage; // Using percentage as budget amount? Adjust as needed
    });
    return Array.from(budgetMap.entries()).map(function (_a) {
        var category = _a[0], data = _a[1];
        var spent = monthTransactions
            .filter(function (t) { return t.category === category; })
            .reduce(function (sum, t) { return sum + t.amount; }, 0);
        // Assuming budgeted amount is derived from monthly income
        // This is a simplified version - adjust based on your actual budget logic
        var budgeted = data.budgeted * 1000; // Placeholder conversion
        var remaining = budgeted - spent;
        var status = 'on_track';
        if (spent > budgeted) {
            status = 'overspending';
        }
        else if (spent < budgeted * 0.5) {
            status = 'under_spending';
        }
        return {
            category: category,
            budgeted: budgeted,
            spent: spent,
            remaining: remaining,
            status: status
        };
    });
};
var findSavingsOpportunities = function (transactions, budgets, goals) {
    var opportunities = [];
    // Analyze recurring subscriptions
    var subscriptions = findRecurringSubscriptions(transactions);
    subscriptions.forEach(function (sub) {
        if (sub.annualCost > 100) {
            opportunities.push({
                type: 'subscription',
                potentialSavings: sub.annualCost * 0.3,
                suggestion: "Consider reviewing your ".concat(sub.name, " subscription - you could save by switching to annual billing or finding alternatives."),
                difficulty: 'easy'
            });
        }
    });
    // Analyze dining out vs cooking
    var diningOut = transactions
        .filter(function (t) {
        var _a, _b;
        return ((_a = t.category) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('dining')) ||
            ((_b = t.category) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('restaurant'));
    })
        .reduce(function (sum, t) { return sum + t.amount; }, 0);
    if (diningOut > 500) {
        opportunities.push({
            type: 'dining',
            potentialSavings: diningOut * 0.2,
            suggestion: "You spent $".concat(diningOut.toFixed(2), " on dining out. Meal prepping could save you around $").concat((diningOut * 0.2).toFixed(2), " monthly."),
            difficulty: 'medium'
        });
    }
    // Goal progress opportunities
    goals.forEach(function (goal) {
        var progress = (goal.currentAmount / goal.targetAmount) * 100;
        if (progress < 30 && goal.targetDate) {
            var daysLeft = (0, date_fns_1.differenceInDays)(new Date(goal.targetDate), new Date());
            if (daysLeft < 90) {
                opportunities.push({
                    type: 'goal_acceleration',
                    potentialSavings: goal.targetAmount - goal.currentAmount,
                    suggestion: "Your goal \"".concat(goal.title, "\" needs attention. Consider setting up automatic transfers to stay on track."),
                    difficulty: 'hard'
                });
            }
        }
    });
    return opportunities.slice(0, 5);
};
var forecastCashFlow = function (transactions, accounts) {
    var last3Months = transactions.filter(function (t) {
        return new Date(t.transactionDate) >= (0, date_fns_1.subMonths)(new Date(), 3);
    });
    var avgMonthlyIncome = last3Months
        .filter(function (t) { return t.type === 'INCOME'; })
        .reduce(function (sum, t) { return sum + t.amount; }, 0) / 3;
    var avgMonthlyExpenses = last3Months
        .filter(function (t) { return t.type === 'EXPENSE'; })
        .reduce(function (sum, t) { return sum + t.amount; }, 0) / 3;
    var totalBalance = accounts.reduce(function (sum, acc) { return sum + acc.balance; }, 0);
    var netMonthly = avgMonthlyIncome - avgMonthlyExpenses;
    var daysUntilZero = netMonthly < 0 && totalBalance > 0 ?
        Math.ceil(totalBalance / Math.abs(netMonthly) * 30) : null;
    var riskLevel = 'low';
    var recommendations = [];
    if (netMonthly < 0) {
        riskLevel = 'high';
        recommendations.push('Your expenses exceed income. Review your spending habits immediately.');
    }
    else if (totalBalance < avgMonthlyExpenses * 3) {
        riskLevel = 'medium';
        recommendations.push('Build an emergency fund covering 3-6 months of expenses.');
    }
    if (daysUntilZero && daysUntilZero < 60) {
        recommendations.push('Based on current trends, your funds may run out soon. Consider reducing expenses.');
    }
    return {
        projectedBalance: totalBalance + (netMonthly * 3),
        daysUntilZero: daysUntilZero,
        riskLevel: riskLevel,
        recommendations: recommendations
    };
};
var findRecurringSubscriptions = function (transactions) {
    var grouped = new Map();
    transactions.forEach(function (t) {
        var _a;
        var key = (_a = t.description) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!key)
            return;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(t);
    });
    return Array.from(grouped.entries())
        .filter(function (_a) {
        var _ = _a[0], trans = _a[1];
        return trans.length >= 3;
    })
        .map(function (_a) {
        var name = _a[0], trans = _a[1];
        return ({
            name: name,
            monthlyCost: trans[0].amount,
            annualCost: trans[0].amount * 12
        });
    });
};
var generateNaturalLanguageInsight = function (data) {
    var parts = [];
    // Overall health
    if (data.cashFlowForecast.riskLevel === 'high') {
        parts.push('⚠️ Your financial health needs immediate attention. ');
    }
    else if (data.cashFlowForecast.riskLevel === 'medium') {
        parts.push('📊 Your finances are stable but have room for improvement. ');
    }
    else {
        parts.push('✅ You\'re on a solid financial track! ');
    }
    // Budget insights
    var overspending = data.budgetHealth.filter(function (b) { return b.status === 'overspending'; });
    if (overspending.length > 0) {
        parts.push("You're overspending in ".concat(overspending.length, " ").concat(overspending.length === 1 ? 'category' : 'categories', ": ").concat(overspending.map(function (b) { return b.category; }).join(', '), ". "));
    }
    // Anomalies
    if (data.anomalies.length > 0) {
        parts.push("We detected ".concat(data.anomalies.length, " unusual ").concat(data.anomalies.length === 1 ? 'transaction' : 'transactions', " that you might want to review. "));
    }
    // Savings opportunities
    if (data.savingsOpportunities.length > 0) {
        var totalSavings = data.savingsOpportunities.reduce(function (sum, opp) { return sum + opp.potentialSavings; }, 0);
        parts.push("\uD83D\uDCB0 You could potentially save up to $".concat(totalSavings.toFixed(2), " by optimizing ").concat(data.savingsOpportunities.length, " area").concat(data.savingsOpportunities.length === 1 ? '' : 's', ". "));
    }
    // Goals progress
    var goalsNearDeadline = data.goals.filter(function (g) {
        if (g.targetDate) {
            var daysLeft = (0, date_fns_1.differenceInDays)(new Date(g.targetDate), new Date());
            return daysLeft < 90 && (g.currentAmount / g.targetAmount) < 0.7;
        }
        return false;
    });
    if (goalsNearDeadline.length > 0) {
        parts.push("\uD83C\uDFAF Your ".concat(goalsNearDeadline.length, " goal").concat(goalsNearDeadline.length === 1 ? ' is' : 's are', " approaching deadline. Consider increasing contributions."));
    }
    return parts.join('');
};
var createInsightNotifications = function (userId, data) { return __awaiter(void 0, void 0, void 0, function () {
    var notifications, overspending;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                notifications = [];
                if (data.anomalies.length > 0) {
                    notifications.push({
                        userId: userId,
                        type: 'ANOMALY_DETECTED',
                        message: "Detected ".concat(data.anomalies.length, " unusual transaction(s) that need review.")
                    });
                }
                overspending = data.budgetHealth.filter(function (b) { return b.status === 'overspending'; });
                if (overspending.length > 0) {
                    notifications.push({
                        userId: userId,
                        type: 'BUDGET_ALERT',
                        message: "Budget alert: You're overspending in ".concat(overspending.length, " category(s).")
                    });
                }
                if (data.cashFlowForecast.riskLevel !== 'low') {
                    notifications.push({
                        userId: userId,
                        type: 'CASH_FLOW_WARNING',
                        message: "Cash flow warning: ".concat(data.cashFlowForecast.recommendations[0] || 'Review your spending habits.')
                    });
                }
                if (!(notifications.length > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma_1.default.notification.createMany({
                        data: notifications
                    })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };

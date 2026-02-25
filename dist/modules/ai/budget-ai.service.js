"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetAIService = void 0;
// src/modules/ai/budget-ai-simplified.service.ts
const prisma_1 = __importDefault(require("../../config/prisma"));
const date_fns_1 = require("date-fns");
class BudgetAIService {
    async analyzeMonthlyBudget(userId, month) {
        const monthStart = (0, date_fns_1.startOfMonth)(month);
        const monthEnd = (0, date_fns_1.endOfMonth)(month);
        // Get current month's transactions
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                userId,
                transactionDate: {
                    gte: monthStart,
                    lte: monthEnd
                }
            }
        });
        // Get previous 3 months for trend analysis
        const threeMonthsAgo = (0, date_fns_1.subMonths)(monthStart, 3);
        const historicalTransactions = await prisma_1.default.transaction.findMany({
            where: {
                userId,
                transactionDate: {
                    gte: threeMonthsAgo,
                    lt: monthStart
                }
            }
        });
        // Calculate monthly totals
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expensesByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
            const cat = t.category || 'Other';
            acc[cat] = (acc[cat] || 0) + t.amount;
            return acc;
        }, {});
        const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
        const savings = totalIncome - totalExpenses;
        // Calculate historical averages
        const historicalAverages = this.calculateHistoricalAverages(historicalTransactions);
        // Generate recommendations
        const recommendations = this.generateRecommendations(totalIncome, expensesByCategory, historicalAverages);
        // Generate insights
        const insights = this.generateInsights(totalIncome, expensesByCategory, savings, historicalAverages);
        // Calculate disposable income
        const disposableIncome = this.calculateDisposableIncome(expensesByCategory, totalIncome);
        const savingsOpportunities = this.findSavingsOpportunities(expensesByCategory, historicalAverages);
        // Store insights in AIInsight table (which exists in your schema)
        await this.storeInsights(userId, insights);
        return {
            recommendations,
            insights,
            disposableIncome,
            savingsOpportunities,
            summary: {
                totalIncome,
                totalExpenses,
                savings,
                savingsRate: totalIncome > 0 ? (savings / totalIncome) * 100 : 0
            }
        };
    }
    generateRecommendations(monthlyIncome, currentExpenses, historicalAverages) {
        const recommendations = [];
        const categoryGuidelines = {
            'Rent': { min: 25, max: 35, essential: true },
            'Grocery': { min: 10, max: 15, essential: true },
            'Transport': { min: 5, max: 10, essential: true },
            'Utilities': { min: 5, max: 10, essential: true },
            'Savings': { min: 15, max: 25, essential: false },
            'Investment': { min: 10, max: 20, essential: false },
            'Dining': { min: 5, max: 10, essential: false },
            'Entertainment': { min: 5, max: 10, essential: false },
        };
        for (const [category, spent] of Object.entries(currentExpenses)) {
            if (monthlyIncome === 0)
                continue;
            const spentPercentage = (spent / monthlyIncome) * 100;
            const guideline = categoryGuidelines[category];
            if (guideline) {
                if (spentPercentage > guideline.max) {
                    const suggestedAmount = (monthlyIncome * guideline.max) / 100;
                    recommendations.push({
                        category,
                        recommendedPercentage: guideline.max,
                        currentPercentage: spentPercentage,
                        suggestedAmount,
                        reasoning: `You're spending ${(spentPercentage - guideline.max).toFixed(1)}% above the recommended ${guideline.max}% on ${category}.`,
                        priority: guideline.essential ? "HIGH" : "MEDIUM"
                    });
                }
            }
            // Compare with historical average
            const historicalAvg = historicalAverages[category] || 0;
            if (historicalAvg > 0) {
                const change = ((spent - historicalAvg) / historicalAvg) * 100;
                if (Math.abs(change) > 20) {
                    recommendations.push({
                        category,
                        recommendedPercentage: (historicalAvg / monthlyIncome) * 100,
                        currentPercentage: spentPercentage,
                        suggestedAmount: historicalAvg,
                        reasoning: `Your ${category} spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(0)}% compared to your average.`,
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
    }
    generateInsights(income, expenses, savings, historicalAverages) {
        const insights = [];
        if (income === 0) {
            insights.push({
                type: "SUGGESTION",
                title: "No Income Recorded",
                description: "Add your income transactions to get personalized budget insights.",
            });
            return insights;
        }
        const savingsRate = (savings / income) * 100;
        if (savingsRate < 10) {
            insights.push({
                type: "WARNING",
                title: "Low Savings Rate",
                description: `You're only saving ${savingsRate.toFixed(1)}% of your income. Aim for at least 20%.`,
                impact: income * 0.2 - savings,
                action: {
                    type: "INCREASE_SAVINGS",
                    description: `Try to save an extra $${(income * 0.2 - savings).toFixed(0)} this month`,
                    potentialSavings: income * 0.2 - savings
                }
            });
        }
        const disposableIncome = this.calculateDisposableIncome(expenses, income);
        if (disposableIncome > 100) {
            const treatAmount = Math.min(disposableIncome * 0.2, 2000);
            insights.push({
                type: "SUGGESTION",
                title: "You Deserve a Treat! 🎁",
                description: `You have $${disposableIncome.toFixed(0)} in disposable income. Consider treating yourself up to $${treatAmount.toFixed(0)}!`,
                impact: treatAmount,
                action: {
                    type: "TREAT_YOURSELF",
                    description: `You can afford that $${treatAmount.toFixed(0)} purchase!`,
                    potentialSavings: treatAmount
                }
            });
        }
        return insights;
    }
    calculateDisposableIncome(expenses, income) {
        const essentialCategories = ['Rent', 'Grocery', 'Transport', 'Utilities', 'Insurance'];
        const essentialExpenses = Object.entries(expenses)
            .filter(([cat]) => essentialCategories.includes(cat))
            .reduce((sum, [, amount]) => sum + amount, 0);
        return Math.max(0, income - essentialExpenses);
    }
    findSavingsOpportunities(expenses, historicalAverages) {
        let total = 0;
        for (const [category, amount] of Object.entries(expenses)) {
            const historicalAvg = historicalAverages[category] || amount;
            if (amount > historicalAvg * 1.2) {
                total += amount - historicalAvg;
            }
        }
        return total;
    }
    calculateHistoricalAverages(transactions) {
        const categoryTotals = {};
        transactions.forEach(t => {
            if (t.type !== 'expense')
                return;
            const category = t.category || 'Other';
            if (!categoryTotals[category]) {
                categoryTotals[category] = { sum: 0, count: 0 };
            }
            categoryTotals[category].sum += t.amount;
            categoryTotals[category].count += 1;
        });
        return Object.entries(categoryTotals).reduce((acc, [cat, { sum, count }]) => {
            acc[cat] = count > 0 ? sum / count : 0;
            return acc;
        }, {});
    }
    async storeInsights(userId, insights) {
        // Store in your existing AIInsight table
        for (const insight of insights) {
            await prisma_1.default.aIInsight.create({
                data: {
                    userId,
                    insightText: `${insight.title}: ${insight.description}`,
                    type: insight.type
                }
            });
        }
    }
    async getUserBudgets(userId) {
        const startDate = (0, date_fns_1.startOfMonth)(new Date());
        const endDate = (0, date_fns_1.endOfMonth)(new Date());
        const budgets = await prisma_1.default.budgetAllocation.findMany({
            where: {
                userId,
                month: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        return budgets;
    }
    // Get amount spent in a specific category for current month
    async getSpentInCategory(userId, category) {
        const startDate = (0, date_fns_1.startOfMonth)(new Date());
        const endDate = (0, date_fns_1.endOfMonth)(new Date());
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                userId,
                category,
                type: 'expense',
                transactionDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        return transactions.reduce((sum, t) => sum + t.amount, 0);
    }
    // Get days remaining in current month
    getDaysRemainingInMonth() {
        const now = new Date();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return (0, date_fns_1.differenceInDays)(endOfMonth, now);
    }
    // Get total income for current month
    async getMonthlyIncome(userId) {
        const startDate = (0, date_fns_1.startOfMonth)(new Date());
        const endDate = (0, date_fns_1.endOfMonth)(new Date());
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                userId,
                type: 'income',
                transactionDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        return transactions.reduce((sum, t) => sum + t.amount, 0);
    }
    // Main method to check if user can afford a purchase
    async canAffordPurchase(userId, amount, category) {
        try {
            console.log('💰 Checking purchase:', { userId, amount, category });
            // Get user's budgets
            const budgets = await this.getUserBudgets(userId);
            const monthlyIncome = await this.getMonthlyIncome(userId);
            // If no budgets exist
            if (budgets.length === 0) {
                return {
                    allowed: false,
                    remainingBudget: 0,
                    suggestions: [
                        "You haven't set up any budgets yet. Create budgets to track your spending.",
                        "Start by creating a budget for essential categories like Rent, Groceries, etc."
                    ],
                    impact: {
                        daysRemaining: this.getDaysRemainingInMonth(),
                        recommendedAmount: monthlyIncome > 0 ? monthlyIncome / 30 : 0,
                        willExceed: true,
                        newPercentage: 0
                    }
                };
            }
            // If category is provided, check that specific category
            if (category) {
                const categoryBudget = budgets.find(b => b.category === category);
                if (categoryBudget) {
                    const budgetedAmount = (categoryBudget.percentage / 100) * monthlyIncome;
                    const spentInCategory = await this.getSpentInCategory(userId, category);
                    const remaining = budgetedAmount - spentInCategory;
                    console.log(`Category ${category}:`, { budgetedAmount, spentInCategory, remaining });
                    if (amount <= remaining) {
                        return {
                            allowed: true,
                            remainingBudget: remaining - amount,
                            category,
                            suggestions: [
                                `✓ This purchase fits within your ${category} budget.`,
                                `You'll have $${(remaining - amount).toFixed(2)} left in this category.`
                            ],
                            impact: {
                                willExceed: false,
                                newPercentage: ((spentInCategory + amount) / budgetedAmount) * 100,
                                daysRemaining: this.getDaysRemainingInMonth(),
                                recommendedAmount: remaining / this.getDaysRemainingInMonth()
                            }
                        };
                    }
                    else {
                        return {
                            allowed: false,
                            remainingBudget: remaining,
                            category,
                            suggestions: [
                                `✗ This would exceed your ${category} budget by $${(amount - remaining).toFixed(2)}.`,
                                `You only have $${remaining.toFixed(2)} left in this category.`,
                                `Consider waiting until next month or reallocating from another category.`
                            ],
                            impact: {
                                willExceed: true,
                                newPercentage: ((spentInCategory + amount) / budgetedAmount) * 100,
                                daysRemaining: this.getDaysRemainingInMonth(),
                                recommendedAmount: remaining / this.getDaysRemainingInMonth()
                            }
                        };
                    }
                }
                else {
                    // Category not found in budgets
                    return {
                        allowed: false,
                        remainingBudget: 0,
                        category,
                        suggestions: [
                            `You don't have a budget set for ${category}.`,
                            `Consider creating a budget for this category to track your spending.`
                        ],
                        impact: {
                            daysRemaining: this.getDaysRemainingInMonth(),
                            recommendedAmount: monthlyIncome > 0 ? monthlyIncome / 30 : 0,
                            willExceed: true,
                            newPercentage: 0
                        }
                    };
                }
            }
            // If no category specified, check against total budget
            const totalBudgeted = budgets.reduce((sum, b) => {
                return sum + ((b.percentage / 100) * monthlyIncome);
            }, 0);
            const totalSpent = await this.getTotalSpentThisMonth(userId);
            const totalRemaining = totalBudgeted - totalSpent;
            if (amount <= totalRemaining) {
                return {
                    allowed: true,
                    remainingBudget: totalRemaining - amount,
                    suggestions: [
                        `✓ This purchase fits within your overall budget.`,
                        `You have $${(totalRemaining - amount).toFixed(2)} remaining across all categories.`
                    ],
                    impact: {
                        willExceed: false,
                        newPercentage: ((totalSpent + amount) / totalBudgeted) * 100,
                        daysRemaining: this.getDaysRemainingInMonth(),
                        recommendedAmount: totalRemaining / this.getDaysRemainingInMonth()
                    }
                };
            }
            else {
                return {
                    allowed: false,
                    remainingBudget: totalRemaining,
                    suggestions: [
                        `✗ This would exceed your overall budget by $${(amount - totalRemaining).toFixed(2)}.`,
                        `You have $${totalRemaining.toFixed(2)} remaining across all categories.`,
                        `Consider which category you can reduce spending in.`
                    ],
                    impact: {
                        willExceed: true,
                        newPercentage: ((totalSpent + amount) / totalBudgeted) * 100,
                        daysRemaining: this.getDaysRemainingInMonth(),
                        recommendedAmount: totalRemaining / this.getDaysRemainingInMonth()
                    }
                };
            }
        }
        catch (error) {
            console.error('Error in canAffordPurchase:', error);
            return {
                allowed: false,
                remainingBudget: 0,
                suggestions: ["Unable to check purchase at this time. Please try again later."],
                impact: {
                    daysRemaining: this.getDaysRemainingInMonth(),
                    recommendedAmount: 0,
                    willExceed: true,
                    newPercentage: 0
                }
            };
        }
    }
    // Helper method to get total spent this month
    async getTotalSpentThisMonth(userId) {
        const startDate = (0, date_fns_1.startOfMonth)(new Date());
        const endDate = (0, date_fns_1.endOfMonth)(new Date());
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                userId,
                type: 'expense',
                transactionDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        return transactions.reduce((sum, t) => sum + t.amount, 0);
    }
}
exports.BudgetAIService = BudgetAIService;

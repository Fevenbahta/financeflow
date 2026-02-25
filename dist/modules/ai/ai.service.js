"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeUserFinances = void 0;
// services/aiService.ts
const prisma_1 = __importDefault(require("../../config/prisma"));
const date_fns_1 = require("date-fns");
const analyzeUserFinances = async (userId) => {
    // Fetch comprehensive user data - fixed to match actual schema
    const [budgets, goals, transactions, user] = await Promise.all([
        prisma_1.default.budgetAllocation.findMany({
            where: { userId }
        }),
        prisma_1.default.goal.findMany({
            where: { userId }
            // Removed status filter since it doesn't exist in schema
        }),
        prisma_1.default.transaction.findMany({
            where: { userId },
            orderBy: { transactionDate: 'desc' }, // Fixed: using transactionDate instead of date
            take: 500
        }),
        prisma_1.default.user.findUnique({
            where: { id: userId },
            include: { accounts: true }
        })
    ]);
    const currentMonth = new Date();
    const lastMonth = (0, date_fns_1.subMonths)(currentMonth, 1);
    const threeMonthsAgo = (0, date_fns_1.subMonths)(currentMonth, 3);
    // 1. Categorization Analysis
    const categorySpending = analyzeCategorySpending(transactions, lastMonth, threeMonthsAgo);
    // 2. Anomaly Detection
    const anomalies = detectAnomalies(transactions);
    // 3. Budget Health Check
    const budgetHealth = calculateBudgetHealth(budgets, transactions, currentMonth);
    // 4. Savings Opportunities
    const savingsOpportunities = findSavingsOpportunities(transactions, budgets, goals);
    // 5. Cash Flow Forecasting
    const cashFlowForecast = forecastCashFlow(transactions, user?.accounts || []);
    // 6. Generate Natural Language Insight
    const insight = generateNaturalLanguageInsight({
        categorySpending,
        anomalies,
        budgetHealth,
        savingsOpportunities,
        cashFlowForecast,
        goals
    });
    // Store the analysis results in AIInsight model
    await prisma_1.default.aIInsight.create({
        data: {
            userId,
            insightText: insight,
            type: 'COMPREHENSIVE_ANALYSIS'
        }
    });
    // Create notifications for important findings
    await createInsightNotifications(userId, {
        anomalies,
        budgetHealth,
        cashFlowForecast
    });
    return {
        insight,
        spendingAnalysis: categorySpending,
        anomalies,
        budgetHealth,
        savingsOpportunities,
        cashFlowForecast
    };
};
exports.analyzeUserFinances = analyzeUserFinances;
// Helper functions
const analyzeCategorySpending = (transactions, lastMonth, threeMonthsAgo) => {
    const categories = new Map();
    transactions.forEach(t => {
        const category = t.category || 'Uncategorized';
        if (!categories.has(category)) {
            categories.set(category, {
                current: 0,
                previous: 0,
                threeMonthAvg: 0
            });
        }
        const categoryData = categories.get(category);
        const amount = t.amount;
        const transactionDate = new Date(t.transactionDate);
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
    return Array.from(categories.entries()).map(([category, data]) => {
        const percentageChange = data.previous ?
            ((data.current - data.previous) / data.previous) * 100 : 0;
        let trend = 'stable';
        if (percentageChange > 10)
            trend = 'up';
        if (percentageChange < -10)
            trend = 'down';
        let recommendation = '';
        if (trend === 'up' && data.current > data.threeMonthAvg * 1.2) {
            recommendation = `Your ${category} spending is significantly higher than usual. Consider reviewing these expenses.`;
        }
        else if (trend === 'down' && data.current < data.threeMonthAvg * 0.8) {
            recommendation = `Great job reducing ${category} spending! Keep up the good work.`;
        }
        return {
            category,
            trend,
            percentageChange: Math.round(percentageChange * 100) / 100,
            recommendation
        };
    });
};
const detectAnomalies = (transactions) => {
    // Statistical anomaly detection using standard deviation
    const amounts = transactions.map(t => t.amount);
    if (amounts.length === 0)
        return [];
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const anomalies = transactions.filter(t => Math.abs(t.amount - mean) > 2.5 * stdDev).map(t => ({
        id: t.id,
        date: t.transactionDate,
        amount: t.amount,
        category: t.category,
        description: t.description,
        reason: Math.abs(t.amount - mean) > 3 * stdDev ?
            'Unusually large transaction' : 'Potential outlier'
    }));
    return anomalies.slice(0, 5);
};
const calculateBudgetHealth = (budgets, transactions, currentMonth) => {
    const monthStart = (0, date_fns_1.startOfMonth)(currentMonth);
    const monthEnd = (0, date_fns_1.endOfMonth)(currentMonth);
    const monthTransactions = transactions.filter(t => new Date(t.transactionDate) >= monthStart &&
        new Date(t.transactionDate) <= monthEnd &&
        t.type === 'EXPENSE');
    // Group budgets by category
    const budgetMap = new Map();
    budgets.forEach(budget => {
        if (!budgetMap.has(budget.category)) {
            budgetMap.set(budget.category, {
                budgeted: 0,
                percentage: 0
            });
        }
        const existing = budgetMap.get(budget.category);
        existing.budgeted += budget.percentage; // Using percentage as budget amount? Adjust as needed
    });
    return Array.from(budgetMap.entries()).map(([category, data]) => {
        const spent = monthTransactions
            .filter(t => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0);
        // Assuming budgeted amount is derived from monthly income
        // This is a simplified version - adjust based on your actual budget logic
        const budgeted = data.budgeted * 1000; // Placeholder conversion
        const remaining = budgeted - spent;
        let status = 'on_track';
        if (spent > budgeted) {
            status = 'overspending';
        }
        else if (spent < budgeted * 0.5) {
            status = 'under_spending';
        }
        return {
            category,
            budgeted,
            spent,
            remaining,
            status
        };
    });
};
const findSavingsOpportunities = (transactions, budgets, goals) => {
    const opportunities = [];
    // Analyze recurring subscriptions
    const subscriptions = findRecurringSubscriptions(transactions);
    subscriptions.forEach(sub => {
        if (sub.annualCost > 100) {
            opportunities.push({
                type: 'subscription',
                potentialSavings: sub.annualCost * 0.3,
                suggestion: `Consider reviewing your ${sub.name} subscription - you could save by switching to annual billing or finding alternatives.`,
                difficulty: 'easy'
            });
        }
    });
    // Analyze dining out vs cooking
    const diningOut = transactions
        .filter(t => t.category?.toLowerCase().includes('dining') ||
        t.category?.toLowerCase().includes('restaurant'))
        .reduce((sum, t) => sum + t.amount, 0);
    if (diningOut > 500) {
        opportunities.push({
            type: 'dining',
            potentialSavings: diningOut * 0.2,
            suggestion: `You spent $${diningOut.toFixed(2)} on dining out. Meal prepping could save you around $${(diningOut * 0.2).toFixed(2)} monthly.`,
            difficulty: 'medium'
        });
    }
    // Goal progress opportunities
    goals.forEach(goal => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        if (progress < 30 && goal.targetDate) {
            const daysLeft = (0, date_fns_1.differenceInDays)(new Date(goal.targetDate), new Date());
            if (daysLeft < 90) {
                opportunities.push({
                    type: 'goal_acceleration',
                    potentialSavings: goal.targetAmount - goal.currentAmount,
                    suggestion: `Your goal "${goal.title}" needs attention. Consider setting up automatic transfers to stay on track.`,
                    difficulty: 'hard'
                });
            }
        }
    });
    return opportunities.slice(0, 5);
};
const forecastCashFlow = (transactions, accounts) => {
    const last3Months = transactions.filter(t => new Date(t.transactionDate) >= (0, date_fns_1.subMonths)(new Date(), 3));
    const avgMonthlyIncome = last3Months
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0) / 3;
    const avgMonthlyExpenses = last3Months
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0) / 3;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const netMonthly = avgMonthlyIncome - avgMonthlyExpenses;
    const daysUntilZero = netMonthly < 0 && totalBalance > 0 ?
        Math.ceil(totalBalance / Math.abs(netMonthly) * 30) : null;
    let riskLevel = 'low';
    const recommendations = [];
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
        daysUntilZero,
        riskLevel,
        recommendations
    };
};
const findRecurringSubscriptions = (transactions) => {
    const grouped = new Map();
    transactions.forEach(t => {
        const key = t.description?.toLowerCase();
        if (!key)
            return;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(t);
    });
    return Array.from(grouped.entries())
        .filter(([_, trans]) => trans.length >= 3)
        .map(([name, trans]) => ({
        name,
        monthlyCost: trans[0].amount,
        annualCost: trans[0].amount * 12
    }));
};
const generateNaturalLanguageInsight = (data) => {
    const parts = [];
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
    const overspending = data.budgetHealth.filter((b) => b.status === 'overspending');
    if (overspending.length > 0) {
        parts.push(`You're overspending in ${overspending.length} ${overspending.length === 1 ? 'category' : 'categories'}: ${overspending.map((b) => b.category).join(', ')}. `);
    }
    // Anomalies
    if (data.anomalies.length > 0) {
        parts.push(`We detected ${data.anomalies.length} unusual ${data.anomalies.length === 1 ? 'transaction' : 'transactions'} that you might want to review. `);
    }
    // Savings opportunities
    if (data.savingsOpportunities.length > 0) {
        const totalSavings = data.savingsOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0);
        parts.push(`💰 You could potentially save up to $${totalSavings.toFixed(2)} by optimizing ${data.savingsOpportunities.length} area${data.savingsOpportunities.length === 1 ? '' : 's'}. `);
    }
    // Goals progress
    const goalsNearDeadline = data.goals.filter((g) => {
        if (g.targetDate) {
            const daysLeft = (0, date_fns_1.differenceInDays)(new Date(g.targetDate), new Date());
            return daysLeft < 90 && (g.currentAmount / g.targetAmount) < 0.7;
        }
        return false;
    });
    if (goalsNearDeadline.length > 0) {
        parts.push(`🎯 Your ${goalsNearDeadline.length} goal${goalsNearDeadline.length === 1 ? ' is' : 's are'} approaching deadline. Consider increasing contributions.`);
    }
    return parts.join('');
};
const createInsightNotifications = async (userId, data) => {
    const notifications = [];
    if (data.anomalies.length > 0) {
        notifications.push({
            userId,
            type: 'ANOMALY_DETECTED',
            message: `Detected ${data.anomalies.length} unusual transaction(s) that need review.`
        });
    }
    const overspending = data.budgetHealth.filter((b) => b.status === 'overspending');
    if (overspending.length > 0) {
        notifications.push({
            userId,
            type: 'BUDGET_ALERT',
            message: `Budget alert: You're overspending in ${overspending.length} category(s).`
        });
    }
    if (data.cashFlowForecast.riskLevel !== 'low') {
        notifications.push({
            userId,
            type: 'CASH_FLOW_WARNING',
            message: `Cash flow warning: ${data.cashFlowForecast.recommendations[0] || 'Review your spending habits.'}`
        });
    }
    if (notifications.length > 0) {
        await prisma_1.default.notification.createMany({
            data: notifications
        });
    }
};

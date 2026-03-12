// src/modules/user/user.repository.ts
import prisma from "../../config/prisma";

export class UserRepository {
  async create(data: { username: string; email: string; monthlyIncome?: number }) {
    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        monthlyIncome: data.monthlyIncome ?? 0,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        goals: true,
        transactions: {
          orderBy: { transactionDate: 'desc' },
          take: 50
        },
        budgets: true,
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' }
        },
        aiInsights: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: Partial<{ username: string; email: string; monthlyIncome: number }>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
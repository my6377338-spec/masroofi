import { prisma } from "@/lib/prisma"
import AnalyticsClient from "./analytics-client"

export default async function AnalyticsPage() {
  let user = await prisma.user.findFirst({
    include: {
      accounts: true,
      transactions: {
        include: {
          category: true,
          account: true,
        },
      },
      budgets: {
        include: {
          category: true,
        },
      },
      goals: true,
      lifeGoals: true,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "أحمد محمود",
        email: "user@masroofi.local",
        password: "default",
      },
      include: {
        accounts: true,
        transactions: {
          include: {
            category: true,
            account: true,
          },
        },
        budgets: {
          include: {
            category: true,
          },
        },
        goals: true,
        lifeGoals: true,
      },
    })
  }

  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const currentMonthTransactions = user.transactions.filter((t) => t.date >= currentMonthStart)

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthlyExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthlySavings = monthlyIncome - monthlyExpenses

  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    accounts: user.accounts.map((a) => ({
      id: a.id,
      userId: a.userId,
      name: a.name,
      type: a.type,
      currency: a.currency,
      icon: a.icon,
      color: a.color,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      balance: Number(a.balance),
    })),
    transactions: user.transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      accountId: t.accountId,
      categoryId: t.categoryId,
      type: t.type,
      description: t.description,
      notes: t.notes,
      date: t.date,
      tags: t.tags,
      recurring: t.recurring,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      amount: Number(t.amount),
    })),
    budgets: user.budgets.map((b) => ({
      id: b.id,
      userId: b.userId,
      categoryId: b.categoryId,
      period: b.period,
      startDate: b.startDate,
      endDate: b.endDate,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      amount: Number(b.amount),
    })),
    goals: user.goals.map((g) => ({
      id: g.id,
      userId: g.userId,
      name: g.name,
      description: g.description,
      deadline: g.deadline,
      status: g.status,
      icon: g.icon,
      color: g.color,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
      targetAmount: Number(g.targetAmount),
      currentAmount: Number(g.currentAmount),
      monthlyContribution: Number(g.monthlyContribution || 0),
    })),
    lifeGoals: user.lifeGoals.map((lg) => ({
      id: lg.id,
      userId: lg.userId,
      title: lg.title,
      description: lg.description,
      category: lg.category,
      targetDate: lg.targetDate,
      priority: lg.priority,
      status: lg.status,
      icon: lg.icon,
      color: lg.color,
      goalId: lg.goalId,
      createdAt: lg.createdAt,
      updatedAt: lg.updatedAt,
      estimatedBudget: Number(lg.estimatedBudget || 0),
    })),
  }

  return (
    <AnalyticsClient
      user={serializedUser}
      metrics={{
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
      }}
    />
  )
}

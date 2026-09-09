import { prisma } from "@/lib/prisma"
import MoneyClient from "./money-client"

export default async function MoneyPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>
}) {
  const resolvedParams = searchParams ? await searchParams : {}
  const activeTabParam = resolvedParams.tab || "transactions"

  let user = await prisma.user.findFirst({
    include: {
      accounts: true,
      transactions: {
        orderBy: { date: "desc" },
        include: {
          category: true,
          account: true,
        },
      },
      categories: true,
      budgets: {
        include: {
          category: true,
        },
      },
      subscriptions: true,
      commitments: true,
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
          orderBy: { date: "desc" },
          include: {
            category: true,
            account: true,
          },
        },
        categories: true,
        budgets: {
          include: {
            category: true,
          },
        },
        subscriptions: true,
        commitments: true,
      },
    })
  }

  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Explicitly map budgets with spent calculations & serialized Decimals
  const budgetsWithSpent = user.budgets.map((b) => {
    const spent = user.transactions
      .filter((t) => t.categoryId === b.categoryId && t.type === "expense" && t.date >= currentMonthStart)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const amountNum = Number(b.amount)
    return {
      id: b.id,
      userId: b.userId,
      categoryId: b.categoryId,
      period: b.period,
      startDate: b.startDate,
      endDate: b.endDate,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      amount: amountNum,
      spent,
      progress: amountNum > 0 ? (spent / amountNum) * 100 : 0,
      category: b.category ? { ...b.category } : null,
    }
  })

  // Explicitly serialize user object
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
      category: t.category ? { ...t.category } : null,
      account: t.account
        ? {
            id: t.account.id,
            name: t.account.name,
            type: t.account.type,
            icon: t.account.icon,
            color: t.account.color,
            currency: t.account.currency,
            balance: Number(t.account.balance),
          }
        : null,
    })),
    categories: user.categories.map((c) => ({ ...c })),
    subscriptions: user.subscriptions.map((s) => ({
      id: s.id,
      userId: s.userId,
      name: s.name,
      billingCycle: s.billingCycle,
      category: s.category,
      nextBillingDate: s.nextBillingDate,
      active: s.active,
      icon: s.icon,
      color: s.color,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      amount: Number(s.amount),
    })),
    commitments: user.commitments.map((c) => ({
      id: c.id,
      userId: c.userId,
      name: c.name,
      dueDate: c.dueDate,
      paid: c.paid,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      amount: Number(c.amount),
      totalAmount: c.totalAmount ? Number(c.totalAmount) : null,
    })),
  }

  return (
    <MoneyClient
      initialTab={activeTabParam}
      user={serializedUser}
      budgets={budgetsWithSpent}
    />
  )
}

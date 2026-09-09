import { prisma } from "@/lib/prisma"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  // Fetch default user
  let user = await prisma.user.findFirst({
    include: {
      accounts: true,
      transactions: {
        orderBy: { date: "desc" },
        take: 15,
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
      goals: true,
      subscriptions: true,
      commitments: true,
      lifeGoals: {
        include: {
          milestones: true,
          tasks: true,
          linkedGoal: true,
        },
      },
      monthlyPlans: true,
      monthlyReviews: true,
      settings: true,
    },
  })

  // Create default user if none exists
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "أحمد محمود",
        email: "user@masroofi.local",
        password: "default",
        settings: {
          create: {
            language: "ar",
            theme: "system",
            currency: "EGP",
          },
        },
      },
      include: {
        accounts: true,
        transactions: {
          orderBy: { date: "desc" },
          take: 15,
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
        goals: true,
        subscriptions: true,
        commitments: true,
        lifeGoals: {
          include: {
            milestones: true,
            tasks: true,
            linkedGoal: true,
          },
        },
        monthlyPlans: true,
        monthlyReviews: true,
        settings: true,
      },
    })
  }

  // Calculate Net Worth / Total Balance
  const totalBalance = user.accounts.reduce(
    (sum, account) => sum + Number(account.balance),
    0
  )

  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Current month transactions
  const currentMonthTransactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: currentMonthStart,
      },
    },
    include: {
      category: true,
      account: true,
    },
    orderBy: { date: "asc" },
  })

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthlyExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthlySavings = monthlyIncome - monthlyExpenses
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0

  // Previous month comparison
  const previousMonthTransactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: previousMonthStart,
        lt: currentMonthStart,
      },
    },
  })

  const previousMonthIncome = previousMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const previousMonthExpenses = previousMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const previousMonthSavings = previousMonthIncome - previousMonthExpenses

  // Daily Chart Data
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dailyChartData = []

  for (let day = 1; day <= Math.min(now.getDate(), daysInMonth); day++) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), day, 0, 0, 0)
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), day, 23, 59, 59)

    const dayTx = currentMonthTransactions.filter(
      (t) => t.date >= dayStart && t.date <= dayEnd
    )

    const dayIncome = dayTx
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const dayExpense = dayTx
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    dailyChartData.push({
      dayLabel: `${day}`,
      dateStr: dayStart.toLocaleDateString("ar-EG", { day: "numeric", month: "short" }),
      income: dayIncome,
      expense: dayExpense,
    })
  }

  // Category spending breakdown
  const categorySpendingMap: Record<string, { name: string; color: string; icon: string; amount: number; count: number }> = {}

  currentMonthTransactions
    .filter((t) => t.type === "expense" && t.category)
    .forEach((t) => {
      const catId = t.categoryId || "uncategorized"
      const catName = t.category?.name || "عام"
      const catColor = t.category?.color || "#c5a059"
      const catIcon = t.category?.icon || "ShoppingBag"
      const amt = Number(t.amount)

      if (!categorySpendingMap[catId]) {
        categorySpendingMap[catId] = {
          name: catName,
          color: catColor,
          icon: catIcon,
          amount: 0,
          count: 0,
        }
      }
      categorySpendingMap[catId].amount += amt
      categorySpendingMap[catId].count += 1
    })

  const categoryBreakdown = Object.values(categorySpendingMap)
    .map((cat) => ({
      ...cat,
      percentage: monthlyExpenses > 0 ? (cat.amount / monthlyExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  // Budget calculations
  const budgetsWithSpent = user.budgets.map((budget) => {
    const spent = currentMonthTransactions
      .filter((t) => t.categoryId === budget.categoryId && t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      amount: Number(budget.amount),
      spent,
      progress: Number(budget.amount) > 0 ? (spent / Number(budget.amount)) * 100 : 0,
      category: budget.category ? { ...budget.category } : null,
    }
  })

  // Calculate Subscriptions metrics
  const activeSubscriptions = user.subscriptions.filter((s) => s.active)
  const totalMonthlySubscriptions = activeSubscriptions.reduce((sum, s) => {
    const amt = Number(s.amount)
    return sum + (s.billingCycle === "yearly" ? amt / 12 : amt)
  }, 0)

  // Calculate Commitments metrics
  const pendingCommitments = user.commitments.filter((c) => !c.paid)
  const totalPendingCommitments = pendingCommitments.reduce((sum, c) => sum + Number(c.amount), 0)

  // Generate Data-Driven Smart Insights
  const insights: Array<{ id: string; title: string; description: string; type: "info" | "success" | "warning" | "error"; icon: string }> = []

  if (categoryBreakdown.length > 0) {
    const topCat = categoryBreakdown[0]
    insights.push({
      id: "top-category",
      title: `أعلى فئة إنفاق: ${topCat.name}`,
      description: `تستحوذ فئة "${topCat.name}" على ${topCat.percentage.toFixed(1)}% من مصروفاتك بمبلغ ${topCat.amount.toLocaleString("en")} ج.م.`,
      type: "info",
      icon: "PieChart",
    })
  }

  if (savingsRate >= 20) {
    insights.push({
      id: "savings-rate-good",
      title: "أداء ادخاري متفوق!",
      description: `معدل ادخارك الحقيقي يبلغ ${savingsRate.toFixed(1)}%، متجاوزاً الهدف الموصى به (20%).`,
      type: "success",
      icon: "TrendingUp",
    })
  } else if (savingsRate > 0) {
    insights.push({
      id: "savings-rate-mod",
      title: "معدل الادخار يحتاج تحسين",
      description: `معدل الادخار الحالي ${savingsRate.toFixed(1)}%. يمكنك توفير زيادة من خلال مراجعة البنود الثانوية.`,
      type: "warning",
      icon: "AlertTriangle",
    })
  }

  if (activeSubscriptions.length > 0) {
    insights.push({
      id: "subscriptions-summary",
      title: `${activeSubscriptions.length} اشتراكات نشطة`,
      description: `تصل تكلفتها التراكمية إلى ${totalMonthlySubscriptions.toLocaleString("en")} ج.م شهريًا.`,
      type: "info",
      icon: "Cpu",
    })
  }

  if (pendingCommitments.length > 0) {
    insights.push({
      id: "commitments-pending",
      title: `${pendingCommitments.length} التزامات مستحقة القادمة`,
      description: `إجمالي المستحقات الواجب سدادها قريبًا: ${totalPendingCommitments.toLocaleString("en")} ج.م.`,
      type: "warning",
      icon: "Zap",
    })
  }

  // Calculate Goal projections & monthly requirements
  const goalsWithCalculations = user.goals.map((goal) => {
    const target = Number(goal.targetAmount)
    const current = Number(goal.currentAmount)
    const remaining = Math.max(0, target - current)
    const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0

    let monthsRemaining = 12
    if (goal.deadline) {
      const diffYears = goal.deadline.getFullYear() - now.getFullYear()
      const diffMonths = goal.deadline.getMonth() - now.getMonth()
      monthsRemaining = Math.max(1, diffYears * 12 + diffMonths)
    }

    const requiredMonthlySaving = remaining / monthsRemaining

    return {
      id: goal.id,
      userId: goal.userId,
      name: goal.name,
      description: goal.description,
      deadline: goal.deadline,
      status: goal.status,
      icon: goal.icon,
      color: goal.color,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
      targetAmount: target,
      currentAmount: current,
      monthlyContribution: Number(goal.monthlyContribution || 0),
      remainingAmount: remaining,
      progress,
      monthsRemaining,
      requiredMonthlySaving,
    }
  })

  // Format Life Goals with Milestones and Tasks
  const lifeGoalsFormatted = user.lifeGoals.map((lg) => {
    const totalMilestones = lg.milestones.length
    const completedMilestones = lg.milestones.filter((m) => m.completed).length
    const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

    const totalTasks = lg.tasks.length
    const completedTasks = lg.tasks.filter((t) => t.completed).length

    return {
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
      totalMilestones,
      completedMilestones,
      milestoneProgress,
      totalTasks,
      completedTasks,
      milestones: lg.milestones.map((m) => ({
        id: m.id,
        lifeGoalId: m.lifeGoalId,
        title: m.title,
        targetDate: m.targetDate,
        completed: m.completed,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        cost: Number(m.cost || 0),
      })),
      tasks: lg.tasks.map((t) => ({
        id: t.id,
        lifeGoalId: t.lifeGoalId,
        title: t.title,
        dueDate: t.dueDate,
        completed: t.completed,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
      linkedGoal: lg.linkedGoal
        ? {
            id: lg.linkedGoal.id,
            userId: lg.linkedGoal.userId,
            name: lg.linkedGoal.name,
            description: lg.linkedGoal.description,
            deadline: lg.linkedGoal.deadline,
            status: lg.linkedGoal.status,
            icon: lg.linkedGoal.icon,
            color: lg.linkedGoal.color,
            createdAt: lg.linkedGoal.createdAt,
            updatedAt: lg.linkedGoal.updatedAt,
            targetAmount: Number(lg.linkedGoal.targetAmount),
            currentAmount: Number(lg.linkedGoal.currentAmount),
            monthlyContribution: Number(lg.linkedGoal.monthlyContribution || 0),
          }
        : null,
    }
  })

  // Current Month Plan & Review
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const currentMonthPlan = user.monthlyPlans.find((p) => p.monthYear === currentMonthStr) || null
  const currentMonthReview = user.monthlyReviews.find((r) => r.monthYear === currentMonthStr) || null

  return (
    <DashboardClient
      user={{
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
        subscriptions: user.subscriptions.map((s) => ({
          ...s,
          amount: Number(s.amount),
        })),
        commitments: user.commitments.map((c) => ({
          ...c,
          amount: Number(c.amount),
          totalAmount: c.totalAmount ? Number(c.totalAmount) : null,
        })),
        settings: user.settings ? { ...user.settings } : null,
      }}
      stats={{
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        savingsRate,
      }}
      previousMonthStats={{
        income: previousMonthIncome,
        expenses: previousMonthExpenses,
        savings: previousMonthSavings,
      }}
      dailyChartData={dailyChartData}
      categoryBreakdown={categoryBreakdown}
      budgetsWithSpent={budgetsWithSpent}
      subscriptions={user.subscriptions.map((s) => ({ ...s, amount: Number(s.amount) }))}
      commitments={user.commitments.map((c) => ({
        ...c,
        amount: Number(c.amount),
        totalAmount: c.totalAmount ? Number(c.totalAmount) : null,
      }))}
      goals={goalsWithCalculations}
      lifeGoals={lifeGoalsFormatted}
      monthlyPlan={
        currentMonthPlan
          ? {
              id: currentMonthPlan.id,
              userId: currentMonthPlan.userId,
              monthYear: currentMonthPlan.monthYear,
              focusNotes: currentMonthPlan.focusNotes,
              createdAt: currentMonthPlan.createdAt,
              updatedAt: currentMonthPlan.updatedAt,
              financialTarget: Number(currentMonthPlan.financialTarget || 0),
              savingsTarget: Number(currentMonthPlan.savingsTarget || 0),
              personalGoals: currentMonthPlan.personalGoals ? JSON.parse(currentMonthPlan.personalGoals) : [],
              habits: currentMonthPlan.habits ? JSON.parse(currentMonthPlan.habits) : [],
              plannedPurchases: currentMonthPlan.plannedPurchases ? JSON.parse(currentMonthPlan.plannedPurchases) : [],
            }
          : null
      }
      monthlyReview={
        currentMonthReview
          ? {
              id: currentMonthReview.id,
              userId: currentMonthReview.userId,
              monthYear: currentMonthReview.monthYear,
              reflections: currentMonthReview.reflections,
              rating: currentMonthReview.rating,
              createdAt: currentMonthReview.createdAt,
              updatedAt: currentMonthReview.updatedAt,
              achievements: currentMonthReview.achievements ? JSON.parse(currentMonthReview.achievements) : [],
            }
          : null
      }
      insights={insights}
    />
  )
}

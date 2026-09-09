import { prisma } from "@/lib/prisma"
import LifeClient from "./life-client"

export default async function LifePage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>
}) {
  const resolvedParams = searchParams ? await searchParams : {}
  const activeTabParam = resolvedParams.tab || "goals"

  let user = await prisma.user.findFirst({
    include: {
      goals: true,
      lifeGoals: {
        include: {
          milestones: true,
          tasks: true,
          linkedGoal: true,
        },
      },
      monthlyPlans: true,
      monthlyReviews: true,
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
        goals: true,
        lifeGoals: {
          include: {
            milestones: true,
            tasks: true,
            linkedGoal: true,
          },
        },
        monthlyPlans: true,
        monthlyReviews: true,
      },
    })
  }

  const now = new Date()

  // Calculate Goal projections with explicit serialization
  const goalsWithMetrics = user.goals.map((goal) => {
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
      remainingAmount: remaining,
      progress,
      monthsRemaining,
      requiredMonthlySaving,
      monthlyContribution: Number(goal.monthlyContribution || 0),
    }
  })

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

  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const currentMonthPlan = user.monthlyPlans.find((p) => p.monthYear === currentMonthStr) || null
  const currentMonthReview = user.monthlyReviews.find((r) => r.monthYear === currentMonthStr) || null

  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    goals: goalsWithMetrics,
    lifeGoals: lifeGoalsFormatted,
  }

  return (
    <LifeClient
      initialTab={activeTabParam}
      user={serializedUser}
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
    />
  )
}

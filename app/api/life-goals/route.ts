import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const lifeGoals = await prisma.lifeGoal.findMany({
      where: { userId: user.id },
      include: {
        milestones: true,
        tasks: true,
        linkedGoal: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(lifeGoals)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch life goals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, category, targetDate, estimatedBudget, priority, status, icon, color, goalId, milestones, tasks } = body

    const user = await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const lifeGoal = await prisma.lifeGoal.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        category: category || "career_business",
        targetDate: targetDate ? new Date(targetDate) : null,
        estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : 0,
        priority: priority || "medium",
        status: status || "planning",
        icon: icon || "Rocket",
        color: color || "#2d5a4c",
        goalId: goalId || null,
        milestones: milestones && Array.isArray(milestones) ? {
          create: milestones.map((m: any) => ({
            title: m.title,
            cost: m.cost ? parseFloat(m.cost) : 0,
            targetDate: m.targetDate ? new Date(m.targetDate) : null,
            completed: !!m.completed,
          })),
        } : undefined,
        tasks: tasks && Array.isArray(tasks) ? {
          create: tasks.map((t: any) => ({
            title: t.title,
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            completed: !!t.completed,
          })),
        } : undefined,
      },
      include: {
        milestones: true,
        tasks: true,
        linkedGoal: true,
      },
    })

    return NextResponse.json(lifeGoal)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create life goal" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(goals)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, targetAmount, currentAmount, deadline, monthlyContribution, icon, color } = body

    const user = await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (!name || !targetAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        deadline: deadline ? new Date(deadline) : null,
        monthlyContribution: monthlyContribution ? parseFloat(monthlyContribution) : 0,
        icon: icon || "Target",
        color: color || "#2d5a4c",
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}

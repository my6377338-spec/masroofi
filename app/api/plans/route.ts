import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthYear = searchParams.get("monthYear")

    const user = await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const where: any = { userId: user.id }
    if (monthYear) where.monthYear = monthYear

    const plans = await prisma.monthlyPlan.findMany({
      where,
      orderBy: { monthYear: "desc" },
    })

    return NextResponse.json(plans)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { monthYear, financialTarget, savingsTarget, focusNotes, personalGoals, habits, plannedPurchases } = body

    const user = await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (!monthYear) {
      return NextResponse.json({ error: "monthYear is required" }, { status: 400 })
    }

    const plan = await prisma.monthlyPlan.upsert({
      where: {
        userId_monthYear: {
          userId: user.id,
          monthYear,
        },
      },
      update: {
        financialTarget: financialTarget ? parseFloat(financialTarget) : 0,
        savingsTarget: savingsTarget ? parseFloat(savingsTarget) : 0,
        focusNotes: focusNotes || null,
        personalGoals: personalGoals ? JSON.stringify(personalGoals) : null,
        habits: habits ? JSON.stringify(habits) : null,
        plannedPurchases: plannedPurchases ? JSON.stringify(plannedPurchases) : null,
      },
      create: {
        userId: user.id,
        monthYear,
        financialTarget: financialTarget ? parseFloat(financialTarget) : 0,
        savingsTarget: savingsTarget ? parseFloat(savingsTarget) : 0,
        focusNotes: focusNotes || null,
        personalGoals: personalGoals ? JSON.stringify(personalGoals) : null,
        habits: habits ? JSON.stringify(habits) : null,
        plannedPurchases: plannedPurchases ? JSON.stringify(plannedPurchases) : null,
      },
    })

    return NextResponse.json(plan)
  } catch (error) {
    return NextResponse.json({ error: "Failed to save monthly plan" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - جلب جميع الحسابات
export async function GET() {
  try {
    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    )
  }
}

// POST - إنشاء حساب جديد
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, type, balance, currency, icon, color } = body

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    const account = await prisma.account.create({
      data: {
        userId: user.id,
        name,
        type,
        balance: balance ? parseFloat(balance) : 0,
        currency: currency || "EGP",
        icon: icon || null,
        color: color || null,
      },
    })

    return NextResponse.json(account)
  } catch (error) {
    console.error("Error creating account:", error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}
